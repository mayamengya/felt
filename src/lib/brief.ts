import { REGIONS } from "@/content/regions";
import { SENSATION_BY_ID } from "@/content/sensations";
import type { Entry, Source } from "./types";

export interface BriefLine {
  text: string;
  source: Source;
}

export interface BriefSection {
  id: string;
  title: string;
  lines: BriefLine[];
}

const list = (xs: string[]) => xs.join(", ").toLowerCase();

/**
 * Builds the appointment brief deterministically from her answers.
 * No AI here: the brief can only contain what she said or chose.
 */
export function buildBrief(e: Entry): BriefSection[] {
  const s: BriefSection[] = [];

  if (e.ownWords.trim()) s.push({ id: "concern", title: "In my words", lines: [{ text: `“${e.ownWords.trim()}”`, source: "her" }] });

  if (e.impact.length || e.impactOther.trim()) {
    const lines: BriefLine[] = [];
    if (e.impact.length) lines.push({ text: e.impact.join("; "), source: "chose" });
    if (e.impactOther.trim()) lines.push({ text: `“${e.impactOther.trim()}”`, source: "her" });
    s.push({ id: "impact", title: "How it's affecting my life", lines });
  }

  if (e.regions.length)
    s.push({ id: "where", title: "Where", lines: [{ text: e.regions.map((r) => REGIONS[r].label).join("; "), source: "chose" }] });

  const feel: BriefLine[] = [];
  if (e.sensations.length) feel.push({ text: e.sensations.map((id) => SENSATION_BY_ID[id]?.word ?? id).join(", "), source: "chose" });
  if (e.simile.trim()) feel.push({ text: `It feels like ${e.simile.trim().replace(/^(it )?(feels )?like\s+/i, "")}`, source: "her" });
  if (e.sensationOther.trim()) feel.push({ text: `“${e.sensationOther.trim()}”`, source: "her" });
  if (feel.length) s.push({ id: "feel", title: "What it feels like", lines: feel });

  const when: string[] = [];
  if (e.onset) when.push(`Started ${e.onset.toLowerCase()}`);
  if (e.onsetStyle) when.push(`came on ${e.onsetStyle.toLowerCase()}`);
  if (e.pattern) when.push(e.pattern.toLowerCase());
  if (e.episodeLength) when.push(`episodes last ${e.episodeLength.toLowerCase()}`);
  if (when.length) s.push({ id: "when", title: "When and how often", lines: [{ text: when.join("; "), source: "chose" }] });

  if (e.severity !== null) s.push({ id: "severity", title: "Severity", lines: [{ text: `${e.severity} out of 10 at its worst`, source: "chose" }] });

  const bw: BriefLine[] = [];
  if (e.better.length) bw.push({ text: `Better with: ${list(e.better)}`, source: "chose" });
  if (e.worse.length) bw.push({ text: `Worse with: ${list(e.worse)}`, source: "chose" });
  if (bw.length) s.push({ id: "betterworse", title: "What changes it", lines: bw });

  if (e.timing.length) s.push({ id: "timing", title: "Timing", lines: [{ text: e.timing.join("; "), source: "chose" }] });

  const other: BriefLine[] = [];
  if (e.otherSymptoms.length) other.push({ text: e.otherSymptoms.join("; "), source: "chose" });
  if (e.pregnancy === "yes" || e.pregnancy === "unsure")
    other.push({ text: e.pregnancy === "yes" ? "Could be pregnant" : "Not sure if pregnant", source: "chose" });
  if (other.length) s.push({ id: "other", title: "Other symptoms", lines: other });

  const fu = e.followUps.filter((f) => f.answer.trim());
  if (fu.length)
    s.push({ id: "followups", title: "More detail", lines: fu.map((f) => ({ text: `${f.question} — ${f.answer}`, source: "her" as Source })) });

  return s;
}

export function briefToText(sections: BriefSection[]): Record<string, string> {
  return Object.fromEntries(sections.map((sec) => [sec.id, sec.lines.map((l) => l.text).join("\n")]));
}
