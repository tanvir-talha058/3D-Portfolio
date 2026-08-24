'use client';

import { useEffect, useRef, useState } from 'react';
import dynamic from 'next/dynamic';

const Field = dynamic(() => import('./Field'), { ssr: false, loading: () => null });

type Quality = 'high' | 'low';

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
 * Static stand-in for machines without WebGL, and the first paint before the
 * scene chunk arrives. Same ramp, same composition, no GPU.
 */
function Fallback() {
  return (
    <div className="field" aria-hidden="true">
      <div className="fallback-core" />
      <div className="fallback-ring fallback-ring--a" />
      <div className="fallback-ring fallback-ring--b" />
    </div>
  );
}

export default function FieldMount() {
  const host = useRef<HTMLDivElement>(null);
  const [ready, setReady] = useState(false);
  const [supported, setSupported] = useState(true);
  const [reduced, setReduced] = useState(false);
  const [quality, setQuality] = useState<Quality>('high');
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    setSupported(detectWebGL());

    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    const apply = () => setReduced(mq.matches);
    apply();
    mq.addEventListener('change', apply);

    // Coarse pointer, few cores, or small viewport: drop the expensive
    // transmission pass rather than shipping a stuttering hero.
    const cores = navigator.hardwareConcurrency ?? 8;
    const small = window.matchMedia('(max-width: 900px)').matches;
    setQuality(cores <= 4 || small ? 'low' : 'high');

    setReady(true);
    return () => mq.removeEventListener('change', apply);
  }, []);

  // Stop rendering entirely once the hero is off screen.
  useEffect(() => {
    const el = host.current;
    if (!el || typeof IntersectionObserver === 'undefined') return;
    const io = new IntersectionObserver(([entry]) => setVisible(entry.isIntersecting), {
      rootMargin: '120px',
    });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <div ref={host} className="field-host" aria-hidden="true">
      {ready && supported ? (
        <Field reduced={reduced} quality={quality} active={visible} />
      ) : (
        <Fallback />
      )}
    </div>
  );
}
