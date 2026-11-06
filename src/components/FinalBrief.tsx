"use client";
// The one-page brief. Leads with her words. Editable per section, source tags kept,
// plus hand-written questions to ask and "If you feel unheard" phrases. Print or save as PDF.
import { useState } from "react";
import { QUESTIONS_TO_ASK, UNHEARD_PHRASES } from "@/content/steps";
import { briefToText, type BriefSection } from "@/lib/brief";
import type { Source } from "@/lib/types";
import { NavBar, Screen, SourceTag } from "./ui";

export function FinalBrief({ sections, onBack, onRestart }: { sections: BriefSection[]; onBack: () => void; onRestart: () => void }) {
  // Snapshot the text on arrival; her edits live here.
  const [text, setText] = useState<Record<string, string>>(() => briefToText(sections));

  return (
    <Screen
      title="Your brief"
      progress={1}
      label="Ready"
      footer={
        <NavBar
          onBack={onBack}
          middle={
            <button type="button" className="btn btn-ghost !px-4 text-sm" onClick={onRestart}>
              Start over
            </button>
          }
          onNext={() => window.print()}
          nextLabel="Print / PDF"
        />
      }
    >
      <p className="no-print mb-3 text-sm text-quiet">
        Every line is yours. Tap a section to edit it. <SourceTag source="her" /> <SourceTag source="chose" /> <SourceTag source="info" />
      </p>

      <div className="piece stitch space-y-4 p-5">
        {sections.length === 0 ? <p className="text-quiet">You haven&apos;t added anything yet. Go back and answer a few steps.</p> : null}
        {sections.map((sec) => {
          const sources = [...new Set(sec.lines.map((l) => l.source))] as Source[];
          return (
            <section key={sec.id}>
              <div className="flex flex-wrap items-center justify-between gap-2">
                <h2 className="text-xs font-semibold tracking-wide text-quiet uppercase">{sec.title}</h2>
                <span className="flex gap-1">
                  {sources.map((s) => (
                    <SourceTag key={s} source={s} />
                  ))}
                </span>
              </div>
              <textarea
                aria-label={sec.title}
                value={text[sec.id] ?? ""}
                onChange={(e) => setText({ ...text, [sec.id]: e.target.value })}
                className={`mt-1 w-full resize-none rounded-xl border border-transparent bg-transparent p-1 leading-relaxed hover:border-cream-dark focus:border-plum focus:bg-white/70 focus:outline-none ${
                  sec.id === "concern" ? "font-serif text-lg italic" : ""
                }`}
              />
            </section>
          );
        })}

        <section className="border-t-2 border-dashed border-cream-dark pt-4">
          <div className="flex items-center justify-between gap-2">
            <h2 className="text-xs font-semibold tracking-wide text-quiet uppercase">Questions to ask</h2>
            <SourceTag source="info" />
          </div>
          <ul className="mt-2 list-disc space-y-1.5 pl-5">
            {QUESTIONS_TO_ASK.map((q) => (
              <li key={q}>{q}</li>
            ))}
          </ul>
        </section>

        <section className="rounded-2xl bg-plum-tint p-4">
          <div className="flex items-center justify-between gap-2">
            <h2 className="font-serif text-lg font-semibold text-plum-dark">If you feel unheard</h2>
            <SourceTag source="info" />
          </div>
          <p className="mt-1 text-sm text-quiet">Calm phrases that ask for documentation and next steps.</p>
          <ul className="mt-2 space-y-2">
            {UNHEARD_PHRASES.map((p) => (
              <li key={p} className="font-serif italic">
                “{p}”
              </li>
            ))}
          </ul>
        </section>

        <p className="text-xs leading-snug text-quiet">Prepared with Felt from her own answers. This is a description to support the conversation, not a diagnosis.</p>
      </div>
      <p className="no-print mt-3 text-center text-sm text-quiet">Nothing is saved. Print or save it before you close this page.</p>
    </Screen>
  );
}
