"use client";
// One "Details" screen: When, How strong, Patterns (OLDCARTS: onset, duration, severity, aggravating/relieving, timing).
import { PELVIC_REGIONS } from "@/content/regions";
import { BETTER, EPISODE, ONSET, ONSET_STYLE, OTHER, PATTERN, TIMING, WHY, WORSE } from "@/content/steps";
import type { Entry, Pregnancy } from "@/lib/types";
import { Card, Chip, ChipGroup, Why } from "./ui";

const ANCHORS: Record<number, string> = { 0: "None", 2: "Mild", 5: "Moderate", 7: "Severe", 10: "Worst I can imagine" };
const anchorFor = (n: number) => (n === 0 ? "None" : n <= 3 ? "Mild: I notice it" : n <= 6 ? "Moderate: hard to ignore" : n <= 9 ? "Severe: hard to do anything" : "Worst I can imagine");

const PREGNANCY: { v: Pregnancy; label: string }[] = [
  { v: "no", label: "No" },
  { v: "yes", label: "Yes" },
  { v: "unsure", label: "Not sure" },
  { v: "skip", label: "Prefer not to say" },
];

export function DetailsStep({ entry, update }: { entry: Entry; update: (p: Partial<Entry>) => void }) {
  const pelvic = entry.regions.some((r) => PELVIC_REGIONS.includes(r));
  return (
    <div className="space-y-5">
      <Card>
        <h2 className="font-serif text-xl font-semibold">When</h2>
        <Why text={WHY.onset} />
        <ChipGroup label="When did it start?" options={ONSET} value={entry.onset} onChange={(v) => update({ onset: v as string })} />
        <ChipGroup label="How did it start?" options={ONSET_STYLE} value={entry.onsetStyle} onChange={(v) => update({ onsetStyle: v as string })} />
        <div className="mt-5 border-t-2 border-dashed border-cream-dark pt-3">
          <Why text={WHY.pattern} />
          <ChipGroup label="Is it constant, or does it come and go?" options={PATTERN} value={entry.pattern} onChange={(v) => update({ pattern: v as string })} />
          <ChipGroup label="When it's there, how long does it last?" options={EPISODE} value={entry.episodeLength} onChange={(v) => update({ episodeLength: v as string })} />
        </div>
      </Card>

      <Card>
        <h2 className="font-serif text-xl font-semibold">How strong, at its worst?</h2>
        <Why text={WHY.severity} />
        <div className="mt-3 grid grid-cols-6 gap-2" role="radiogroup" aria-label="Severity from 0 to 10">
          {Array.from({ length: 11 }, (_, n) => (
            <button
              key={n}
              type="button"
              role="radio"
              aria-checked={entry.severity === n}
              aria-label={`${n}: ${anchorFor(n)}`}
              onClick={() => update({ severity: entry.severity === n ? null : n })}
              className="chip !min-h-12 !px-0 text-center text-lg font-semibold"
            >
              {n}
            </button>
          ))}
        </div>
        <div className="mt-2 flex justify-between text-xs text-quiet" aria-hidden="true">
          <span>{ANCHORS[0]}</span>
          <span>{ANCHORS[5]}</span>
          <span>{ANCHORS[10]}</span>
        </div>
        <p className="mt-3 min-h-6 font-semibold text-plum" aria-live="polite">
          {entry.severity !== null ? `${entry.severity}: ${anchorFor(entry.severity)}` : ""}
        </p>
      </Card>

      <Card>
        <h2 className="font-serif text-xl font-semibold">Patterns</h2>
        <Why text={WHY.betterWorse} />
        <ChipGroup multi label="What makes it better?" options={BETTER} value={entry.better} onChange={(v) => update({ better: v as string[] })} />
        <ChipGroup multi label="What makes it worse?" options={WORSE} value={entry.worse} onChange={(v) => update({ worse: v as string[] })} />
        <div className="mt-5 border-t-2 border-dashed border-cream-dark pt-3">
          <Why text={WHY.timing} />
          <ChipGroup multi label="Does it follow a pattern?" options={TIMING} value={entry.timing} onChange={(v) => update({ timing: v as string[] })} />
        </div>
        <div className="mt-5 border-t-2 border-dashed border-cream-dark pt-3">
          <Why text={WHY.other} />
          <ChipGroup multi label="Anything else you've noticed?" options={OTHER} value={entry.otherSymptoms} onChange={(v) => update({ otherSymptoms: v as string[] })} />
        </div>
      </Card>

      {pelvic ? (
        <Card>
          <h2 className="font-serif text-xl font-semibold">Could you be pregnant?</h2>
          <p className="mt-2 text-sm text-quiet">
            <span className="font-semibold">Why a clinician asks: </span>
            it changes which next steps are safe for pain low in the belly. You can skip this.
          </p>
          <div className="mt-3 flex flex-wrap gap-2">
            {PREGNANCY.map((p) => (
              <Chip key={p.v} selected={entry.pregnancy === p.v} onClick={() => update({ pregnancy: entry.pregnancy === p.v ? null : p.v })}>
                {p.label}
              </Chip>
            ))}
          </div>
        </Card>
      ) : null}
    </div>
  );
}
