'use client';

import { useState } from 'react';
import dynamic from 'next/dynamic';
import { Canvas } from '@react-three/fiber';
import { Scene as FieldScene } from '../Field';
import { Scene as NetScene } from '../Net';
import { Scene as DescentScene } from '../Descent';
import { Scene as RagScene } from '../Rag';
import { reportDescent } from './telemetry';
import CameraRig from './CameraRig';
import { STATIONS, MOUNT_WINDOW, MOUNT_WINDOW_MOBILE } from './stations';

const GlassComposite = dynamic(() => import('./glass/GlassComposite'), { ssr: false });

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
  /** Names the station in frame, so the scrim outside the canvas can change
      with it — the hero needs a different veil from the reading sections. */
  onFrame: (id: string) => void;
};

export default function World({ reduced, quality, onFrame }: Props) {
  const [station, setStation] = useState(0);
  const low = quality === 'low';
  const windowSize = low ? MOUNT_WINDOW_MOBILE : MOUNT_WINDOW;

  /* Refraction is an enhancement, and enhancements are the first thing to
     go: not on the low tier, not under reduced motion, and not once it has
     told us it cannot run. The CSS glass is the floor in all three cases. */
  const [glassOk, setGlassOk] = useState(true);
  const wantGlass = glassOk && !low && !reduced;

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
      <CameraRig
        reduced={reduced}
        onStation={(i) => {
          setStation(i);
          onFrame(STATIONS[i].id);
        }}
      />

      {wantGlass ? <GlassComposite onFail={() => setGlassOk(false)} /> : null}

      {near(0) ? (
        <group position={STATIONS[0].at} scale={STATIONS[0].scale}>
          <FieldScene reduced={reduced} rig={false} />
        </group>
      ) : null}

      {near(1) ? (
        <group position={STATIONS[1].at} scale={STATIONS[1].scale}>
          <NetScene reduced={reduced} />
        </group>
      ) : null}

      {near(2) ? (
        <group position={STATIONS[2].at} scale={STATIONS[2].scale}>
          <DescentScene report={reportDescent} reduced={reduced} />
        </group>
      ) : null}

      {/* The retrieval stack is scenery here rather than a figure, so its
          hover coupling is not wired up: there is nothing to hover behind a
          scrim. Its stages are named in the caption beside it. */}
      {near(3) ? (
        <group position={STATIONS[3].at} scale={STATIONS[3].scale}>
          <RagScene reduced={reduced} hovered={null} setHovered={() => {}} rig={false} />
        </group>
      ) : null}
    </Canvas>
  );
}
