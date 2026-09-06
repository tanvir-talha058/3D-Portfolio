import React from 'react';
import { useInView } from '../hooks/useInView';
import { usePrefersReducedMotion } from '../hooks/usePrefersReducedMotion';

// Starting transform for each entrance direction. The element animates from
// this offset back to its natural position once it enters the viewport.
const VARIANTS = {
  up: 'translate3d(0, 30px, 0)',
  down: 'translate3d(0, -24px, 0)',
  left: 'translate3d(-34px, 0, 0)',
  right: 'translate3d(34px, 0, 0)',
  scale: 'scale(0.94)',
  'scale-up': 'translate3d(0, 22px, 0) scale(0.96)',
  fade: 'none'
};

/**
 * Scroll-triggered entrance wrapper.
 *
 * <Reveal variant="up" delay={120}>…</Reveal>
 *
 * Honours prefers-reduced-motion by rendering the content in its final state
 * with no transition at all.
 */
export default function Reveal({
  children,
  variant = 'up',
  delay = 0,
  duration = 650,
  blur = false,
  once = true,
  threshold = 0.15,
  as: Tag = 'div',
  className = '',
  style = {},
  ...rest
}) {
  const prefersReducedMotion = usePrefersReducedMotion();
  const [ref, inView] = useInView({ once, threshold });

  if (prefersReducedMotion) {
    return (
      <Tag className={className} style={style} {...rest}>
        {children}
      </Tag>
    );
  }

  const from = VARIANTS[variant] || VARIANTS.up;
  const shown = inView;

  return (
    <Tag
      ref={ref}
      className={className}
      style={{
        ...style,
        opacity: shown ? 1 : 0,
        transform: shown ? 'none' : from,
        filter: blur && !shown ? 'blur(6px)' : 'blur(0px)',
        willChange: shown ? 'auto' : 'opacity, transform',
        transition: `opacity ${duration}ms cubic-bezier(0.16, 1, 0.3, 1) ${delay}ms, transform ${duration}ms cubic-bezier(0.16, 1, 0.3, 1) ${delay}ms, filter ${duration}ms ease ${delay}ms`
      }}
      {...rest}
    >
      {children}
    </Tag>
  );
}
