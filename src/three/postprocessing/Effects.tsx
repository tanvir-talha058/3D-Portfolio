"use client";

import { EffectComposer, Bloom, ChromaticAberration, Vignette, Noise } from "@react-three/postprocessing";
import { BlendFunction } from "postprocessing";
import { usePortfolioStore } from "@/lib/store";

export function Effects() {
  const isMobile = usePortfolioStore((s) => s.isMobile);
  const theme = usePortfolioStore((s) => s.theme);
  const isLight = theme === "light";

  return (
    <EffectComposer multisampling={isMobile ? 0 : 4}>
      <Bloom
        mipmapBlur
        // A bright/paper background sits much closer to (or above) a dark-
        // mode-tuned luminance threshold, so bloom would glare and wash out
        // the whole scene instead of highlighting a few emissive accents —
        // light mode needs a meaningfully higher threshold and lower gain.
        luminanceThreshold={isLight ? 0.75 : 0.32}
        luminanceSmoothing={0.08}
        intensity={isLight ? 0.25 : isMobile ? 0.45 : 0.75}
        height={isMobile ? 240 : 480}
      />
      <ChromaticAberration offset={isMobile ? [0.0003, 0.0003] : [0.0006, 0.0006]} />
      <Vignette offset={0.15} darkness={isLight ? 0.35 : 1.0} />
      <Noise opacity={isMobile ? 0.02 : 0.03} blendFunction={BlendFunction.OVERLAY} />
    </EffectComposer>
  );
}
