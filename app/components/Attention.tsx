'use client';

/**
 * The attention map: the research section's signature.
 *
 * A 10x10 instanced grid where every tile is one weight from a real
 * row-softmaxed self-attention matrix. Height and colour both carry the
 * weight, so a head's pattern is legible as relief even before the colour
 * ramp is read. Switching heads interpolates the whole matrix rather than
 * cutting, so what you watch is one sentence being re-read four ways.
 */

import { useMemo, useRef } from 'react';
import { Canvas, useFrame, useThree, type ThreeEvent } from '@react-three/fiber';
import * as THREE from 'three';
import { attnHeads, attnMatrix, attnTokens } from '../data';

const N = attnTokens.length;
const GAP = 0.085;
const TILE = 1 - GAP;
/** Peak weight in any head, used to normalise relief to a stable scale. */
const PEAK = 0.62;
/** Tallest a tile gets, in grid units — the fit maths has to account for it. */
const RELIEF = 1.7;
/** How far the plate leans away from the viewer. The whole read depends on it. */
const TILT = 0.58;

const CAM_Z = 13;
const FOV = 38;

/* The page's magma ramp, sampled in linear space so the tiles sit in the
   same colour system as the hero field. */
const RAMP = [
  new THREE.Color('#20203a'),
  new THREE.Color('#4a3566'),
  new THREE.Color('#b2506a'),
  new THREE.Color('#e07a55'),
  new THREE.Color('#f7d489'),
];

function rampAt(t: number, out: THREE.Color) {
  const c = THREE.MathUtils.clamp(t, 0, 1) * (RAMP.length - 1);
  const i = Math.min(Math.floor(c), RAMP.length - 2);
  return out.copy(RAMP[i]).lerp(RAMP[i + 1], c - i);
}

function Grid({
  head,
  focus,
  onFocus,
  reduced,
}: {
  head: number;
  focus: number;
  onFocus: (row: number) => void;
  reduced: boolean;
}) {
  const mesh = useRef<THREE.InstancedMesh>(null);
  const dummy = useMemo(() => new THREE.Object3D(), []);
  const colour = useMemo(() => new THREE.Color(), []);

  // Every head's matrix, precomputed once. Ten by ten by four is nothing.
  const mats = useMemo(() => attnHeads.map((h) => attnMatrix(h)), []);

  // What is currently drawn, damped toward the selected head's matrix.
  const shown = useRef<Float32Array>(new Float32Array(N * N));
  const started = useRef(false);

  useFrame((state, delta) => {
    const m = mesh.current;
    if (!m) return;

    const target = mats[head];
    const d = Math.min(delta, 0.1);
    const t = state.clock.elapsedTime;

    for (let i = 0; i < N; i++) {
      for (let j = 0; j < N; j++) {
        const k = i * N + j;
        const want = target[i][j];

        // First frame lands flat, then rises — the grid assembles rather
        // than popping in at full relief.
        shown.current[k] = started.current
          ? THREE.MathUtils.damp(shown.current[k], want, 6, d)
          : 0;

        const w = shown.current[k];
        const norm = THREE.MathUtils.clamp(w / PEAK, 0, 1);

        // A row reads as a distribution, so dimming every other row while
        // one is focused is the honest way to isolate it.
        const dim = focus < 0 || focus === i ? 1 : 0.34;
        const lift = focus === i ? 1.35 : 1;

        // Barely-there breathing keeps the surface alive without implying
        // the weights themselves are changing.
        const breathe = reduced ? 1 : 1 + Math.sin(t * 0.9 + (i + j) * 0.35) * 0.035;

        const h = 0.06 + norm * 1.55 * lift * breathe;

        dummy.position.set(
          j - (N - 1) / 2,
          (N - 1) / 2 - i,
          h / 2,
        );
        dummy.scale.set(TILE, TILE, h);
        dummy.updateMatrix();
        m.setMatrixAt(k, dummy.matrix);

        // Display gamma only. Softmax rows are peaky, so mapping weight
        // linearly to colour would leave the whole map bimodal — black or
        // gold — and throw away the middle of the ramp. Relief still carries
        // the true value.
        rampAt(Math.pow(norm, 0.62) * 0.94 + 0.06, colour);
        colour.multiplyScalar(dim);
        m.setColorAt(k, colour);
      }
    }

    started.current = true;
    m.instanceMatrix.needsUpdate = true;
    if (m.instanceColor) m.instanceColor.needsUpdate = true;
  });

  return (
    <instancedMesh
      ref={mesh}
      args={[undefined, undefined, N * N]}
      onPointerMove={(e: ThreeEvent<PointerEvent>) => {
        e.stopPropagation();
        if (e.instanceId != null) onFocus(Math.floor(e.instanceId / N));
      }}
      onPointerOut={() => onFocus(-1)}
    >
      <boxGeometry args={[1, 1, 1]} />
      <meshStandardMaterial
        roughness={0.42}
        metalness={0.1}
        emissiveIntensity={0.35}
        toneMapped={false}
      />
    </instancedMesh>
  );
}

