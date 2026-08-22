"use client";

import { usePortfolioStore } from "@/lib/store";
import { getPalette } from "@/lib/tokens";

export function Lighting() {
  const theme = usePortfolioStore((s) => s.theme);
  const pal = getPalette(theme);

  return (
    <>
      <ambientLight intensity={0.35} />
      <pointLight position={[10, 8, 10]} intensity={30} color={pal.brass} distance={40} decay={2} />
      <pointLight position={[-10, -5, -10]} intensity={18} color={pal.ambient} distance={40} decay={2} />
    </>
  );
}
