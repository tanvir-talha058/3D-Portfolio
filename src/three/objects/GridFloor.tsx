"use client";

import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { usePortfolioStore } from "@/lib/store";
import { getPalette } from "@/lib/tokens";
import "@/three/materials/gridFloorShader";
import type { GridFloorShaderMaterial } from "@/three/materials/gridFloorShader";

type GridFloorMaterialInstance = InstanceType<typeof GridFloorShaderMaterial>;

export function GridFloor() {
  const reducedMotion = usePortfolioStore((s) => s.reducedMotion);
  const theme = usePortfolioStore((s) => s.theme);
  const pal = getPalette(theme);
  const groupRef = useRef<THREE.Group>(null);
  const materialRef = useRef<GridFloorMaterialInstance>(null);

  useFrame((_, delta) => {
    if (!reducedMotion) {
      if (materialRef.current) {
        materialRef.current.uTime += delta;
      }
      if (groupRef.current) {
        groupRef.current.rotation.y += delta * 0.015;
      }
    }
  });

  return (
    <group ref={groupRef} position={[0, -14, 0]}>
      <mesh rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[90, 90]} />
        <gridFloorMaterial
          ref={materialRef}
          uColorMajor={new THREE.Color(pal.brass)}
          uColorMinor={new THREE.Color(pal.line)}
          transparent
          depthWrite={false}
        />
      </mesh>
    </group>
  );
}
