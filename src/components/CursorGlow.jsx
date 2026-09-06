import React, { useEffect, useRef } from 'react';
import { usePrefersReducedMotion } from '../hooks/usePrefersReducedMotion';

/**
 * A soft light that trails the pointer, adding depth over the neural canvas.
 * Fine pointers only — it is meaningless on touch — and off under
 * prefers-reduced-motion. Position is written straight to the node inside a
 * single rAF per frame so it never re-renders React.
 */
export default function CursorGlow() {
  const glowRef = useRef(null);
  const prefersReducedMotion = usePrefersReducedMotion();

  useEffect(() => {
    if (prefersReducedMotion) return undefined;
    if (!window.matchMedia('(pointer: fine)').matches) return undefined;

    const node = glowRef.current;
    if (!node) return undefined;

    let frame = null;
    let x = 0;
    let y = 0;

    const paint = () => {
      frame = null;
      node.style.transform = `translate3d(${x}px, ${y}px, 0)`;
    };

    const handleMove = (e) => {
      x = e.clientX;
      y = e.clientY;
      node.style.opacity = '1';
      if (frame == null) frame = window.requestAnimationFrame(paint);
    };

    const handleLeave = () => {
      node.style.opacity = '0';
    };

    window.addEventListener('mousemove', handleMove, { passive: true });
    document.addEventListener('mouseleave', handleLeave);

    return () => {
      window.removeEventListener('mousemove', handleMove);
      document.removeEventListener('mouseleave', handleLeave);
      if (frame != null) window.cancelAnimationFrame(frame);
    };
  }, [prefersReducedMotion]);

  if (prefersReducedMotion) return null;

  return <div ref={glowRef} className="cursor-glow" aria-hidden="true" />;
}
