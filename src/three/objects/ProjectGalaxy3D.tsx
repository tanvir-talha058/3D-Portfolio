"use client";

import { useMemo, useRef } from "react";
import { Physics, RigidBody, CuboidCollider } from "@react-three/rapier";
import type { RapierRigidBody } from "@react-three/rapier";
import * as THREE from "three";
import { usePortfolioStore } from "@/lib/store";
import { getPalette } from "@/lib/tokens";
import { projects } from "@/data/projects";
import { useAnchorSpring } from "@/three/physics/useAnchorSpring";

const RADIUS = 4.5;
const BOUNDS = 7;

function computeAnchors() {
  return projects.map((_, i) => {
    const angle = (i / projects.length) * Math.PI * 2;
    const x = Math.cos(angle) * RADIUS;
    const z = Math.sin(angle) * RADIUS;
    const y = Math.sin(angle * 2) * 0.8;
    return new THREE.Vector3(x, y, z);
  });
}

function ProjectOrb({
  anchor,
  color,
  reducedMotion,
}: {
  anchor: THREE.Vector3;
  color: string;
  reducedMotion: boolean;
}) {
  const bodyRef = useRef<RapierRigidBody>(null);
  useAnchorSpring(bodyRef, anchor, { strength: 3, enabled: !reducedMotion });

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
        <icosahedronGeometry args={[0.35, 0]} />
        <meshStandardMaterial
          color={color}
          emissive={color}
          emissiveIntensity={0.55}
          roughness={0.3}
          metalness={0.4}
        />
      </mesh>
    </RigidBody>
  );
}

export function ProjectGalaxy3D() {
  const reducedMotion = usePortfolioStore((s) => s.reducedMotion);
  const theme = usePortfolioStore((s) => s.theme);
  const anchors = useMemo(() => computeAnchors(), []);
  const pal = getPalette(theme);
  const colors = [pal.brass, pal.brassBright];

  return (
    <Physics gravity={[0, 0, 0]} paused={reducedMotion}>
      {anchors.map((anchor, i) => (
        <ProjectOrb
          key={projects[i].id}
          anchor={anchor}
          color={colors[i % colors.length]}
          reducedMotion={reducedMotion}
        />
      ))}
      <CuboidCollider args={[BOUNDS, 0.1, BOUNDS]} position={[0, -BOUNDS, 0]} />
      <CuboidCollider args={[BOUNDS, 0.1, BOUNDS]} position={[0, BOUNDS, 0]} />
      <CuboidCollider args={[0.1, BOUNDS, BOUNDS]} position={[-BOUNDS, 0, 0]} />
      <CuboidCollider args={[0.1, BOUNDS, BOUNDS]} position={[BOUNDS, 0, 0]} />
      <CuboidCollider args={[BOUNDS, BOUNDS, 0.1]} position={[0, 0, -BOUNDS]} />
      <CuboidCollider args={[BOUNDS, BOUNDS, 0.1]} position={[0, 0, BOUNDS]} />
    </Physics>
  );
}
