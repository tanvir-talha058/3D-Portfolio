import React, { useEffect, useRef, useState } from 'react';
import { SECTION_IDS } from '../data/navSections';
import { useActiveSection } from '../hooks/useActiveSection';

/**
 * Thin reading-progress bar pinned under the navbar. Updates are coalesced
 * into a single rAF per frame so fast scrolling stays cheap. Briefly glows
 * whenever the active section changes, tying it to the same notion of
 * "current section" Navbar's link highlight uses instead of being a fully
 * separate system.
 */
export default function ScrollProgress() {
  const [progress, setProgress] = useState(0);
  const frameRef = useRef(null);
  const activeSection = useActiveSection(SECTION_IDS, { initial: 'hero' });
  const [pulsing, setPulsing] = useState(false);
  const isFirstRender = useRef(true);

  useEffect(() => {
    const update = () => {
      frameRef.current = null;
      const scrollable = document.documentElement.scrollHeight - window.innerHeight;
      setProgress(scrollable > 0 ? Math.min(window.scrollY / scrollable, 1) : 0);
    };

    const handleScroll = () => {
      if (frameRef.current == null) {
        frameRef.current = window.requestAnimationFrame(update);
      }
    };

    update();
    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', handleScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleScroll);
      if (frameRef.current != null) window.cancelAnimationFrame(frameRef.current);
    };
  }, []);

  useEffect(() => {
    // Skip the pulse on mount — only a real section change should glow.
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return undefined;
    }
    setPulsing(true);
    const timer = setTimeout(() => setPulsing(false), 500);
    return () => clearTimeout(timer);
  }, [activeSection]);

  return (
    <div className="scroll-progress-track" aria-hidden="true">
      <div
        className={pulsing ? 'scroll-progress-bar scroll-progress-pulse' : 'scroll-progress-bar'}
        style={{ transform: `scaleX(${progress})` }}
      />
    </div>
  );
}
