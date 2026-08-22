import { cn } from "@/lib/cn";

export function SectionHeading({
  eyebrow,
  title,
  index,
  className,
}: {
  eyebrow: string;
  title: string;
  index?: string;
  className?: string;
}) {
  return (
    <div className={cn("mb-10 md:mb-14", className)}>
      <div className="mb-4 flex items-center gap-3">
        {index && (
          <span className="font-mono text-xs tracking-[0.2em] text-brass">{index}</span>
        )}
        <p className="text-xs font-medium uppercase tracking-[0.3em] text-muted">{eyebrow}</p>
        <span className="h-px flex-1 bg-line" aria-hidden="true" />
      </div>
      <h2 className="font-display text-4xl font-medium tracking-tight text-paper sm:text-5xl md:text-6xl">
        {title}
      </h2>
    </div>
  );
}
