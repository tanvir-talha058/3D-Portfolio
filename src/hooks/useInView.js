import { useEffect, useRef, useState } from 'react';

/**
 * Observes an element and reports whether it has scrolled into the viewport.
 * Used to drive the scroll-reveal motion across the page sections.
 *
 * `once` (the default) latches to true on first intersection so content never
 * flickers back out while the user scrolls up and down.
 */
export function useInView({ threshold = 0.15, rootMargin = '0px 0px -8% 0px', once = true } = {}) {
  const ref = useRef(null);

  // jsdom and very old browsers have no IntersectionObserver — start out
  // visible there rather than leaving the content stuck at opacity 0.
  const [inView, setInView] = useState(() => typeof IntersectionObserver === 'undefined');

  useEffect(() => {
    const el = ref.current;
    if (!el || typeof IntersectionObserver === 'undefined') return undefined;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          if (once) observer.disconnect();
        } else if (!once) {
          setInView(false);
        }
      },
      { threshold, rootMargin }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [threshold, rootMargin, once]);

  return [ref, inView];
}
