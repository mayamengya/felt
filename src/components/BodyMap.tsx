"use client";
// Front-view body map made of felt pieces. Her right is on the VIEWER'S LEFT.
// Each region is its own piece with a seam (gap) between; selected = plum patch with stitching.
import { useState } from "react";
import { REGIONS, REGION_NOTE } from "@/content/regions";
import type { RegionId } from "@/lib/types";
import { Card, Chip } from "./ui";

type Piece = { id: RegionId; d: string; fill: string };

const SKIN = "#D9A07F";
const SAND = "#DDBF8C";
const TAN = "#E6CDA6";
const TAN2 = "#DCC09A";
const CLAY = "#D29C7E";

// viewBox 0 0 200 350. x < 100 is HER RIGHT side.
const PIECES: Piece[] = [
  { id: "head", d: "M100 8 C116 8 124 22 124 38 C124 56 113 66 100 66 C87 66 76 56 76 38 C76 22 84 8 100 8 Z", fill: SKIN },
  { id: "chest", d: "M64 72 Q100 64 136 72 Q146 76 145 88 L144 118 L56 118 L55 88 Q54 76 64 72 Z", fill: SAND },
  // upper abdomen: her right (viewer left), center, her left (viewer right)
  { id: "upper-right", d: "M56 121 H85 V159 H56 Z", fill: TAN },
  { id: "upper-center", d: "M87.5 121 H112.5 V159 H87.5 Z", fill: TAN2 },
  { id: "upper-left", d: "M115 121 H144 V159 H115 Z", fill: TAN },
  { id: "lower-right", d: "M56 162 H85 V200 H57 Z", fill: TAN2 },
  { id: "lower-center", d: "M87.5 162 H112.5 V200 H87.5 Z", fill: TAN },
  { id: "lower-left", d: "M115 162 H144 L143 200 H115 Z", fill: TAN2 },
  { id: "pelvis", d: "M58 203 H142 L136 226 Q100 240 64 226 Z", fill: CLAY },
  { id: "arm-right", d: "M38 76 Q50 72 52 84 L50 220 Q44 230 36 224 L26 92 Q26 80 38 76 Z", fill: SAND },
  { id: "arm-left", d: "M162 76 Q150 72 148 84 L150 220 Q156 230 164 224 L174 92 Q174 80 162 76 Z", fill: SAND },
  { id: "leg-right", d: "M64 236 Q80 242 97 238 L95 336 Q86 344 76 338 L64 250 Z", fill: SAND },
  { id: "leg-left", d: "M136 236 Q120 242 103 238 L105 336 Q114 344 124 338 L136 250 Z", fill: SAND },
];

export function BodyMap({ value, onChange }: { value: RegionId[]; onChange: (v: RegionId[]) => void }) {
  const [focus, setFocus] = useState<RegionId | null>(value.at(-1) ?? null);

  const toggle = (id: RegionId) => {
    const on = value.includes(id);
    onChange(on ? value.filter((r) => r !== id) : [...value, id]);
    setFocus(on ? (value.filter((r) => r !== id).at(-1) ?? null) : id);
  };

  return (
    <div>
      <div className="piece stitch flex flex-col items-center px-4 pt-5 pb-3">
        <svg viewBox="0 0 200 350" className="w-full max-w-[290px]" role="group" aria-label="Body map, front view. Your right side is on the left of the picture.">
          {/* hair (bob) behind the head; not tappable */}
          <path d="M74 40 C72 14 88 4 100 4 C112 4 128 14 126 40 L127 64 Q118 70 112 62 L88 62 Q82 70 73 64 Z" fill="#7A5C48" aria-hidden="true" />
          <rect x="91" y="60" width="18" height="12" rx="5" fill={SKIN} aria-hidden="true" />
          {PIECES.map((p) => {
            const on = value.includes(p.id);
            const label = REGIONS[p.id].label;
            return (
              <g
                key={p.id}
                role="button"
                tabIndex={0}
                aria-pressed={on}
                aria-label={label}
                onClick={() => toggle(p.id)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    toggle(p.id);
                  }
                }}
                className="cursor-pointer outline-none [&:focus-visible>path:first-child]:stroke-ink"
                style={{
                  filter: `drop-shadow(0 ${on ? 3 : 2}px 0 ${on ? "#4A1F40" : "rgb(122 92 72 / .35)"})`,
                  transform: on ? "translateY(-1.5px)" : undefined,
                  transition: "transform 250ms ease",
                }}
              >
                <title>{label}</title>
                <path d={p.d} fill={on ? "#6B2D5C" : p.fill} stroke="transparent" strokeWidth="3" strokeLinejoin="round" />
                {/* stitching inset along the edge */}
                <path
                  d={p.d}
                  fill="none"
                  stroke={on ? "#fff" : "#7A5C48"}
                  strokeOpacity={on ? 0.75 : 0.28}
                  strokeWidth="1"
                  strokeDasharray="3 2.5"
                  style={{ transformBox: "fill-box", transform: "scale(0.86)" }}
                  pointerEvents="none"
                />
              </g>
            );
          })}
        </svg>
        <div className="mt-1 flex w-full max-w-[290px] justify-between text-sm font-semibold text-quiet" aria-hidden="true">
          <span>← Your right</span>
          <span>Your left →</span>
        </div>
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        {(["lower-back", "general"] as RegionId[]).map((id) => (
          <Chip key={id} selected={value.includes(id)} onClick={() => toggle(id)}>
            {REGIONS[id].label}
          </Chip>
        ))}
      </div>

      {focus ? (
        <Card className="stitch-in mt-4" key={focus}>
          <p className="text-xs font-semibold tracking-wide text-quiet uppercase">What&apos;s here</p>
          <h2 className="mt-1 font-serif text-xl font-semibold">{REGIONS[focus].label}</h2>
          <p className="mt-2 leading-relaxed">{REGIONS[focus].inside}</p>
          <p className="mt-3 text-sm leading-snug text-quiet">{REGION_NOTE}</p>
        </Card>
      ) : (
        <p className="mt-4 text-quiet">Tap every place you feel it. You can choose more than one.</p>
      )}
    </div>
  );
}
