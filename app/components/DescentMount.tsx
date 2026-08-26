'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import dynamic from 'next/dynamic';

const DescentScene = dynamic(() => import('./Descent'), { ssr: false, loading: () => null });

export default function DescentMount() {
  const host = useRef<HTMLDivElement>(null);
  const stepEl = useRef<HTMLSpanElement>(null);
  const lossEl = useRef<HTMLSpanElement>(null);

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
      rootMargin: '80px',
    });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  /* The scene reports every frame. Writing that into React state would
     re-render the whole subtree sixty times a second for two numbers, so the
     readout is written straight to its own text nodes instead. */
  const report = useCallback((step: number, value: number) => {
    const s = stepEl.current;
    const l = lossEl.current;
    if (s) {
      const next = String(step).padStart(3, '0');
      if (s.textContent !== next) s.textContent = next;
    }
    if (l) {
      const next = value.toFixed(3);
      if (l.textContent !== next) l.textContent = next;
    }
  }, []);

  return (
    <figure className="descent" ref={host}>
      <div className="descent-canvas">
        {ready && supported && seen ? (
          <DescentScene report={report} reduced={reduced} active={active} />
        ) : null}
      </div>

      <figcaption className="descent-legend">
        <dl className="descent-readout mono">
          <div>
            <dt>step</dt>
            <dd>
              <span ref={stepEl}>000</span>
            </dd>
          </div>
          <div>
            <dt>loss</dt>
            <dd>
              <span ref={lossEl}>0.000</span>
            </dd>
          </div>
          <div>
            <dt>optimiser</dt>
            <dd>SGD + momentum 0.86</dd>
          </div>
        </dl>
        <p className="descent-note">
          Momentum descent on a surface with two basins. Every run starts
          somewhere new, so which minimum it finds is decided before the first
          step — the reason a result has to be reproducible to count.
        </p>
      </figcaption>
    </figure>
  );
}
