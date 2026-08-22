"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { usePortfolioStore } from "@/lib/store";
import { CodeEditorMockup } from "./CodeEditorMockup";

const BOOT_SEEN_KEY = "pf:bootSeen";
// The scene wrapper is tilted steeply (-78deg) so the closed lid/base read as
// a laptop lying flat, viewed from a steep product-shot angle overhead. The
// lid then hinges the OPPOSITE direction (positive) by ~95deg so the two
// rotations largely cancel out, leaving the open screen facing the viewer
// almost directly (total ≈ -78 + 95 = +17deg) rather than edge-on.
const LID_OPEN_ROTATION = 95;

function getPrefersReducedMotion() {
  if (typeof window === "undefined") return false;
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

function getHasSeenBoot() {
  if (typeof window === "undefined") return false;
  try {
    return sessionStorage.getItem(BOOT_SEEN_KEY) === "1";
  } catch {
    return false;
  }
}

function markBootSeen() {
  try {
    sessionStorage.setItem(BOOT_SEEN_KEY, "1");
  } catch {
    // Safari private mode etc. can throw on write — non-critical, ignore.
  }
}

export function BootLaptop() {
  const setBootComplete = usePortfolioStore((s) => s.setBootComplete);
  const [reducedMotion] = useState(getPrefersReducedMotion);
  const [hasSeenBoot] = useState(getHasSeenBoot);
  const [visible, setVisible] = useState(true);

  const overlayRef = useRef<HTMLDivElement>(null);
  const lidRef = useRef<HTMLDivElement>(null);
  const chromeRef = useRef<HTMLDivElement>(null);
  const lineRefs = useRef<(HTMLDivElement | null)[]>([]);
  const timelineRef = useRef<gsap.core.Timeline | null>(null);

  const skipToEnd = () => {
    timelineRef.current?.play("fadeOut");
  };

  useEffect(() => {
    const lines = lineRefs.current.filter((el): el is HTMLDivElement => el !== null);
    const skipAnimation = reducedMotion || hasSeenBoot;

    if (skipAnimation) {
      markBootSeen();
      if (lidRef.current) gsap.set(lidRef.current, { rotationX: LID_OPEN_ROTATION });
      if (chromeRef.current) gsap.set(chromeRef.current, { opacity: 1 });
      gsap.set(lines, { opacity: 1 });

      const timeout = setTimeout(
        () => {
          setBootComplete(true);
          setVisible(false);
        },
        reducedMotion ? 400 : 250
      );
      return () => clearTimeout(timeout);
    }

    // Mark seen as soon as the full animation is committed to, not at the
    // end of the timeline — otherwise a reload/navigation before the ~3.7s
    // sequence finishes would never persist it, and the next load replays
    // the whole thing again.
    markBootSeen();

    gsap.set(lidRef.current, { rotationX: 0 });
    gsap.set(chromeRef.current, { opacity: 0 });
    gsap.set(lines, { opacity: 0 });

    const timeline = gsap.timeline({
      onComplete: () => {
        setBootComplete(true);
        setVisible(false);
      },
    });
    timelineRef.current = timeline;

    timeline.to(
      lidRef.current,
      { rotationX: LID_OPEN_ROTATION, duration: 1.1, ease: "power3.inOut" },
      0.15
    );

    timeline.to(chromeRef.current, { opacity: 1, duration: 0.3, ease: "power1.out" }, 1.05);

    timeline.to(lines, { opacity: 1, duration: 0.35, ease: "power2.out", stagger: 0.09 }, 1.35);

    timeline.addLabel("fadeOut", "+=0.75");
    timeline.to(overlayRef.current, { opacity: 0, duration: 0.5, ease: "power1.out" }, "fadeOut");

    // requestAnimationFrame (what GSAP's timeline runs on) can be throttled
    // hard by the browser — a backgrounded tab during load, battery saver,
    // a slow device — well beyond this timeline's own ~3.7s design length.
    // A decorative intro must never be able to block the real page behind
    // it indefinitely, so force it closed as a hard ceiling regardless of
    // the timeline's actual progress.
    const hardFallback = setTimeout(() => {
      setBootComplete(true);
      setVisible(false);
    }, 8000);

    return () => {
      clearTimeout(hardFallback);
      timeline.kill();
    };
  }, [reducedMotion, hasSeenBoot, setBootComplete]);

  if (!visible) return null;

  return (
    <div ref={overlayRef} className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-ink">
      <div
        aria-hidden="true"
        className="flex w-full flex-1 items-center justify-center [perspective:1400px]"
      >
        <div className="relative w-[min(88vw,620px)] [transform:rotateX(-78deg)] [transform-style:preserve-3d]">
          <div className="absolute bottom-0 left-0 h-[22px] w-full rounded-md bg-gradient-to-b from-line to-ink shadow-2xl" />
          <div
            ref={lidRef}
            className="absolute bottom-[22px] left-0 aspect-[16/10] w-full origin-bottom overflow-hidden rounded-t-lg border-8 border-ink [backface-visibility:hidden]"
          >
            <div ref={chromeRef} className="h-full w-full">
              <CodeEditorMockup lineRefs={lineRefs} />
            </div>
          </div>
        </div>
      </div>

      <button
        type="button"
        onClick={skipToEnd}
        aria-label="Skip intro animation"
        className="mb-8 font-mono text-xs uppercase tracking-[0.3em] text-muted transition-colors hover:text-brass"
      >
        Skip →
      </button>
    </div>
  );
}
