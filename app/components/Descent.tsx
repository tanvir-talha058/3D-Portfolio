'use client';

/**
 * A loss landscape with gradient descent actually running on it.
 *
 * The surface is a real analytic function, the marble's path is real
 * momentum gradient descent stepped against that function's analytic
 * gradient, and the readout reports the loss it is standing on. Nothing here
 * is a canned animation: the landscape has two basins, so where a run ends
 * genuinely depends on where it started.
 */

import { useCallback, useMemo, useRef } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';

const EXTENT = 3.4;
const SEG = 46;

/* Momentum SGD — the same three knobs as the real thing. */
const LR = 0.055;
const MOMENTUM = 0.86;
const MAX_STEPS = 320;
/** Optimiser steps per second, so the descent reads at a human pace. */
const RATE = 24;
/** Frames to sit at the minimum before the next run starts. */
const HOLD = 90;

/* --------------------------- the objective --------------------------- */

/** Two basins, a bowl to keep it bounded, and a ripple to give it texture. */
function loss(x: number, y: number): number {
  const bowl = 0.13 * (x * x + y * y);
  const a = -1.35 * Math.exp(-((x - 1.25) ** 2 + (y + 0.85) ** 2) / 1.5);
  const b = -1.05 * Math.exp(-((x + 1.55) ** 2 + (y - 1.15) ** 2) / 1.7);
  const ripple = 0.16 * Math.sin(1.7 * x) * Math.cos(1.7 * y);
  return bowl + a + b + ripple;
}

/** Analytic gradient — the descent steps against this, not a difference. */
function grad(x: number, y: number): [number, number] {
  const ea = Math.exp(-((x - 1.25) ** 2 + (y + 0.85) ** 2) / 1.5);
  const eb = Math.exp(-((x + 1.55) ** 2 + (y - 1.15) ** 2) / 1.7);

  const dx =
    0.26 * x +
    1.35 * ea * ((2 * (x - 1.25)) / 1.5) +
    1.05 * eb * ((2 * (x + 1.55)) / 1.7) +
    0.16 * 1.7 * Math.cos(1.7 * x) * Math.cos(1.7 * y);

  const dy =
    0.26 * y +
    1.35 * ea * ((2 * (y + 0.85)) / 1.5) +
    1.05 * eb * ((2 * (y - 1.15)) / 1.7) -
    0.16 * 1.7 * Math.sin(1.7 * x) * Math.sin(1.7 * y);

  return [dx, dy];
}

/** Range of the surface, used to normalise height onto the ramp. */
const LO = -1.4;
const HI = 2.7;

const RAMP = [
  new THREE.Color('#121430'),
  new THREE.Color('#2f2a72'),
  new THREE.Color('#5442b5'),
  new THREE.Color('#7d78ee'),
  new THREE.Color('#63cbe8'),
];

function rampAt(t: number, out: THREE.Color) {
  const c = THREE.MathUtils.clamp(t, 0, 1) * (RAMP.length - 1);
  const i = Math.min(Math.floor(c), RAMP.length - 2);
  return out.copy(RAMP[i]).lerp(RAMP[i + 1], c - i);
}

/* ------------------------------ surface ------------------------------ */

function useSurface() {
  return useMemo(() => {
    const g = new THREE.PlaneGeometry(EXTENT * 2, EXTENT * 2, SEG, SEG);
    const pos = g.attributes.position;
    const colours = new Float32Array(pos.count * 3);
    const c = new THREE.Color();

    for (let i = 0; i < pos.count; i++) {
      const z = loss(pos.getX(i), pos.getY(i));
      pos.setZ(i, z);
      // Height is the loss, so colour is the loss: cold in the basins, hot
      // on the ridges. The same ramp as every other scene on the page.
      rampAt((z - LO) / (HI - LO), c);
      colours[i * 3] = c.r;
      colours[i * 3 + 1] = c.g;
      colours[i * 3 + 2] = c.b;
    }

    g.setAttribute('color', new THREE.BufferAttribute(colours, 3));
    g.computeVertexNormals();
    return g;
  }, []);
}

/* ------------------------------ descent ------------------------------ */

const TRAIL = 110;

