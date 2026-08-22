"use client";

import { Canvas } from "@react-three/fiber";
import { Suspense } from "react";
import dynamic from "next/dynamic";
import { usePortfolioStore, type SectionId } from "@/lib/store";
import { getPalette } from "@/lib/tokens";
import { Lighting } from "./Lighting";
import { CameraRig } from "./CameraRig";
import { SECTION_DEPTH } from "./sectionDepth";
import { ParticleField } from "../objects/ParticleField";
import { GridFloor } from "../objects/GridFloor";
import { TimelinePath3D } from "../objects/TimelinePath3D";
import { ResearchConstellation } from "../objects/ResearchConstellation";
import { AICore } from "../objects/AICore";
import { Effects } from "../postprocessing/Effects";

// Rapier-backed groups: nested dynamic imports (rather than a static import
// at module scope) so the Rapier WASM chunk only downloads once one of these
// actually renders for the first time — not on initial hero paint.
const ProjectGalaxy3D = dynamic(
  () => import("../objects/ProjectGalaxy3D").then((m) => m.ProjectGalaxy3D),
  { ssr: false }
);
const NeuralNetwork3D = dynamic(
  () => import("../objects/NeuralNetwork3D").then((m) => m.NeuralNetwork3D),
  { ssr: false }
);

const SECTION_ORDER: SectionId[] = [
  "hero",
  "experience",
  "projects",
  "skills",
  "research",
  "contact",
];

// Per-section decorative groups sit far apart along z in one persistent world.
// Bloom operates on rendered pixel brightness with no distance falloff, so an
// emissive object many sections away still renders as a small photo-real
// bright point that Bloom's fixed-size kernel blows into a large, distracting
// blob — regardless of how far away or how small it visually is. Only mount a
// section's decorative group when it's the active section or one step away
// (covering the camera's in-flight transition), so distant sections' objects
// simply aren't in the render tree to bloom.
function isSectionNear(section: SectionId, activeSection: SectionId) {
  const activeIndex = SECTION_ORDER.indexOf(activeSection);
  const sectionIndex = SECTION_ORDER.indexOf(section);
  return Math.abs(sectionIndex - activeIndex) <= 1;
}

export default function Scene() {
  const isMobile = usePortfolioStore((s) => s.isMobile);
  const activeSection = usePortfolioStore((s) => s.activeSection);
  const theme = usePortfolioStore((s) => s.theme);
  const dpr: [number, number] = [1, isMobile ? 1.5 : 2];
  const particleCount = isMobile ? 1500 : 6000;
  const pal = getPalette(theme);

  return (
    <div className="fixed inset-0 -z-10">
      <Canvas
        dpr={dpr}
        gl={{ antialias: !isMobile, powerPreference: "high-performance" }}
        performance={{ min: 0.5 }}
        camera={{ position: [0, 0, 9], fov: 55, near: 0.1, far: 200 }}
      >
        <color attach="background" args={[pal.ink]} />
        <fog attach="fog" args={[pal.ink, 20, 90]} />
        <Suspense fallback={null}>
          <Lighting />
          <CameraRig />
          <ParticleField count={particleCount} />
          <GridFloor />
          {isSectionNear("hero", activeSection) && <AICore />}
          {isSectionNear("experience", activeSection) && (
            <group position={[0, 0, SECTION_DEPTH.experience]}>
              <TimelinePath3D />
            </group>
          )}
          {isSectionNear("projects", activeSection) && (
            <group position={[0, -4, SECTION_DEPTH.projects]}>
              <ProjectGalaxy3D />
            </group>
          )}
          {isSectionNear("skills", activeSection) && (
            <group position={[0, -2.1, SECTION_DEPTH.skills]}>
              <NeuralNetwork3D />
            </group>
          )}
          {isSectionNear("research", activeSection) && (
            <group position={[0, 0, SECTION_DEPTH.research]}>
              <ResearchConstellation />
            </group>
          )}
        </Suspense>
        <Effects />
      </Canvas>
    </div>
  );
}
