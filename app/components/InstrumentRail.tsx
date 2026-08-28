'use client';

import { useEffect, useState } from 'react';
import NetMount from './NetMount';
import DescentMount from './DescentMount';

/**
 * One instrument, pinned beside the middle of the page.
 *
 * These figures used to sit boxed inside their own sections, so each one
 * cost a full section of height and none of them read as related. Here they
 * share a single pinned frame and the scroll position selects which is
 * showing: the reader drives one machine through its modes rather than
 * scrolling past a row of separate widgets.
 *
 * Exactly one is mounted at a time. A WebGL context is a scarce,
 * browser-capped resource, and the rail is permanently on screen — mounting
 * every instrument would leave that many render loops running for the whole
 * session.
 */

/* Section -> instrument. The rail spans the narrative middle only: the
   network carries expertise and experience because both are about what
   fills each layer, and method is the optimiser.
   
   The card walls — stack, work, research — are deliberately not here. Each
   is a grid that gets *taller* when squeezed into a half-width column, so
   giving them the rail cost more height than the inline figures ever did.
   They keep their full measure and their own figures. */
const RAIL: { id: string; render: () => React.ReactNode }[] = [
  { id: 'expertise', render: () => <NetMount /> },
  { id: 'experience', render: () => <NetMount /> },
  { id: 'method', render: () => <DescentMount /> },
];

/* Below this the rail is not rendered at all: there is no room for a second
   column, and the sections fall back to a single stacked flow. Matches the
   1024px breakpoint the stylesheet uses for .instrument-rail. */
const MIN_WIDTH = '(min-width: 1024px)';

export default function InstrumentRail() {
  const [wide, setWide] = useState(false);
  const [active, setActive] = useState<string | null>(null);

  useEffect(() => {
    const mq = window.matchMedia(MIN_WIDTH);
    const apply = () => setWide(mq.matches);
    apply();
    mq.addEventListener('change', apply);
    return () => mq.removeEventListener('change', apply);
  }, []);

  useEffect(() => {
    if (!wide || typeof IntersectionObserver === 'undefined') return;

    // Ratios are kept per section rather than reacting to each entry alone,
    // so that during a scroll where one section is leaving and the next is
    // arriving the rail switches to whichever actually owns more of the
    // viewport instead of flapping between them.
    const ratios = new Map<string, number>();

    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) ratios.set(e.target.id, e.intersectionRatio);
        let best: string | null = null;
        let bestRatio = 0;
        for (const { id } of RAIL) {
          const r = ratios.get(id) ?? 0;
          if (r > bestRatio) {
            bestRatio = r;
            best = id;
          }
        }
        setActive(best);
      },
      { threshold: [0, 0.15, 0.35, 0.6, 0.9] },
    );

    for (const { id } of RAIL) {
      const el = document.getElementById(id);
      if (el) io.observe(el);
    }
    return () => io.disconnect();
  }, [wide]);

  if (!wide) return null;

  const current = RAIL.find((r) => r.id === active);

  return (
    // Not aria-hidden: each figure carries a real figcaption — the layer
    // names, the optimiser readout, the paper list — and that text exists
    // nowhere else on the page now that the inline copies are gone.
    <aside className="instrument-rail" data-showing={current ? 'true' : 'false'}>
      {/* Keyed on the section so React swaps the figure outright rather than
          reconciling one canvas into another — the old context is released
          before the new one is created. */}
      <div className="instrument-frame" key={current?.id ?? 'none'}>
        {current ? current.render() : null}
      </div>
    </aside>
  );
}
