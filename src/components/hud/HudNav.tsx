"use client";

import type { MouseEvent } from "react";
import { cn } from "@/lib/cn";
import { usePortfolioStore, type SectionId } from "@/lib/store";
import { ThemeToggle } from "./ThemeToggle";

const NAV_ITEMS: { id: SectionId; label: string }[] = [
  { id: "experience", label: "Experience" },
  { id: "projects", label: "Projects" },
  { id: "skills", label: "Skills" },
  { id: "research", label: "Research" },
  { id: "contact", label: "Contact" },
];

export function HudNav() {
  const activeSection = usePortfolioStore((s) => s.activeSection);
  const reducedMotion = usePortfolioStore((s) => s.reducedMotion);

  function handleClick(event: MouseEvent<HTMLAnchorElement>, id: SectionId) {
    event.preventDefault();
    document.getElementById(id)?.scrollIntoView({
      behavior: reducedMotion ? "auto" : "smooth",
      block: "start",
    });
  }

  return (
    <nav
      aria-label="Primary"
      className="fixed left-1/2 top-4 z-40 flex -translate-x-1/2 items-center gap-1 rounded-sm border border-line bg-ink/85 px-2 py-2 backdrop-blur-md sm:top-6"
    >
      <a
        href="#hero"
        onClick={(e) => handleClick(e, "hero")}
        className="mr-2 hidden pl-3 font-mono text-xs tracking-[0.2em] text-paper sm:inline-flex"
      >
        TANVIR.OS
      </a>
      {NAV_ITEMS.map((item) => (
        <a
          key={item.id}
          href={`#${item.id}`}
          onClick={(e) => handleClick(e, item.id)}
          className={cn(
            "border-b px-3 py-1.5 text-xs font-medium uppercase tracking-[0.15em] transition-colors sm:px-4 sm:text-sm",
            activeSection === item.id
              ? "border-brass text-brass"
              : "border-transparent text-paper/60 hover:text-paper"
          )}
        >
          {item.label}
        </a>
      ))}
      <ThemeToggle />
    </nav>
  );
}
