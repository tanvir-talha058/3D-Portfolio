import { CtaGroup } from "./CtaGroup";
import { HeroNodes } from "./HeroNodes";

export function Hero() {
  return (
    <section
      id="hero"
      aria-label="Introduction"
      className="relative flex min-h-screen flex-col items-center justify-center px-6 pt-24 text-center"
    >
      <HeroNodes />
      <p className="mb-5 font-mono text-xs uppercase tracking-[0.4em] text-brass">
        Computer Scientist · AI/ML Engineer
      </p>
      <h1 className="font-display text-6xl leading-[0.95] tracking-tight text-paper sm:text-7xl md:text-8xl">
        Tanvir <em className="font-medium italic">Ahmed</em>
      </h1>
      <p className="mt-6 max-w-xl text-base text-paper/65 sm:text-lg">
        Computer Science graduate turning AI and machine learning research into production
        systems — from academic publications to fintech deployed at scale.
      </p>
      <CtaGroup />
    </section>
  );
}
