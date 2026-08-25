'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import dynamic from 'next/dynamic';
import { attnHeads, attnMatrix, attnTokens } from '../data';

const Attention = dynamic(() => import('./Attention'), { ssr: false, loading: () => null });

/** How long a head holds before the map advances on its own. */
const DWELL = 5200;

export default function AttentionMount() {
  const host = useRef<HTMLDivElement>(null);
  const [ready, setReady] = useState(false);
  const [supported, setSupported] = useState(true);
  const [reduced, setReduced] = useState(false);
  const [active, setActive] = useState(false);

  const [head, setHead] = useState(0);
  const [focus, setFocus] = useState(-1);
  /** Once someone picks a head, stop cycling underneath them. */
  const [held, setHeld] = useState(false);

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
    const io = new IntersectionObserver(([e]) => setActive(e.isIntersecting), {
      rootMargin: '80px',
    });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  // Advance heads only while the figure is on screen and unattended.
  useEffect(() => {
    if (!active || held || reduced) return;
    const id = window.setInterval(() => setHead((h) => (h + 1) % attnHeads.length), DWELL);
    return () => window.clearInterval(id);
  }, [active, held, reduced]);

  const matrix = useMemo(() => attnMatrix(attnHeads[head]), [head]);

  // The readout is the diagram's actual claim, written out: which keys this
  // query token spends its attention on, and how much.
  const readout = useMemo(() => {
    const row = focus >= 0 ? focus : null;
    if (row === null) return null;
    const weights = matrix[row]
      .map((w, j) => ({ token: attnTokens[j], w }))
      .sort((a, b) => b.w - a.w)
      .slice(0, 3);
    return { query: attnTokens[row], weights };
  }, [focus, matrix]);

  const pick = (i: number) => {
    setHead(i);
    setHeld(true);
  };

  return (
    <figure className="attn" ref={host}>
      <div className="attn-canvas">
        {ready && supported ? (
          <Attention
            head={head}
            focus={focus}
            onFocus={setFocus}
            reduced={reduced}
            active={active}
          />
        ) : null}
      </div>

      <figcaption className="attn-legend">
        {/* The sentence being read: the matrix's own query axis, so hovering
            a token is the same gesture as hovering its row. Kept out of the
            canvas, where it could be neither selected nor tabbed to. */}
        <ol className="attn-tokens mono" aria-label="Query tokens">
          {attnTokens.map((t, i) => (
            <li key={`${t}-${i}`}>
              <button
                type="button"
                className="attn-token"
                data-special={t.startsWith('[')}
                data-on={focus === i}
                onMouseEnter={() => setFocus(i)}
                onMouseLeave={() => setFocus(-1)}
                onFocus={() => setFocus(i)}
                onBlur={() => setFocus(-1)}
              >
                {t}
              </button>
            </li>
          ))}
        </ol>

        <div className="attn-heads" role="group" aria-label="Attention heads">
          {attnHeads.map((h, i) => (
            <button
              key={h.id}
              type="button"
              className="attn-head"
              data-on={head === i}
              onClick={() => pick(i)}
            >
              <span className="mono attn-head-i">H{i + 1}</span>
              <span className="attn-head-name">{h.name}</span>
            </button>
          ))}
        </div>

        <p className="attn-note" aria-live="polite">
          {readout ? (
            <>
              <span className="mono attn-note-q">{readout.query}</span> attends to{' '}
              {readout.weights.map((w, i) => (
                <span key={w.token}>
                  {i > 0 && ', '}
                  <span className="mono attn-note-k">{w.token}</span>{' '}
                  <span className="mono attn-note-w">{w.w.toFixed(2)}</span>
                </span>
              ))}
            </>
          ) : (
            attnHeads[head].note
          )}
        </p>
      </figcaption>
    </figure>
  );
}
