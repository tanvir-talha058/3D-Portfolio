import { SectionHeading } from "../ui/SectionHeading";
import { ProjectCard } from "./ProjectCard";
import { projects } from "@/data/projects";

export function ProjectsSection() {
  return (
    <section
      id="projects"
      aria-label="Projects"
      className="relative mx-auto max-w-6xl px-6 py-28 md:py-36"
    >
      <SectionHeading eyebrow="Project Galaxy" title="Projects" />
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {projects.map((project) => (
          <ProjectCard key={project.id} project={project} />
        ))}
      </div>
    </section>
  );
}
