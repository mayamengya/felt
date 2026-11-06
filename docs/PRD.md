# Felt: Product Requirements Document

**Understand your body. Find your words. Be heard.**

Code with Claude: Women in AI Hackathon · Friday, Nov 6, 2026 · Solo build
Deadline **12:45 PM PT** · Code freeze **12:05 PM** · Deliverables: GitHub repo and demo video
Data: synthetic or public only. No real personal or health information.

---

## 1. Summary

Felt is a phone-first web app that helps a woman turn a bodily feeling that's hard to describe into a clear, one-page brief for her next medical appointment, in about 10 minutes.

The name means two things: "felt" as the past tense of *feel*, and felt the soft, handmade material. The visual design leans into the material.

**Positioning:** appointment prep in one sitting. Not a symptom tracker, not a chatbot, not a diagnosis tool.

**Selling difference:** *Others tell you what it might be, or what else to mention. Felt helps you say what you actually feel, in words a clinician can use, and keeps it yours.*

---

## 2. Problem

There's a gap between feeling something and saying it in a way a clinician can act on. People lack the vocabulary, forget details in short appointments, and feel unheard. Women face extra barriers here:
- symptoms dismissed
- gaps in medical research
- little practice describing pain precisely

**Research basis:**
- Because there's no objective test for pain, people rely on language to communicate it, and pain is most often described through metaphor (Munday et al.).
- Semino (2010) shows that pain metaphors draw on concrete causes of damage: sharp objects, pressure, heat, movement. Those images help the listener partly simulate the sensation.
- Some McGill Pain Questionnaire words ("rasping", "lancinating") are hard for patients to understand, so word lists alone fall short.
- Semino et al. (2026) highlight similes ("it feels like…") as a key way people describe pain.

**What the product cannot fix:** dismissal is structural. Felt makes her account precise, documented and harder to dismiss. It doesn't change the clinician.

---

## 3. User

**Core user:** an adult woman with a non-emergency symptom and an appointment in the next few days. She knows something is off but can't describe it beyond "weird" or "it hurts".

**When she uses it:** the evening before her appointment, on her phone, alone, for about 10 minutes.

**Demo persona (synthetic):** "Priya, 29". She has had lower-left abdominal discomfort, on and off, for 2 weeks. She missed one day of work. Her appointment is tomorrow.

**Success:** she walks in with a one-page brief that leads with her concern in her own words, the effect on her life and a precise description. She also has questions to ask and phrases to use if she feels unheard.

---

## 4. What makes it different

1. **Grounded vocabulary.** Each sensation word has three layers: the word, a plain meaning, and "You may have felt this…" (an everyday anchor such as "like a stubbed toe a minute later"). The words are grouped by image family, following Semino's grouping of the McGill words.
2. **"It feels like…".** She writes her own comparison ("like a fist slowly clenching"). Claude suggests which words share her image. She decides. Her comparison goes into the brief word for word.
3. **Provenance.** Every line in the brief is tagged *Her words*, *She chose* or *Background info*. The brief is built in code from her answers, so the AI cannot invent facts.
4. **Clinician structure.** The questions follow OLDCARTS (Onset, Location, Duration, Character, Aggravating/relieving factors, Radiation, Timing, Severity), so the brief arrives in the order a clinician thinks.
5. **Self-advocacy.** The effect on her daily life (which people usually leave out), questions to ask, and "If you feel unheard" phrases.

### Competitors

| Product | What it does | How Felt differs |
|---|---|---|
| ChatGPT Health (OpenAI, 2026) | Connects medical records and wellness apps; helps prepare questions for visits | General-purpose and based on records. It doesn't help you find words for a feeling you can't describe. |
| Previa (iOS, built on Claude) | Pre-visit prep: suggests related symptoms you may have missed and tests to ask about; offers translations | It adds to her story. Felt helps her describe what she actually feels, and keeps it hers. |
| Symptom checkers (Ada, Abby and others) | Diagnosis or triage | Felt deliberately doesn't diagnose. |
| Trackers (Flo, Bearable and others) | Log symptoms over time | Felt is one session aimed at one appointment. |

---

## 5. Core user flow (6 steps, one question per screen)

