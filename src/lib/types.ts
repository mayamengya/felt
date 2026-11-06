export type RegionId =
  | "head"
  | "chest"
  | "upper-right"
  | "upper-center"
  | "upper-left"
  | "lower-right"
  | "lower-center"
  | "lower-left"
  | "pelvis"
  | "arm-right"
  | "arm-left"
  | "leg-right"
  | "leg-left"
  | "lower-back"
  | "general";

export type Pregnancy = "yes" | "no" | "unsure" | "skip";

export interface FollowUpQuestion {
  id: string;
  text: string;
  whyAsk: string;
  options: string[];
}

export interface Entry {
  ownWords: string;
  regions: RegionId[];
  sensations: string[]; // sensation ids she chose
  simile: string; // "It feels like..." in her words
  sensationOther: string;
  onset: string;
  onsetStyle: string; // gradual / sudden
  pattern: string;
  episodeLength: string;
  severity: number | null;
  better: string[];
  worse: string[];
  timing: string[];
  otherSymptoms: string[];
  pregnancy: Pregnancy | null;
  impact: string[];
  impactOther: string;
  followUps: { question: string; answer: string }[];
}

export const emptyEntry: Entry = {
  ownWords: "",
  regions: [],
  sensations: [],
  simile: "",
  sensationOther: "",
  onset: "",
  onsetStyle: "",
  pattern: "",
  episodeLength: "",
  severity: null,
  better: [],
  worse: [],
  timing: [],
  otherSymptoms: [],
  pregnancy: null,
  impact: [],
  impactOther: "",
  followUps: [],
};

/** Where a line in the brief came from. */
export type Source = "her" | "chose" | "info";
