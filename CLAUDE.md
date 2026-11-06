# Felt: project brief for Claude Code

Read this AND `docs/PRD.md` (the full PRD) before doing anything.

## Context
- Solo build for the Code with Claude: Women in AI Hackathon, Nov 6, 2026.
- **Deadline 12:45 PM PT. Code freeze 12:05 PM.** Deliverables: a GitHub repo and a demo video.
- Only synthetic or public data. Never use real personal or health information.
- The developer is a software engineering graduate (React, TS, Python) and isn't strong at frontend design. Explain big changes briefly and ask before structural changes.

## The product
**Felt**: "Understand your body. Find your words. Be heard."
It helps a woman turn a bodily feeling that's hard to describe into a clear, one-page brief for her next appointment, in about 10 minutes. The name means both "past tense of feel" and the soft craft material, and the visual design leans into the material.

**Core user:** an adult woman with a non-emergency symptom and an appointment in the next few days. She can't describe it beyond "weird" or "it hurts".

**Positioning:** appointment prep in one sitting. Not a symptom tracker, not a chatbot, not a diagnosis tool.

## What makes it different (protect these)
1. **Grounded vocabulary.** Each sensation word has three layers: the word, a plain meaning, and "You may have felt this…" (an everyday anchor). Based on pain-language research: Semino (2010) groups McGill Pain Questionnaire words by the image they draw on (sharp objects, pressure, heat, movement).
2. **"It feels like…".** She writes her own comparison. Claude (`/api/simile`) suggests words that share her image. She decides. Her comparison goes into the brief word for word.
3. **Provenance.** Every line in the brief is tagged *Her words* / *She chose* / *Background info*. The brief is built **in code** (`src/lib/brief.ts`) from her answers, so the AI can't invent facts.
4. **Clinician structure.** The questions follow OLDCARTS (Onset, Location, Duration, Character, Aggravating/relieving, Radiation, Timing, Severity).
5. **Self-advocacy.** Effect on daily life, questions to ask, and "If you feel unheard" phrases.

Competitors: ChatGPT Health (record-based visit prep), Previa (suggests extra symptoms and tests), symptom checkers like Ada (diagnosis or triage). The pitch: *Others tell you what it might be, or what else to mention. Felt helps you say what you actually feel, and keeps it yours.*

## Hard rules: do not break
- Never diagnose, name possible conditions or causes, or suggest treatments or tests. Education covers anatomy, term meanings and "why a clinician asks" only.
- Never pre-select a sensation word. Always offer "None of these fit".
- Red flags stay **hard-coded rules** in `src/lib/redFlags.ts`, not prompts:
  - sudden severe pain, or severity 8 or higher
  - possible pregnancy with pelvic or lower-belly pain
  - very heavy bleeding
  - fainting
  - fever with belly pain
  - chest pain
  - self-harm language (shows 988)
- The red-flag screen stays plain and calm, never cute.
- No accounts, no database, nothing stored. The API key stays server-side.
- Body-map labels describe anatomy, not gender. The pregnancy question shows only for pelvic regions and can be skipped.

## Architecture (TARGET for a fresh build)
This is a fresh build. Already present: `src/content/`, plus `src/lib/types.ts`, `brief.ts` and `redFlags.ts`. Reuse them as-is. Build everything else.
- Next.js 16 (App Router), TypeScript, Tailwind v4, `@anthropic-ai/sdk`, model `claude-sonnet-5-5`.
- `src/app/page.tsx`: the guided flow, plus the live brief (a bottom sheet on mobile).
- `src/app/api/followups/route.ts`: 2–3 follow-up questions (forced tool use, with a static fallback).
- `src/app/api/simile/route.ts`: maps her comparison to sensation ids.
- `src/lib/brief.ts`: deterministic brief with provenance. `src/lib/redFlags.ts`: urgent-care rules.
- `src/content/`: hand-written regions, sensations and step options.
- `src/components/`: BodyMap (front view; her right is the viewer's left), SensationStep, BriefPanel, FinalBrief, ui.
- Fonts: Fraunces (serif headings) and Inter, via `@fontsource-variable` (no Google Fonts fetch at build time).

## Visual direction: "felt craft" (build it in from the start)
References are in `design/inspo/`. Target look:
- a subtle fibre texture on the background (an inline SVG `feTurbulence` layer at low opacity)
- dashed "stitched" borders on cards (`outline: dashed` with a negative `outline-offset`)
- chunky rounded cut-felt shapes with soft layered shadows (`box-shadow: 0 3px 0 <darker>`)
- warm wool palette as a starting point: oatmeal `#F3EADF`, plum `#6B2D5C`, sage `#A9C1AE`, dusty rose `#E7B7AE`, mustard `#E6C16A`, ink `#2E2430`
- a small felt mascot on the welcome screen only (inline SVG, button eyes, stitched smile)
- the body map as felt cut-out pieces, where a selected region looks like an added patch
- text always on flat backgrounds, with 4.5:1 contrast

Draft mockups: https://claude.ai/artifact/6uSuhiodUTNGVNeypjmmfg

## Decided: phone-first (mobile web app / PWA, not native)
- Main target is 390px wide; on desktop, show a centred phone-width column.
- On mobile, the live brief becomes a sticky bottom tab ("Your brief · N") that opens a slide-up sheet. New lines still animate in.
- Touch targets at least 44px.
- If there's time: a PWA manifest, theme colour and apple-touch-icon (the felt mascot), so it can be added to the home screen and run full-screen.
- No React Native or Expo rewrite.
- Design references live in `design/inspo/`. That folder is gitignored, so never commit it.

## Optional flow change
Merge the "When", "How strong" and "Patterns" steps into one "Details" screen (8 steps become 6) to shorten the demo.

## Out of scope
Accounts, history or tracking, voice, translation, a free-form chat, a back-view body map, condition lists.

## Demo (about 2.5 minutes, synthetic persona "Priya, 29")
Lower-left abdominal discomfort, on and off for 2 weeks; she missed a day of work. The video runs:
1. hook
2. her own words
3. the body map and its anatomy card
4. **"It feels like a fist slowly clenching" → cramping**: the hero moment
5. details and effect on her life
6. the Claude follow-ups
7. a brief look at the red flag
8. the final brief with source tags and the "If you feel unheard" phrases
9. the tagline

## Workflow
- Run `npm run dev` and check http://localhost:3000 after each change.
- Commit small and often. Run `npm run build` before the 12:05 freeze.
