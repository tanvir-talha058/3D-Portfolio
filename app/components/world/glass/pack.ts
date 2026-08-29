/**
 * Turning measured DOM rectangles into something a shader can read.
 *
 * Kept apart from the DOM reading itself because this half is pure
 * arithmetic and pure arithmetic can be tested. The y flip, the radius
 * clamp and the cap are exactly the places a refraction layer goes subtly
 * wrong, and subtly wrong refraction is very hard to see and very easy to
 * assert about.
 */

import { OPTICS, type Tier } from './recipes';

/**
 * How many panes reach the shader at once.
 *
 * The shader loops over this many rounded-rect distance evaluations per
 * pixel, so it is a real cost, and it is a uniform array size so it must be
 * a compile-time constant. Twenty-four covers the densest band on this page
 * with room to spare. A pane that loses the cap keeps its CSS glass, so it
 * degrades to how the page looked yesterday rather than to nothing.
 */
export const MAX_PANES = 24;

export type PaneInput = {
  /** Viewport-relative CSS pixels, y down — i.e. getBoundingClientRect. */
  x: number;
  y: number;
  w: number;
  h: number;
  /** Corner radius in CSS pixels, before clamping. */
  radius: number;
  tier: Tier;
  /** 0..1, eased as the pane enters the viewport. */
  enter: number;
  /** 0..1, eased on hover and focus. */
  response: number;
};

/**
 * Overlaps the viewport, grown by the pane's rim.
 *
 * The margin matters: a pane one pixel off the top of the screen still has
 * a rim that bends light back into view, and culling it would pop the
 * refraction at the edge of the screen.
 */
export function visible(p: PaneInput, vw: number, vh: number): boolean {
  const m = OPTICS[p.tier].rim;
  return p.x + p.w > -m && p.y + p.h > -m && p.x < vw + m && p.y < vh + m;
}

/**
 * Writes the visible panes into the two uniform buffers.
 *
 * `rects` is (x, y, w, h) in device pixels with the origin at the bottom
 * left, because that is where gl_FragCoord's origin is. `params` is
 * (radius, tier, enter, response). Returns how many slots were filled;
 * the shader loops to that count and ignores the rest.
 */
export function pack(
  panes: PaneInput[],
  vw: number,
  vh: number,
  dpr: number,
  rects: Float32Array,
  params: Float32Array,
): number {
  const keep = panes
    .filter((p) => p.w > 0 && p.h > 0 && visible(p, vw, vh))
    .sort((a, b) => b.w * b.h - a.w * a.h)
    .slice(0, MAX_PANES);

  for (let i = 0; i < keep.length; i += 1) {
    const p = keep[i];
    const o = i * 4;
    rects[o] = p.x * dpr;
    rects[o + 1] = (vh - p.y - p.h) * dpr;
    rects[o + 2] = p.w * dpr;
    rects[o + 3] = p.h * dpr;
    params[o] = Math.min(p.radius, Math.min(p.w, p.h) / 2) * dpr;
    params[o + 1] = p.tier;
    params[o + 2] = p.enter;
    params[o + 3] = p.response;
  }

  return keep.length;
}

/**
 * Exponential ease toward a target, independent of frame rate.
 *
 * A naive `v += (target - v) * 0.1` moves twice as fast at 120fps as at
 * 60fps, which would make the glass resolve at a different speed on
 * different machines. `tau` is the time constant: about 63% of the way
 * there after tau seconds, about 97% after 3.5 tau. The default reaches a
 * pane's full refraction in roughly 320ms.
 */
export function approach(current: number, target: number, dt: number, tau = 0.09): number {
  return current + (target - current) * (1 - Math.exp(-dt / tau));
}
