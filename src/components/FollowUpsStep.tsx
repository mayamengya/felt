"use client";
// 2–3 follow-ups from /api/followups (static fallback on the server). Tap-to-answer chips plus optional text.
import { useEffect, useState } from "react";
import { WHY } from "@/content/steps";
import type { Entry, FollowUpQuestion } from "@/lib/types";
import { FeltLoading } from "./FeltWoman";
import { Card, ChipGroup, TextBox, Why } from "./ui";

type Answer = { chip: string; text: string };

export function FollowUpsStep({
  entry,
  update,
  questions,
  setQuestions,
}: {
  entry: Entry;
  update: (p: Partial<Entry>) => void;
  questions: FollowUpQuestion[] | null;
  setQuestions: (q: FollowUpQuestion[]) => void;
}) {
  // Fetch once; going back and forth keeps the same questions.
  useEffect(() => {
    if (questions) return;
    let alive = true;
    fetch("/api/followups", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ entry }) })
      .then((r) => r.json())
      .then((d) => alive && setQuestions(d.questions))
      .catch(() => alive && setQuestions([]));
    return () => {
      alive = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (!questions) return <FeltLoading text="Thinking about what a clinician might ask next…" />;
  if (!questions.length) return <p className="text-quiet">No extra questions right now. You can go straight to your brief.</p>;
  return <FollowUpCards entry={entry} update={update} questions={questions} />;
}

/** Mounted once questions exist, so answers can be restored from her entry on first render. */
function FollowUpCards({ entry, update, questions }: { entry: Entry; update: (p: Partial<Entry>) => void; questions: FollowUpQuestion[] }) {
  const [answers, setAnswers] = useState<Record<string, Answer>>(() => {
    const init: Record<string, Answer> = {};
    for (const q of questions) {
      const prev = entry.followUps.find((f) => f.question === q.text)?.answer ?? "";
      const chip = q.options.find((o) => prev === o || prev.startsWith(`${o}. `)) ?? "";
      init[q.id] = { chip, text: chip ? prev.slice(chip.length + 2) : prev };
    }
    return init;
  });

  const set = (q: FollowUpQuestion, a: Answer) => {
    const next = { ...answers, [q.id]: a };
    setAnswers(next);
    update({
      followUps: questions
        .map((x) => {
          const v = next[x.id] ?? { chip: "", text: "" };
          return { question: x.text, answer: [v.chip, v.text.trim()].filter(Boolean).join(". ") };
        })
        .filter((f) => f.answer),
    });
  };

  return (
    <div className="space-y-5">
      <p className="text-sm text-quiet">{WHY.followUps} All optional.</p>
      {questions.map((q) => {
        const a = answers[q.id] ?? { chip: "", text: "" };
        return (
          <Card key={q.id} className="stitch-in">
            <h2 className="font-serif text-xl leading-snug font-semibold">{q.text}</h2>
            <Why text={q.whyAsk} />
            <ChipGroup options={q.options} value={a.chip} onChange={(v) => set(q, { ...a, chip: v as string })} />
            <div className="mt-3">
              <TextBox label={`Add detail: ${q.text}`} tone="her" rows={2} value={a.text} onChange={(v) => set(q, { ...a, text: v })} placeholder="Add anything in your own words (optional)" />
            </div>
          </Card>
        );
      })}
    </div>
  );
}
