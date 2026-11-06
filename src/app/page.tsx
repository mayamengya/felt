"use client";
// The guided flow as app screens. One Entry in state; brief = buildBrief(entry).
// 6 steps (some split into short screens so each fits 100dvh), then the brief.
import { useMemo, useState, type ReactNode } from "react";
import { BodyMap } from "@/components/BodyMap";
import { BriefPanel } from "@/components/BriefPanel";
import { OtherStep, PatternsStep, SeverityStep, WhenStep } from "@/components/DetailsStep";
import { FinalBrief } from "@/components/FinalBrief";
import { FollowUpsStep } from "@/components/FollowUpsStep";
import { FeltScene, Mascot } from "@/components/Mascot";
import { RedFlagScreen } from "@/components/RedFlagScreen";
import { SimileStep, WordPicker } from "@/components/SensationStep";
import { ChipGroup, NavBar, Screen, TextBox } from "@/components/ui";
import { IMPACT, WHY } from "@/content/steps";
import { buildBrief } from "@/lib/brief";
import { checkRedFlags } from "@/lib/redFlags";
import { emptyEntry, type Entry, type FollowUpQuestion } from "@/lib/types";

type Match = { sensationId: string; reason: string };

// Each screen belongs to one of the 6 steps; `part` = its position within that step.
const SCREENS = [
  { id: "welcome" },
  { id: "words", step: 1, part: [1, 1] },
  { id: "where", step: 2, part: [1, 1] },
  { id: "simile", step: 3, part: [1, 2] },
  { id: "pick", step: 3, part: [2, 2] },
  { id: "when", step: 4, part: [1, 4] },
  { id: "severity", step: 4, part: [2, 4] },
  { id: "patterns", step: 4, part: [3, 4] },
  { id: "other", step: 4, part: [4, 4] },
  { id: "life", step: 5, part: [1, 1] },
  { id: "followups", step: 6, part: [1, 1] },
  { id: "brief" },
] as const;
const TOTAL_STEPS = 6;

