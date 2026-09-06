import { useEffect, useState } from 'react';
import { useInView } from './useInView';
import { usePrefersReducedMotion } from './usePrefersReducedMotion';

/**
 * Eases a number from 0 to `targetNumber` the first time the returned ref's
 * element scrolls into view. Reduced-motion users get the final figure at once.
 */
export function useCountUp(targetNumber, duration = 1600, suffix = '', prefix = '') {
  const prefersReducedMotion = usePrefersReducedMotion();
  const [elementRef, inView] = useInView({ threshold: 0.2 });
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!inView || prefersReducedMotion) return undefined;

    let frame = null;
    let startTime = null;

    const step = (timestamp) => {
      if (startTime === null) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      // Ease out cubic
      const easeOut = 1 - Math.pow(1 - progress, 3);
      setCount(Math.floor(easeOut * targetNumber));

      if (progress < 1) {
        frame = window.requestAnimationFrame(step);
      } else {
        setCount(targetNumber);
      }
    };

    frame = window.requestAnimationFrame(step);
    return () => {
      if (frame != null) window.cancelAnimationFrame(frame);
    };
  }, [inView, targetNumber, duration, prefersReducedMotion]);

  const value = prefersReducedMotion ? targetNumber : count;

  return { count: value, elementRef, display: `${prefix}${value.toLocaleString()}${suffix}` };
}
