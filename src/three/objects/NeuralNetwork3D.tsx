"use client";

import { useMemo, useRef } from "react";
import type { RefObject } from "react";
import { useFrame } from "@react-three/fiber";
import { Physics, RigidBody, CuboidCollider } from "@react-three/rapier";
import type { RapierRigidBody } from "@react-three/rapier";
import * as THREE from "three";
import { usePortfolioStore } from "@/lib/store";
import { getPalette } from "@/lib/tokens";
import { skillGroups } from "@/data/skills";
import { useAnchorSpring } from "@/three/physics/useAnchorSpring";

const CENTER = new THREE.Vector3(0, 0, 0);
const RADIUS = 3.2;
const BOUNDS = 5;

function computeAnchors() {
  return skillGroups.map((_, gi) => {
    const angle = (gi / skillGroups.length) * Math.PI * 2;
    const x = Math.cos(angle) * RADIUS;
    const z = Math.sin(angle) * RADIUS;
    return new THREE.Vector3(x, 0, z);
  });
}

function SkillNode({
  anchor,
  color,
  reducedMotion,
  bodyRef,
}: {
  anchor: THREE.Vector3;
  color: string;
  reducedMotion: boolean;
  bodyRef: RefObject<RapierRigidBody | null>;
}) {
  useAnchorSpring(bodyRef, anchor, { strength: 3.5, enabled: !reducedMotion });

  return (
    <RigidBody
      ref={bodyRef}
      position={[anchor.x, anchor.y, anchor.z]}
      colliders="ball"
      linearDamping={2}
      angularDamping={1.5}
      restitution={0.4}
    >
      <mesh>
        <sphereGeometry args={[0.22, 16, 16]} />
        <meshStandardMaterial color={color} emissive={color} emissiveIntensity={1.0} />
      </mesh>
    </RigidBody>
  );
}

function Spokes({
  bodyRefs,
  colors,
  hubColor,
}: {
  bodyRefs: RefObject<RapierRigidBody | null>[];
  colors: string[];
  hubColor: string;
}) {
  const geometryRef = useRef<THREE.BufferGeometry>(null);

  const { positions, colorAttr } = useMemo(() => {
    const count = bodyRefs.length;
    const positions = new Float32Array(count * 2 * 3);
    const colorAttr = new Float32Array(count * 2 * 3);
    const hub = new THREE.Color(hubColor);
    for (let i = 0; i < count; i++) {
      const c = new THREE.Color(colors[i]);
      hub.toArray(colorAttr, i * 6);
      c.toArray(colorAttr, i * 6 + 3);
    }
    return { positions, colorAttr };
  }, [bodyRefs, colors, hubColor]);

  useFrame(() => {
    const geometry = geometryRef.current;
    if (!geometry) return;
    const posAttr = geometry.getAttribute("position") as THREE.BufferAttribute;
    const arr = posAttr.array as Float32Array;

    bodyRefs.forEach((ref, i) => {
      const base = i * 6;
      arr[base] = CENTER.x;
      arr[base + 1] = CENTER.y;
      arr[base + 2] = CENTER.z;
      const body = ref.current;
      if (body) {
        const t = body.translation();
        arr[base + 3] = t.x;
        arr[base + 4] = t.y;
        arr[base + 5] = t.z;
      }
    });
    posAttr.needsUpdate = true;
  });

  return (
    <lineSegments>
      <bufferGeometry ref={geometryRef}>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
        <bufferAttribute attach="attributes-color" args={[colorAttr, 3]} />
      </bufferGeometry>
      <lineBasicMaterial vertexColors transparent opacity={0.35} />
    </lineSegments>
  );
}

export function NeuralNetwork3D() {
  const reducedMotion = usePortfolioStore((s) => s.reducedMotion);
  const theme = usePortfolioStore((s) => s.theme);
  const anchors = useMemo(() => computeAnchors(), []);
  const pal = getPalette(theme);
  const colorOptions = [pal.brass, pal.brassBright];
  const colors = skillGroups.map((_, i) => colorOptions[i % colorOptions.length]);

  const bodyRefs = useMemo(
    () => anchors.map(() => ({ current: null }) as RefObject<RapierRigidBody | null>),
    [anchors]
  );

  return (
    <group>
      <Physics gravity={[0, 0, 0]} paused={reducedMotion}>
        {anchors.map((anchor, i) => (
          <SkillNode
            key={skillGroups[i].id}
            anchor={anchor}
            color={colors[i]}
            reducedMotion={reducedMotion}
            bodyRef={bodyRefs[i]}
          />
        ))}
        <CuboidCollider args={[BOUNDS, 0.1, BOUNDS]} position={[0, -BOUNDS, 0]} />
        <CuboidCollider args={[BOUNDS, 0.1, BOUNDS]} position={[0, BOUNDS, 0]} />
        <CuboidCollider args={[0.1, BOUNDS, BOUNDS]} position={[-BOUNDS, 0, 0]} />
        <CuboidCollider args={[0.1, BOUNDS, BOUNDS]} position={[BOUNDS, 0, 0]} />
        <CuboidCollider args={[BOUNDS, BOUNDS, 0.1]} position={[0, 0, -BOUNDS]} />
        <CuboidCollider args={[BOUNDS, BOUNDS, 0.1]} position={[0, 0, BOUNDS]} />
      </Physics>
      <Spokes bodyRefs={bodyRefs} colors={colors} hubColor={pal.ambient} />
      <mesh position={CENTER}>
        <sphereGeometry args={[0.3, 20, 20]} />
        <meshStandardMaterial color={pal.ambient} emissive={pal.ambient} emissiveIntensity={0.7} />
      </mesh>
    </group>
  );
}
