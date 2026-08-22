"use client";

import { useEffect, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import gsap from "gsap";
import * as THREE from "three";
import { usePortfolioStore } from "@/lib/store";
import { SECTION_DEPTH } from "./sectionDepth";

const CAMERA_DISTANCE = 9;

export function CameraRig() {
  const activeSection = usePortfolioStore((s) => s.activeSection);
  const pointer = usePortfolioStore((s) => s.pointer);
  const reducedMotion = usePortfolioStore((s) => s.reducedMotion);

  const targetZ = useRef(SECTION_DEPTH.hero + CAMERA_DISTANCE);
  const lookZ = useRef(SECTION_DEPTH.hero);

  useEffect(() => {
    const depth = SECTION_DEPTH[activeSection];

    const cameraTween = gsap.to(targetZ, {
      current: depth + CAMERA_DISTANCE,
      duration: reducedMotion ? 0 : 1.4,
      ease: "power3.inOut",
    });
    const lookTween = gsap.to(lookZ, {
      current: depth,
      duration: reducedMotion ? 0 : 1.4,
      ease: "power3.inOut",
    });

    return () => {
      cameraTween.kill();
      lookTween.kill();
    };
  }, [activeSection, reducedMotion]);

  useFrame((state, delta) => {
    const { camera } = state;
    const parallaxX = reducedMotion ? 0 : pointer.x * 0.6;
    const parallaxY = reducedMotion ? 0 : -pointer.y * 0.35;

    camera.position.x = THREE.MathUtils.damp(camera.position.x, parallaxX, 4, delta);
    camera.position.y = THREE.MathUtils.damp(camera.position.y, parallaxY, 4, delta);
    camera.position.z = THREE.MathUtils.damp(camera.position.z, targetZ.current, 3, delta);

    camera.lookAt(0, 0, lookZ.current);
  });

  return null;
}
