import type { RefObject } from "react";

interface Segment {
  text: string;
  color?: string;
}

const KEYWORD = "#569cd6";
const FUNC = "#dcdcaa";
const CLASS_NAME = "#4ec9b0";
const PARAM = "#9cdcfe";
const NUMBER = "#b5cea8";
const DEFAULT = "#d4d4d4";

const CODE_LINES: Segment[][] = [
  [
    { text: "import ", color: KEYWORD },
    { text: "numpy ", color: DEFAULT },
    { text: "as ", color: KEYWORD },
    { text: "np", color: DEFAULT },
  ],
  [],
  [
    { text: "class ", color: KEYWORD },
    { text: "RiskScorer", color: CLASS_NAME },
    { text: ":", color: DEFAULT },
  ],
  [
    { text: "    def ", color: KEYWORD },
    { text: "__init__", color: FUNC },
    { text: "(self, ", color: DEFAULT },
    { text: "weights", color: PARAM },
    { text: "):", color: DEFAULT },
  ],
  [
    { text: "        self.weights = ", color: DEFAULT },
    { text: "weights", color: PARAM },
  ],
  [],
  [
    { text: "    def ", color: KEYWORD },
    { text: "score", color: FUNC },
    { text: "(self, ", color: DEFAULT },
    { text: "signals", color: PARAM },
    { text: ") -> float:", color: DEFAULT },
  ],
  [
    { text: "        risk = np.dot(self.weights, ", color: DEFAULT },
    { text: "signals", color: PARAM },
    { text: ")", color: DEFAULT },
  ],
  [
    { text: "        return ", color: KEYWORD },
    { text: "round", color: FUNC },
    { text: "(risk * ", color: DEFAULT },
    { text: "100", color: NUMBER },
    { text: ", ", color: DEFAULT },
    { text: "2", color: NUMBER },
    { text: ")", color: DEFAULT },
  ],
];

export function CodeEditorMockup({
  lineRefs,
}: {
  lineRefs: RefObject<(HTMLDivElement | null)[]>;
}) {
  return (
    <div className="flex h-full w-full flex-col overflow-hidden bg-[#1e1e1e] text-[13px]">
      <div className="flex h-7 shrink-0 items-center gap-1.5 bg-[#3c3c3c] px-3">
        <span className="h-2.5 w-2.5 rounded-full bg-[#ff5f56]" />
        <span className="h-2.5 w-2.5 rounded-full bg-[#ffbd2e]" />
        <span className="h-2.5 w-2.5 rounded-full bg-[#27c93f]" />
        <span className="ml-3 truncate font-mono text-[11px] text-[#cccccc]/70">
          risk_scorer.py — tanvir-ahmed
        </span>
      </div>

      <div className="flex min-h-0 flex-1">
        <div className="hidden w-12 shrink-0 flex-col items-center gap-4 bg-[#252526] py-3 sm:flex">
          <div className="h-4 w-4 rounded-sm bg-[#569cd6]/40" />
          <div className="h-4 w-4 rounded-sm bg-[#4ec9b0]/30" />
          <div className="h-4 w-4 rounded-sm bg-[#dcdcaa]/30" />
        </div>

        <div className="flex min-w-0 flex-1 flex-col">
          <div className="flex h-8 shrink-0 items-center bg-[#252526]">
            <div className="flex h-full items-center gap-2 bg-[#1e1e1e] px-4 font-mono text-[11px] text-[#d4d4d4]">
              risk_scorer.py
            </div>
          </div>

          <div className="flex min-h-0 flex-1 overflow-hidden px-2 py-3 font-mono leading-6">
            <div className="select-none pr-4 text-right text-[#858585]">
              {CODE_LINES.map((_, i) => (
                <div key={i}>{i + 1}</div>
              ))}
            </div>
            <div className="min-w-0 flex-1">
              {CODE_LINES.map((segments, i) => (
                <div
                  key={i}
                  ref={(el) => {
                    lineRefs.current[i] = el;
                  }}
                  className="whitespace-pre opacity-0"
                >
                  {segments.length === 0
                    ? " "
                    : segments.map((seg, j) => (
                        <span key={j} style={{ color: seg.color }}>
                          {seg.text}
                        </span>
                      ))}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="h-5 shrink-0 bg-[#007acc]" />
    </div>
  );
}
