'use client';

import { useRef } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { STATIONS } from './stations';

/**
 * The one camera in the world.
 *
 * Scroll position picks a point on the station path; the rig eases toward it
 * rather than tracking the wheel one-to-one, so a flick of the scrollbar
 * reads as the camera catching up rather than as a jump cut.
 *
 * Station positions come from measuring the anchored DOM sections, not from
 * hardcoded scroll offsets. Sections on this page change height whenever the
 * content does, and a path pinned to stale offsets drifts out of sync with
 * the very copy it is supposed to be illustrating.
 */

type Props = {
  reduced: boolean;
  /** Reports which station currently owns the frame, so only its
      neighbours stay mounted. */
  onStation: (index: number) => void;
};

/** Scroll offsets of each station's anchor, in document pixels. */
function measure(): number[] {
  const doc = document.documentElement;
  const max = Math.max(1, doc.scrollHeight - window.innerHeight);
  return STATIONS.map((s, i) => {
    if (!s.anchor) return 0;
    const el = document.getElementById(s.anchor);
    if (!el) {
      // No anchor rendered: fall back to an even share of the document so
      // the path still advances instead of collapsing onto station 0.
      return (max * i) / Math.max(1, STATIONS.length - 1);
    }
    const top = el.getBoundingClientRect().top + window.scrollY;
    // Park the camera when the section is a third up the viewport, which is
    // roughly where its heading sits while being read.
    return Math.min(max, Math.max(0, top - window.innerHeight * 0.33));
  });
}

/** Where we are on the path: an index plus the fraction to the next one. */
function locate(offsets: number[], y: number): { i: number; t: number } {
  if (y <= offsets[0]) return { i: 0, t: 0 };
  for (let i = 0; i < offsets.length - 1; i += 1) {
    const a = offsets[i];
    const b = offsets[i + 1];
    if (y >= a && y <= b) {
      const span = b - a;
      return { i, t: span > 0 ? (y - a) / span : 0 };
    }
  }
  return { i: offsets.length - 2, t: 1 };
}

/** Smoothstep — eases arrival and departure at every station. */
const ease = (t: number) => t * t * (3 - 2 * t);

export default function CameraRig({ reduced, onStation }: Props) {
  const { camera, pointer } = useThree();
  const offsets = useRef<number[]>([]);
  const eye = useRef(new THREE.Vector3(...STATIONS[0].eye));
  const look = useRef(new THREE.Vector3(...STATIONS[0].look));
  const target = useRef(new THREE.Vector3());
  const aim = useRef(new THREE.Vector3());
  const current = useRef(-1);
  const dirty = useRef(true);
  const lastHeight = useRef(-1);

  useFrame((state, delta) => {
    // Any reflow invalidates the measured path, and this page reflows a lot:
    // section heights move with the copy. Comparing document height is cheap
    // and catches every case that matters without listening for resize.
    const h = document.documentElement.scrollHeight;
    if (h !== lastHeight.current) {
      lastHeight.current = h;
      dirty.current = true;
    }

    if (dirty.current || offsets.current.length === 0) {
      offsets.current = measure();
      dirty.current = false;
    }

    const y = window.scrollY;
    const { i, t } = locate(offsets.current, y);
    const a = STATIONS[i];
    const b = STATIONS[Math.min(i + 1, STATIONS.length - 1)];
    const k = ease(t);

    // Report the nearer station so mounting follows the frame, not the
    // midpoint of a long transition.
    const nearest = t < 0.5 ? i : Math.min(i + 1, STATIONS.length - 1);
    if (nearest !== current.current) {
      current.current = nearest;
      onStation(nearest);
    }

    target.current.set(
      THREE.MathUtils.lerp(a.eye[0], b.eye[0], k),
      THREE.MathUtils.lerp(a.eye[1], b.eye[1], k),
      THREE.MathUtils.lerp(a.eye[2], b.eye[2], k),
    );
    aim.current.set(
      THREE.MathUtils.lerp(a.look[0], b.look[0], k),
      THREE.MathUtils.lerp(a.look[1], b.look[1], k),
      THREE.MathUtils.lerp(a.look[2], b.look[2], k),
    );

    const cam = camera as THREE.PerspectiveCamera;
    const fov = THREE.MathUtils.lerp(a.fov, b.fov, k);

    if (reduced) {
      // No easing and no parallax: the camera is wherever the scroll says it
      // is, and nothing moves that the reader did not move themselves.
      eye.current.copy(target.current);
      look.current.copy(aim.current);
      cam.position.copy(eye.current);
      cam.lookAt(look.current);
      if (cam.fov !== fov) {
        cam.fov = fov;
        cam.updateProjectionMatrix();
      }
      return;
    }

    // A little pointer parallax on top of the path, so the world has
    // volume even when the page is standing still.
    target.current.x += pointer.x * 0.9;
    target.current.y += pointer.y * 0.6;

    const d = Math.min(delta, 0.1);
    eye.current.x = THREE.MathUtils.damp(eye.current.x, target.current.x, 3, d);
    eye.current.y = THREE.MathUtils.damp(eye.current.y, target.current.y, 3, d);
    eye.current.z = THREE.MathUtils.damp(eye.current.z, target.current.z, 3.4, d);
    look.current.x = THREE.MathUtils.damp(look.current.x, aim.current.x, 3.4, d);
    look.current.y = THREE.MathUtils.damp(look.current.y, aim.current.y, 3.4, d);
    look.current.z = THREE.MathUtils.damp(look.current.z, aim.current.z, 3.4, d);

    cam.position.copy(eye.current);
    cam.lookAt(look.current);

    const nextFov = THREE.MathUtils.damp(cam.fov, fov, 3, d);
    if (Math.abs(nextFov - cam.fov) > 0.01) {
      cam.fov = nextFov;
      cam.updateProjectionMatrix();
    }
  });

  return null;
}
