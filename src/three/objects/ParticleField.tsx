"use client";

import { Stars } from "@react-three/drei";
import { usePortfolioStore } from "@/lib/store";

export function ParticleField({ count }: { count: number }) {
  const reducedMotion = usePortfolioStore((s) => s.reducedMotion);
  const theme = usePortfolioStore((s) => s.theme);
  // Drei's Stars hardcodes point lightness internally (not an exposed prop),
  // so it can't become genuine dark ink-flecks on a light background —
  // shrinking point size instead keeps it a faint, intentional sparkle
  // rather than a stark white speckle field against paper.
  const isLight = theme === "light";

  return (
    <Stars
      radius={60}
      depth={40}
      count={isLight ? Math.round(count * 0.5) : count}
      factor={isLight ? 0.9 : 2.5}
      saturation={0}
      fade
      speed={reducedMotion ? 0 : 0.4}
    />
  );
}
