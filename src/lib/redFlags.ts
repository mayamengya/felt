import { PELVIC_REGIONS } from "@/content/regions";
import type { Entry } from "./types";

export interface Flag {
  id: string;
  title: string;
  message: string;
  crisis?: boolean;
}

const SELF_HARM = /(kill myself|end my life|suicid|self[- ]?harm|hurt myself|don'?t want to (live|be here))/i;

/**
 * Hard-coded urgent-care rules. Deliberately NOT done by the LLM, so the
 * behaviour is predictable and testable.
 */
export function checkRedFlags(e: Entry): Flag | null {
  const freeText = [e.ownWords, e.simile, e.sensationOther, e.impactOther, ...e.followUps.map((f) => f.answer)].join(" ");

  if (SELF_HARM.test(freeText)) {
    return {
      id: "self-harm",
      crisis: true,
      title: "You don't have to carry this alone",
      message:
        "It sounds like you might be going through something really hard. In the US you can call or text 988 to reach the Suicide & Crisis Lifeline any time. If you're in immediate danger, call 911.",
    };
  }

  const pelvic = e.regions.some((r) => PELVIC_REGIONS.includes(r));
  const reasons: string[] = [];

  if (e.onsetStyle === "Suddenly and severe") reasons.push("sudden, severe pain");
  if (e.severity !== null && e.severity >= 8) reasons.push("pain rated 8 or higher");
  if (pelvic && (e.pregnancy === "yes" || e.pregnancy === "unsure"))
    reasons.push("lower belly or pelvic pain when you might be pregnant");
  if (e.otherSymptoms.some((s) => s.startsWith("Very heavy bleeding"))) reasons.push("very heavy bleeding");
  if (e.otherSymptoms.includes("Fainting or nearly fainting")) reasons.push("fainting or nearly fainting");
  if (e.otherSymptoms.includes("Fever") && e.regions.some((r) => r.startsWith("upper") || r.startsWith("lower") || r === "pelvis"))
    reasons.push("fever with belly pain");
  if (e.regions.includes("chest") || e.otherSymptoms.includes("Chest pain or trouble breathing"))
    reasons.push("chest pain or trouble breathing");

  if (reasons.length === 0) return null;
  return {
    id: reasons.join("|"),
    title: "This may need care now",
    message: `You mentioned ${reasons.join(", ")}. That can need prompt medical attention. If it feels like an emergency, call 911. Otherwise, please contact urgent care or your clinician today rather than waiting for your appointment.`,
  };
}
