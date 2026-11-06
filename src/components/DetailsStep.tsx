"use client";
// "Details" (OLDCARTS: onset, duration, severity, aggravating/relieving, timing), as four short screens.
import { PELVIC_REGIONS } from "@/content/regions";
import { BETTER, EPISODE, ONSET, ONSET_STYLE, OTHER, PATTERN, TIMING, WHY, WORSE } from "@/content/steps";
import type { Entry, Pregnancy } from "@/lib/types";
import { Chip, ChipGroup, Why } from "./ui";

type Props = { entry: Entry; update: (p: Partial<Entry>) => void };

const anchorFor = (n: number) =>
  n === 0 ? "None" : n <= 3 ? "Mild: I notice it" : n <= 6 ? "Moderate: hard to ignore" : n <= 9 ? "Severe: hard to do anything" : "Worst I can imagine";

export function WhenStep({ entry, update }: Props) {
  return (
    <div>
      <ChipGroup label="When did it start?" options={ONSET} value={entry.onset} onChange={(v) => update({ onset: v as string })} />
      <ChipGroup label="How did it start?" options={ONSET_STYLE} value={entry.onsetStyle} onChange={(v) => update({ onsetStyle: v as string })} />
      <div className="mt-4 border-t-2 border-dashed border-cream-dark pt-1">
        <Why text={WHY.pattern} />
        <ChipGroup label="Constant, or comes and goes?" options={PATTERN} value={entry.pattern} onChange={(v) => update({ pattern: v as string })} />
        <ChipGroup label="When it's there, how long does it last?" options={EPISODE} value={entry.episodeLength} onChange={(v) => update({ episodeLength: v as string })} />
      </div>
    </div>
  );
}

export function SeverityStep({ entry, update }: Props) {
  const n = entry.severity;
  return (
    <div className="flex flex-col items-center">
      <div className="piece stitch my-2 grid h-36 w-36 place-items-center rounded-full">
        <span className="font-serif text-6xl font-semibold text-plum">{n ?? "–"}</span>
      </div>
      <p className="min-h-7 text-center font-semibold text-plum" aria-live="polite">
        {n !== null ? anchorFor(n) : "Tap a number"}
      </p>
      <div className="mt-4 grid w-full grid-cols-6 gap-2" role="radiogroup" aria-label="Severity from 0 to 10">
        {Array.from({ length: 11 }, (_, i) => (
          <button
            key={i}
            type="button"
            role="radio"
            aria-checked={n === i}
            aria-label={`${i}: ${anchorFor(i)}`}
            onClick={() => update({ severity: n === i ? null : i })}
            className="chip !min-h-12 !px-0 !text-center text-lg font-semibold"
          >
            {i}
          </button>
        ))}
      </div>
      <div className="mt-2 flex w-full justify-between text-xs text-quiet" aria-hidden="true">
        <span>0 None</span>
        <span>5 Moderate</span>
        <span>10 Worst</span>
      </div>
    </div>
  );
}

export function PatternsStep({ entry, update }: Props) {
  return (
    <div>
      <ChipGroup multi label="What makes it better?" options={BETTER} value={entry.better} onChange={(v) => update({ better: v as string[] })} />
      <ChipGroup multi label="What makes it worse?" options={WORSE} value={entry.worse} onChange={(v) => update({ worse: v as string[] })} />
      <div className="mt-4 border-t-2 border-dashed border-cream-dark pt-1">
        <Why text={WHY.timing} />
        <ChipGroup multi label="Does it follow a pattern?" options={TIMING} value={entry.timing} onChange={(v) => update({ timing: v as string[] })} />
      </div>
    </div>
  );
}

const PREGNANCY: { v: Pregnancy; label: string }[] = [
  { v: "no", label: "No" },
  { v: "yes", label: "Yes" },
  { v: "unsure", label: "Not sure" },
  { v: "skip", label: "Prefer not to say" },
];

export function OtherStep({ entry, update }: Props) {
  const pelvic = entry.regions.some((r) => PELVIC_REGIONS.includes(r));
  return (
    <div>
      <ChipGroup multi options={OTHER} value={entry.otherSymptoms} onChange={(v) => update({ otherSymptoms: v as string[] })} />
      {pelvic ? (
        <div className="mt-5 border-t-2 border-dashed border-cream-dark pt-3">
          <p className="font-semibold">Could you be pregnant?</p>
          <p className="mt-1 text-sm text-quiet">
            <span className="font-semibold">Why a clinician asks: </span>
            it changes which next steps are safe for pain low in the belly. You can skip this.
          </p>
          <div className="mt-2 flex flex-wrap gap-2">
            {PREGNANCY.map((p) => (
              <Chip key={p.v} selected={entry.pregnancy === p.v} onClick={() => update({ pregnancy: entry.pregnancy === p.v ? null : p.v })}>
                {p.label}
              </Chip>
            ))}
          </div>
        </div>
      ) : null}
    </div>
  );
}
