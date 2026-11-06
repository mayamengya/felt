// POST /api/simile
// Her comparison ("It feels like a fist slowly clenching") -> sensation words that share its image.
// Body: { simile: string, ownWords?: string }
// Returns: { matches: [{ sensationId, reason }] }   (0–3 matches; ids are always from SENSATIONS)
// Claude only suggests. She decides in the UI, and nothing here is pre-selected.
import { NextResponse } from "next/server";
import { SENSATIONS, SENSATION_BY_ID } from "@/content/sensations";
import { askJSON, clean, SHARED_RULES } from "@/lib/claude";

const IDS = SENSATIONS.map((s) => s.id);

const SCHEMA = {
  type: "object",
  properties: {
    matches: {
      type: "array",
      items: {
        type: "object",
        properties: {
          sensationId: { type: "string", enum: IDS },
          reason: { type: "string" },
        },
        required: ["sensationId", "reason"],
        additionalProperties: false,
      },
    },
  },
  required: ["matches"],
  additionalProperties: false,
};

const VOCAB = SENSATIONS.map(
  (s) => `- ${s.id}: "${s.word}" (image family: ${s.family}). ${s.meaning}`,
).join("\n");

const SYSTEM = `${SHARED_RULES}

Your task: she has written her own comparison for a sensation ("It feels like ..."). Pain comparisons draw on concrete images such as sharp objects, pressure, heat, squeezing or movement (Semino, 2010). Pick the words from this vocabulary whose image is closest to hers:
${VOCAB}

- Return 1 to 3 matches, best first. Return fewer if only one or two truly share her image. Return an empty list if none do: she can say "None of these fit".
- Use only the ids above.
- For each match, write one short sentence ("reason") linking her image to the word, e.g. "A fist clenching and letting go tightens and then eases, like cramping." Speak to her as "you". No medical claims.`;

interface Match {
  sensationId: string;
  reason: string;
}

export async function POST(req: Request) {
  const body = await req.json().catch(() => ({}));
  const simile = clean(body?.simile, 300);
  if (!simile) return NextResponse.json({ error: "simile is required" }, { status: 400 });
  const ownWords = clean(body?.ownWords, 600);

  const user = [
    `Her comparison: "It feels like ${simile.replace(/^it feels like\s*/i, "")}"`,
    ownWords && `Her own description, for context only: "${ownWords}"`,
  ]
    .filter(Boolean)
    .join("\n");

  try {
    const out = await askJSON<{ matches: Match[] }>({ system: SYSTEM, user, schema: SCHEMA });
    // Belt and braces: keep known ids only, drop duplicates, cap at 3.
    const seen = new Set<string>();
    const matches = out.matches
      .filter((m) => SENSATION_BY_ID[m.sensationId] && !seen.has(m.sensationId) && seen.add(m.sensationId))
      .slice(0, 3)
      .map((m) => ({ sensationId: m.sensationId, reason: clean(m.reason, 240) }));
    return NextResponse.json({ matches });
  } catch (err) {
    // Never log her words; just the failure.
    console.error("[simile] Claude call failed:", (err as Error).message);
    // The word cards still work without this, so fail soft.
    return NextResponse.json({ matches: [], error: "unavailable" }, { status: 503 });
  }
}
