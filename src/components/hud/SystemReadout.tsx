"use client";

import { useEffect, useState } from "react";
import { usePortfolioStore } from "@/lib/store";
import { GlassPanel } from "@/components/ui/GlassPanel";

function randomBetween(min: number, max: number) {
  return Math.round(min + Math.random() * (max - min));
}

export function SystemReadout() {
  const reducedMotion = usePortfolioStore((s) => s.reducedMotion);
  const [latency, setLatency] = useState(24);
  const [throughput, setThroughput] = useState(842);

  useEffect(() => {
    if (reducedMotion) return;
    const interval = setInterval(() => {
      setLatency(randomBetween(11, 38));
      setThroughput(randomBetween(620, 980));
    }, 1400);
    return () => clearInterval(interval);
  }, [reducedMotion]);

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed bottom-4 right-4 z-40 hidden font-mono text-[10px] uppercase tracking-[0.15em] text-muted sm:block"
    >
      <GlassPanel className="px-4 py-3">
        <div className="flex flex-col gap-1">
          <span className="flex items-center gap-1.5 text-brass">
            <span className="h-1.5 w-1.5 rounded-full bg-brass" />
            System Online
          </span>
          <span>
            Latency <span className="text-paper">{latency}ms</span>
          </span>
          <span>
            Throughput <span className="text-paper">{throughput}</span> req/s
          </span>
          <span>
            Nodes <span className="text-paper">6</span> active
          </span>
        </div>
      </GlassPanel>
    </div>
  );
}
