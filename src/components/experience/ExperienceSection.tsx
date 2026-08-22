import { SectionHeading } from "../ui/SectionHeading";
import { ExperienceCard } from "./ExperienceCard";
import { experience } from "@/data/experience";

export function ExperienceSection() {
  return (
    <section
      id="experience"
      aria-label="Experience"
      className="relative mx-auto max-w-5xl px-6 py-28 md:py-36"
    >
      <SectionHeading eyebrow="Career Timeline" title="Experience" />
      <div className="flex flex-col gap-8">
        {experience.map((entry) => (
          <ExperienceCard key={entry.id} entry={entry} />
        ))}
      </div>
    </section>
  );
}
