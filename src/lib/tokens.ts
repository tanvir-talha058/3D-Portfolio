import type { Theme } from "./store";

export const paletteDark = {
  ink: "#0b0d10",
  panel: "#14171c",
  line: "#2a2f37",
  paper: "#ede9e1",
  muted: "#9a9d9f",
  brass: "#c9a227",
  brassBright: "#f0c750",
  bronze: "#3d2b12",
  ambient: "#ede9e1",
} as const;

export const paletteLight = {
  ink: "#f4f1ea",
  panel: "#fbf9f4",
  line: "#ddd6c4",
  paper: "#1c1a14",
  muted: "#6b6558",
  brass: "#8a621c",
  brassBright: "#a8791c",
  bronze: "#d8c9a3",
  ambient: "#fbf9f4",
} as const;

// Default export kept for any not-yet-migrated call sites — always resolves
// to the dark palette. Prefer getPalette(theme) for anything rendered inside
// the R3F scene, since Three.js materials need a real theme-aware value, not
// a CSS variable the WebGL canvas can't see.
export const palette = paletteDark;

export function getPalette(theme: Theme) {
  return theme === "light" ? paletteLight : paletteDark;
}
