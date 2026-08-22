import { SectionHeading } from "../ui/SectionHeading";
import { GlassPanel } from "../ui/GlassPanel";
import { education, publications, awards } from "@/data/research";

export function ResearchSection() {
  return (
    <section
      id="research"
      aria-label="Research"
      className="relative mx-auto max-w-5xl px-6 py-28 md:py-36"
    >
      <SectionHeading eyebrow="Academic Record" title="Research" />

      <GlassPanel className="p-6 md:p-8">
        <div className="flex flex-col justify-between gap-2 sm:flex-row sm:items-baseline">
          <div>
            <h3 className="font-display text-2xl text-paper sm:text-3xl">{education.degree}</h3>
            <p className="mt-1 text-sm text-brass">{education.institution}</p>
          </div>
          <p className="whitespace-nowrap font-mono text-xs uppercase tracking-[0.15em] text-muted">
            {education.period}
          </p>
        </div>
        <div className="mt-5 flex flex-wrap gap-1.5">
          {education.coursework.map((course) => (
            <span
              key={course}
              className="rounded-sm border border-line px-2.5 py-1 font-mono text-[10px] uppercase tracking-wide text-muted"
            >
              {course}
            </span>
          ))}
        </div>
      </GlassPanel>

      <div className="mt-8 flex flex-col gap-5">
        {publications.map((pub) => (
          <GlassPanel key={pub.id} className="p-6 md:p-8">
            <div className="flex flex-col justify-between gap-2 sm:flex-row sm:items-baseline">
              <h3 className="font-display text-xl text-paper sm:text-2xl">{pub.title}</h3>
              <p className="whitespace-nowrap font-mono text-xs uppercase tracking-[0.15em] text-muted">
                {pub.period}
              </p>
            </div>
            <p className="mt-3 text-sm text-paper/70 sm:text-base">{pub.description}</p>
            <div className="mt-4 flex flex-wrap gap-1.5">
              {pub.tags.map((tag) => (
                <span
                  key={tag}
                  className="rounded-sm border border-line px-2.5 py-1 font-mono text-[10px] uppercase tracking-wide text-brass"
                >
                  {tag}
                </span>
              ))}
            </div>
          </GlassPanel>
        ))}
      </div>

      <div className="mt-8 flex flex-col gap-2">
        {awards.map((award) => (
          <p key={award} className="flex gap-3 text-sm text-paper/70">
            <span className="mt-[9px] h-px w-3 shrink-0 bg-brass" aria-hidden="true" />
            {award}
          </p>
        ))}
      </div>
    </section>
  );
}
