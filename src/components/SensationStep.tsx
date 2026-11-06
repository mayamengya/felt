"use client";
// The hero moment, split over two screens so each fits:
//  - SimileStep: "It feels like..." in her words; Claude suggests words that share her image; she decides.
//  - WordPicker: word cards (word, meaning, "You may have felt this..."). Nothing pre-selected; "None of these fit".
import { useState } from "react";
import { SENSATIONS, SENSATION_BY_ID } from "@/content/sensations";
import type { Entry } from "@/lib/types";
import { StitchLoader } from "./BodyFigure";
import { TextBox } from "./ui";

type Match = { sensationId: string; reason: string };
type Props = { entry: Entry; update: (p: Partial<Entry>) => void };

const toggleIn = (entry: Entry, id: string) =>
  entry.sensations.includes(id) ? entry.sensations.filter((s) => s !== id) : [...entry.sensations, id];

export function SimileStep({ entry, update, matches, setMatches }: Props & { matches: Match[] | null; setMatches: (m: Match[] | null) => void }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function findWords() {
    setLoading(true);
    setError("");
    setMatches(null);
    try {
      const res = await fetch("/api/simile", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ simile: entry.simile, ownWords: entry.ownWords }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error();
      setMatches(data.matches);
    } catch {
      setError("Couldn't find words just now. You can pick from the word cards on the next screen.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-4">
      <div className="piece stitch p-4">
        <label htmlFor="simile" className="font-serif text-xl font-semibold">
          It feels like…
        </label>
        <p className="mt-1 mb-3 text-sm text-quiet">Your own comparison. It goes into your brief exactly as you write it.</p>
        <TextBox label="It feels like" tone="her" rows={2} value={entry.simile} onChange={(v) => update({ simile: v })} placeholder="a fist slowly clenching…" />
        <button type="button" className="btn btn-primary mt-3 w-full" disabled={!entry.simile.trim() || loading} onClick={findWords}>
          ✦ Find words that match my image
        </button>
      </div>

      {loading ? <StitchLoader kind="simile" /> : null}
      {error ? <p className="text-sm text-quiet">{error}</p> : null}

      {matches && !loading ? (
        <div className="space-y-3" aria-live="polite">
          <p className="text-sm font-semibold text-quiet">
            {matches.length ? "Words that share your image. You decide:" : "None of our words share that image closely. Your own words are already enough."}
          </p>
          {matches.map((m, i) => {
            const s = SENSATION_BY_ID[m.sensationId];
            const on = entry.sensations.includes(m.sensationId);
            return (
              <div key={m.sensationId} className="piece stitch-in p-4" style={{ animationDelay: `${i * 120}ms` }}>
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="font-serif text-xl font-semibold">{s.word}</p>
                    <p className="mt-1 text-[0.95rem] leading-snug">{m.reason}</p>
                  </div>
                  <button type="button" className="chip shrink-0 font-semibold" aria-pressed={on} onClick={() => update({ sensations: toggleIn(entry, m.sensationId) })}>
                    {on ? "✓ Added" : "That's it"}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      ) : null}
    </div>
  );
}

export function WordPicker({ entry, update }: Props) {
  const [noneFit, setNoneFit] = useState(entry.sensationOther.length > 0);
  return (
    <div className="grid gap-3">
      {SENSATIONS.map((s) => {
        const on = entry.sensations.includes(s.id);
        return (
          <button
            key={s.id}
            type="button"
            aria-pressed={on}
            onClick={() => update({ sensations: toggleIn(entry, s.id) })}
            className={`rounded-3xl p-4 text-left transition ${
              on ? "bg-plum text-white shadow-[0_3px_0_#4A1F40] outline-2 -outline-offset-[7px] outline-white/60 outline-dashed" : "piece"
            }`}
          >
            <span className="flex items-baseline justify-between gap-2">
              <span className="font-serif text-lg font-semibold">{s.word}</span>
              {on ? <span className="text-sm font-semibold">✓ Chosen</span> : null}
            </span>
            <span className="mt-0.5 block">{s.meaning}</span>
            <span className={`mt-1.5 block text-sm ${on ? "text-white/90" : "text-quiet"}`}>
              <span className="font-semibold">You may have felt this: </span>
              {s.feltBefore}
            </span>
          </button>
        );
      })}
      <button type="button" aria-pressed={noneFit} onClick={() => setNoneFit(!noneFit)} className="chip w-full py-3 !text-center font-semibold">
        None of these fit
      </button>
      {noneFit ? (
        <TextBox label="Describe it your way" tone="her" value={entry.sensationOther} onChange={(v) => update({ sensationOther: v })} placeholder="Describe it your way…" />
      ) : null}
    </div>
  );
}
