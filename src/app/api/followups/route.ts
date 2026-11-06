// POST /api/followups
// Her answers so far -> 2–3 neutral follow-up questions that fill gaps in her history.
// Body: { entry: Partial<Entry> }
// Returns: { questions: FollowUpQuestion[], source: "claude" | "fallback" }
// Always returns 200 with questions: on any failure or timeout it uses the static fallback.
import { NextResponse } from "next/server";
import { FALLBACK_FOLLOWUPS } from "@/content/followups";
import { REGIONS } from "@/content/regions";
import { SENSATION_BY_ID } from "@/content/sensations";
import { askJSON, clean, SHARED_RULES } from "@/lib/claude";
import type { Entry, FollowUpQuestion, RegionId } from "@/lib/types";

const TIMEOUT_MS = 12_000;

const SCHEMA = {
  type: "object",
  properties: {
    questions: {
      type: "array",
      items: {
        type: "object",
        properties: {
          text: { type: "string" },
          whyAsk: { type: "string" },
          options: { type: "array", items: { type: "string" } },
        },
        required: ["text", "whyAsk", "options"],
        additionalProperties: false,
      },
    },
  },
  required: ["questions"],
  additionalProperties: false,
};

const SYSTEM = `${SHARED_RULES}

Your task: read her answers so far, which follow the OLDCARTS order a clinician uses (Onset, Location, Duration, Character, Aggravating/relieving, Radiation, Timing, Severity). Write 2 or 3 follow-up questions that fill the most useful gaps a clinician would likely ask about.
- Do not ask again about something she has already answered.
- Each question must be neutral and open. Never name or hint at a condition, cause, test or treatment. Never suggest a symptom she hasn't mentioned (ask "Have you noticed anything else...?" style questions instead).
- No questions about pregnancy, sexual history or mental health: the app handles those elsewhere.
- "text": one short question to her, as "you".
- "whyAsk": one short sentence about why it helps, not what it might mean. It is shown after the label "Why a clinician asks:", so do not repeat that phrase. Example: "It shows whether the feeling is changing over time."
- "options": 3 to 6 short tap-to-answer choices, covering the range neutrally. Include "Not sure" where it fits.`;

/** Turn her (partial) entry into plain lines for the prompt. Only what she gave; never her pregnancy answer. */
function summarise(e: Partial<Entry>): string {
  const list = (a: unknown) => (Array.isArray(a) ? a.map((x) => clean(x, 80)).filter(Boolean).join(", ") : "");
  const regions = Array.isArray(e.regions)
    ? e.regions.map((r) => REGIONS[r as RegionId]?.label).filter(Boolean).join(", ")
    : "";
  const words = Array.isArray(e.sensations)
    ? e.sensations.map((id) => SENSATION_BY_ID[id]?.word).filter(Boolean).join(", ")
    : "";
  const lines: [string, string][] = [
    ["In her own words", clean(e.ownWords)],
    ["Where", regions],
    ["Words she chose", words],
    ["It feels like", clean(e.simile, 300)],
    ["Her other description", clean(e.sensationOther, 300)],
    ["Started", clean(e.onset, 80)],
    ["How it started", clean(e.onsetStyle, 80)],
    ["Pattern", clean(e.pattern, 80)],
    ["Episode length", clean(e.episodeLength, 80)],
    ["Severity (0–10)", typeof e.severity === "number" ? String(e.severity) : ""],
    ["Better with", list(e.better)],
    ["Worse with", list(e.worse)],
    ["Timing", list(e.timing)],
    ["Other symptoms she mentioned", list(e.otherSymptoms)],
    ["Effect on her life", [list(e.impact), clean(e.impactOther, 300)].filter(Boolean).join("; ")],
  ];
  return lines
    .map(([k, v]) => `${k}: ${v || "(not answered)"}`)
    .join("\n");
}

function fallback(reason: string) {
  console.error("[followups] using fallback:", reason);
  return NextResponse.json({ questions: FALLBACK_FOLLOWUPS, source: "fallback" });
}

export async function POST(req: Request) {
  const body = await req.json().catch(() => ({}));
  const entry: Partial<Entry> = body?.entry && typeof body.entry === "object" ? body.entry : {};

  try {
    const out = await Promise.race([
      askJSON<{ questions: Omit<FollowUpQuestion, "id">[] }>({
        system: SYSTEM,
        user: `Her answers so far:\n${summarise(entry)}`,
        schema: SCHEMA,
      }),
      new Promise<never>((_, reject) => setTimeout(() => reject(new Error("timeout")), TIMEOUT_MS)),
    ]);

    const questions: FollowUpQuestion[] = out.questions
      .filter((q) => q.text?.trim() && Array.isArray(q.options) && q.options.length >= 2)
      .slice(0, 3)
      .map((q, i) => ({
        id: `claude-${i}`,
        text: clean(q.text, 200),
        whyAsk: clean(q.whyAsk, 240)
          .replace(/^(a )?clinician(s)? (asks?|ask) this because\s*/i, "")
          .replace(/^./, (c) => c.toUpperCase()),
        options: q.options.map((o) => clean(o, 60)).filter(Boolean).slice(0, 6),
      }));

    if (questions.length < 2) return fallback("fewer than 2 valid questions");
    return NextResponse.json({ questions, source: "claude" });
  } catch (err) {
    return fallback((err as Error).message);
  }
}
