const STREAM_CHARS = "01 1A 3F C2 00 7E 9B 42 D8 5C 01 F0 66 2B 88 0A 1C E4".split(" ");
const LOOP_CHARS = [...STREAM_CHARS, ...STREAM_CHARS];

export function DataStreamFlourish() {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed right-0 top-0 z-30 hidden h-full w-10 overflow-hidden opacity-[0.12] lg:block"
    >
      <div className="animate-[dataStream_18s_linear_infinite] font-mono text-[10px] leading-[1.4] text-brass">
        {LOOP_CHARS.map((chunk, i) => (
          <div key={i} className="text-center">
            {chunk}
          </div>
        ))}
      </div>
    </div>
  );
}
