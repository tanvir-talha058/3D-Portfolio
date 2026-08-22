function CornerMark({ className }: { className: string }) {
  return (
    <svg
      viewBox="0 0 16 16"
      fill="none"
      className={`absolute h-4 w-4 text-line ${className}`}
      aria-hidden="true"
    >
      <path d="M0 0H16M0 0V16" stroke="currentColor" strokeWidth="1" />
    </svg>
  );
}

export function TechnicalFrame() {
  return (
    <div aria-hidden="true" className="pointer-events-none fixed inset-0 z-30">
      <CornerMark className="left-3 top-3" />
      <CornerMark className="right-3 top-3 rotate-90" />
      <CornerMark className="bottom-3 right-3 rotate-180" />
      <CornerMark className="bottom-3 left-3 -rotate-90" />

      <div className="fixed left-3 top-1/2 hidden -translate-y-1/2 md:block">
        <span
          style={{ writingMode: "vertical-rl" }}
          className="whitespace-nowrap font-mono text-[10px] uppercase tracking-[0.35em] text-muted/40"
        >
          Tanvir Ahmed · AI/ML Systems · Rev 2026
        </span>
      </div>
    </div>
  );
}
