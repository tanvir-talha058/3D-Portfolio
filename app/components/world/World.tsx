'use client';

import { useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { Scene as FieldScene } from '../Field';
import CameraRig from './CameraRig';
import { STATIONS, MOUNT_WINDOW, MOUNT_WINDOW_MOBILE } from './stations';

/**
 * One canvas, one camera, one world.
 *
 * The page used to hold six separate canvases, each with its own camera and
 * render loop, so the figures read as things scrolled past rather than as
 * one space moved through. Here every scene is a station at a fixed place in
 * a single world and the scroll position flies the camera between them.
 *
 * Only the stations near the camera are mounted. Everything else is
 * unmounted outright rather than hidden — a hidden scene still holds its
 * geometry, its textures and its place in the render list, and the point of
 * one canvas is to pay for one station at a time.
 */

type Props = {
  reduced: boolean;
  quality: 'high' | 'low';
};

export default function World({ reduced, quality }: Props) {
  const [station, setStation] = useState(0);
  const low = quality === 'low';
  const windowSize = low ? MOUNT_WINDOW_MOBILE : MOUNT_WINDOW;

  const near = (i: number) => Math.abs(i - station) <= windowSize;

  return (
    <Canvas
      className="world-canvas"
      dpr={[1, low ? 1.5 : 2]}
      /* Antialias is the first thing to go on a low tier: it is a full extra
         resolve every frame, and at this scale the geometry is soft-edged
         particles and thin lines that alias very little to begin with. */
      gl={{ antialias: !low, alpha: true, powerPreference: 'high-performance' }}
      camera={{ position: STATIONS[0].eye, fov: STATIONS[0].fov }}
      /* The world sits behind the page. Only the things that opt in — the
         hero's domain anchors — take pointer events back. */
      style={{ pointerEvents: 'none' }}
    >
      <CameraRig reduced={reduced} onStation={setStation} />

      {near(0) ? (
        <group position={STATIONS[0].at}>
          <FieldScene reduced={reduced} rig={false} />
        </group>
      ) : null}
    </Canvas>
  );
}
