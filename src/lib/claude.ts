// Server-only helper for Claude calls. Never import this from a client component:
// it reads ANTHROPIC_API_KEY, which must stay on the server.
import "server-only";
import Anthropic from "@anthropic-ai/sdk";

export const MODEL = "claude-sonnet-5-5";

// Shared rules for every Felt prompt (PRD section 9).
export const SHARED_RULES = `You are helping a woman prepare to describe a non-emergency bodily feeling at her next medical appointment.
Rules you must always follow:
- Never diagnose. Never name, hint at or list possible conditions, diseases or causes.
- Never suggest treatments, medicines, tests or scans.
- Never lead her. Never add symptoms she has not mentioned, and never imply she should have them.
- Her words are hers: do not reword, correct or judge them.
- Use plain, warm language at about a 6th-grade reading level. Short sentences.`;

let client: Anthropic | null = null;
function getClient(): Anthropic {
  if (!process.env.ANTHROPIC_API_KEY) throw new Error("ANTHROPIC_API_KEY is not set");
  // Short timeout and one retry: these calls sit inside a 10-minute flow.
  client ??= new Anthropic({ timeout: 15_000, maxRetries: 1 });
  return client;
}

/**
 * One Claude call whose reply is guaranteed to match `schema` (structured outputs).
 * Note: claude-sonnet-5-5 rejects forced tool_choice ("any"/"tool") with a 400,
 * so structured outputs is how we get the same "always valid JSON" guarantee.
 * Throws on any failure; callers decide the fallback.
 */
export async function askJSON<T>(opts: {
  system: string;
  user: string;
  schema: Record<string, unknown>;
  maxTokens?: number;
}): Promise<T> {
  const res = await getClient().messages.create({
    model: MODEL,
    max_tokens: opts.maxTokens ?? 2000,
    system: opts.system,
    messages: [{ role: "user", content: opts.user }],
    // Low effort: short, well-scoped tasks where speed matters more than depth.
    output_config: { effort: "low", format: { type: "json_schema", schema: opts.schema } },
  });

  if (res.stop_reason === "refusal") throw new Error("Claude declined the request");
  if (res.stop_reason === "max_tokens") throw new Error("Claude reply was cut off");
  const text = res.content.find((b) => b.type === "text");
  if (!text || text.type !== "text") throw new Error("No text in Claude reply");
  return JSON.parse(text.text) as T;
}

/** Trim and cap free text before it goes to the API. */
export function clean(s: unknown, max = 600): string {
  return typeof s === "string" ? s.trim().slice(0, max) : "";
}
