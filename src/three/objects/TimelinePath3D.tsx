"use client";

import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { Line } from "@react-three/drei";
import * as THREE from "three";
import { usePortfolioStore } from "@/lib/store";
import { getPalette } from "@/lib/tokens";

const NODE_POSITIONS: [number, number, number][] = [
  [-3, 0, -2],
  [3, -1, -6],
];

export function TimelinePath3D() {
  const reducedMotion = usePortfolioStore((s) => s.reducedMotion);
  const theme = usePortfolioStore((s) => s.theme);
  const pal = getPalette(theme);
  const groupRef = useRef<THREE.Group>(null);

  const points = useMemo(() => {
    const curve = new THREE.CatmullRomCurve3(
      NODE_POSITIONS.map((p) => new THREE.Vector3(...p))
    );
    return curve.getPoints(40);
  }, []);

  useFrame((_, delta) => {
    if (groupRef.current && !reducedMotion) {
      groupRef.current.rotation.y += delta * 0.03;
    }
  });

  return (
    <group ref={groupRef}>
      <Line points={points} color={pal.brass} transparent opacity={0.35} lineWidth={1} />
      {NODE_POSITIONS.map((pos, i) => (
        <mesh key={i} position={pos}>
          <sphereGeometry args={[0.18, 16, 16]} />
          <meshStandardMaterial
            color={i === 0 ? pal.brassBright : pal.brass}
            emissive={i === 0 ? pal.brassBright : pal.brass}
            emissiveIntensity={1.4}
          />
        </mesh>
      ))}
    </group>
  );
}
