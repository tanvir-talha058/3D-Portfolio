import { SectionHeading } from "../ui/SectionHeading";
import { GlassPanel } from "../ui/GlassPanel";
import { skillGroups } from "@/data/skills";

export function SkillsSection() {
  return (
    <section
      id="skills"
      aria-label="Skills"
      className="relative mx-auto max-w-6xl px-6 py-28 md:py-36"
    >
      <SectionHeading eyebrow="Technical Index" title="Capabilities" />
      <div className="grid gap-5 sm:grid-cols-2">
        {skillGroups.map((group) => (
          <GlassPanel key={group.id} className="p-6">
            <h3 className="font-mono text-xs uppercase tracking-[0.25em] text-brass">
              {group.title}
            </h3>
            <div className="mt-4 flex flex-wrap gap-2">
              {group.items.map((item) => (
                <span
                  key={item}
                  className="rounded-sm border border-line px-3 py-1 text-xs text-paper/75"
                >
                  {item}
                </span>
              ))}
            </div>
          </GlassPanel>
        ))}
      </div>
    </section>
  );
}
