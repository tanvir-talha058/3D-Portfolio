import { GlassPanel } from "../ui/GlassPanel";
import type { ExperienceEntry } from "@/types/content";

export function ExperienceCard({ entry }: { entry: ExperienceEntry }) {
  return (
    <GlassPanel className="p-6 md:p-8">
      <div className="flex flex-col justify-between gap-2 border-b border-line pb-4 sm:flex-row sm:items-baseline">
        <div>
          <h3 className="font-display text-2xl text-paper sm:text-3xl">{entry.role}</h3>
          <p className="mt-1 text-sm text-brass">{entry.org}</p>
        </div>
        <p className="whitespace-nowrap font-mono text-xs uppercase tracking-[0.15em] text-muted">
          {entry.period}
        </p>
      </div>

      <ul className="mt-5 flex flex-col gap-3 text-sm text-paper/70 sm:text-base">
        {entry.bullets.map((bullet) => (
          <li key={bullet} className="flex gap-3">
            <span className="mt-[9px] h-px w-3 shrink-0 bg-brass" aria-hidden="true" />
            {bullet}
          </li>
        ))}
      </ul>

      <div className="mt-6 flex flex-wrap items-center gap-x-2 gap-y-2" aria-label="Systems pipeline">
        {entry.pipeline.map((step, i) => (
          <span key={step} className="flex items-center gap-2">
            <span className="rounded-sm border border-line px-3 py-1 font-mono text-[11px] uppercase tracking-wide text-muted">
              {step}
            </span>
            {i < entry.pipeline.length - 1 && (
              <span className="text-line" aria-hidden="true">
                →
              </span>
            )}
          </span>
        ))}
      </div>
    </GlassPanel>
  );
}
