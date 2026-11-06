"use client";
// The guided flow: Welcome -> 6 steps -> Brief. One Entry in state; brief = buildBrief(entry).
import { useEffect, useMemo, useState } from "react";
import { BodyMap } from "@/components/BodyMap";
import { BriefPanel } from "@/components/BriefPanel";
import { DetailsStep } from "@/components/DetailsStep";
import { FeltWoman } from "@/components/FeltWoman";
import { FinalBrief } from "@/components/FinalBrief";
import { FollowUpsStep } from "@/components/FollowUpsStep";
import { RedFlagScreen } from "@/components/RedFlagScreen";
import { SensationStep } from "@/components/SensationStep";
import { ChipGroup, NavBar, StepHeader, TextBox } from "@/components/ui";
import { IMPACT, WHY } from "@/content/steps";
import { buildBrief } from "@/lib/brief";
import { checkRedFlags } from "@/lib/redFlags";
import { emptyEntry, type Entry, type FollowUpQuestion } from "@/lib/types";

const TOTAL = 6; // 1 words, 2 where, 3 feel, 4 details, 5 life, 6 follow-ups; 7 = brief

export default function Home() {
  const [step, setStep] = useState(0);
  const [entry, setEntry] = useState<Entry>(emptyEntry);
  const [followUpQs, setFollowUpQs] = useState<FollowUpQuestion[] | null>(null);
  const [dismissed, setDismissed] = useState<string[]>([]);

  const update = (p: Partial<Entry>) => setEntry((e) => ({ ...e, ...p }));
  const brief = useMemo(() => buildBrief(entry), [entry]);

  // Red-flag rules run after every answer. Once acknowledged, the same flag doesn't reappear.
  const flag = checkRedFlags(entry);
  const showFlag = flag && !dismissed.includes(flag.id) ? flag : null;

  const go = (n: number) => setStep(n);
  useEffect(() => {
    window.scrollTo({ top: 0 });
  }, [step]);

  const restart = () => {
    setEntry(emptyEntry);
    setFollowUpQs(null);
    setDismissed([]);
    setStep(0);
  };

  return (
    <main className="mx-auto min-h-dvh max-w-[430px] px-5 pt-6 pb-32">
      {showFlag ? <RedFlagScreen flag={showFlag} onContinue={() => setDismissed((d) => [...d, showFlag.id])} /> : null}

      {step === 0 ? <Welcome onStart={() => go(1)} /> : null}

      {step === 1 ? (
        <>
          <StepHeader step={1} total={TOTAL} title="What's been going on?" why={WHY.ownWords} />
          <TextBox
            label="What's been going on, in your own words"
            tone="her"
            rows={5}
            value={entry.ownWords}
            onChange={(v) => update({ ownWords: v })}
            placeholder="Say it however it comes out. “My stomach feels weird” is a fine start."
          />
          <p className="mt-2 text-sm text-quiet">This goes at the top of your brief, word for word.</p>
          <NavBar onBack={() => go(0)} onNext={() => go(2)} />
        </>
      ) : null}

      {step === 2 ? (
        <>
          <StepHeader step={2} total={TOTAL} title="Where do you feel it?" why={WHY.where} />
          <BodyMap value={entry.regions} onChange={(regions) => update({ regions })} />
          <NavBar onBack={() => go(1)} onNext={() => go(3)} />
        </>
      ) : null}

      {step === 3 ? (
        <>
          <StepHeader step={3} total={TOTAL} title="What does it feel like?" why={WHY.feel} />
          <SensationStep entry={entry} update={update} />
          <NavBar onBack={() => go(2)} onNext={() => go(4)} />
        </>
      ) : null}

      {step === 4 ? (
        <>
          <StepHeader step={4} total={TOTAL} title="A few details" />
          <DetailsStep entry={entry} update={update} />
          <NavBar onBack={() => go(3)} onNext={() => go(5)} />
        </>
      ) : null}

      {step === 5 ? (
        <>
          <StepHeader step={5} total={TOTAL} title="How is it affecting your life?" why={WHY.impact} />
          <ChipGroup multi options={IMPACT} value={entry.impact} onChange={(v) => update({ impact: v as string[] })} />
          <div className="mt-5">
            <TextBox
              label="Anything else about how it affects you"
              tone="her"
              value={entry.impactOther}
              onChange={(v) => update({ impactOther: v })}
              placeholder="Anything else? e.g. “I left my sister's birthday early.”"
            />
          </div>
          <NavBar onBack={() => go(4)} onNext={() => go(6)} />
        </>
      ) : null}

      {step === 6 ? (
        <>
          <StepHeader step={6} total={TOTAL} title="A few more questions" />
          <FollowUpsStep entry={entry} update={update} questions={followUpQs} setQuestions={setFollowUpQs} />
          <NavBar onBack={() => go(5)} onNext={() => go(7)} nextLabel="See my brief" />
        </>
      ) : null}

      {step === 7 ? <FinalBrief sections={brief} onBack={() => go(6)} onRestart={restart} /> : null}

      {step >= 1 && step <= 6 ? <BriefPanel sections={brief} /> : null}
    </main>
  );
}

function Welcome({ onStart }: { onStart: () => void }) {
  return (
    <div className="flex min-h-[85dvh] flex-col">
      <div className="flex flex-1 flex-col items-center justify-center text-center">
        <FeltWoman size={170} heart />
        <h1 className="mt-6 font-serif text-5xl font-semibold text-plum">Felt</h1>
        <p className="mt-3 font-serif text-xl leading-snug">
          Understand your body.
          <br />
          Find your words. Be heard.
        </p>
        <div className="piece stitch mt-6 p-5 text-left">
          <p className="leading-relaxed">
            In about <strong>10 minutes</strong>, turn a feeling that&apos;s hard to describe into a clear, one-page brief for your next appointment.
          </p>
          <p className="mt-3 text-sm leading-snug text-quiet">
            Nothing is saved, and there&apos;s no account. Your answers are sent to Claude only to suggest words and questions.
          </p>
        </div>
      </div>
      <button type="button" className="btn btn-primary mt-6 w-full text-lg" onClick={onStart}>
        Start
      </button>
      <p className="mt-4 rounded-2xl bg-white px-4 py-3 text-center text-sm text-ink">If this feels urgent, call 911 or go to your nearest emergency room.</p>
    </div>
  );
}