function Runner({
  report,
  reduced,
}: {
  report: (step: number, value: number) => void;
  reduced: boolean;
}) {
  const marble = useRef<THREE.Mesh>(null);
  const state = useRef({ x: 0, y: 0, vx: 0, vy: 0, step: 0, acc: 0, hold: 0 });
  const filled = useRef(0);
  const ready = useRef(false);

  const positions = useMemo(() => new Float32Array(TRAIL * 3), []);

  const path = useMemo(() => {
    const g = new THREE.BufferGeometry();
    g.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    g.setDrawRange(0, 0);
    const m = new THREE.LineBasicMaterial({
      color: new THREE.Color('#9df3e2'),
      transparent: true,
      opacity: 0.92,
      toneMapped: false,
    });
    const l = new THREE.Line(g, m);
    l.frustumCulled = false;
    return l;
  }, [positions]);

  const restart = useCallback(() => {
    const s = state.current;
    // Start somewhere on the rim. Which basin a run finds is genuinely a
    // function of this, which is the whole reason to show it.
    const a = Math.random() * Math.PI * 2;
    const r = 2.3 + Math.random() * 0.8;
    s.x = Math.cos(a) * r;
    s.y = Math.sin(a) * r;
    s.vx = 0;
    s.vy = 0;
    s.step = 0;
    s.hold = 0;
    filled.current = 0;
    path.geometry.setDrawRange(0, 0);
  }, [path]);

  const push = useCallback(
    (x: number, y: number) => {
      if (filled.current >= TRAIL) {
        positions.copyWithin(0, 3);
        filled.current = TRAIL - 1;
      }
      const n = filled.current;
      positions[n * 3] = x;
      positions[n * 3 + 1] = y;
      positions[n * 3 + 2] = loss(x, y) + 0.045;
      filled.current = n + 1;
      path.geometry.setDrawRange(0, filled.current);
      path.geometry.attributes.position.needsUpdate = true;
      path.geometry.computeBoundingSphere();
    },
    [positions, path],
  );

  /** One optimiser step against the analytic gradient. */
  const step = useCallback(() => {
    const s = state.current;
    const [gx, gy] = grad(s.x, s.y);
    s.vx = MOMENTUM * s.vx - LR * gx;
    s.vy = MOMENTUM * s.vy - LR * gy;
    s.x += s.vx;
    s.y += s.vy;
    s.step += 1;
    push(s.x, s.y);
    return Math.hypot(s.vx, s.vy);
  }, [push]);

  useFrame((_, delta) => {
    const s = state.current;
    if (!ready.current) {
      restart();
      push(s.x, s.y);
      ready.current = true;

      // With motion reduced, run the whole descent on the first frame and
      // park at the minimum. The contract is no animation, not no content —
      // a marble sitting at step 000 shows nothing at all.
      if (reduced) {
        for (let i = 0; i < MAX_STEPS; i++) {
          if (step() < 0.0018 && s.step > 70) break;
        }
      }
    }

    if (!reduced) {
      // Fixed-size optimiser steps, decoupled from frame rate: the descent
      // takes the same path on a 60Hz and a 144Hz display.
      s.acc += Math.min(delta, 0.1) * RATE;
      while (s.acc >= 1) {
        s.acc -= 1;

        if (s.hold > 0) {
          s.hold -= 1;
          if (s.hold === 0) {
            restart();
            push(s.x, s.y);
          }
          continue;
        }

        const speed = step();
        if (s.step >= MAX_STEPS || (s.step > 70 && speed < 0.0018)) s.hold = HOLD;
      }
    }

    const z = loss(s.x, s.y);
    if (marble.current) marble.current.position.set(s.x, s.y, z + 0.1);
    report(s.step, z);
  });

  return (
    <group>
      <primitive object={path} />
      <mesh ref={marble}>
        <sphereGeometry args={[0.11, 20, 20]} />
        <meshStandardMaterial
          color="#c6fbef"
          emissive="#6fd6ee"
          emissiveIntensity={1.7}
          roughness={0.3}
          toneMapped={false}
        />
      </mesh>
    </group>
  );
}

/* ------------------------------- scene -------------------------------- */

function Scene({
  report,
  reduced,
}: {
  report: (step: number, value: number) => void;
  reduced: boolean;
}) {
  const surface = useSurface();
  const spin = useRef<THREE.Group>(null);
  const tilt = useRef<THREE.Group>(null);
  const { pointer, size } = useThree();

  const wire = useMemo(() => new THREE.WireframeGeometry(surface), [surface]);

  const scale = useMemo(() => {
    const halfH = Math.tan((40 * Math.PI) / 360) * 9;
    const halfW = halfH * (size.width / Math.max(size.height, 1));
    return Math.min((halfW * 2) / (EXTENT * 2.6), (halfH * 2) / (EXTENT * 2.2));
  }, [size.width, size.height]);

  useFrame((state, delta) => {
    const d = Math.min(delta, 0.1);
    // A slow turn is what makes a surface read as a surface; the pointer
    // only adds parallax on top of it.
    if (spin.current) {
      spin.current.rotation.z = reduced ? -0.5 : -0.5 + state.clock.elapsedTime * 0.07;
    }
    if (tilt.current) {
      tilt.current.rotation.x = THREE.MathUtils.damp(
        tilt.current.rotation.x,
        -1.0 + (reduced ? 0 : pointer.y * 0.11),
        4,
        d,
      );
    }
  });

  return (
    <>
      <ambientLight intensity={0.7} />
      <directionalLight position={[3, 5, 7]} intensity={1.15} />
      <directionalLight position={[-5, -3, 4]} intensity={0.4} color="#9db4ff" />

      <group ref={tilt} scale={scale} rotation={[-1.0, 0, 0]} position={[0, -0.35, 0]}>
        <group ref={spin} rotation={[0, 0, -0.5]}>
          <mesh geometry={surface}>
            <meshStandardMaterial
              vertexColors
              roughness={0.66}
              metalness={0.05}
              side={THREE.DoubleSide}
            />
          </mesh>

          {/* The mesh lines over the shaded surface: the plot convention for
              a loss landscape, and they keep the slope readable where the
              shading alone would flatten out. */}
          <lineSegments geometry={wire}>
            <lineBasicMaterial color="#ccd3e6" transparent opacity={0.085} toneMapped={false} />
          </lineSegments>

          <Runner report={report} reduced={reduced} />
        </group>
      </group>
    </>
  );
}

export default function DescentScene({
  report,
  reduced,
  active,
}: {
  report: (step: number, value: number) => void;
  reduced: boolean;
  active: boolean;
}) {
  return (
    <Canvas
      frameloop={active ? 'always' : 'never'}
      dpr={[1, 2]}
      gl={{ antialias: true, alpha: true }}
      camera={{ position: [0, 0, 9], fov: 40 }}
      style={{ pointerEvents: 'none' }}
    >
      <Scene report={report} reduced={reduced} />
    </Canvas>
  );
}
