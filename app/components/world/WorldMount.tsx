'use client';

import { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';

const World = dynamic(() => import('./World'), { ssr: false, loading: () => null });

/** Cheap capability probe. A failed context means we render the fallback. */
function detectWebGL(): boolean {
  try {
    const canvas = document.createElement('canvas');
    return !!(
      window.WebGLRenderingContext &&
      (canvas.getContext('webgl2') || canvas.getContext('webgl'))
    );
  } catch {
    return false;
  }
}

/**
 * Static stand-in for machines without WebGL, and for the first paint before
 * the world chunk arrives. Same ramp, no GPU.
 */
function Fallback() {
  return (
    <div className="world-fallback" aria-hidden="true">
      <div className="fallback-ring fallback-ring--a" />
      <div className="fallback-ring fallback-ring--b" />
    </div>
  );
}

/**
 * Gate for the shared world. Decides whether to run it at all, and at which
 * tier, then hands both to the canvas and never re-decides — a quality
 * change mid-session would tear down the context and rebuild it, which costs
 * more than any setting it could switch to.
 */
export default function WorldMount() {
  const [ready, setReady] = useState(false);
  const [supported, setSupported] = useState(true);
  const [reduced, setReduced] = useState(false);
  const [quality, setQuality] = useState<'high' | 'low'>('high');
  const [frame, setFrame] = useState('field');

  useEffect(() => {
    setSupported(detectWebGL());

    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    const apply = () => setReduced(mq.matches);
    apply();
    mq.addEventListener('change', apply);

    /* Few cores or a small viewport: the world still runs — the whole page is
       built around it — but at a lower tier. */
    const cores = navigator.hardwareConcurrency ?? 8;
    const small = window.matchMedia('(max-width: 900px)').matches;
    setQuality(cores <= 4 || small ? 'low' : 'high');

    setReady(true);
    return () => mq.removeEventListener('change', apply);
  }, []);

  return (
    <div className="world" data-frame={frame} aria-hidden="true">
      {ready && supported ? (
        <World reduced={reduced} quality={quality} onFrame={setFrame} />
      ) : (
        <Fallback />
      )}
    </div>
  );
}