0. **Welcome.** Tagline, the 10-minute promise, a one-line privacy note, an emergency notice ("If this feels urgent, call 911"), and the felt mascot.
1. **In your own words.** Free text: "What's been going on?" It's saved word for word and leads the brief.
2. **Where.** Tap one or more regions on a front-view body map; her right is on the viewer's left. A short anatomy card explains what's in that area. Also offered: "Lower back" and "Whole body / hard to place".
3. **What it feels like (the hero moment).**
   - **"It feels like…"** box: her own comparison. "Find words that match my image" calls Claude, which suggests 1–3 words with a one-line reason linking her image to each word. She taps to accept.
   - **Word cards:** word, meaning and "You may have felt this…". Nothing is pre-selected. "None of these fit" opens a text box.
4. **Details (one screen):**
   - when it started, and how (gradually / suddenly but mild / suddenly and severe)
   - constant or comes and goes, and how long an episode lasts
   - severity 0–10 with plain-word anchors
   - what makes it better or worse
   - timing (cycle, meals, time of day) and other symptoms
   - "Could you be pregnant?", shown only for pelvic or lower-belly regions, and skippable

   Each question has a one-line "Why a clinician asks this".
5. **Your life.** Work missed, sleep, exercise, plans, concentration, intimacy, worry, plus free text.
6. **A few more questions (Claude).** 2–3 follow-ups that fill gaps in her history, each with tap-to-answer chips plus an optional text box.
7. **Your brief.** Editable sections with source tags, questions to ask, "If you feel unheard" phrases, and print or save as PDF.

**The live brief:** it builds as she answers. On a phone it's a sticky bottom tab ("Your brief · N") that opens a slide-up sheet, and new lines animate in.

**Red-flag check:** runs after every answer. If it triggers, a calm full-screen message appears (see section 7).

---

## 6. MVP scope

### In
| Feature | Approach |
|---|---|
| Body map | Inline SVG, front view only, about 14 regions; the lower abdomen is split into left, center and right, plus the pelvis |
| Guided journal | Fixed steps, each with optional free text. No chat interface. |
| Live brief | Built in code (`buildBrief`) from her answers, not by AI |
| "It feels like…" matching | Claude call: `/api/simile` |
| Follow-up questions | Claude call: `/api/followups`, with a static fallback |
| Education | Hand-written cards: region anatomy, word meanings and anchors, "why a clinician asks" |
| Editable brief | One text field per section, plus print CSS |
| Questions to ask and "If you feel unheard" phrases | Hand-written, static |
| Red-flag check | Rules in code, not a prompt |
| Phone-first layout | 390px target; desktop shows a centred phone-width column |

### Stretch (only if ahead)
- A PWA manifest and icon, so it can be added to the home screen and run full-screen
- Deploying to Vercel, so the demo can run on a real phone

### Out
Accounts, a database, history or tracking, voice, translation, free-form chat, a back-view body map, lists of possible conditions, and a native app (React Native or Expo).

---

## 7. Safety and privacy

**Never:** diagnose, name possible conditions or causes, or suggest treatments or tests. Education covers anatomy, what words mean and why a clinician asks, and nothing more.

**Red-flag rules** (hard-coded in `src/lib/redFlags.ts`):

| Trigger | Response |
|---|---|
| Sudden and severe pain, or severity 8 or higher | "This may need care now": 911, urgent care, or contact her clinician today |
| Pelvic or lower-belly pain with a possible pregnancy (yes or not sure) | Same |
| Very heavy bleeding (soaking a pad or tampon every hour) | Same |
| Fainting or nearly fainting | Same |
| Fever with belly pain | Same |
| Chest pain or trouble breathing | Same |
| Self-harm language in any free text | A support message with 988 (call or text) and 911 |

She can acknowledge the message and continue. The screen is plain and calm, never cute.

**Not putting words in her mouth:**
- Her original quote is always visible and leads the brief.
- No word is ever pre-selected, and "None of these fit" is always offered.
- Claude only suggests; she decides.
- Follow-up questions are neutral, never leading.

**Privacy:**
- No accounts, no database, no analytics, and nothing stored.
- Answers go to the Claude API only to suggest words and questions. The welcome screen says so.
- The API key stays on the server.

**Inclusive wording:** body-map labels describe anatomy, not gender ("in people with a uterus"). Reproductive questions show only when relevant and can be skipped.

**Framing:** "Be heard" means making the appointment work for both sides. The advocacy phrases ask for documentation and next steps; they don't accuse.

---

## 8. Design direction: "felt craft"