/** The floor plate the tiles sit on, so relief has something to read against. */
function Plate() {
  return (
    <mesh position={[0, 0, -0.02]}>
      <planeGeometry args={[N + 0.5, N + 0.5]} />
      <meshBasicMaterial color="#0d0e15" transparent opacity={0.85} />
    </mesh>
  );
}

function Scene({
  head,
  focus,
  onFocus,
  reduced,
}: {
  head: number;
  focus: number;
  onFocus: (row: number) => void;
  reduced: boolean;
}) {
  const group = useRef<THREE.Group>(null);
  const { pointer, size } = useThree();

  // Fit the *tilted* plate, not the flat one: leaning it back by TILT
  // foreshortens its height to cos(TILT), and fitting the unrotated square
  // is what leaves the grid stranded in the middle of the frame.
  const scale = useMemo(() => {
    const halfH = Math.tan((FOV * Math.PI) / 360) * CAM_Z;
    const halfW = halfH * (size.width / Math.max(size.height, 1));
    const w = N * 1.2;
    const h = N * Math.cos(TILT) * 1.2 + RELIEF;
    return Math.min((halfW * 2) / w, (halfH * 2) / h);
  }, [size.width, size.height]);

  // A fixed three-quarter tilt is what makes the relief legible; the pointer
  // only nudges it, so the read never depends on where the cursor is.
  useFrame((_, delta) => {
    const g = group.current;
    if (!g) return;
    const d = Math.min(delta, 0.1);
    const tx = -TILT + (reduced ? 0 : pointer.y * 0.09);
    const tz = reduced ? 0 : pointer.x * 0.1;
    g.rotation.x = THREE.MathUtils.damp(g.rotation.x, tx, 4, d);
    g.rotation.z = THREE.MathUtils.damp(g.rotation.z, tz, 4, d);
  });

  return (
    <>
      <ambientLight intensity={0.75} />
      <directionalLight position={[4, 6, 8]} intensity={1.1} />
      <directionalLight position={[-6, -2, 4]} intensity={0.35} color="#8ba6ff" />

      <group ref={group} scale={scale} rotation={[-TILT, 0, 0]}>
        <Plate />
        <Grid head={head} focus={focus} onFocus={onFocus} reduced={reduced} />
      </group>
    </>
  );
}

export default function Attention({
  head,
  focus,
  onFocus,
  reduced,
  active,
}: {
  head: number;
  focus: number;
  onFocus: (row: number) => void;
  reduced: boolean;
  active: boolean;
}) {
  return (
    <Canvas
      frameloop={active ? 'always' : 'never'}
      dpr={[1, 2]}
      gl={{ antialias: true, alpha: true }}
      camera={{ position: [0, 0, CAM_Z], fov: FOV }}
      style={{ pointerEvents: 'auto' }}
    >
      <Scene head={head} focus={focus} onFocus={onFocus} reduced={reduced} />
    </Canvas>
  );
}
