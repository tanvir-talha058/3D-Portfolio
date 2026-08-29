/**
 * Which elements are glass, and how thick.
 *
 * The stylesheets already say this — sixteen recipes, each setting a
 * --lens-N-blur — but a shader cannot read a stylesheet. So the fact is
 * written twice, and `npm run check:glass` fails the build if the two
 * copies ever disagree.
 *
 * Tier is the one axis a pane varies on, exactly as in the CSS: how far it
 * floats above the world. Everything optical follows from it. A tier 3 pane
 * floats higher, so it is thicker, so it bends more.
 */

export type Tier = 1 | 2 | 3;

export const RECIPES: Record<string, Tier> = {
  /* 1 inset — chips, steps, small instrument labels. Nearly flush. */
  '.chip': 1,
  '.pipeline-step': 1,
  '.rag-label': 1,

  /* 2 raised — cards, rows, panels, the figure frames. Most of the page. */
  '.panel': 2,
  '.rowglass': 2,
  '.research-entry': 2,
  '.net': 2,
  '.attn': 2,
  '.descent': 2,
  '.rag': 2,
  '.station-legend': 2,

  /* 3 floating — topbar, sheet, buttons. Clears the page entirely. */
  '.node-label': 3,
  '.sheet': 3,
  '.glass-btn': 3,
  '.topbar': 3,
  '.boot-skip': 3,
};

/** One selector string for querySelectorAll. */
export const PANE_SELECTOR = Object.keys(RECIPES).join(', ');

export type TierOptics = {
  /** Width of the rim band, in CSS pixels. Beyond this the pane is clear. */
  rim: number;
  /** Peak displacement at the rim, as a fraction of the rim width. */
  strength: number;
  /** How far apart R and B sample, as a fraction of the displacement. */
  dispersion: number;
  /** Specular gain. Deliberately the alpha of --lens-N-spec, so the WebGL
      highlight and the CSS one are lit to the same brightness. */
  spec: number;
};

export const OPTICS: Record<Tier, TierOptics> = {
  1: { rim: 10, strength: 0.9, dispersion: 0.18, spec: 0.28 },
  2: { rim: 14, strength: 1.2, dispersion: 0.26, spec: 0.4 },
  3: { rim: 18, strength: 1.6, dispersion: 0.34, spec: 0.55 },
};

/** Tier order as flat arrays, for upload as shader uniforms. */
export const OPTICS_ARRAYS = {
  rim: [OPTICS[1].rim, OPTICS[2].rim, OPTICS[3].rim],
  strength: [OPTICS[1].strength, OPTICS[2].strength, OPTICS[3].strength],
  dispersion: [OPTICS[1].dispersion, OPTICS[2].dispersion, OPTICS[3].dispersion],
  spec: [OPTICS[1].spec, OPTICS[2].spec, OPTICS[3].spec],
};
