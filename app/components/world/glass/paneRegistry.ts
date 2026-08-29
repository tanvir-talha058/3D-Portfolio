'use client';

/**
 * The DOM side of the refraction layer.
 *
 * Everything here exists to keep layout reads out of the render loop. The
 * shader needs pane rectangles every frame; getBoundingClientRect forces a
 * layout; doing that for two dozen elements sixty times a second would cost
 * more than the refraction it feeds. So: events mark the registry dirty, one
 * rAF per frame at most does the measuring, and update() — which does run in
 * the render loop — only eases numbers that are already in memory.
 */

import { PANE_SELECTOR, RECIPES, type Tier } from './recipes';
import { MAX_PANES, approach, pack, type PaneInput } from './pack';

type Tracked = {
  el: Element;
  tier: Tier;
  /** Measured. */
  x: number;
  y: number;
  w: number;
  h: number;
  radius: number;
  /** Eased toward targets by update(). */
  enter: number;
  enterTo: number;
  response: number;
  responseTo: number;
};

export type Registry = {
  rects: Float32Array;
  params: Float32Array;
  /** Advances easing, packs, returns how many panes the shader should read. */
  update(dt: number, dpr: number): number;
  dispose(): void;
};

/** First matching selector wins; the map has no overlapping selectors. */
function tierOf(el: Element): Tier | null {
  for (const sel of Object.keys(RECIPES)) {
    if (el.matches(sel)) return RECIPES[sel];
  }
  return null;
}

/** Computed border-radius in px. Percentages and per-corner radii collapse
    to the first value, which is what every recipe on this page uses. */
function radiusOf(el: Element): number {
  const raw = getComputedStyle(el).borderTopLeftRadius;
  const n = parseFloat(raw);
  return Number.isFinite(n) ? n : 0;
}

export function createRegistry(): Registry {
  const rects = new Float32Array(MAX_PANES * 4);
  const params = new Float32Array(MAX_PANES * 4);

  let tracked: Tracked[] = [];
  const byEl = new Map<Element, Tracked>();
  const scratch: PaneInput[] = [];

  let dirty = true;
  let queued = 0;
  let disposed = false;

  function measure() {
    const vh = window.innerHeight;
    for (const t of tracked) {
      const r = t.el.getBoundingClientRect();
      t.x = r.left;
      t.y = r.top;
      t.w = r.width;
      t.h = r.height;
      /* A pane fully offscreen has no reason to hold its eased-in state:
         letting it decay means it fades back in on return, which is what
         makes long scrolls feel like the glass is forming, not blinking. */
      if (r.bottom < -vh || r.top > vh * 2) t.enterTo = 0;
    }
    dirty = false;
  }

  function schedule() {
    dirty = true;
    if (queued || disposed) return;
    queued = requestAnimationFrame(() => {
      queued = 0;
      if (!disposed) measure();
    });
  }

  /* Entering the viewport is what turns refraction on. IntersectionObserver
     rather than a rect comparison, because it does not force layout. */
  const io = new IntersectionObserver(
    (entries) => {
      for (const e of entries) {
        const t = byEl.get(e.target);
        if (t) t.enterTo = e.isIntersecting ? 1 : 0;
      }
      schedule();
    },
    { rootMargin: '10% 0px' },
  );

  /* Collect is the expensive one — a querySelectorAll plus a computed style
     per pane — so it runs on mount and on mutation, not on scroll. */
  function collect() {
    const found = document.querySelectorAll(PANE_SELECTOR);
    const next: Tracked[] = [];
    const seen = new Set<Element>();

    found.forEach((el) => {
      const tier = tierOf(el);
      if (!tier) return;
      seen.add(el);
      const prev = byEl.get(el);
      if (prev) {
        prev.tier = tier;
        prev.radius = radiusOf(el);
        next.push(prev);
        return;
      }
      next.push({
        el,
        tier,
        x: 0,
        y: 0,
        w: 0,
        h: 0,
        radius: radiusOf(el),
        /* New panes start unrefracted and ease in, so a sheet opening
           resolves into glass rather than arriving as glass. */
        enter: 0,
        enterTo: 0,
        response: 0,
        responseTo: 0,
      });
    });

    byEl.clear();
    for (const t of next) byEl.set(t.el, t);
    for (const t of tracked) if (!seen.has(t.el)) io.unobserve(t.el);
    for (const t of next) io.observe(t.el);
    tracked = next;
    dirty = true;
  }

  /* Hover and focus are delegated at the document, so panes that mount
     later — the sheet, the node labels — need no wiring of their own. */
  function setResponse(target: EventTarget | null, on: boolean) {
    if (!(target instanceof Element)) return;
    const pane = target.closest(PANE_SELECTOR);
    if (!pane) return;
    const t = byEl.get(pane);
    /* Tier 1 does not respond. Chips and steps are small, plentiful and not
       interactive; lighting them under the pointer reads as noise. The CSS
       makes the same distinction with --lit. */
    if (t && t.tier > 1) t.responseTo = on ? 1 : 0;
  }

  const onOver = (e: Event) => setResponse(e.target, true);
  const onOut = (e: Event) => setResponse(e.target, false);
  const onFocusIn = (e: Event) => setResponse(e.target, true);
  const onFocusOut = (e: Event) => setResponse(e.target, false);

  const mo = new MutationObserver(() => collect());

  collect();
  measure();

  window.addEventListener('scroll', schedule, { passive: true });
  window.addEventListener('resize', schedule);
  document.addEventListener('pointerover', onOver, { passive: true });
  document.addEventListener('pointerout', onOut, { passive: true });
  document.addEventListener('focusin', onFocusIn);
  document.addEventListener('focusout', onFocusOut);
  mo.observe(document.body, { childList: true, subtree: true });

  const ro = new ResizeObserver(schedule);
  ro.observe(document.documentElement);

  return {
    rects,
    params,

    update(dt, dpr) {
      if (dirty && !queued) measure();

      scratch.length = 0;
      for (const t of tracked) {
        t.enter = approach(t.enter, t.enterTo, dt);
        t.response = approach(t.response, t.responseTo, dt, 0.12);
        /* Below a whisker of refraction a pane contributes nothing but a
           distance evaluation, so it does not get a slot. */
        if (t.enter < 0.01) continue;
        scratch.push({
          x: t.x,
          y: t.y,
          w: t.w,
          h: t.h,
          radius: t.radius,
          tier: t.tier,
          enter: t.enter,
          response: t.response,
        });
      }

      return pack(scratch, window.innerWidth, window.innerHeight, dpr, rects, params);
    },

    dispose() {
      disposed = true;
      if (queued) cancelAnimationFrame(queued);
      io.disconnect();
      ro.disconnect();
      mo.disconnect();
      window.removeEventListener('scroll', schedule);
      window.removeEventListener('resize', schedule);
      document.removeEventListener('pointerover', onOver);
      document.removeEventListener('pointerout', onOut);
      document.removeEventListener('focusin', onFocusIn);
      document.removeEventListener('focusout', onFocusOut);
      tracked = [];
      byEl.clear();
    },
  };
}
