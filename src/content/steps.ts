// Options and "why a clinician asks" lines for the OLDCARTS steps. Hand-written.

export const WHY = {
  ownWords: "Your first description, in your own words, is often the most useful thing a clinician hears.",
  where: "Location helps a clinician think about which parts of the body are involved.",
  feel: "The quality of a sensation (squeezing, sharp, burning) gives clues that a pain number can't.",
  onset: "A new symptom and a long-running one are looked at differently. How it started matters too.",
  pattern: "Whether it's constant or comes and goes helps narrow down what's happening.",
  severity: "A number lets you and your clinician compare over time and between visits.",
  betterWorse: "Triggers like food, movement or your cycle can point to which body system is involved.",
  timing: "Some symptoms follow meals, time of day, or hormonal changes across the cycle.",
  other: "Symptoms that show up together can change what a clinician looks for first.",
  impact: "How much this costs you in daily life helps decide how urgently to look into it. People often leave it out.",
  followUps: "These are based on your answers so far, to fill gaps a clinician would likely ask about.",
};

export const ONSET = ["Today", "A few days ago", "1–2 weeks ago", "About a month ago", "Several months or more"];
export const ONSET_STYLE = ["Gradually", "Suddenly, but mild", "Suddenly and severe"];
export const PATTERN = ["Constant", "Comes and goes", "Mostly constant, with flare-ups"];
export const EPISODE = ["Seconds", "Minutes", "A few hours", "Most of the day", "Not sure"];

export const BETTER = ["Rest", "Lying down", "Heat", "Moving around", "Eating", "Going to the bathroom", "Pain medicine", "Nothing helps"];
export const WORSE = ["Moving", "Eating", "Sitting long", "Exercise", "Sex", "Going to the bathroom", "Stress", "Around my period"];

export const TIMING = ["Around my period", "Mid-cycle", "After eating", "Mornings", "At night", "No pattern I've noticed"];
export const OTHER = [
  "Nausea",
  "Bloating",
  "Changes in bowel habits",
  "Pain when peeing",
  "Unusual discharge",
  "Spotting between periods",
  "Very heavy bleeding (soaking a pad or tampon every hour)",
  "Fever",
  "Fainting or nearly fainting",
  "Chest pain or trouble breathing",
  "Tiredness",
];

export const IMPACT = [
  "Missed work or school",
  "Trouble sleeping",
  "Stopped exercising",
  "Cancelled plans",
  "Hard to concentrate",
  "Affects intimacy",
  "Worrying about it a lot",
];

export const QUESTIONS_TO_ASK = [
  "What else could this be, and what would help rule those things out?",
  "Is there anything I should track before my next visit?",
  "What signs mean I should come back sooner or go to urgent care?",
];

export const UNHEARD_PHRASES = [
  "Could you note in my chart that I reported this today?",
  "What else could this be, and what would help rule it out?",
  "If this doesn't improve, what should I do next, and when?",
  "This is affecting my work and sleep. I'd like to understand the next step.",
  "Could I be referred to someone who specializes in this?",
];
