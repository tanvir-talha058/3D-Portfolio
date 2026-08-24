'use client';

import {
  createElement,
  useCallback,
  useEffect,
  useRef,
  useState,
  type CSSProperties,
  type ReactNode,
} from 'react';
import { nav } from '../data';

/* ---------------------------- reduced motion ---------------------------- */

export function useReducedMotion() {
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    const apply = () => setReduced(mq.matches);
    apply();
    mq.addEventListener('change', apply);
    return () => mq.removeEventListener('change', apply);
  }, []);
  return reduced;
}

/* ------------------------------- reveal -------------------------------- */

/** Fades content up as it enters view. Fires once; no scroll listener. */
export function Reveal({
  children,
  delay = 0,
  className = '',
  as: Tag = 'div',
}: {
  children: ReactNode;
  delay?: number;
  className?: string;
  as?: 'div' | 'section' | 'article' | 'li' | 'header';
}) {
  const ref = useRef<HTMLElement>(null);
  const [shown, setShown] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (typeof IntersectionObserver === 'undefined') {
      setShown(true);
      return;
    }
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setShown(true);
          io.disconnect();
        }
      },
      { threshold: 0.12, rootMargin: '0px 0px -8% 0px' },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  // createElement keeps the polymorphic tag from fighting the ref's type,
  // which JSX cannot express without widening every caller.
  return createElement(
    Tag,
    {
      ref,
      className: `reveal ${className}`,
      'data-shown': shown,
      style: { transitionDelay: `${delay}ms` },
    },
    children,
  );
}

/* ------------------------------ tilt card ------------------------------ */

/**
 * Real perspective tilt driven by pointer position. Skipped entirely for
 * coarse pointers and reduced-motion users.
 */
export function TiltCard({
  children,
  className = '',
  max = 8,
}: {
  children: ReactNode;
  className?: string;
  max?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(false);
  const reduced = useReducedMotion();
  const frame = useRef(0);

  const onMove = useCallback(
    (e: React.PointerEvent<HTMLDivElement>) => {
      if (reduced || e.pointerType !== 'mouse') return;
      const el = ref.current;
      if (!el) return;

      const { clientX, clientY } = e;
      cancelAnimationFrame(frame.current);
      frame.current = requestAnimationFrame(() => {
        const r = el.getBoundingClientRect();
        const px = (clientX - r.left) / r.width - 0.5;
        const py = (clientY - r.top) / r.height - 0.5;
        el.style.setProperty('--ry', `${px * max * 2}deg`);
        el.style.setProperty('--rx', `${-py * max * 2}deg`);
      });
    },
    [max, reduced],
  );

  const reset = useCallback(() => {
    cancelAnimationFrame(frame.current);
    setActive(false);
    const el = ref.current;
    if (!el) return;
    el.style.setProperty('--rx', '0deg');
    el.style.setProperty('--ry', '0deg');
  }, []);

  useEffect(() => () => cancelAnimationFrame(frame.current), []);

  return (
    <div
      ref={ref}
      className={`tilt-root ${className}`}
      data-active={active}
      onPointerMove={onMove}
      onPointerEnter={(e) => e.pointerType === 'mouse' && !reduced && setActive(true)}
      onPointerLeave={reset}
    >
      <div className="tilt-body">{children}</div>
    </div>
  );
}

export function Lift({ z, children }: { z: number; children: ReactNode }) {
  return (
    <div className="tilt-lift" style={{ '--z': `${z}px` } as CSSProperties}>
      {children}
    </div>
  );
}

/* -------------------------------- topbar -------------------------------- */

const SECTION_IDS = nav.map((n) => n.href.slice(1));

export function Topbar() {
  const [stuck, setStuck] = useState(false);
  const [current, setCurrent] = useState<string>('');
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setStuck(window.scrollY > 24);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    const sections = SECTION_IDS.map((id) => document.getElementById(id)).filter(
      (el): el is HTMLElement => !!el,
    );
    if (!sections.length || typeof IntersectionObserver === 'undefined') return;

    const io = new IntersectionObserver(
      (entries) => {
        const hit = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (hit) setCurrent(hit.target.id);
      },
      { rootMargin: '-45% 0px -45% 0px', threshold: [0, 0.25, 0.5, 1] },
    );

    sections.forEach((s) => io.observe(s));
    return () => io.disconnect();
  }, []);

  return (
    <header className="topbar" data-stuck={stuck}>
      <a href="#top" className="brand">
        <span className="brand-mark" aria-hidden="true" />
        <span>
          <span className="brand-name">Tanvir Ahmed</span>
          <span className="brand-role mono">AI / ML Engineer</span>
        </span>
      </a>

      <nav className="topnav" aria-label="Sections">
        {nav.map((item) => (
          <a
            key={item.href}
            href={item.href}
            className="navlink"
            aria-current={current === item.href.slice(1) ? 'true' : undefined}
          >
            {item.label}
          </a>
        ))}
      </nav>

      <div className="topbar-end">
        <a href="#contact" className="glass-btn glass-btn--hot topbar-cta">
          Get in touch
        </a>
        <button
          type="button"
          className="glass-btn menu-toggle"
          aria-expanded={open}
          aria-controls="mobile-nav"
          onClick={() => setOpen((v) => !v)}
        >
          {open ? 'Close' : 'Menu'}
        </button>
      </div>

      {open && (
        <nav id="mobile-nav" className="mobile-nav panel" aria-label="Sections">
          {nav.map((item) => (
            <a key={item.href} href={item.href} onClick={() => setOpen(false)}>
              {item.label}
            </a>
          ))}
          <a href="#contact" onClick={() => setOpen(false)}>
            Contact
          </a>
        </nav>
      )}
    </header>
  );
}

/* ------------------------------ case sheet ------------------------------ */

const FOCUSABLE =
  'a[href], button:not([disabled]), input, select, textarea, [tabindex]:not([tabindex="-1"])';

/**
 * Side sheet for a case study. Traps focus, closes on Escape or backdrop
 * click, locks background scroll, and returns focus to the trigger.
 */
export function Sheet({ onClose, children }: { onClose: () => void; children: ReactNode }) {
  const panel = useRef<HTMLDivElement>(null);
  const restoreTo = useRef<HTMLElement | null>(null);

  useEffect(() => {
    restoreTo.current = document.activeElement as HTMLElement | null;

    const { overflow, paddingRight } = document.body.style;
    const gap = window.innerWidth - document.documentElement.clientWidth;
    document.body.style.overflow = 'hidden';
    if (gap > 0) document.body.style.paddingRight = `${gap}px`;

    panel.current?.focus();

    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        onClose();
        return;
      }
      if (e.key !== 'Tab') return;

      const nodes = panel.current?.querySelectorAll<HTMLElement>(FOCUSABLE);
      if (!nodes || !nodes.length) return;
      const first = nodes[0];
      const last = nodes[nodes.length - 1];

      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };

    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = overflow;
      document.body.style.paddingRight = paddingRight;
      restoreTo.current?.focus();
    };
  }, [onClose]);

  return (
    <div className="sheet-backdrop" onMouseDown={onClose}>
      <div
        ref={panel}
        className="sheet"
        role="dialog"
        aria-modal="true"
        aria-labelledby="sheet-title"
        tabIndex={-1}
        onMouseDown={(e) => e.stopPropagation()}
      >
        {children}
      </div>
    </div>
  );
}
