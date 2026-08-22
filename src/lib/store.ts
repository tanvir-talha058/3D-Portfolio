import { create } from "zustand";

export type Theme = "light" | "dark";

export type SectionId =
  | "hero"
  | "experience"
  | "projects"
  | "skills"
  | "research"
  | "contact";

interface PointerState {
  x: number;
  y: number;
}

interface PortfolioState {
  theme: Theme;
  setTheme: (value: Theme) => void;

  bootComplete: boolean;
  setBootComplete: (value: boolean) => void;

  activeSection: SectionId;
  setActiveSection: (section: SectionId) => void;

  reducedMotion: boolean;
  setReducedMotion: (value: boolean) => void;

  isMobile: boolean;
  setIsMobile: (value: boolean) => void;

  hasFinePointer: boolean;
  setHasFinePointer: (value: boolean) => void;

  pointer: PointerState;
  setPointer: (x: number, y: number) => void;
}

export const usePortfolioStore = create<PortfolioState>((set) => ({
  theme: "dark",
  setTheme: (value) => set({ theme: value }),

  bootComplete: false,
  setBootComplete: (value) => set({ bootComplete: value }),

  activeSection: "hero",
  setActiveSection: (section) => set({ activeSection: section }),

  reducedMotion: false,
  setReducedMotion: (value) => set({ reducedMotion: value }),

  isMobile: false,
  setIsMobile: (value) => set({ isMobile: value }),

  hasFinePointer: false,
  setHasFinePointer: (value) => set({ hasFinePointer: value }),

  pointer: { x: 0, y: 0 },
  setPointer: (x, y) => set({ pointer: { x, y } }),
}));
