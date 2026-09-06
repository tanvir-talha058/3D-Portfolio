import { useEffect, useRef } from 'react';
import { usePrefersReducedMotion } from './usePrefersReducedMotion';

/**
 * Returns a ref to attach to an element that should drift vertically as the
 * page scrolls — a lightweight depth effect, distinct from (and meant to be
 * layered underneath) any entrance animation on a wrapping element, since a
 * CSS animation's transform would otherwise fight this hook's inline one on
 * the same node. `speed` is the fraction of scroll distance applied as
 * translateY; `max` clamps the offset so the drift stays subtle.
 */
export function useScrollParallax({ speed = 0.15, max = 40 } = {}) {
  const ref = useRef(null);
  const prefersReducedMotion = usePrefersReducedMotion();

  useEffect(() => {
    if (prefersReducedMotion) return undefined;
    const node = ref.current;
    if (!node) return undefined;

    let frame = null;

    const paint = () => {
      frame = null;
      const offset = Math.max(-max, Math.min(max, window.scrollY * speed));
      node.style.transform = `translate3d(0, ${offset}px, 0)`;
    };

    const handleScroll = () => {
      if (frame == null) frame = window.requestAnimationFrame(paint);
    };

    paint();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', handleScroll);
      if (frame != null) window.cancelAnimationFrame(frame);
    };
  }, [prefersReducedMotion, speed, max]);

  return ref;
}
