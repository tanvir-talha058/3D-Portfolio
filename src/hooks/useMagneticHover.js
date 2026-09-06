import { useEffect, useRef } from 'react';
import { usePrefersReducedMotion } from './usePrefersReducedMotion';

/**
 * Returns a ref for a button that nudges toward the cursor while hovered
 * (within `radius` px of its center) and eases back to rest on pointer
 * leave. Writes the transform straight to the node every frame (no
 * re-render), mirroring CursorGlow's pattern — fine pointers only.
 *
 * Because setting an inline `transform` permanently overrides that CSS
 * property for the element (inline styles beat any non-!important
 * selector), this also reproduces the shared .btn class's hover-lift and
 * active-press transforms itself rather than losing them.
 */
export function useMagneticHover({ strength = 0.35, radius = 60, lift = 2 } = {}) {
  const ref = useRef(null);
  const prefersReducedMotion = usePrefersReducedMotion();

  useEffect(() => {
    if (prefersReducedMotion) return undefined;
    if (!window.matchMedia('(pointer: fine)').matches) return undefined;

    const node = ref.current;
    if (!node) return undefined;

    let frame = null;
    let targetX = 0;
    let targetY = 0;
    let hovering = false;
    let pressed = false;

    const paint = () => {
      frame = null;
      const liftY = hovering ? -lift : 0;
      const scale = pressed ? 0.97 : 1;
      node.style.transform = `translate3d(${targetX}px, ${targetY + liftY}px, 0) scale(${scale})`;
    };

    const schedule = () => {
      if (frame == null) frame = window.requestAnimationFrame(paint);
    };

    const handleMove = (e) => {
      const rect = node.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      const dx = e.clientX - cx;
      const dy = e.clientY - cy;
      const dist = Math.sqrt(dx * dx + dy * dy);

      if (dist < radius) {
        targetX = dx * strength;
        targetY = dy * strength;
      } else {
        targetX = 0;
        targetY = 0;
      }
      schedule();
    };

    const handleEnter = () => {
      hovering = true;
      schedule();
    };

    const handleLeave = () => {
      hovering = false;
      pressed = false;
      targetX = 0;
      targetY = 0;
      schedule();
    };

    const handleDown = () => {
      pressed = true;
      schedule();
    };

    const handleUp = () => {
      pressed = false;
      schedule();
    };

    window.addEventListener('mousemove', handleMove, { passive: true });
    node.addEventListener('mouseenter', handleEnter);
    node.addEventListener('mouseleave', handleLeave);
    node.addEventListener('mousedown', handleDown);
    node.addEventListener('mouseup', handleUp);

    return () => {
      window.removeEventListener('mousemove', handleMove);
      node.removeEventListener('mouseenter', handleEnter);
      node.removeEventListener('mouseleave', handleLeave);
      node.removeEventListener('mousedown', handleDown);
      node.removeEventListener('mouseup', handleUp);
      if (frame != null) window.cancelAnimationFrame(frame);
      node.style.transform = '';
    };
  }, [prefersReducedMotion, strength, radius, lift]);

  return ref;
}
