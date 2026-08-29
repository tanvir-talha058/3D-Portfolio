'use client';

import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from 'react';
import { useReducedMotion } from './ui';

/* --------------------------- shared helpers --------------------------- */

function useFinePointer() {
  const [fine, setFine] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia('(pointer: fine)');
    const apply = () => setFine(mq.matches);
    apply();
    mq.addEventListener('change', apply);
    return () => mq.removeEventListener('change', apply);
  }, []);
  return fine;
}

/** Fires once when the element first enters view. */
function useInView<T extends HTMLElement>(threshold = 0.25) {
  const ref = useRef<T>(null);
  const [shown, setShown] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (typeof IntersectionObserver === 'undefined') {
      setShown(true);
      return;
    }
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setShown(true);
          io.disconnect();
        }
      },
      { threshold, rootMargin: '0px 0px -6% 0px' },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [threshold]);

  return { ref, shown };
}

/* ------------------------------- cursor ------------------------------- */

const INTERACTIVE = 'a, button, [role="button"], input, summary';

/**
 * Two-part cursor: a lagging ring and a dot pinned to the real pointer.
 * Only mounts for a fine pointer with motion allowed; everything else keeps
 * the native cursor, and the CSS never hides it in those cases.
 */
export function Cursor() {
  const ring = useRef<HTMLDivElement>(null);
  const dot = useRef<HTMLDivElement>(null);
  const fine = useFinePointer();
  const reduced = useReducedMotion();
  const active = fine && !reduced;

  useEffect(() => {
    if (!active) return;

    const target = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
    const eased = { ...target };
    let raf = 0;
    let seen = false;

    const onMove = (e: PointerEvent) => {
      target.x = e.clientX;
      target.y = e.clientY;

      if (!seen) {
        seen = true;
        eased.x = target.x;
        eased.y = target.y;
        document.body.dataset.cursor = 'on';
      }

      const el = e.target as Element | null;
      const state = el?.closest?.(INTERACTIVE)
        ? 'link'
        : el?.tagName === 'CANVAS'
          ? 'scene'
          : 'idle';
      if (document.body.dataset.cursorState !== state) {
        document.body.dataset.cursorState = state;
      }
    };

    const tick = () => {
      // The ring lags the pointer; the dot does not. That gap is the effect.
      eased.x += (target.x - eased.x) * 0.18;
      eased.y += (target.y - eased.y) * 0.18;

      if (ring.current) {
        ring.current.style.transform = `translate3d(${eased.x}px, ${eased.y}px, 0)`;
      }
      if (dot.current) {
        dot.current.style.transform = `translate3d(${target.x}px, ${target.y}px, 0)`;
      }
      raf = requestAnimationFrame(tick);
    };

    const onLeave = () => {
      document.body.dataset.cursor = 'off';
    };
    const onEnter = () => {
      if (seen) document.body.dataset.cursor = 'on';
    };

    window.addEventListener('pointermove', onMove, { passive: true });
    document.addEventListener('pointerleave', onLeave);
    document.addEventListener('pointerenter', onEnter);
    raf = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('pointermove', onMove);
      document.removeEventListener('pointerleave', onLeave);
      document.removeEventListener('pointerenter', onEnter);
      delete document.body.dataset.cursor;
      delete document.body.dataset.cursorState;
    };
  }, [active]);

  if (!active) return null;

  return (
    <>
      <div ref={ring} className="cursor-ring" aria-hidden="true" />
      <div ref={dot} className="cursor-dot" aria-hidden="true" />
    </>
  );
}

/* --------------------------- scroll progress --------------------------- */

export function ScrollProgress() {
  const bar = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let raf = 0;
    const update = () => {
      raf = 0;
      const max = document.documentElement.scrollHeight - window.innerHeight;
      const p = max > 0 ? Math.min(window.scrollY / max, 1) : 0;
      bar.current?.style.setProperty('--p', String(p));
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };
    update();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll, { passive: true });
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
    };
  }, []);

  return (
    <div className="progress" aria-hidden="true">
      <div ref={bar} className="progress-bar" />
    </div>
  );
}

/* --------------------------- hero departure --------------------------- */

/**
 * Publishes the hero's exit progress as a CSS variable.
 *
 * The WebGL rig already drives the camera forward through the field over
 * the first 900px of scroll; this puts the same 0..1 on the hero element so
 * the copy can travel with it. Deliberately the same constant and the same
 * smoothstep as the rig — if the two curves drift apart the copy stops
 * feeling attached to the scene.
 *
 * Nothing here animates on its own: it only reports scroll position, and
 * the styling lives in motion.css, so reduced-motion is handled there.
 */