- **Texture:** a subtle fibre grain on the background (inline SVG `feTurbulence`, low opacity). Text always sits on flat backgrounds.
- **Stitched edges:** dashed "sewn seam" outlines inset on cards (`outline: dashed` with a negative `outline-offset`).
- **Cut-felt shapes:** chunky rounded pieces with layered shadows (`box-shadow: 0 3px 0 <darker>`).
- **Body map:** felt cut-out pieces; a selected region looks like an added patch.
- **Palette (starting point; refine from `design/inspo/`):** oatmeal `#F3EADF`, plum `#6B2D5C`, sage `#A9C1AE`, dusty rose `#E7B7AE`, mustard `#E6C16A`, ink `#2E2430`.
- **Type:** Fraunces (serif headings and her quoted words, in italics) and Inter (body text).
- **Mascot:** a small felt figure with button eyes and a stitched smile, on the welcome screen only.
- **Tone:** warm and crafted, but grown-up. Not childish. Contrast at least 4.5:1, touch targets at least 44px.
- **Source tags:** sage for *Her words*, plum for *She chose*, grey for *Background info*.

Draft mockups: https://claude.ai/artifact/6uSuhiodUTNGVNeypjmmfg

---

## 9. Technical approach

- **Stack:** Next.js 16 (App Router), TypeScript, Tailwind v4, `@anthropic-ai/sdk`, model `claude-sonnet-5-5`. Fonts via `@fontsource-variable` (Fraunces, Inter).
- **State:** one `Entry` object in React state. The brief is a pure function, `buildBrief(entry)`.
- **Claude call 1, `POST /api/simile`:** her comparison → `{ matches: [{ sensationId, reason }] }`. Forced tool use; ids are limited to the vocabulary list; 1–3 matches.
- **Claude call 2, `POST /api/followups`:** her answers so far → `{ questions: [{ id, text, whyAsk, options[] }] }`, with 2–3 questions. Forced tool use. Falls back to 3 static questions if the call fails or times out.
- **Shared system prompt rules:** never diagnose, never lead, never add symptoms; plain language at about a 6th-grade reading level.
- **Already written (from the starter kit):**
  - `src/content/regions.ts`, `sensations.ts`, `steps.ts`
  - `src/lib/types.ts`, `brief.ts`, `redFlags.ts`
- **To build:**
  - `src/app/page.tsx` (the flow)
  - the API routes
  - `src/components/` (BodyMap, SensationStep, BriefSheet, FinalBrief, UI pieces)
  - the felt styling

**Riskiest parts, done first:** (1) the Claude routes returning valid JSON; (2) the body map looking good on a phone.

---

## 10. Build plan

| By | Checkpoint |
|---|---|
| 10:55 | Scaffold done; `/api/simile` and `/api/followups` working with the key |
| 11:35 | Full flow works end to end with the live brief sheet, even if plain |
| 12:00 | Felt styling, mascot and red-flag screen |
| **12:05** | **Code freeze:** `npm run build`, commit, push |
| 12:05–12:35 | Record the demo video; finish the README |
| 12:45 | Submit |

**If behind, cut in this order:** PWA, mascot, print styling, multi-select on the body map.
**Never cut:** her own words and the source tags, the live brief, the red-flag rules, and at least one working Claude call.

---

## 11. Demo script (about 2.5 minutes)

1. **Hook (15 s).** "Two weeks of pain, a ten-minute appointment, and all she can say is 'my stomach feels weird.'"
2. **Her words (15 s).** Type the quote and watch it appear in the brief.
3. **Body map (20 s).** Tap the lower-left abdomen; the anatomy card appears.
4. **The hero moment (30 s).** Type "a fist slowly clenching and letting go" and tap Find words. Claude suggests *cramping* because it shares her image; she accepts. The brief shows *She chose: cramping* and *Her words: It feels like a fist slowly clenching*.
5. **Details and her life (20 s).** Move quickly through details; pick "Missed work".
6. **Claude follow-ups (20 s).** Two specific questions appear.
7. **Safety (10 s).** Show that "Suddenly and severe" triggers the calm care-now screen.
8. **The brief (25 s).** One page with source tags, questions to ask and "If you feel unheard" phrases.
9. **Close (10 s).** "Felt. Understand your body. Find your words. Be heard."

---

## 12. Sources

- Semino (2010), *Descriptions of pain, metaphor and embodied simulation*, Metaphor and Symbol 25(4)
- Munday et al., *Barbed wire wrapped around my feet: metaphor use in chronic pain*, PMC7496857
- Semino, Liu and Demmen (2026), *Metaphors and identities in online descriptions of the experience of pain*
- Critiques of the McGill Pain Questionnaire descriptors (difficult and ambiguous words)
- Competitor information: Previa App Store listing; ChatGPT Health coverage (2026); Abby Health help centre
