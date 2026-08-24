'use client';

import { useEffect, useRef, useState } from 'react';
import dynamic from 'next/dynamic';
import { netLayers } from '../data';

const Net = dynamic(() => import('./Net'), { ssr: false, loading: () => null });

export default function NetMount() {
  const host = useRef<HTMLDivElement>(null);
  const [ready, setReady] = useState(false);
  const [supported, setSupported] = useState(true);
  const [reduced, setReduced] = useState(false);
  const [active, setActive] = useState(false);

  useEffect(() => {
    try {
      const c = document.createElement('canvas');
      setSupported(!!(c.getContext('webgl2') || c.getContext('webgl')));
    } catch {
      setSupported(false);
    }

    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    const apply = () => setReduced(mq.matches);
    apply();
    mq.addEventListener('change', apply);
    setReady(true);
    return () => mq.removeEventListener('change', apply);
  }, []);

  // Only run the propagation loop while the diagram is actually on screen.
  useEffect(() => {
    const el = host.current;
    if (!el || typeof IntersectionObserver === 'undefined') return;
    const io = new IntersectionObserver(([e]) => setActive(e.isIntersecting), {
      rootMargin: '80px',
    });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <figure className="net" ref={host}>
      <div className="net-canvas">
        {ready && supported ? <Net reduced={reduced} active={active} /> : null}
      </div>

      {/* The legend is the diagram's real content, so it is text, not
          rendered into the canvas where it could not be read or selected. */}
      <figcaption className="net-legend">
        {netLayers.map((l, i) => (
          <div key={l.label} className="net-layer">
            <span className="mono net-layer-i">{String(i + 1).padStart(2, '0')}</span>
            <span className="net-layer-name">{l.label}</span>
            <span className="net-layer-note">{l.note}</span>
          </div>
        ))}
      </figcaption>
    </figure>
  );
}
