<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

# AI Ignite — the heat build

Fourth build, started 2026-08-11, and now the only one in the working
tree — it lives in `final/`, which IS the site. The earlier builds were
deleted on 2026-08-13 at the client's request and are not gone: every one
of them is reachable in git history, and the third is tagged
**`press-build-v3`** as well, tagged specifically because it lived only on
a branch and would not have survived that branch being deleted. To read
one, check out the commit before the deletion — do not go looking for
`../2` or a root-level `app/`, which is where they used to be.

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

`lib/heat.ts` is a real (if small) **diffusion simulation** over the
viewport, and `components/HeatField.tsx` runs it and drives everything
from it. Heat you add SPREADS, COOLS, and RISES — so touching the page
leaves a warm trail that drifts upward and fades, rather than a
highlight that switches off the instant the pointer moves. **That
persistence is what makes it read as a material rather than a hover
state**, and it is the reason this is a simulation and not a set of
transitions.

Elements opt in declaratively with `data-heat="type|rule|label|mark"`
and one loop drives them all. Type swells (weight AND width), rules warm
toward the flame, labels ignite, the mark flares. Nothing glows and
nothing gradients.

Heat comes from things the reader actually does: the **pointer**, the
**scroll** (movement is friction is heat — and it is the only source a
touch device reliably produces), and a deliberate **tap**, which is
hotter than a passing move so that tapping feels like striking a match.

### Things that will bite you here

- **Heat is AMBIENT PLUS FIELD, and the ambient half is not optional.**
  The simulation decays to nothing within a couple of seconds of the
  last touch — correct for a diffusion model and fatal for a page,
  because a reader who arrives and does not move the mouse gets dead
  type. The ambient is a standing wave computed straight from position
  and time, so it cannot decay. Measured before the fix: idle weight sat
  at 207–213 out of a possible 900.
- **Inject along the pointer's path, not at its current point.** A fast
  pointer generates far fewer events than frames, so point injection
  leaves a dotted trail with cold gaps. Measured before the fix: a fast
  drag across the headline moved the weight by 32 out of 700.
- **READ ALL RECTS, THEN WRITE ALL STYLES.** Interleaving makes the
  browser flush layout once per element instead of once per frame. This
  is the single thing that decides whether the field is free or is the
  most expensive thing on the page.
- **`axes: ['wdth']` in `layout.tsx` is load-bearing.** `next/font` ships
  the weight axis only by default. Drop it and the heat silently
  degrades from swelling to bolding, which is the whole difference.
- **Width range is capped at 90–116 on purpose.** Every character is an
  `inline-block`, so a wider range makes each letter shove its
  neighbours and the line visibly churns.
- **`dt` is clamped.** A backgrounded tab returning with a two-second
  step would blow the diffusion up rather than fast-forward it.
- **Never put a `transition` on `.heat span`.** It fights the per-frame
  writes and turns a travelling front into mush.
- **Words must be wrapped, not just characters.** Characters have to be
  `inline-block` for the width axis to move them, and an inline-block is
  a break opportunity — so a plain per-character split lets the browser
  wrap MID-WORD. It rendered "What actually happe / ns". Each word is its
  own `nowrap` wrapper now.
- **The space goes BETWEEN those wrappers, never inside one.** An
  inline-block trims its own trailing whitespace, so a space placed
  within a word silently disappears and the words run together — it
  rendered "Whatactually happens".

Verified behaviour, weight out of 900: idle 270–606 (alive untouched),
after a drag 275–704, 1.2s later 278–433 (cooling), after a tap
286–900.

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

## What this page owes to industrynightinitiative.ca

The client offered that site as a quality reference — explicitly for how
completely it explains itself, NOT for its look. Taken: a persistent nav
with a CTA, logistics in the first screen, the audience named out loud
rather than implied, a description of what actually happens, and a FAQ.
The page previously had no navigation at all and roughly five sections
that stated facts and stopped.

