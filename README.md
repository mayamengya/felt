# felt

**from felt to said**

felt is a phone-first web app that helps women turn a bodily feeling that's hard to describe into a clear, one-page brief for their next medical appointment, in their own words, in about ten minutes.

Built solo for the **Code with Claude: Women in AI Hackathon** (San Francisco, November 6, 2026).

**Demo video:** [ADD LINK]

<!-- Screenshots: add 2–3 here (welcome, "It feels like…", final brief) -->

---

## The problem

> *"English, which can express the thoughts of Hamlet and the tragedy of Lear, has no words for the shiver and the headache."*
> Virginia Woolf, *On Being Ill* (1926)

There's no blood test for pain. It travels only through words. And when women use those words, they are often not believed.

- **Women's pain is under-treated.** A 2024 study of emergency departments in the US and Israel (21,851 discharge notes) found that female patients were less likely than male patients to be prescribed pain relief at every pain score and every age. Nurses were 10% less likely to record their pain score, and women stayed about 30 minutes longer. *(Guzikevits et al., PNAS, 2024)*
- **Medicine was built around men.** Only in 1993 did US law require women to be included in NIH-funded clinical research. *(NIH Revitalization Act of 1993)*
- **Language barriers make it worse.** In one study of six US hospitals, 49% of adverse events among patients with limited English involved physical harm, compared with 30% for English speakers, and they were more often caused by communication failures. *(Divi et al., 2007)*

So women walk into stressful, ten-minute appointments with symptoms that are hard to describe, in a system that wasn't designed to hear them.

## The insight

When people describe pain, they don't reach for medical terms. They reach for comparisons, the way poets do: "like barbed wire", "like a fist clenching". Pain-language research shows this isn't vague. It's precise. Metaphors drawn from physical causes (sharp objects, pressure, heat, movement) help the listener partly feel what's being described. *(Semino, 2010; Munday et al.)*

felt starts from *her* image and builds the bridge to the language a clinician uses.

## How it works

1. **In your own words.** She describes what's going on. Her sentence leads the brief, word for word.
2. **Where.** She taps a felt body map. A short card explains the anatomy of that area, never what might be wrong.
3. **What it feels like.** This is the core of the product.
   - **"It feels like…"**: she writes her own comparison, such as *"a fist slowly clenching and letting go"*. Claude suggests words that share her image, such as *cramping*, and explains why. She decides.
   - **Grounded word cards**: each word has three layers: the word, a plain meaning, and "You may have felt this…", an everyday anchor such as *"like a stubbed toe a minute later"*.
4. **Details.** The questions cover OLDCARTS, a framework many clinicians learn for taking a patient's history. Each question explains *why a clinician asks it*.
5. **Your life.** How it's affecting work, sleep and plans: the detail that makes clinicians take notice, and that people often leave out.
6. **Follow-ups.** Claude asks 2–3 questions about what's still missing.
7. **The brief.** One editable page. Every line is tagged with its source:
   - **Her words**
   - **She chose**
   - **Background info**

   It also includes questions to ask, and "If you feel unheard" phrases such as *"Could you note in my chart that I reported this today?"*

## What makes it different

| | felt | Typical health AI |
|---|---|---|
| Goal | Help her **say** what she feels | Tell her what it **might be** |
| Starting point | Her own words and images | A symptom checklist |
| AI's role | Suggests; she decides | Decides or diagnoses |
| Output | Her brief, with every line's source shown | AI-written summary |
| Data | Nothing stored | Accounts and history |

## Why AI

A word list can't understand "a fist clenching". Claude can read the image inside her words and connect it to clinical vocabulary, **without adding anything she didn't say**. It also notices gaps in her history and asks about them.

AI is used for exactly two things:
- **`/api/simile`**: maps her comparison to sensation words that share its image.
- **`/api/followups`**: generates 2–3 neutral follow-up questions.

Both use forced tool use for structured JSON, are limited to fixed vocabularies where possible, and are instructed never to diagnose or lead. The brief itself is assembled **in code** from her answers, so the AI cannot invent facts.

## Safety and privacy

- **Never diagnoses.** It never names conditions or causes and never suggests treatments or tests. Education covers anatomy, word meanings and why a clinician asks something.
- **Hard-coded red flags, not AI.** Rules in `src/lib/redFlags.ts` trigger a calm "get care now" screen (911 or urgent care) for:
  - sudden severe pain, or severity 8 or higher
  - possible pregnancy with pelvic pain
  - very heavy bleeding
  - fainting
  - fever with belly pain
  - chest pain

  Self-harm language shows the 988 crisis line.
- **Never puts words in her mouth.** Nothing is pre-selected, "None of these fit" is always offered, and her original words are always shown.
- **Her data stays hers.** At a time when health data, especially reproductive health data, can be collected, sold or used against you, felt keeps nothing:
  - no account
  - no database
  - no analytics

  Answers are sent to Claude only in the moment, to suggest words and questions. Close the page and it's gone.
- **Inclusive.** Body-map labels describe anatomy, not gender. Reproductive questions appear only when relevant and can be skipped.
- **Synthetic data only.** The demo persona ("Priya, 29") is fictional.

## Design

felt leans into its name. The interface looks like felt: a soft fibre texture, cut-felt pieces, stitched seams and a felt figure, in earthy colours with plum as the accent. It's warm and handmade, but grown-up, because this is a serious moment in someone's life.

## Run it locally

Requires **Node 20+** and an Anthropic API key.

```bash
git clone https://github.com/mayamengya/felt.git
cd felt
npm install
cp .env.example .env.local   # then add ANTHROPIC_API_KEY=...
npm run dev
```

Open http://localhost:3000. The app is designed for phone width, so use your browser's device mode or open it on your phone. Without an API key, follow-up questions fall back to a static set.

## Tech

- Next.js (App Router), TypeScript, Tailwind CSS
- Anthropic SDK, using `claude-sonnet-5-5` with forced tool use
- `src/lib/brief.ts`: builds the brief deterministically, tagging every line with its source
- `src/lib/redFlags.ts`: urgent-care rules
- `src/content/`: hand-written content (body regions, sensation words, "why a clinician asks")

## What's next

- **Bridging languages.** She describes her feeling in her own language, and the brief comes out in the clinician's language as well, keeping her original words. Feelings are among the hardest things to translate; even the standard pain questionnaire's words don't map cleanly between languages.
- **A shared vocabulary for clinicians.** The same image-based words could be used to teach medical communication from the patient's side.
- **Validation** of the content and word anchors with clinicians and patients.

felt won't fix the healthcare system. But it changes what walks into the room: a woman who understands her body, has words for it, and has her experience on the record.

## Sources

- Woolf, V. (1926). *On Being Ill.*
- Semino, E. (2010). Descriptions of pain, metaphor and embodied simulation. *Metaphor and Symbol*, 25(4), 205–226.
- Munday, I., Newton-John, T., & Kneebone, I. Metaphor use in chronic pain. PMC7496857.
- Semino, E., Liu, Y., & Demmen, J. (2026). Metaphors and identities in online descriptions of the experience of pain.
- Guzikevits, M., et al. (2024). Sex bias in pain management decisions. *PNAS.*
- NIH Office of Research on Women's Health. History of Women's Participation in Clinical Research.
- Divi, C., et al. (2007). Language proficiency and adverse events in US hospitals: a pilot study. *Int J Qual Health Care*, 19(2), 60–67.
- Boyle, G. J., et al. The McGill Pain Questionnaire: linguistic and statistical considerations.

---

*felt is a hackathon prototype and not a medical device. It does not provide medical advice. If you think you may have an emergency, call 911.*