"use client";

import { useEffect } from "react";
import { usePortfolioStore } from "@/lib/store";

export function useDeviceCapability() {
  const setIsMobile = usePortfolioStore((s) => s.setIsMobile);
  const setReducedMotion = usePortfolioStore((s) => s.setReducedMotion);
  const setHasFinePointer = usePortfolioStore((s) => s.setHasFinePointer);

  useEffect(() => {
    const mobileQuery = window.matchMedia("(max-width: 768px)");
    const motionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    const pointerQuery = window.matchMedia("(pointer: fine)");

    const updateMobile = () => setIsMobile(mobileQuery.matches);
    const updateMotion = () => setReducedMotion(motionQuery.matches);
    const updatePointer = () => setHasFinePointer(pointerQuery.matches);

    updateMobile();
    updateMotion();
    updatePointer();

    mobileQuery.addEventListener("change", updateMobile);
    motionQuery.addEventListener("change", updateMotion);
    pointerQuery.addEventListener("change", updatePointer);

    return () => {
      mobileQuery.removeEventListener("change", updateMobile);
      motionQuery.removeEventListener("change", updateMotion);
      pointerQuery.removeEventListener("change", updatePointer);
    };
  }, [setIsMobile, setReducedMotion, setHasFinePointer]);
}
