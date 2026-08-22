"use client";

import { useEffect } from "react";
import { usePortfolioStore } from "@/lib/store";

export function useParallax() {
  const setPointer = usePortfolioStore((s) => s.setPointer);

  useEffect(() => {
    function handlePointerMove(event: PointerEvent) {
      const x = (event.clientX / window.innerWidth) * 2 - 1;
      const y = (event.clientY / window.innerHeight) * 2 - 1;
      setPointer(x, y);
    }

    window.addEventListener("pointermove", handlePointerMove);
    return () => window.removeEventListener("pointermove", handlePointerMove);
  }, [setPointer]);
}
