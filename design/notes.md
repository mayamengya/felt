# Felt: design notes

Read this together with the images in this folder before styling anything.

## The feeling
Calm, warm, handmade, grown-up. Like sitting somewhere soft and safe with someone who listens.
Not childish, not clinical, not a generic wellness app.

## What I love (from my references)
1. **Full-screen felt.** The whole screen should feel like a sheet of felt, not a flat app with felt decorations. Every screen's background is felt, and cards and buttons are smaller felt pieces layered on top, as if cut out and placed on a felt board.
2. **A felt person.** I love that the figure in my references is made of felt. In Felt she should be **a woman**:
   - soft, simple and rounded, like a handmade felt doll
   - warm, natural colouring
   - simple felt hair (for example a bun or a bob)
   - minimal or no facial features
   - respectful and non-sexualised: no exaggerated curves, no stereotypes
3. **Earthy, calming colours with a plum accent.** Natural, muted tones, with plum as the one colour that stands out.

## Palette (starting point; adjust to match my references)
| Role | Colour | Hex |
|---|---|---|
| Background felt | Oatmeal / linen | `#EFE6D8` |
| Raised felt pieces (cards) | Warm cream | `#F8F2E8` |
| Earthy accent 1 | Moss / sage | `#8A9A78` |
| Earthy accent 2 | Clay / terracotta | `#C98B6B` |
| Earthy accent 3 | Sand / ochre | `#D9B77E` |
| Grounding neutral | Warm brown | `#7A5C48` |
| **Primary accent** | **Plum** | `#6B2D5C` |
| Text | Deep ink | `#2E2430` |
| Quiet text | Muted plum-grey | `#5E5262` |

Rules:
- Plum is the only "loud" colour. Use it for the main buttons, selected states and the *She chose* tag.
- Use moss for anything that is *her words*: the "It feels like…" box and the *Her words* tag.
- Text sits on flat areas with at least 4.5:1 contrast. Body text is never on top of the texture.

## How to make it feel like felt (implementation hints)
- **Texture:** a full-screen fibre layer, inline SVG `feTurbulence` (fractal noise) blended at low opacity over the background colour. It should be visible but subtle, and sit on every screen.
- **Felt pieces:** large corner radii (20–28px), slightly uneven shapes where possible, and a solid offset shadow in a darker shade (`box-shadow: 0 3px 0 <darker>`) so pieces look thick and layered.
- **Stitching:** dashed outlines set inside the edge (`outline: 2px dashed; outline-offset: -8px`) on cards, the brief and the main buttons.
- **Selected states:** look like a felt patch sewn on. Fill with plum or a plum tint, show the stitch outline, and add a slight lift.
- **Motion:** soft and slow (200–350ms). New brief lines "stitch in" with a gentle fade-up.

## The body map
- The woman figure **is** the body map: a front view, made of felt pieces.
- Each tappable region is its own felt piece, with a seam between pieces.
- A selected region becomes a plum felt patch with stitching.
- Her right is on the viewer's left. Label "Your right" and "Your left" underneath.
- Region labels stay anatomical (for example "Lower abdomen, left"), as the PRD requires.

## Where the felt woman appears
- **Welcome screen:** large, as the hero image, maybe holding a small felt heart.
- **Body map:** as the interactive figure.
- **Loading moments:** small. For example, when finding words or asking follow-up questions.
- **Never on the red-flag or care-now screen.** That screen stays plain, calm and serious.

## Typography
- Headings and her quoted words: **Fraunces** (serif, italic for her words).
- Body text and interface: **Inter**.
- Generous spacing and large tap targets (at least 44px). Phone-first, 390px wide.

## My reference images
(One line per image: what I like about it.)
- `image1.png`:
- `image2.png`:
- `image3.png`:
