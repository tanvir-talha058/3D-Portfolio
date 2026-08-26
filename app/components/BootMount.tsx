'use client';

import { useCallback, useEffect, useState } from 'react';
import dynamic from 'next/dynamic';

const Boot = dynamic(() => import('./Boot'), { ssr: false, loading: () => null });

const SEEN = 'boot-seen';

/**
 * Gate for the laptop intro. It plays on a first visit in a session, on a
 * capable machine, when motion is welcome — and is bypassed entirely
 * otherwise. The page underneath is always rendered; the intro is an
 * overlay, so nothing about the site depends on it running.
 */
export default function BootMount() {
  const [play, setPlay] = useState(false);
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    let ok = true;
    try {
      if (sessionStorage.getItem(SEEN)) ok = false;
    } catch {
      /* private mode: just play it */
    }

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) ok = false;

    try {
      const c = document.createElement('canvas');
      if (!(c.getContext('webgl2') || c.getContext('webgl'))) ok = false;
    } catch {
      ok = false;
    }

    if (ok) document.documentElement.classList.add('booting');
    setPlay(ok);
    setChecked(true);
  }, []);

  const done = useCallback(() => {
    try {
      sessionStorage.setItem(SEEN, '1');
    } catch {
      /* ignore */
    }
    document.documentElement.classList.remove('booting');
    // Held until the white-out has fully faded, so the reveal is one motion.
    window.setTimeout(() => setPlay(false), 900);
  }, []);

  if (!checked || !play) return null;
  return <Boot onDone={done} />;
}
