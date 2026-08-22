const NODES = [
  { label: "RAG Systems", className: "left-[6%] top-[16%]" },
  { label: "Computer Vision", className: "left-[3%] top-[62%]" },
  { label: "NLP", className: "right-[8%] top-[14%]" },
  { label: "Fraud Detection", className: "right-[4%] top-[58%]" },
  { label: "Automation", className: "left-[12%] bottom-[6%]" },
  { label: "Research", className: "right-[20%] bottom-[20%]" },
];

export function HeroNodes() {
  return (
    <div className="pointer-events-none absolute inset-0 hidden md:block" aria-hidden="true">
      {NODES.map((node, i) => (
        <span
          key={node.label}
          style={{ animationDelay: `${i * 0.4}s` }}
          className={`absolute font-mono text-[11px] uppercase tracking-[0.25em] text-muted motion-safe:animate-[float_6s_ease-in-out_infinite] ${node.className}`}
        >
          <span className="text-brass/70">/</span> {node.label}
        </span>
      ))}
    </div>
  );
}