**Deliberately not taken:** its cream stock, navy palette, Playfair
display serif, diagonal split hero and skyline illustration. That is its
identity, and borrowing it would make this a knock-off of a sibling
club's site at the same faculty — the one place a resemblance would
actually be noticed.

One thing it does that this page CANNOT: it earns trust with three years
of history and a row of partner logos. This club launches in September
2026 and has none of that. `lib/content.ts` therefore has a hard rule —
nothing claimed that is not true — and the credibility gap is filled
with what is real instead: who backs it, who runs it, and a minute-by
-minute description of a session.

## Why the previous build was replaced

It was a near-black page with a single acid accent, which is one of the
three most recognisable generated-design defaults. It had real craft in
it — computed ink maths, a live WebGL halftone press, registration traps
— but craft applied to a generic silhouette still reads as generic.

**The lesson to carry: distinctiveness comes from structure, not
finish.** Do not answer "this feels generic" by adding more effects.

## Where things are

- `lib/heat.ts` — the simulation. Framework-free on purpose: a grid of
  numbers with a step function, so it is testable alone and its
  per-frame cost is obvious.
- `components/HeatField.tsx` — the one loop. Read its header before
  changing any constant in it.
- `components/HeatText.tsx` — splits a line into per-character spans for
  the field to drive. Holds no state and runs no loop; adding another
  heated headline costs nothing but characters.
- `components/Mark.tsx` — the flame, used as a CSS mask rather than an
  `<img>` so its colour comes from the palette and can never drift.
- `lib/content.ts` — every fact the site states, in one place, including
  the two track curriculums. Read the header before adding to it: the
  no-unearned-claims rule is why sponsors are not named.
- `lib/signup.ts` — where the CTA points and what the microcopy promises,
  decided together so they cannot disagree.
- `app/spark` and `app/forge` — the two track pages. The landing page
  carries the CHOICE between tracks; these carry the syllabus. Ten
  sessions, two tool stacks and two formats would bury the five facts a
  first-time reader came for.
- `components/PipelineRail.tsx` — the Forge track's structure made
  visible. It observes `[data-workshop]` on the workshop list and lights
  a layer per workshop as you read past it. NOT a reveal animation: it
  is a position indicator that happens to be the diagram of the thing
  being described.
- `app/page.tsx` — one asymmetric column that never centres. Everything
  hangs off one left axis; the measure changes per section, so the page
  has a spine but not a template.

## The slop audit

Checked against a 20-point list of generated-site tells on 2026-08-16.
The ones that cost real work, so they do not get undone by accident:

- **The sign-up button must always go somewhere.** See `lib/signup.ts`.
  A dead `href="#"` under microcopy promising a form is the single most
  recognisable tell there is, because it proves nobody ever used the
  page.
- **`app/privacy` and `app/terms` are written from what the code does**,
  not from a template. The site sets no cookies, stores nothing, runs no
  analytics and makes no third-party request, and the privacy page says
  exactly that. Add any of those things and both pages become false
  statements rather than missing ones.
- **No em dashes in user-visible copy.** `lib/content.ts` and
  `app/page.tsx` were rewritten to restructure the sentences rather than
  swap the character. Code comments still use them; they do not ship.
- No emoji, no gradients, no stock photography, no invented numbers, no
  testimonials, no scroll-triggered reveals, no builder badge. Each of
  those is a choice, not an oversight.

## Still to do

- `NEXT_PUBLIC_SIGNUP_URL` is still unset, but the sign-up button is no
  longer broken by that: `lib/signup.ts` falls back to a prefilled
  mailto and derives the microcopy from the same branch, so the button
  and the line under it can never disagree. Set the env var and rebuild
  once the form exists; it is inlined at build time.
- Institutional lockups for York and Lassonde are named in the footer as
  text only. Get the one-colour/reversed versions from the brand kits.
- `assets/do_the_second.mp4` is the generated title-sequence clip from
  the previous build, kept only so it is not lost. **Its on-screen type
  is hallucinated** — "AI ZONITE", "FALL 2826" — so it cannot ship
  anywhere near this site without being re-cut before the type appears.
