import React from 'react';
import { useInView } from '../hooks/useInView';
import { usePrefersReducedMotion } from '../hooks/usePrefersReducedMotion';

const LEVEL_PERCENT = { Mastery: 98, Expert: 92, Advanced: 82, Proficient: 72 };

/**
 * Thin proficiency fill bar under a skill card. Fills from 0 to its target
 * width the first time it scrolls into view, using the same useInView hook
 * that drives the rest of the site's scroll-triggered reveals.
 */
export default function SkillBar({ level, delay = 0 }) {
  const prefersReducedMotion = usePrefersReducedMotion();
  const [ref, inView] = useInView({ threshold: 0.4 });
  const percent = LEVEL_PERCENT[level] ?? 80;
  const filled = prefersReducedMotion || inView;

  return (
    <div
      ref={ref}
      style={{
        marginTop: '0.85rem',
        height: '4px',
        borderRadius: 'var(--radius-full)',
        background: 'var(--bg-surface-elevated)',
        overflow: 'hidden'
      }}
    >
      <div
        style={{
          height: '100%',
          borderRadius: 'var(--radius-full)',
          width: filled ? `${percent}%` : '0%',
          background: 'var(--grad-primary-btn)',
          transition: prefersReducedMotion
            ? 'none'
            : `width 0.9s cubic-bezier(0.16, 1, 0.3, 1) ${delay}ms`
        }}
      />
    </div>
  );
}