export function HeroDepart() {
  useEffect(() => {
    const hero = document.querySelector<HTMLElement>('.hero');
    if (!hero) return;

    let raf = 0;
    const update = () => {
      raf = 0;
      const p = Math.min(window.scrollY / 900, 1);
      hero.style.setProperty('--depart', String(p * p * (3 - 2 * p)));
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };

    update();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('scroll', onScroll);
    };
  }, []);

  return null;
}

/* ---------------------------- split heading ---------------------------- */

/**
 * Staggered reveal for a heading.
 *
 * `by="char"` is the hero treatment; `by="word"` is used everywhere else so
 * that skimming the page is not slowed down by letter-level animation.
 * The animated spans are hidden from assistive tech and the original string
 * is exposed once via aria-label.
 */
export function Split({
  text,
  by = 'word',
  className = '',
  step,
  offset = 0,
}: {
  text: string;
  by?: 'char' | 'word';
  className?: string;
  step?: number;
  /** Cumulative delay in ms, so a multi-segment headline stays one sequence. */
  offset?: number;
}) {
  const { ref, shown } = useInView<HTMLSpanElement>(0.2);
  const reduced = useReducedMotion();
  const delayStep = step ?? (by === 'char' ? 18 : 45);

  if (reduced) return <span className={className}>{text}</span>;

  const words = text.split(' ');
  let index = 0;

  // Decorative by construction: the heading that contains this carries the
  // accessible name via aria-label, so the letters must not be announced
  // and must not duplicate the string in the DOM.
  return (
    <span ref={ref} className={`split ${className}`} data-shown={shown} aria-hidden="true">
      <>
        {words.map((word, w) => {
          const gap = w < words.length - 1 ? ' ' : '';

          if (by === 'word') {
            return (
              <span
                key={`${word}-${w}`}
                className="split-word"
                style={{ transitionDelay: `${offset + w * delayStep}ms` }}
              >
                {word}
                {gap}
              </span>
            );
          }

          const chars = Array.from(word).map((ch, c) => {
            const d = offset + index++ * delayStep;
            return (
              <span
                key={`${ch}-${c}`}
                className="split-char"
                style={{ transitionDelay: `${d}ms` }}
              >
                {ch}
              </span>
            );
          });
          index++; // the space also occupies a beat

          return (
            // Letters stay glued together; the gap sits outside the wrapper
            // so lines can still break between words.
            <span key={`${word}-${w}`}>
              <span className="split-word-wrap">{chars}</span>
              {gap}
            </span>
          );
        })}
      </>
    </span>
  );
}

/** Character count including inter-word beats, for chaining Split offsets. */
export function beats(text: string) {
  return text.length;
}

/* ------------------------------- wipe ------------------------------- */

export function Wipe({
  children,
  delay = 0,
  className = '',
}: {
  children: ReactNode;
  delay?: number;
  className?: string;
}) {
  const { ref, shown } = useInView<HTMLDivElement>(0.12);
  return (
    <div
      ref={ref}
      className={`wipe ${className}`}
      data-shown={shown}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </div>
  );
}

/* ----------------------------- magnetic ----------------------------- */

/** Pulls its child toward the pointer while hovered. Mouse only. */
export function Magnet({
  children,
  strength = 0.32,
  className = '',
}: {
  children: ReactNode;
  strength?: number;
  className?: string;
}) {
  const el = useRef<HTMLSpanElement>(null);
  const raf = useRef(0);
  const reduced = useReducedMotion();

  const onMove = useCallback(
    (e: React.PointerEvent<HTMLSpanElement>) => {
      if (reduced || e.pointerType !== 'mouse') return;
      const node = el.current;
      if (!node) return;
      const { clientX, clientY } = e;

      cancelAnimationFrame(raf.current);
      raf.current = requestAnimationFrame(() => {
        const r = node.getBoundingClientRect();
        const dx = clientX - (r.left + r.width / 2);
        const dy = clientY - (r.top + r.height / 2);
        node.dataset.pulling = 'true';
        node.style.setProperty('--mgx', `${dx * strength}px`);
        node.style.setProperty('--mgy', `${dy * strength}px`);
      });
    },
    [reduced, strength],
  );

  const reset = useCallback(() => {
    cancelAnimationFrame(raf.current);
    const node = el.current;
    if (!node) return;
    node.dataset.pulling = 'false';
    node.style.setProperty('--mgx', '0px');
    node.style.setProperty('--mgy', '0px');
  }, []);

  useEffect(() => () => cancelAnimationFrame(raf.current), []);

  return (
    <span
      ref={el}
      className={`magnet ${className}`}
      onPointerMove={onMove}
      onPointerLeave={reset}
    >
      {children}
    </span>
  );
}

