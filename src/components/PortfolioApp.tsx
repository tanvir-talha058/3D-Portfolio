"use client";

import dynamic from "next/dynamic";
import { useActiveSection } from "@/hooks/useActiveSection";
import { useDeviceCapability } from "@/hooks/useDeviceCapability";
import { useTheme } from "@/hooks/useTheme";
import { useParallax } from "@/three/controls/useParallax";
import { BootLaptop } from "./boot/BootLaptop";
import { HudNav } from "./hud/HudNav";
import { SystemReadout } from "./hud/SystemReadout";
import { CursorTrail } from "./hud/CursorTrail";
import { DataStreamFlourish } from "./hud/DataStreamFlourish";
import { TechnicalFrame } from "./hud/TechnicalFrame";
import { Hero } from "./hero/Hero";
import { ExperienceSection } from "./experience/ExperienceSection";
import { ProjectsSection } from "./projects/ProjectsSection";
import { SkillsSection } from "./skills/SkillsSection";
import { ResearchSection } from "./research/ResearchSection";
import { ContactSection } from "./contact/ContactSection";

const Scene = dynamic(() => import("@/three/scene/Scene"), { ssr: false });

export function PortfolioApp() {
  useDeviceCapability();
  useActiveSection();
  useParallax();
  useTheme();

  return (
    <>
      <BootLaptop />
      <Scene />
      <HudNav />
      <SystemReadout />
      <CursorTrail />
      <DataStreamFlourish />
      <TechnicalFrame />
      <main className="relative z-10">
        <Hero />
        <ExperienceSection />
        <ProjectsSection />
        <SkillsSection />
        <ResearchSection />
        <ContactSection />
      </main>
    </>
  );
}
