// Families follow Semino (2010)'s grouping of McGill Pain Questionnaire words by
// the image they draw on: sharp objects, pressure, heat, movement, etc.
// Each word has three layers: the word, what it means, and an everyday anchor.

export interface Sensation {
  id: string;
  word: string;
  family: string;
  meaning: string;
  feltBefore: string;
}

export const SENSATIONS: Sensation[] = [
  {
    id: "cramping",
    word: "Cramping",
    family: "Squeezing",
    meaning: "Tightens, builds, then eases off.",
    feltBefore: "Like a period cramp, or a calf cramp that grips and slowly lets go.",
  },
  {
    id: "squeezing",
    word: "Squeezing / tight",
    family: "Squeezing",
    meaning: "Held tight, without much let-up.",
    feltBefore: "Like a belt pulled one notch too tight.",
  },
  {
    id: "pressure",
    word: "Pressure / heavy",
    family: "Pressure",
    meaning: "Pushing outward or weighing down.",
    feltBefore: "Like a full bladder you can't empty, or a weight resting on you.",
  },
  {
    id: "dull",
    word: "Dull ache",
    family: "Dull",
    meaning: "Low and steady, hard to pin to one point.",
    feltBefore: "Like the day after a hard workout, or a low headache you notice when it's quiet.",
  },
  {
    id: "sharp",
    word: "Sharp",
    family: "Sharp",
    meaning: "Sudden and precise, at one point.",
    feltBefore: "Like stepping on a Lego, or a paper cut.",
  },
  {
    id: "stabbing",
    word: "Stabbing",
    family: "Sharp",
    meaning: "A sharp jab that pushes in.",
    feltBefore: "Like a sudden poke from a pencil tip, but from the inside.",
  },
  {
    id: "shooting",
    word: "Shooting",
    family: "Moving",
    meaning: "Zips quickly along a line.",
    feltBefore: "Like hitting your funny bone.",
  },
  {
    id: "radiating",
    word: "Spreading / radiating",
    family: "Moving",
    meaning: "Starts in one place, then travels outward.",
    feltBefore: "Like ripples spreading from a stone dropped in water.",
  },
  {
    id: "throbbing",
    word: "Throbbing",
    family: "Rhythm",
    meaning: "Pulses in waves, sometimes with your heartbeat.",
    feltBefore: "Like a stubbed toe a minute later.",
  },
  {
    id: "burning",
    word: "Burning",
    family: "Heat",
    meaning: "Hot or stinging.",
    feltBefore: "Like heartburn, or skin just after touching a hot pan.",
  },
  {
    id: "twisting",
    word: "Twisting",
    family: "Pulling",
    meaning: "Wringing or turning.",
    feltBefore: "Like wringing out a wet towel, but inside you.",
  },
  {
    id: "bloated",
    word: "Bloated / full",
    family: "Pressure",
    meaning: "Swollen or tight from the inside.",
    feltBefore: "Like after a huge holiday meal.",
  },
  {
    id: "tender",
    word: "Tender",
    family: "Touch",
    meaning: "Fine at rest, but hurts when pressed.",
    feltBefore: "Like a bruise, fine until someone pokes it.",
  },
  {
    id: "nagging",
    word: "Nagging",
    family: "Dull",
    meaning: "Always there in the background.",
    feltBefore: "Like a pebble in your shoe you can't stop noticing.",
  },
];

export const SENSATION_BY_ID = Object.fromEntries(SENSATIONS.map((s) => [s.id, s]));
