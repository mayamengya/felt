"use client";
// The hero moment: "It feels like..." in her words, Claude suggests words that share her image,
// she decides. Word cards: word, meaning, "You may have felt this...". Nothing pre-selected.
import { useState } from "react";
import { SENSATIONS, SENSATION_BY_ID } from "@/content/sensations";
import type { Entry } from "@/lib/types";
import { FeltLoading } from "./FeltWoman";
import { Card, TextBox } from "./ui";

type Match = { sensationId: string; reason: string };

export function SensationStep({ entry, update }: { entry: Entry; update: (p: Partial<Entry>) => void }) {
  const [matches, setMatches] = useState<Match[] | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [noneFit, setNoneFit] = useState(entry.sensationOther.length > 0);

  const toggle = (id: string) =>
    update({ sensations: entry.sensations.includes(id) ? entry.sensations.filter((s) => s !== id) : [...entry.sensations, id] });

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
      setError("Couldn't find words just now. You can still pick from the cards below.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-5">
      <Card>
        <label htmlFor="simile" className="font-serif text-xl font-semibold">
          It feels like…
        </label>
        <p className="mt-1 mb-3 text-sm text-quiet">Your own comparison. Anything goes. It goes into your brief exactly as you write it.</p>
        <TextBox label="It feels like" tone="her" rows={2} value={entry.simile} onChange={(v) => update({ simile: v })} placeholder="a fist slowly clenching…" />
        <button type="button" className="btn btn-primary mt-3 w-full" disabled={!entry.simile.trim() || loading} onClick={findWords}>
          Find words that match my image
        </button>

        {loading ? <FeltLoading text="Looking for words that share your image…" /> : null}
        {error ? <p className="mt-3 text-sm text-quiet">{error}</p> : null}

        {matches ? (
          <div className="mt-4 space-y-3" aria-live="polite">
            {matches.length === 0 ? (
              <p className="text-quiet">None of our words share that image closely. Your own words are already enough.</p>
            ) : (
              <p className="text-sm font-semibold text-quiet">Suggestions. You decide:</p>
            )}
            {matches.map((m) => {
              const s = SENSATION_BY_ID[m.sensationId];
              const on = entry.sensations.includes(m.sensationId);
              return (
                <div key={m.sensationId} className="stitch-in rounded-2xl bg-white/70 p-4">
                  <p className="font-serif text-lg font-semibold">{s.word}</p>
                  <p className="mt-1 text-[0.95rem] leading-snug">{m.reason}</p>
                  <button type="button" className="chip mt-3" aria-pressed={on} onClick={() => toggle(m.sensationId)}>
                    {on ? "✓ Added to my brief" : "Yes, that's it"}
                  </button>
                </div>
              );
            })}
          </div>
        ) : null}
      </Card>

      <div>
        <h2 className="font-serif text-xl font-semibold">Or pick any words that fit</h2>
        <p className="mt-1 text-sm text-quiet">Choose as many as you like.</p>
        <div className="mt-3 grid gap-3">
          {SENSATIONS.map((s) => {
            const on = entry.sensations.includes(s.id);
            return (
              <button
                key={s.id}
                type="button"
                aria-pressed={on}
                onClick={() => toggle(s.id)}
                className={`rounded-3xl p-4 text-left transition ${
                  on ? "bg-plum text-white shadow-[0_3px_0_#4A1F40] outline-2 -outline-offset-[7px] outline-white/60 outline-dashed" : "piece"
                }`}
              >
                <span className="flex items-baseline justify-between gap-2">
                  <span className="font-serif text-lg font-semibold">{s.word}</span>
                  {on ? <span className="text-sm font-semibold">✓ Chosen</span> : null}
                </span>
                <span className="mt-1 block">{s.meaning}</span>
                <span className={`mt-2 block text-sm ${on ? "text-white/90" : "text-quiet"}`}>
                  <span className="font-semibold">You may have felt this: </span>
                  {s.feltBefore}
                </span>
              </button>
            );
          })}
          <button type="button" aria-pressed={noneFit} onClick={() => setNoneFit(!noneFit)} className="chip w-full justify-center py-3 text-center font-semibold">
            None of these fit
          </button>
          {noneFit ? (
            <TextBox label="Describe it your way" tone="her" value={entry.sensationOther} onChange={(v) => update({ sensationOther: v })} placeholder="Describe it your way…" />
          ) : null}
        </div>
      </div>
    </div>
  );
}
