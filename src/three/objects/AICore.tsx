"use client";

import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { usePortfolioStore } from "@/lib/store";
import { getPalette } from "@/lib/tokens";
import "@/three/materials/aiCoreShader";
import type { AICoreShaderMaterial } from "@/three/materials/aiCoreShader";

type AICoreMaterialInstance = InstanceType<typeof AICoreShaderMaterial>;

export function AICore() {
  const isMobile = usePortfolioStore((s) => s.isMobile);
  const reducedMotion = usePortfolioStore((s) => s.reducedMotion);
  const theme = usePortfolioStore((s) => s.theme);
  const materialRef = useRef<AICoreMaterialInstance>(null);
  const meshRef = useRef<THREE.Mesh>(null);
  const pal = getPalette(theme);
  const isDark = theme === "dark";

  useFrame((_, delta) => {
    if (materialRef.current && !reducedMotion) {
      materialRef.current.uTime += delta;
    }
    if (meshRef.current && !reducedMotion) {
      meshRef.current.rotation.y += delta * 0.05;
    }
  });

  return (
    <mesh ref={meshRef} position={[0, -1.1, -11]}>
      <icosahedronGeometry args={[1.1, isMobile ? 3 : 4]} />
      <aiCoreMaterial
        ref={materialRef}
        uHighDetail={isMobile ? 0 : 1}
        // Additive blending is a dark-background-only glow technique — on a
        // light/cream background it just washes toward white instead of
        // glowing, so light mode uses normal alpha compositing instead, with
        // darker mix colors appropriate for staying legible against paper.
        uColorA={new THREE.Color(isDark ? pal.bronze : pal.brass)}
        uColorB={new THREE.Color(pal.brassBright)}
        transparent
        blending={isDark ? THREE.AdditiveBlending : THREE.NormalBlending}
        depthWrite={false}
      />
    </mesh>
  );
}
