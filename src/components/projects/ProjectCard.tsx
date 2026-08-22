"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import { GlassPanel } from "../ui/GlassPanel";
import { cn } from "@/lib/cn";
import type { ProjectEntry } from "@/types/content";

export function ProjectCard({ project }: { project: ProjectEntry }) {
  const [open, setOpen] = useState(false);

  return (
    <GlassPanel className="flex flex-col p-5">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        className="flex items-start justify-between gap-3 text-left"
      >
        <div>
          <h3 className="font-display text-xl text-paper">{project.name}</h3>
          <p className="mt-1 font-mono text-[11px] uppercase tracking-[0.15em] text-muted">
            {project.period}
          </p>
        </div>
        <Plus
          className={cn("mt-1 h-4 w-4 shrink-0 text-brass transition-transform", open && "rotate-45")}
          aria-hidden="true"
        />
      </button>

      <div className="mt-3 flex flex-wrap gap-1.5">
        {project.stack.map((tech) => (
          <span
            key={tech}
            className="rounded-sm border border-line px-2.5 py-1 font-mono text-[10px] uppercase tracking-wide text-muted"
          >
            {tech}
          </span>
        ))}
      </div>

      {open && (
        <ul className="mt-4 flex flex-col gap-2 border-t border-line pt-4 text-sm text-paper/70">
          {project.highlights.map((point) => (
            <li key={point} className="flex gap-3">
              <span className="mt-[9px] h-px w-3 shrink-0 bg-brass" aria-hidden="true" />
              {point}
            </li>
          ))}
        </ul>
      )}
    </GlassPanel>
  );
}