export default function Home() {
  const [i, setI] = useState(0);
  const [dir, setDir] = useState<1 | -1>(1);
  const [entry, setEntry] = useState<Entry>(emptyEntry);
  const [matches, setMatches] = useState<Match[] | null>(null);
  const [followUpQs, setFollowUpQs] = useState<FollowUpQuestion[] | null>(null);
  const [dismissed, setDismissed] = useState<string[]>([]);

  const update = (p: Partial<Entry>) => setEntry((e) => ({ ...e, ...p }));
  const brief = useMemo(() => buildBrief(entry), [entry]);

  // Red-flag rules run after every answer. Once acknowledged, the same flag doesn't reappear.
  const flag = checkRedFlags(entry);
  const showFlag = flag && !dismissed.includes(flag.id) ? flag : null;

  const go = (n: number) => {
    setDir(n > i ? 1 : -1);
    setI(n);
  };
  const next = () => go(i + 1);
  const back = () => go(i - 1);
  const restart = () => {
    setEntry(emptyEntry);
    setMatches(null);
    setFollowUpQs(null);
    setDismissed([]);
    go(0);
  };

  const s = SCREENS[i];
  const step = "step" in s ? s.step : 0;
  const progress = "part" in s ? (step - 1 + s.part[0] / s.part[1]) / TOTAL_STEPS : 0;
  const label = "part" in s ? `Step ${step} of ${TOTAL_STEPS}` : undefined;
  const nav = (nextLabel?: string) => <NavBar onBack={back} onNext={next} nextLabel={nextLabel} middle={<BriefPanel sections={brief} />} />;
  const screen = (title: string, body: ReactNode, opts: { why?: string; scroll?: boolean; nextLabel?: string } = {}) => (
    <Screen progress={progress} label={label} title={title} why={opts.why} scroll={opts.scroll} footer={nav(opts.nextLabel)}>
      {body}
    </Screen>
  );

  let content: ReactNode = null;
  switch (s.id) {
    case "welcome":
      content = <Welcome onStart={next} />;
      break;
    case "words":
      content = screen(
        "What's been going on?",
        <>
          <TextBox
            label="What's been going on, in your own words"
            tone="her"
            rows={6}
            value={entry.ownWords}
            onChange={(v) => update({ ownWords: v })}
            placeholder="Say it however it comes out. “My stomach feels weird” is a fine start."
          />
          <p className="mt-2 text-sm text-quiet">This goes at the top of your brief, word for word.</p>
        </>,
        { why: WHY.ownWords },
      );
      break;
    case "where":
      content = screen("Where do you feel it?", <BodyMap value={entry.regions} onChange={(regions) => update({ regions })} />, { scroll: false });
      break;
    case "simile":
      content = screen("What does it feel like?", <SimileStep entry={entry} update={update} matches={matches} setMatches={setMatches} />, { why: WHY.feel });
      break;
    case "pick":
      content = screen("Pick any words that fit", <WordPicker entry={entry} update={update} />, { why: "Choose as many as you like, or none." });
      break;
    case "when":
      content = screen("When did it start?", <WhenStep entry={entry} update={update} />, { why: WHY.onset });
      break;
    case "severity":
      content = screen("How strong, at its worst?", <SeverityStep entry={entry} update={update} />, { why: WHY.severity });
      break;
    case "patterns":
      content = screen("What changes it?", <PatternsStep entry={entry} update={update} />, { why: WHY.betterWorse });
      break;
    case "other":
      content = screen("Anything else you've noticed?", <OtherStep entry={entry} update={update} />, { why: WHY.other });
      break;
    case "life":
      content = screen(
        "How is it affecting your life?",
        <>
          <ChipGroup multi options={IMPACT} value={entry.impact} onChange={(v) => update({ impact: v as string[] })} />
          <div className="mt-4">
            <TextBox
              label="Anything else about how it affects you"
              tone="her"
              value={entry.impactOther}
              onChange={(v) => update({ impactOther: v })}
              placeholder="Anything else? e.g. “I left my sister's birthday early.”"
            />
          </div>
        </>,
        { why: WHY.impact },
      );
      break;
    case "followups":
      content = screen("A few more questions", <FollowUpsStep entry={entry} update={update} questions={followUpQs} setQuestions={setFollowUpQs} />, {
        nextLabel: "See my brief",
      });
      break;
    case "brief":
      content = <FinalBrief sections={brief} onBack={back} onRestart={restart} />;
      break;
  }

  return (
    <div className="stage felt-bg">
      <div className="device felt-bg">
        <div className="status-bar" aria-hidden="true">
          <span>9:41</span>
          <span className="island" />
          <span className="tracking-widest">●●● ▮</span>
        </div>
        <div className="relative min-h-0 flex-1">
          <div key={s.id} className={`absolute inset-0 ${dir > 0 ? "screen-next" : "screen-prev"}`}>
            {content}
          </div>
        </div>
        {showFlag ? <RedFlagScreen flag={showFlag} onContinue={() => setDismissed((d) => [...d, showFlag.id])} /> : null}
      </div>
    </div>
  );
}

function Welcome({ onStart }: { onStart: () => void }) {
  // Full-screen felt scene; all text sits on a flat cream card.
  return (
    <div className="relative h-full overflow-hidden">
      <FeltScene />
      <div className="relative flex h-full flex-col px-5 pb-[max(16px,env(safe-area-inset-bottom))]">
        <div className="flex min-h-0 flex-1 items-end justify-center pb-2">
          <Mascot size={190} className="bob max-h-full w-auto" />
        </div>
        <div className="piece-soft p-5 text-center">
          <h1 className="font-serif text-5xl font-semibold text-plum">Felt</h1>
          <p className="mt-1 font-serif text-lg leading-snug">Understand your body. Find your words. Be heard.</p>
          <p className="mt-3 text-[0.95rem] leading-snug">
            In about <strong>10 minutes</strong>, turn a feeling that&apos;s hard to describe into a clear, one-page brief for your next appointment.
          </p>
          <button type="button" className="btn btn-primary mt-4 w-full text-lg" onClick={onStart}>
            Start
          </button>
          <p className="mt-3 text-xs leading-snug text-quiet">Nothing is saved. Your answers go to Claude only to suggest words and questions.</p>
          <p className="mt-2 text-sm font-medium text-ink">If this feels urgent, call 911 or go to your nearest emergency room.</p>
        </div>
      </div>
    </div>
  );
}
