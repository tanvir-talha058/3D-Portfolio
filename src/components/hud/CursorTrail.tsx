"use client";

import { useEffect, useRef, useState } from "react";
import { usePortfolioStore } from "@/lib/store";

export function CursorTrail() {
  const isMobile = usePortfolioStore((s) => s.isMobile);
  const reducedMotion = usePortfolioStore((s) => s.reducedMotion);
  const hasFinePointer = usePortfolioStore((s) => s.hasFinePointer);
  const dotRef = useRef<HTMLDivElement>(null);
  // The dot has no real cursor position to follow until the pointer actually
  // moves once — rendering it beforehand would park a glowing marker at the
  // viewport's literal center (the loop's initial x/y) on every fresh load.
  const [hasMoved, setHasMoved] = useState(false);

  const active = !isMobile && !reducedMotion && hasFinePointer;

  useEffect(() => {
    if (!active) return;

    function handleFirstMove() {
      setHasMoved(true);
    }
    window.addEventListener("pointermove", handleFirstMove, { once: true });
    return () => window.removeEventListener("pointermove", handleFirstMove);
  }, [active]);

  useEffect(() => {
    if (!active || !hasMoved) return;

    let raf = 0;
    let x = window.innerWidth / 2;
    let y = window.innerHeight / 2;

    function loop() {
      const { pointer } = usePortfolioStore.getState();
      const targetX = (pointer.x * 0.5 + 0.5) * window.innerWidth;
      const targetY = (pointer.y * 0.5 + 0.5) * window.innerHeight;
      x += (targetX - x) * 0.15;
      y += (targetY - y) * 0.15;
      if (dotRef.current) {
        dotRef.current.style.transform = `translate3d(${x - 6}px, ${y - 6}px, 0)`;
      }
      raf = requestAnimationFrame(loop);
    }

    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, [active, hasMoved]);

  if (!active || !hasMoved) return null;

  return (
    <div
      ref={dotRef}
      aria-hidden="true"
      className="pointer-events-none fixed left-0 top-0 z-40 h-3 w-3 rounded-full bg-brass/70 mix-blend-screen blur-[2px]"
    />
  );
}
