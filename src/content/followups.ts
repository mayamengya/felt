// Static fallback follow-ups, used when the Claude call fails or times out.
// Hand-written, neutral, never leading. Same shape as the Claude output.
import type { FollowUpQuestion } from "@/lib/types";

export const FALLBACK_FOLLOWUPS: FollowUpQuestion[] = [
  {
    id: "fallback-change",
    text: "Has it changed since it first started?",
    whyAsk: "Whether something is getting better, worse or staying the same helps a clinician decide what to look at first.",
    options: ["Getting worse", "About the same", "Getting better", "It changes a lot", "Not sure"],
  },
  {
    id: "fallback-before",
    text: "Have you felt anything like this before?",
    whyAsk: "A first-time feeling and one that comes back are looked at differently.",
    options: ["No, this is new", "Yes, once or twice", "Yes, it comes back often", "Not sure"],
  },
  {
    id: "fallback-tried",
    text: "Have you tried anything for it so far?",
    whyAsk: "Knowing what you've already tried, and how it went, saves time in the appointment.",
    options: ["Nothing yet", "Rest", "Heat", "Pain medicine", "Changed what I eat", "Something else"],
  },
];
