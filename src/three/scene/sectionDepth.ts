import type { SectionId } from "@/lib/store";

export const SECTION_DEPTH: Record<SectionId, number> = {
  hero: 0,
  experience: -16,
  projects: -32,
  skills: -48,
  research: -64,
  contact: -80,
};