/* ------------------------------ count-up ------------------------------ */

/**
 * Counts the numeric part of a value up on reveal while preserving any
 * prefix or suffix, so "<100ms" animates the 100 and keeps the rest.
 */
export function Count({ value }: { value: string }) {
  const { ref, shown } = useInView<HTMLSpanElement>(0.5);
  const reduced = useReducedMotion();
  const [text, setText] = useState(reduced ? value : null);

  // Memoised on the value: a fresh array each render would land in the
  // effect's dependency list and restart the count on every frame it
  // painted, freezing the number a hair above zero.
  const match = useMemo(() => value.match(/^(\D*)([\d,.]+)(.*)$/), [value]);

  useEffect(() => {
    if (reduced) {
      setText(value);
      return;
    }
    if (!shown || !match) return;

    const [, prefix, digits, suffix] = match;
    const hasComma = digits.includes(',');
    const decimals = digits.includes('.') ? digits.split('.')[1].length : 0;
    const end = parseFloat(digits.replace(/,/g, ''));
    if (!Number.isFinite(end)) return;

    const DURATION = 1100;
    const start = performance.now();
    let raf = 0;

    const frame = (now: number) => {
      const t = Math.min((now - start) / DURATION, 1);
      // easeOutExpo: fast start, long settle — reads as a counter landing.
      const eased = t === 1 ? 1 : 1 - Math.pow(2, -10 * t);
      const n = end * eased;
      const shownNum = decimals
        ? n.toFixed(decimals)
        : hasComma
          ? Math.round(n).toLocaleString('en-US')
          : String(Math.round(n));
      setText(`${prefix}${shownNum}${suffix}`);
      if (t < 1) raf = requestAnimationFrame(frame);
    };

    raf = requestAnimationFrame(frame);
    return () => cancelAnimationFrame(raf);
  }, [shown, reduced, match, value]);

  // Non-numeric values pass straight through.
  if (!match) return <span>{value}</span>;

  return (
    <span ref={ref} className="count">
      {text ?? `${match[1]}0${match[3]}`}
    </span>
  );
}

/* --------------------------- glass specular --------------------------- */

/**
 * One delegated pointer listener drives the highlight on every glass pane,
 * rather than a listener per panel. Finds the pane under the cursor, writes
 * local coordinates to it, and clears the previous one.
 */
export function Specular() {
  const reduced = useReducedMotion();
  const fine = useFinePointer();

  useEffect(() => {
    if (reduced || !fine) return;

    let raf = 0;
    let last: HTMLElement | null = null;
    let px = 0;
    let py = 0;

    const clear = (el: HTMLElement | null) => {
      if (!el) return;
      el.style.removeProperty('--mx');
      el.style.removeProperty('--my');
      el.style.removeProperty('--lit');
    };

    const update = () => {
      raf = 0;
      const hit = document.elementFromPoint(px, py) as HTMLElement | null;
      /* Every tier-2 and tier-3 pane. Tier 1 is left out on purpose: those
         appear in walls of twenty or more, and a highlight chasing the
         pointer across a wall of chips reads as noise, not as material. */
      const pane = hit?.closest?.(
        '.panel, .rowglass, .research-entry, .net, .attn, .descent, .rag, ' +
          '.station-legend, .glass-btn, .topbar',
      ) as HTMLElement | null;

      if (pane !== last) {
        clear(last);
        last = pane;
      }
      if (!pane) return;

      const r = pane.getBoundingClientRect();
      pane.style.setProperty('--mx', `${((px - r.left) / r.width) * 100}%`);
      pane.style.setProperty('--my', `${((py - r.top) / r.height) * 100}%`);
      pane.style.setProperty('--lit', '1');
    };

    const onMove = (e: PointerEvent) => {
      px = e.clientX;
      py = e.clientY;
      if (!raf) raf = requestAnimationFrame(update);
    };

    window.addEventListener('pointermove', onMove, { passive: true });
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('pointermove', onMove);
      clear(last);
    };
  }, [reduced, fine]);

  return null;
}
