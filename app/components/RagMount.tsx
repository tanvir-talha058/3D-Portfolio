'use client';

import { useEffect, useRef, useState } from 'react';
import dynamic from 'next/dynamic';
import { STAGES } from './Rag';

const Rag = dynamic(() => import('./Rag'), { ssr: false, loading: () => null });

/**
 * Mount for the retrieval pipeline. Same contract as the other scenes:
 * the diagram is the canvas, but its content is the caption below it, so
 * the section still reads with WebGL off.
 */
export default function RagMount() {
  const host = useRef<HTMLDivElement>(null);
  const [ready, setReady] = useState(false);
  const [supported, setSupported] = useState(true);
  const [reduced, setReduced] = useState(false);
  const [active, setActive] = useState(false);
  // WebGL contexts are a scarce, browser-capped resource: create this one
  // the first time the figure is approached, then keep it.
  const [seen, setSeen] = useState(false);

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

  useEffect(() => {
    const el = host.current;
    if (!el || typeof IntersectionObserver === 'undefined') return;
    const io = new IntersectionObserver(([e]) => {
      setActive(e.isIntersecting);
      if (e.isIntersecting) setSeen(true);
    }, {
      rootMargin: '100px',
    });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <figure className="rag" ref={host}>
      <div className="rag-canvas">
        {/* Off screen, the clock freezes rather than the canvas unmounting. */}
        {ready && supported && seen ? <Rag reduced={reduced || !active} /> : null}
      </div>

      <figcaption className="rag-legend">
        {STAGES.map((s, i) => (
          <div key={s.key} className="rag-stage">
            <span className="mono rag-stage-i">{String(i + 1).padStart(2, '0')}</span>
            <span className="rag-stage-name">{s.label}</span>
            <span className="rag-stage-note">{s.note}</span>
          </div>
        ))}
      </figcaption>
    </figure>
  );
}
