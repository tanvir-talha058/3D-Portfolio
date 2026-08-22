import { Mail, ArrowUpRight } from "lucide-react";
import { Button } from "../ui/Button";
import { GithubIcon, LinkedinIcon } from "../ui/BrandIcons";
import { contact } from "@/data/contact";

const FOCUS_AREAS = [
  "AI Systems",
  "ML Products",
  "RAG Applications",
  "Computer Vision",
  "Intelligent Automation",
  "Research Collaboration",
];

export function ContactSection() {
  return (
    <section
      id="contact"
      aria-label="Contact"
      className="relative mx-auto flex max-w-4xl flex-col items-center px-6 py-32 text-center md:py-44"
    >
      <p className="mb-4 font-mono text-xs uppercase tracking-[0.3em] text-brass">Get in touch</p>
      <h2 className="font-display text-4xl leading-tight text-paper sm:text-5xl">
        Currently building AI systems at Upay —<br className="hidden sm:block" /> open to new
        conversations.
      </h2>

      <div className="mt-6 flex flex-wrap justify-center gap-2">
        {FOCUS_AREAS.map((area) => (
          <span
            key={area}
            className="rounded-sm border border-line px-3 py-1 font-mono text-[11px] uppercase tracking-wide text-muted"
          >
            {area}
          </span>
        ))}
      </div>

      <div className="mt-10">
        <Button href={`mailto:${contact.email}`} variant="primary">
          <Mail size={16} /> {contact.email}
        </Button>
      </div>

      <div className="mt-6 flex items-center gap-5">
        <a
          href={contact.github}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="GitHub"
          className="text-paper/50 transition-colors hover:text-brass"
        >
          <GithubIcon className="h-[22px] w-[22px]" />
        </a>
        <a
          href={contact.linkedin}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="LinkedIn"
          className="text-paper/50 transition-colors hover:text-brass"
        >
          <LinkedinIcon className="h-[22px] w-[22px]" />
        </a>
        <a
          href={contact.resumeHref}
          download
          aria-label="Download CV"
          className="text-paper/50 transition-colors hover:text-brass"
        >
          <ArrowUpRight size={22} />
        </a>
      </div>

      <p className="mt-16 font-mono text-xs uppercase tracking-[0.3em] text-muted">
        Tanvir Ahmed — AI/ML Engineer
      </p>
    </section>
  );
}
