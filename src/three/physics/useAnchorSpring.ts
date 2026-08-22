"use client";

import { useFrame } from "@react-three/fiber";
import type { RapierRigidBody } from "@react-three/rapier";
import type * as THREE from "three";
import type { RefObject } from "react";

interface AnchorSpringOptions {
  strength?: number;
  damping?: number;
  enabled?: boolean;
}

// Directly drives linear velocity (mass-independent) rather than applyImpulse,
// which divides by the body's actual mass — for a small "ball" collider (radius
// ~0.35, default density) that mass is ~0.18, silently amplifying an
// impulse-based spring ~5x beyond its tuned gain and driving it unstable.
export function useAnchorSpring(
  bodyRef: RefObject<RapierRigidBody | null>,
  anchor: THREE.Vector3,
  { strength = 4, damping = 3, enabled = true }: AnchorSpringOptions = {}
) {
  useFrame((_, delta) => {
    if (!enabled) return;
    const body = bodyRef.current;
    if (!body) return;

    const pos = body.translation();
    const vel = body.linvel();

    const dx = anchor.x - pos.x;
    const dy = anchor.y - pos.y;
    const dz = anchor.z - pos.z;

    body.setLinvel(
      {
        x: vel.x + (strength * dx - damping * vel.x) * delta,
        y: vel.y + (strength * dy - damping * vel.y) * delta,
        z: vel.z + (strength * dz - damping * vel.z) * delta,
      },
      true
    );
  });
}
