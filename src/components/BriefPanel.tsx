"use client";
// Live brief: a pill in the footer ("Your brief · N") that opens a slide-up sheet inside the app.
// Built in code from her answers (buildBrief), never by AI.
import { useEffect, useState } from "react";
import type { BriefSection } from "@/lib/brief";
import { SourceTag } from "./ui";

export function BriefPanel({ sections }: { sections: BriefSection[] }) {
  const [open, setOpen] = useState(false);
  const count = sections.reduce((n, s) => n + s.lines.length, 0);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-expanded={open}
        className="chip flex !min-h-12 items-center gap-2 !rounded-full !px-4 font-serif font-semibold"
      >
        Your brief
        <span key={count} className="stitch-in inline-grid h-7 min-w-7 place-items-center rounded-full bg-plum px-1.5 font-sans text-sm text-white">
          {count}
        </span>
      </button>

      {open ? (
        <div className="absolute inset-0 z-40" role="dialog" aria-modal="true" aria-label="Your brief so far">
          <button type="button" aria-label="Close brief" className="absolute inset-0 bg-ink/40" onClick={() => setOpen(false)} />
          <div className="sheet-up felt-bg absolute inset-x-0 bottom-0 flex max-h-[85%] flex-col rounded-t-[28px] shadow-2xl">
            <div className="shrink-0 px-4 pt-3">
              <div className="mx-auto mb-3 h-1.5 w-12 rounded-full bg-brown/40" />
              <div className="mb-3 flex items-center justify-between">
                <h2 className="font-serif text-2xl font-semibold">Your brief so far</h2>
                <button type="button" className="btn btn-ghost !min-h-11 !px-4" onClick={() => setOpen(false)}>
                  Close
                </button>
              </div>
            </div>
            <div className="step-scroll min-h-0 flex-1 px-4 pb-6">
              <BriefLines sections={sections} />
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}

export function BriefLines({ sections }: { sections: BriefSection[] }) {
  if (!sections.length)
    return <p className="piece p-5 text-quiet">Nothing yet. Each answer you give adds a line here, tagged with where it came from.</p>;
  return (
    <div className="piece stitch space-y-4 p-5">
      {sections.map((sec) => (
        <section key={sec.id}>
          <h3 className="text-xs font-semibold tracking-wide text-quiet uppercase">{sec.title}</h3>
          <ul className="mt-1 space-y-1.5">
            {sec.lines.map((l) => (
              <li key={l.text} className="stitch-in flex items-start justify-between gap-3">
                <span className={l.source === "her" ? "font-serif italic" : ""}>{l.text}</span>
                <SourceTag source={l.source} />
              </li>
            ))}
          </ul>
        </section>
      ))}
    </div>
  );
}
