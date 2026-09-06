import React, { useEffect, useState } from 'react';
import { useInView } from '../hooks/useInView';
import { usePrefersReducedMotion } from '../hooks/usePrefersReducedMotion';

const GLYPHS = '!<>-_/[]{}=+*^?#%$&@01';

/**
 * Decodes its text one character at a time when it scrolls into view, filling
 * the not-yet-resolved tail with random glyphs. Because the glyph count always
 * matches the final string there is no layout shift while it runs.
 *
 * The animated text is aria-hidden with the real string exposed alongside it,
 * so assistive tech never reads the intermediate noise.
 */
export default function ScrambleText({ text, speed = 32, className = '', style = {} }) {
  const prefersReducedMotion = usePrefersReducedMotion();
  const [ref, inView] = useInView({ threshold: 0.4 });
  const [display, setDisplay] = useState(text);

  useEffect(() => {
    if (!inView || prefersReducedMotion) return undefined;

    const chars = [...text];
    let tick = 0;

    const id = setInterval(() => {
      tick += 1;
      // Two ticks per character keeps the noise readable rather than strobing.
      const resolved = Math.floor(tick / 2);

      setDisplay(
        chars
          .map((ch, i) => {
            if (i < resolved || ch === ' ') return ch;
            return GLYPHS[Math.floor(Math.random() * GLYPHS.length)];
          })
          .join('')
      );

      if (resolved >= chars.length) clearInterval(id);
    }, speed);

    return () => clearInterval(id);
  }, [inView, text, speed, prefersReducedMotion]);

  const resolved = prefersReducedMotion ? text : display;

  return (
    <span ref={ref} className={className} style={style}>
      <span className="sr-only">{text}</span>
      <span aria-hidden="true">{resolved}</span>
    </span>
  );
}
