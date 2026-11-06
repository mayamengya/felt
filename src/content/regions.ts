import type { RegionId } from "@/lib/types";

export interface RegionInfo {
  id: RegionId;
  label: string;
  inside: string; // plain-language anatomy, no conditions
}

// Hand-written, anatomy only. Verify against MedlinePlus before demo.
export const REGIONS: Record<RegionId, RegionInfo> = {
  head: {
    id: "head",
    label: "Head",
    inside: "Your skull protects the brain. Around it are the sinuses, jaw joints, eyes, ears and the muscles of your scalp and neck.",
  },
  chest: {
    id: "chest",
    label: "Chest",
    inside: "Your ribs surround the heart and lungs. The breasts, chest muscles and the food pipe (esophagus) are here too.",
  },
  "upper-right": {
    id: "upper-right",
    label: "Upper abdomen, right",
    inside: "The liver sits mostly on your right side, under the ribs, with the gallbladder tucked beneath it. Part of the large intestine passes by.",
  },
  "upper-center": {
    id: "upper-center",
    label: "Upper abdomen, center",
    inside: "Just under the breastbone is the stomach, with the pancreas behind it and the start of the small intestine.",
  },
  "upper-left": {
    id: "upper-left",
    label: "Upper abdomen, left",
    inside: "Most of the stomach is on your left side, with the spleen behind it, under your lower ribs. Part of the large intestine passes by.",
  },
  "lower-right": {
    id: "lower-right",
    label: "Lower abdomen, right",
    inside: "The appendix and the start of the large intestine are here. In people with a uterus, the right ovary and fallopian tube are here too.",
  },
  "lower-center": {
    id: "lower-center",
    label: "Lower abdomen, center",
    inside: "The bladder sits low in the middle. In people with a uterus, the uterus sits just behind it. Loops of small intestine fill the space above.",
  },
  "lower-left": {
    id: "lower-left",
    label: "Lower abdomen, left",
    inside: "Part of the large intestine (colon) runs down this side. In people with a uterus, the left ovary and fallopian tube are here. The tube carrying urine from the left kidney passes nearby.",
  },
  pelvis: {
    id: "pelvis",
    label: "Pelvis",
    inside: "The bowl of bone at the base of your torso. It holds the bladder, rectum and reproductive organs, supported by the pelvic floor muscles.",
  },
  "arm-right": {
    id: "arm-right",
    label: "Right arm",
    inside: "Muscles, tendons, joints (shoulder, elbow, wrist), nerves and blood vessels.",
  },
  "arm-left": {
    id: "arm-left",
    label: "Left arm",
    inside: "Muscles, tendons, joints (shoulder, elbow, wrist), nerves and blood vessels.",
  },
  "leg-right": {
    id: "leg-right",
    label: "Right leg",
    inside: "Muscles, joints (hip, knee, ankle), nerves and the large veins and arteries of the leg.",
  },
  "leg-left": {
    id: "leg-left",
    label: "Left leg",
    inside: "Muscles, joints (hip, knee, ankle), nerves and the large veins and arteries of the leg.",
  },
  "lower-back": {
    id: "lower-back",
    label: "Lower back",
    inside: "The lower spine, its discs and the strong muscles around it. The kidneys sit higher up, just under the back ribs.",
  },
  general: {
    id: "general",
    label: "Whole body / hard to place",
    inside: "Some feelings, like tiredness or aching all over, don't belong to one spot. That's useful to say too.",
  },
};

export const REGION_NOTE =
  "Many different things can cause discomfort in the same spot. Where it is helps your clinician, but it doesn't tell you the cause.";

export const PELVIC_REGIONS: RegionId[] = ["lower-right", "lower-center", "lower-left", "pelvis"];
