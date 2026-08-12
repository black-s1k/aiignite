<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

# AI Ignite — the heat build

Fourth build, started 2026-08-11. The previous one is gone from the
working tree at the client's request but is preserved on GitHub twice:
the `demo-waving-dots` branch, and the **`press-build-v3` tag** — tagged
specifically because it lived only on that branch and would not have
survived the branch being deleted. `../2` is the one before that.

## The brief

Ordinary content, extraordinary design. The copy answers, plainly and in
order, the five questions a student actually has: what is this, is it for
me, what will I make, when is it, how do I join. Nothing is written to be
clever. **All of the ambition is in the design, none of it in the copy** —
if you find yourself making the words cute, you have misread the brief.

## The idea

The club is called Ignite, so heat is the mechanism rather than a
metaphor. Things that get hot **swell**, and a variable font can do
exactly that — so the display type carries the idea in its own
letterforms instead of in an effect layered over them.

`components/HeatLine.tsx` drives the `wght` and `wdth` axes of every
character from its distance to a heat source. Nothing glows. Nothing
gradients. That restraint is the design.

Two sources, added:

- **Ambient** — three waves at unrelated speeds, so the pattern never
  resolves into a loop a reader can count.
- **The pointer** — you are a heat source; moving across the words heats
  the letters you pass. Squared falloff, because heat is local; a linear
  falloff lights the whole line dimly and reads as a brightness slider.

### Things that will bite you here

- **`axes: ['wdth']` in `layout.tsx` is load-bearing.** `next/font` ships
  the weight axis only by default to keep files small. Drop that option
  and the width axis silently stops responding — the heat still "works"
  but degrades from swelling to bolding, which is the whole difference.
- **The ambient has to carry the effect on its own.** Roughly half this
  audience is on a phone and will never fire a pointer event. An early
  version compressed ambient into 0.12–0.46 of the range and every letter
  came out the same mid weight; the signature effectively did not exist
  on mobile.
- **Spatial frequency matters as much as amplitude.** `u` runs 0..1
  across the line, so the dominant wave needs to be near a full 2π to fit
  a whole hot-and-cool cycle inside the words. At 3.1 the crest spent
  most of its time off the end of the line — measured, weight never got
  past 501 of a possible 900. At 5.6 it reaches 799.
- **Width range is capped at 90–116 on purpose.** Every character is an
  `inline-block`, so a wider range makes each letter shove its
  neighbours along and the line visibly churns. That cap is the most
  swell the line takes while still sitting still.
- **Never put a `transition` on `.heat span`.** It fights the per-frame
  writes and turns a travelling front into mush.
- Character centres are measured once and on resize, never per frame —
  `getBoundingClientRect` per character per frame is a forced layout
  each time and is the one thing that would make this expensive.

## The palette

- `--color-void: #000000` — carried from the previous build at the
  client's direction. Nothing can go under it, so recession is done with
  weight and colour, never with a darker background.
- `--color-flame: #bee449` — measured, not chosen: the median of every
  green pixel in the club's logo. **The one saturated colour on the
  page.** The more places it appears the less any of them mean.
- `--color-bone: #ece9e4` — type. Not `#ffffff`: pure white on black
  halates and closes counters, and the display face runs to 900.
- `--color-ash`, `--color-edge` — secondary text and rules.

**The accent never appears as a glow, a gradient, or a border on a card.
It is ink.** There are no cards on this page and nothing floats;
structure is made of rules and space.

## The type

Archivo for display, chosen for its axes rather than its resting
appearance — an expanded grotesque is also simply less worn than the
condensed poster faces every club site reaches for. Newsreader for body:
a reading serif with an optical-size axis so it stays open at small sizes
on a dark field. **A serif body under a grotesque display is the pairing
doing the most work here** — it is the fastest way to stop this reading
as a product landing page.

## Why the previous build was replaced

It was a near-black page with a single acid accent, which is one of the
three most recognisable generated-design defaults. It had real craft in
it — computed ink maths, a live WebGL halftone press, registration traps
— but craft applied to a generic silhouette still reads as generic.

**The lesson to carry: distinctiveness comes from structure, not
finish.** Do not answer "this feels generic" by adding more effects.

## Where things are

- `components/HeatLine.tsx` — the signature. Read the header comment
  before changing any constant in it.
- `components/Mark.tsx` — the flame, used as a CSS mask rather than an
  `<img>` so its colour comes from the palette and can never drift.
- `lib/content.ts` — every fact the page states, in one place.
- `app/page.tsx` — one asymmetric column that never centres. Everything
  hangs off one left axis; the measure changes per section, so the page
  has a spine but not a template.

## Still to do

- `NEXT_PUBLIC_SIGNUP_URL` is unset, so the sign-up link falls back to
  `#`. It is inlined at build time and must be set before building.
- No favicon — `/favicon.ico` 404s. The flame plate is the obvious
  source.
- Institutional lockups for York and Lassonde are named in the footer as
  text only. Get the one-colour/reversed versions from the brand kits.
- `assets/do_the_second.mp4` is the generated title-sequence clip from
  the previous build, kept only so it is not lost. **Its on-screen type
  is hallucinated** — "AI ZONITE", "FALL 2826" — so it cannot ship
  anywhere near this site without being re-cut before the type appears.
