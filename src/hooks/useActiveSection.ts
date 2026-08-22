"use client";

import { useEffect } from "react";
import { usePortfolioStore, type SectionId } from "@/lib/store";

const SECTION_IDS: SectionId[] = [
  "hero",
  "experience",
  "projects",
  "skills",
  "research",
  "contact",
];

export function useActiveSection() {
  const setActiveSection = usePortfolioStore((s) => s.setActiveSection);

  useEffect(() => {
    const elements = SECTION_IDS.map((id) => document.getElementById(id)).filter(
      (el): el is HTMLElement => el !== null
    );

    if (elements.length === 0) return;

    // Picks whichever section's bounding box currently contains (or is
    // nearest to) the viewport's vertical center. Deliberately not based on
    // intersectionRatio: that ratio is relative to each target's OWN height,
    // so a much taller section (e.g. Research, stacked with many cards) can
    // never "win" against a single-viewport-tall section even while it's the
    // one actually being read — this check is height-independent instead.
    function updateActive() {
      const center = window.innerHeight / 2;
      let closestId: SectionId | null = null;
      let closestDistance = Infinity;

      for (const el of elements) {
        const rect = el.getBoundingClientRect();
        if (rect.top <= center && rect.bottom >= center) {
          closestId = el.id as SectionId;
          break;
        }
        const distance = rect.top > center ? rect.top - center : center - rect.bottom;
        if (distance < closestDistance) {
          closestDistance = distance;
          closestId = el.id as SectionId;
        }
      }

      if (closestId) setActiveSection(closestId);
    }

    const observer = new IntersectionObserver(updateActive, {
      rootMargin: "-40% 0px -40% 0px",
      threshold: [0, 0.1, 0.25, 0.5, 0.75, 1],
    });

    elements.forEach((el) => observer.observe(el));
    updateActive();
    return () => observer.disconnect();
  }, [setActiveSection]);
}
