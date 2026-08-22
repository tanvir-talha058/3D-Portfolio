"use client";

import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { Line } from "@react-three/drei";
import * as THREE from "three";
import { usePortfolioStore } from "@/lib/store";
import { getPalette } from "@/lib/tokens";

const DIALECT_COUNT = 8;
const RADIUS = 3.6;
const CENTER = new THREE.Vector3(0, 0, 0);

export function ResearchConstellation() {
  const reducedMotion = usePortfolioStore((s) => s.reducedMotion);
  const theme = usePortfolioStore((s) => s.theme);
  const pal = getPalette(theme);
  const groupRef = useRef<THREE.Group>(null);

  const nodes = useMemo(() => {
    return Array.from({ length: DIALECT_COUNT }, (_, i) => {
      const angle = (i / DIALECT_COUNT) * Math.PI * 2;
      const x = Math.cos(angle) * RADIUS;
      const z = Math.sin(angle) * RADIUS;
      const y = Math.sin(angle * 3) * 0.5;
      return new THREE.Vector3(x, y, z);
    });
  }, []);

  useFrame((_, delta) => {
    if (groupRef.current && !reducedMotion) {
      groupRef.current.rotation.y += delta * 0.02;
    }
  });

  return (
    <group ref={groupRef}>
      {nodes.map((pos, i) => (
        <group key={i}>
          <Line points={[CENTER, pos]} color={pal.brass} transparent opacity={0.22} lineWidth={1} />
          <mesh position={pos}>
            <sphereGeometry args={[0.14, 16, 16]} />
            <meshStandardMaterial color={pal.brass} emissive={pal.brass} emissiveIntensity={0.7} />
          </mesh>
        </group>
      ))}
      <mesh position={CENTER}>
        <sphereGeometry args={[0.22, 20, 20]} />
        <meshStandardMaterial
          color={pal.ambient}
          emissive={pal.ambient}
          emissiveIntensity={0.5}
        />
      </mesh>
    </group>
  );
}
