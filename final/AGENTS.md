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

Elements opt in declaratively with
`data-heat="type|rule|label|mark|draw"` and one loop drives them all.
Type swells (weight AND width), rules warm toward the flame, labels
ignite, the mark flares, and the freehand marks warm AND thicken.
Nothing glows and nothing gradients.

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
  step would blow the diffusion up rather than fast-forward it. So is
  `step`, the accumulated version the budget below writes on — on a
  skipped frame it is a SUM of clamped steps and can exceed the cap the
  clamp exists to enforce.
- **The phone has a frame budget, and it changes only HOW OFTEN.** The
  loop costs the same on every device: 96 `getBoundingClientRect` calls
  and 96 style writes per frame on the landing page, which is free on a
  desktop and is not on a phone. Measured at a 6x CPU throttle, roughly a
  mid-range Android: 45fps at rest with 43 of 136 frames over 32ms.
  Two changes, neither of which touches a value the field writes —
  **(1)** writes are capped at 40fps on a coarse pointer, with the real
  elapsed time carried in an accumulator so the simulation advances by
  exactly as much per second either way; **(2)** the read pass is skipped
  entirely when `scrollY` and the viewport are unchanged, because a rect
  is a function of those two and nothing else here moves under its own
  power. `collect()` and a `resize` listener invalidate that cache — they
  are the only two cases scroll position cannot infer. Same measurement
  after: 60fps at rest, 2 long frames of 180.
- **The device test is POINTER, not width.** A phone in landscape is
  844px wide and has a phone's processor; a narrow window on a laptop has
  a desktop's. Every mobile decision in this codebase that is about the
  DEVICE rather than about the space uses `(pointer: coarse)`.
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

## The mark burns

`components/Mark.tsx` is an inline SVG traced from `public/logo-flame.png`,
not the PNG mask it used to be. The artwork is five disjoint shapes — a
body, three detached tongues, and a rounded core — and the nav's instance
animates four of them continuously, because a fire mark that holds still
is a drawing of a fire. `alive` turns that on; only the nav passes it.

The intro's instance passes `alive` AND `face`. `face` cuts an angry glare
into the core with an SVG `<mask>` — each eye an ellipse with its top
sliced flat and rotated so the brow falls toward the nose. The eyes open on
the ignition and shut on the landing, so what flies across the screen is a
mascot and what arrives in the nav is the logo. The core blob was already
head-shaped; nothing was drawn on top of the mark to achieve this, which is
the rule.

The intro is the drawing, then a mascot clip, then the nav — 4.8s door
to door, and no type at all. The wordmark used to be written out under
the drawing and held to be read; it was removed at the client's
direction, along with the viewport-fitting maths that existed only to
size it. Nothing in `CUE` moved when it went, because every cue is pinned
to a clip rather than to the name.

**`--clip-w` is `min(94vw, 58rem, 109vh)`, and the 94 is the portrait
phone's number.** The clip is 1.76:1, so in portrait its width is the
only thing that can give it any size at all — the height cap is 920px on
a 390x844 screen and never binds, and the aspect ratio is the encode's.
At 86vw the drawing was 335px across and 190px tall in an 844px field of
black: the opening moment of the site, a postage stamp, on the device
most people will see it on first. Nothing else moves — at 1440 the 58rem
cap binds long before 94vw, and in landscape the 109vh cap still binds
first. Verified at 1440x900, 1024x768, 844x390 and 390x844; only the last
changes.

**The skip button is a 48px box, not a 13px word.** The sequence runs on
every load at the client's direction, so leaving it is the affordance the
whole thing rests on, and it was type with no box around it in the corner
a right-handed thumb reaches least well. The padding floors the target at
48px and the insets are pulled back by exactly that padding, so the WORD
lands where it always did.

**Both clips are played at 2.25x rather than cut.** 3.68s of drawing runs
in 1.67s, 4.46s of mascot in 2.04s, and nothing is missing from either.
The masters are in `assets/` (`draw-master-3.68s.mp4`,
`mascot-master.mov`); the files in `public/` are always derived, never
edited. Change the rate and every cue in `CUE` moves with it, plus
`HOMING`, which is measured off the encode rather than assumed.

**The reveal is SEQUENTIAL, not simultaneous.** The clip fades out over
200ms and only then, after a matching 200ms delay, does the stock clear
over 360ms. They used to start together, and the clip's last frame still
carries five or six lit embers behind the parked flame — so the page was
fading up through live animation, which read as an overlay clearing off
something already there rather than as a handover. Change the mascot's
fade and the delay on `.intro[data-phase="land"]` has to move with it.

**The clip's trail is masked out IN THE ENCODE, and that is what lets the
flame reach the corner without stopping first.** The element is what
flies, so anything still painted in it flies too — and the clip's ember
trail reaches ~1000px behind the flame, which slid into the corner with
it. Waiting for the clip to end fixes that but leaves the flame sitting
still mid-screen for a beat, which reads as it stopping in the wrong
place. Neither is acceptable, so the trail is removed from the video: a
circle centred on the flame's own path that SHRINKS across five frames,
baked in with `geq`. Progressive, because cutting it in one step pops.

Measured on the shipped encode: trail reach goes 1007 -> 882 -> 629 ->
458 -> 243 -> 63px while the flame's pixel count stays identical to the
unmasked version, so nothing of the flame was eaten. `CLEAN_FROM` in
Intro.tsx is the moment it is flame-only, and the move starts there —
while the flame is still travelling, so there is no park.

**The old approach, for contrast:** The element
is what flies, so everything painted in it flies too — move it mid-swoop
and the trail of embers slides and shrinks into the corner alongside the
flame, which is very visible and plainly wrong. The clip fixes this itself
if it is allowed to finish: measured on the shipped encode, every lit
pixel on the final frame sits within 0.088 frame-heights of the flame's
own centre, so the trail has burned out in place with the element
standing still. The handler pauses the video and seeks it to `duration`
before transforming, so a slow decode cannot leak an earlier frame that
still has trail in it. Verified: across 46 sampled frames of the move the
playhead is pinned at the clip's duration with `ended === true`.

**The clip is what flies, and that is the whole trick.** Its flame parks
near the top left OF ITS OWN FRAME — but that frame is a fixed-ratio box
centred in the viewport, so its top left sits out in the middle of the
screen, and it moves with every window size. Aiming at a corner from
inside the clip is impossible. So over its last 670ms the whole `<video>`
is scaled and translated until the point its flame rests on maps onto the
nav's mark, solved at run time from the real boxes. Verified within 0.1px
from 390x844 to 2560x1440, including landscape and short viewports.

There is no separate mark flying: the clip's flame arrives at the nav's
position and at the nav's size, and the nav's own mark comes up
underneath it. `EXIT` in Intro.tsx is where the clip parks its flame, as
fractions of the VIDEO frame, measured off the last frame's largest lit
blob so stray embers do not drag the answer. Re-cut the clip and it must
be re-measured.

An earlier version instead flew a copy of the mark from mid-stage. A flame ignited
in the drawing's place at one point, and later a generated clip of a
mascot performed there before flying up into the nav; both were removed
at the client's direction. `assets/flame-master.mp4` is that clip's
source, kept only so it is not lost.

**What the attempt is worth remembering for:** a sequence can only hand
over between two DIFFERENT drawings of the same creature if they match in
position, size AND angle at the instant they swap — and even solved to
zero on all three, the change of shape is still findable. One drawing and
one handover is the version with no seam to hide.

`face` is currently unused — the intro's flame was the only thing that
ever wore it. The prop, the eye geometry and the CSS that opens the eyes
are kept because they are measured against the real artwork and would be
tedious to derive again.

### Things that will bite you here

- **The heat field writes `transform` AND `filter` on the `data-heat="mark"`
  element every frame.** The burn therefore lives on the paths INSIDE the
  `<svg>`, never on the `<svg>` itself. Put a CSS animation on the root and
  the field silently eats it sixty times a second.
- **Never amplify a generated clip's glow.** Lifting gamma to brighten the
  flame pushed the source's soft bloom from invisible into a dark oval
  halo around the character under `screen`. It is crushed to black
  instead - which the house rule wanted anyway, since nothing here glows.
- **The glare's tilt sign is the whole expression.** Brow low at the INNER
  corner is angry; low at the outer corner is sad, and the two are one
  minus sign apart. Verify by measuring the brow's y at each end, not by
  squinting at a thumbnail — it was got backwards twice that way.
- **Nested transforms, one concern each.** Flight / hover / ignition are
  three separate spans, the heat field owns the `<svg>`, and the burn owns
  the paths inside it. Five transforms, five elements, no collisions.
- **`transform-box: fill-box` is load-bearing.** Without it an SVG
  `transform-origin` resolves against the viewBox, and all four moving
  parts swing from the same far corner instead of from their own bases.
- **An `<svg>` clips to its viewport.** The blade tip sits 7 units from the
  top edge and the sway leaves 2.9 of headroom, so `.flame-alive` sets
  `overflow: visible`. Raise an amplitude without it and you lop the tip.
- **A `<mask>` resolves in the user space of the element that references
  it.** Hang it on a transformed ancestor and the eyes slide off the head.
- **These are the only `@keyframes` on the site.** Everything else is a
  transition, because everything else answers something the reader did.
  This does not, which is the point.
- **Re-emit, never hand-edit the path data.** Trace the ANTI-ALIASED alpha
  at level 127.5; tracing a thresholded copy costs half a pixel and follows
  the staircase (342 vertices for the body against 145). Current data is
  tolerance 0.5, soft IoU 0.988, and is verified only up to ~340 device px
  tall — above that, re-emit tighter.

## The page is drawn on

`components/Draw.tsx` carries twenty-eight freehand marks: one over each
section label in the left gutter, one over each of the three logistics
facts, a larger one on each track, fifteen scattered across the hero —
one of them HuggingFace, the single logo that had to be drawn rather than
borrowed, see "The borrowed marks" — and `cloudnet`, the cloud-and-circuit
mark standing over the headline.

**The argument for them is continuity, not decoration.** The intro is a
DRAWING being drawn, and `Mark.tsx` is traced from the real artwork — so
the site opens in a hand and then abandons it, because everything after
the first 4.8 seconds is type, hairline rules and space. These carry that
hand into the page.

**They are drawn here rather than licensed.** The brief pointed at
Streamline's Freehand Duotone set. Those are Pro-tier, so shipping them
needs a paid licence — and more to the point DUOTONE would spend the
flame in a dozen new places, against the palette rule that the accent is
the one saturated colour and means less everywhere it is repeated. These
are strokes only, warmed by the field like every other rule.

**The gutter is where they go because the gutter was already there.**
`GUTTER` reserves a 14rem column that held one 13px label; the marks
spend space the layout had and never used, rather than adding any.

**The hero scatter is fifteen marks across the whole first screen**, each
turned a few degrees off square, and six of them in bone rather than ash
(`.draw-bone`) so the field has a foreground and a background instead of
one even texture fill. Four in the corners reads as a frame; a scatter
reads as a surface the headline is sitting on. Positions are in
`app/page.tsx`, and the rules that keep them off the type are in the
comment above them.

**The phone gets its own layer, not a responsive version of that one.**
The desktop scatter works by horizontal clearance — the empty margins
left and right of a centred headline. At 390px those margins are about
90px and the tagline and paragraph run edge to edge, so there is no
continuous margin to run marks down. What exists instead is three BANDS
where the centred content is narrower than the screen: beside the cloud
mark (~172px of 342), beside the headline, and beside the stacked buttons
(capped at 15rem). Eight marks live there, four a side. The two
compositions share nothing but the marks themselves, which is why they
are two layers rather than one with breakpoints.

This only became possible when the hero body was centred. While it was
left-offset and full-bleed there was nowhere on a phone to put these,
which is why the layer was `lg:` only until then.

**It hangs off a wrapper around the hero's own ink, not off the stage.**
The old argument was that the stage is exactly one screen, so a
percentage of it is a percentage of the screen. That stopped being true
when the section took over the one-screen job below `lg` and started
CENTRING its content: the spare height moves the ink around inside the
box, so a percentage of the box is no longer a percentage of anything the
marks have to clear. There is a plain `relative` wrapper around the whole
hero now and the layer is `absolute inset-0` on that. Above `lg` it is an
ordinary block and the desktop scatter still hangs off the stage.

**Two of the eight are gone below 375px, and that is measured.** The
button cap is a fixed 15rem, so the margin beside it is whatever the
screen has left — 50px at 390 and 20px at 320, which is less than a mark
is wide. At 320x640 they overlapped the "Explore tracks" button by 9px.
The band is not there at that width; widening the cap to make room would
cost the two marks beside the headline instead.

### Things that will bite you here

- **The path data is GENERATED. Do not hand-edit it.** Each mark is
  drafted as clean geometry and then put through a roughening pass that
  displaces it along its own normal with smooth noise. Redraft the clean
  shape and re-run the pass — the same rule as `Mark.tsx`'s trace. The
  pass is `tools/marks/rough.mjs`; `tools/marks/hero-marks.mjs` holds the
  clean geometry for the ten newest hero marks and prints them ready to
  paste. Everything older has no clean source checked in and needs its
  shape written there first.
- **A flat wobble amplitude turns every mark into a POTATO.** A drawn
  line is confident: the proportions stay accurate, the corners stay
  corners, and only the runs between them wander. Amplitude also has to
  scale with the feature, or it is a quarter of a 2-unit pupil's radius
  and invisible on a 60-unit outline.
- **A corner is a SPIKE in turn rate, not a large angle.** Judged
  against a fixed threshold, every sample on a small circle reads as a
  corner, its tangents get collapsed, and the circle comes out a
  heptagon. It is measured against the path's own median curvature.
  Rate only means anything on an EVENLY sampled line, though, and the
  corners have to survive into the output exactly — so the pass finds
  them on a finely subdivided copy and then lays the output samples down
  run by run between them.
- **A hero mark cannot be positioned as a share of the section's
  height.** `pt-[26vh]` scales with the window and the type inside it
  does not, so the 56px gap between the headline and the tagline wanders
  from 58.7% to 62.9% of the section between 1024x860 and 1600x1200 —
  a 40px swing, wider than the gap can absorb. The two marks that cross
  the middle hang off a `relative` wrapper around the `h1` instead.
  Everything in the margins is safe at any percentage because it clears
  the type HORIZONTALLY.
- **`vector-effect: non-scaling-stroke` is load-bearing.** Without it
  `--draw-w` is in user units, so one value is a hairline on a 30px
  logistics mark and a slab on a 158px track drawing, and the set stops
  reading as one hand.
- **The wrapping `<div>` is not decoration.** An `<svg>` holds no text
  and contains no descendant `img`/`svg`, so `ScrollReveal`'s content
  test can never match it. Drop the div and these become the only things
  on the page that do not come up into it.
- **`size` takes a number OR a CSS length.** A number is px and computes
  its own height; a string sets `width` and lets `aspect-ratio` do the
  rest. Everything except `cloudnet` is still px, laid out against those
  numbers.
- **`cloudnet` is sized in `em` against `--text-hero`, and the 3.77 is
  measured.** With the headline frozen it renders at exactly 3.770x its
  own font-size at every width (512.8px at a 136px cap, 409.4px at
  108.6px), so `text-hero` plus `size="3.77em"` makes the mark exactly as
  wide as "AI Ignite" and keeps it there as the type scales. The ratio is
  a property of that STRING, in that FACE, at that WEIGHT — re-measure if
  any of the three changes. It was 3.80 while the line still animated,
  which was really a snapshot of a moving target.
- **`cloudnet` is the one mark not drafted on a 64 box.** It is 128x126,
  because it renders at headline width and the extra room goes into the
  wiring. Its box lives in `BOXES` in `tools/marks/hero-marks.mjs`.
- **It is roughly square, so width and height are the same decision.** At
  headline width it is ~509px tall on a desktop, which puts the tagline
  and both CTAs below the fold on a 940px window. That is inherent to the
  reference art, not a layout bug — the levers are a flatter redraw
  (shorter tentacle drop) or moving it behind the headline.
- **`--text-hero` is the landing headline; `--text-vast` is the track
  pages.** They were one token until the cloud mark went in over the
  headline and the pair together pushed the tagline off a laptop screen.
  Same line-height and tracking, one step apart in size.
- **`hero-line` is a ScrollReveal marker, not a style.** It carries no
  CSS at all. It is on the headline because the headline has an arrival
  of its own, and on `cloudnet` because a mark tipping up while the words
  under it sat still read as two objects instead of one masthead.
- **One cloud per screen.** The scatter's small `cloud` was removed when
  `cloudnet` went in over the headline — two clouds 300px apart read as
  the same idea twice rather than as texture. The mark is still in the
  registry for anywhere else that wants it.
- **`LOGISTICS_MARK` in page.tsx is keyed by the label's own text and
  typed against it**, so changing that copy in `lib/content.ts` without
  choosing a mark is a build error rather than a mark that silently stops
  rendering. The track drawings need no such map: `t.key` is already
  `"spark" | "forge"`.
- **The marks are `aria-hidden`.** Every one restates the label directly
  beside it, so announcing them reads the section name twice.

## The borrowed marks

`components/Brand.tsx` carries six third-party tool logos — Anthropic,
OpenAI, Perplexity, n8n, Cursor, LangChain — threaded into the hero
scatter among the drawn ones. HuggingFace is the seventh of the set and
is NOT here: see the silhouetting note below for why it is in Draw.tsx
instead.

**They are a separate component from `Draw.tsx` on purpose.** Every drawn
mark goes through a roughening pass, and a roughened logo is an ALTERED
logo, which is the one thing essentially every brand guideline forbids
outright. A hand-redrawn OpenAI knot would also simply look like a
knockoff. So the two sets are two components and the seam is honest
rather than hidden.

**They are used unmodified, and coloured by a CSS mask.** Same argument
`Mark.tsx` made when it was a PNG alpha plate: the ink comes from the
stylesheet, so it cannot drift out of step with the palette. Seven
full-colour logos would spend the flame's saturation budget seven more
times, against the rule that the accent is the one saturated colour here.
Masked, they are ash like everything else and they warm with the field.
The shape is the vendor's own file; only the ink is ours.

**Six of the seven are named in `lib/content.ts` already** — Claude.ai,
ChatGPT, n8n and Cursor in the Spark tool list, OpenAI API, HuggingFace
and LangChain in the Forge stack. That is what keeps them clear of the
slop audit's partner-logo ban: they state which tools the club teaches,
which is true, rather than implying sponsorship, which would not be.
**Perplexity is the exception and is not named anywhere in the copy.**
Either add it to the Spark tool list or drop the mark; a logo for a tool
no session uses is exactly the unearned claim the content rule exists to
prevent.

### Things that will bite you here

- **Never fabricate or fetch a third-party logo to fill a gap** — a
  standing decision on this project, taken the first time these same four
  brands came up. They are sourced from each vendor's official kit.
- **`assets/brand/` holds the masters; `public/brand/` is DERIVED.** Same
  rule the video clips follow. Vendors ship opaque files — black on white,
  or a lockup on a dark card — and an opaque file masks as a solid
  rectangle. `tools/brand/mask.py` keys the ground out, optionally crops a
  lockup to its icon, and trims to the ink. Re-run it; never hand-edit
  what lands in `public/`.
- **Silhouetting only works on marks whose identity is SHAPE.** Measured
  on the first batch: the OpenAI knot, the n8n node glyph and the
  Anthropic mark came through clean, and Cursor's gradient-shaded cube,
  HuggingFace's yellow face and the LangChain parrot came through as
  featureless blobs, because what makes those readable is hue, not
  outline. No threshold recovers it — the information is not in the file.
  The script warns when the keyed ink covers more than 75% of its own
  box, which is what that failure looks like numerically.
- **HuggingFace is the exception that proves where the line is.** It
  could not be masked, so at the client's direction it is DRAWN, in
  `tools/marks/hero-marks.mjs` like any other freehand mark — a redrawn
  logo, knowingly, because a blob was the only alternative. It is the one
  place the borrowed/drawn split is crossed. If Cursor or LangChain ever
  get the same treatment, they belong there too, not in `Brand.tsx`.
- **The phone layer is anchored by percentage of a wrapper around the
  hero's ink**, not of the stage and not in fixed `rem`. Both earlier
  versions are instructive: fixed offsets stranded the marks at the top
  once the content moved down to the fold, and a percentage of the stage
  broke the moment the section started centring its content below `lg`.
  A percentage of the ink is the thing the marks actually have to clear.
- **The stacked CTAs are capped at `max-w-[15rem]`, and that cap is what
  keeps the bottom two marks clear.** At 17rem on a 360px screen the
  buttons left 2px between their edge and the marks beside them. Widen
  them and re-check 360 first.
- **The logos are balanced against what RENDERS, not what is listed.**
  Three slots a side, but a slot with no file is invisible, so an even
  split of slots reads lopsided on the real page. Count what a reader
  actually sees after changing any of them.
- **The mask reads ALPHA.** A logo sitting on a white or coloured
  rectangle masks as a solid block, because the rectangle is opaque too.
  Use the monochrome-on-transparent variant every brand kit ships.
- **Use the icon, not the wordmark.** `mask-size: contain` letterboxes a
  wide wordmark to about a third of the height of the marks beside it,
  and it is an unreadable smear at 34px anyway.
- **A missing file renders nothing, deliberately** — not a broken box —
  so the build never fails on a logo nobody has downloaded. The lookup
  resolves ONCE at module load, which under `output: "export"` is build
  time: `next dev` will not notice a file you add while it is running.
- **They are not rotated, and the drawn marks are.** Turning a drawn mark
  off square is the hand showing; turning a logo off square is the
  alteration its guideline forbids. Against the tilted neighbours the
  difference reads as deference, not as a mistake. The drawn HuggingFace
  follows the LOGO rule here, not the drawn one: it sits level.

## The hero is one screen

From `lg` up, the mark, the scatter and the headline live in a STAGE — a
`min-h-svh flex flex-col justify-end` block at the top of the section.
The headline sits flush with the bottom of it, so the whole composition
grows UPWARD from the fold as the type scales rather than downward past
it. Everything else in the section follows below and is scrolled to.

**Below `lg` the one-screen box is the SECTION, and it holds the whole
hero.** That is not a smaller version of the stage; it is a different
composition, and the reason is arithmetic. The stage's `justify-end`
assumes the mark and the headline are big enough to fill a screen on
their own, which at desktop sizes they are — 500px and 240px. On a phone
`--text-hero` bottoms out at its 2.4rem floor and the same two objects
are about 250px of an 844px screen, so bottom-anchoring them left 300px
of empty black under the nav and put the tagline, the standfirst and
both calls to action a full screen down.

Measured before the fix, on the landing page: at 390x844 the "Join the
club" button's top edge was at y=1108 with the fold at 844; at 320x640 it
was at 965 with the fold at 640. **The first screen of the site on a
phone was a headline and nothing else.** It now ends at 659 and 660.

So below `lg` the section carries `min-h-svh` and centres everything from
the cloud to the buttons inside it, and the stage is a plain stack.

### Things that will bite you here

- **`justify-content: safe center`, never plain `center`.** A flex column
  that centres content taller than itself overflows in BOTH directions,
  and the half that goes off the top is unreachable because scroll cannot
  go negative. `safe` falls back to start-alignment exactly in that case.
  It is written as a second declaration after `justify-start` so a
  browser that does not know the keyword drops it and keeps the safe
  behaviour rather than the dangerous one.
- **The hero genuinely does not fit one screen on a small phone, and that
  is the right answer.** At 320x640 the standfirst alone is five lines;
  the sum is 779px against 640. Start-aligned with the CTA at the fold is
  correct there. The same is true of any phone in landscape — 663px of
  hero against 390px of screen — and it is inherent to a 1.76:1 clip and
  a 5.5em type stack, not a layout fault to chase.
- **Only the tier BELOW `sm` may change when tuning the phone's spacing.**
  Every margin in the hero steps as `mt-7 sm:mt-14` rather than being
  replaced, because `sm` and up must render the number it rendered
  before — a rem taken off a desktop margin moves the entire page below
  the hero. Two 8px slips did exactly that during this work and were
  caught by the diff below, not by looking.
- **Verify desktop by DIFFING BOXES, not by comparing screenshots.** The
  heat field repaints every frame, so two screenshots of an unchanged
  page never match. The check that means something is: record
  `getBoundingClientRect` for every heading, term, definition, list item
  and link on all five pages at 1024x768, 1280x800, 1440x900 and
  1920x1080, make the change, and diff. It must come back zero. It
  currently does.
- **`svh`, never `vh`.** On a phone `100vh` is the height with the
  browser chrome RETRACTED, so a stage sized in `vh` is taller than the
  screen the reader actually has until they scroll — exactly the
  overflow the stage exists to prevent. `svh` is the chrome-expanded
  height: always safe, occasionally a little short, which is the right
  way round.
- **`--text-hero` carries a `vh` term, and it has to.** The mark is
  3.71em tall and the two headline lines are 1.76em, so the stack is
  ~5.5em. Bind that to width alone and a wide short window — a laptop at
  1440x700, a phone in landscape — gets a block far taller than its
  screen. It is a `min()` of the width and height terms rather than
  another clamp stop, because whichever runs out FIRST must decide.
- **The `- 22px` in that expression is derived, not fudged.** The stage
  spends a fixed amount before the type gets any: the nav clearance its
  `pt` floors at 96px, plus the 24px gap under the mark. Those do not
  shrink with the window. Solving `5.47em <= 0.96svh - 120` gives
  `0.1755svh - 21.9`. Without it, 15.5vh alone still overflowed at
  1440x613, 1280x713 and 1024x681 — measured, not guessed.
- **Verify by MEASURING, not by looking.** The check is: mark top >= 96
  (clears the nav) and headline bottom <= innerHeight, at a spread of
  sizes. It currently passes at 1440x900/700, 1280x800, 1024x768/600,
  1920x1080, 820x1180, 500x844/667 and 740x420.
- **Nothing may hang off the headline's bottom edge any more.** That edge
  is the fold. The `chart` and `branch` marks used to be anchored to it
  with `top-full`; they are in the scatter beside the cloud's wires now.
- **On a very tall window there is deliberate air above the mark.** The
  type is capped at 7rem, so past about 1200px of height the stack stops
  growing and the space goes above it. That is the cap doing its job,
  not a layout fault.

## The tagline lives in the cloud

On `lg` and up the tagline sits INSIDE `cloudnet` rather than under the
headline. The mark was a large empty outline; this is what makes it a
container instead of a decoration.

### Things that will bite you here

- **The text box is measured off the cloud's own path.** Over the band
  y=30..58 of the 126-unit viewBox the outline never comes in past x=18
  left or x=108 right — its narrowest points in that band, where the
  shoulders curve in. `inset-x-[15%] top-[24%] h-[22%]` is that rectangle
  with a little spare. Redraw the cloud and this has to be re-derived.
- **Size it in `em` off the wrapper, never with `text-lead`.** The two
  scale on different curves: the mark follows the headline, while
  `text-lead` is capped from 1024 up — so at 1024 the cloud is at its
  smallest and the type at its largest, and "Let AI do the rest." came
  within a few pixels of the outline. In `em` it is a fixed fraction of
  the cloud at every width.
- **There are two tagline nodes, and that is deliberate.** One node
  inside the cloud wrapper would sit ABOVE the headline in source order
  on mobile, and the headline has to come first. `hidden` removes the
  inactive one from the accessibility tree, so only one is ever
  announced. Below `lg` the cloud is ~175px wide and its interior would
  set the line at about 9px, which is why the phone keeps its own copy
  under the headline.
- **Both copies read `CLUB.tagline`,** through the `Tagline` component,
  which splits the string on `\bAI\b` and sets that word in the flame.
  Neither copy is a literal, so rewording the line in `lib/content.ts`
  cannot leave a stale one behind in the markup. Word boundaries, so it
  colours the word and never the letters inside another one; if the
  tagline ever stops containing it the line renders whole rather than
  breaking.
- **The centring flex box must have exactly ONE child.** With `flex` on
  the paragraph itself, every run of text either side of the flame-set
  "AI" became its own flex item: the line broke into three columns and
  the word landed in the gutter between them. A flex parent wrapping a
  single `<p>` centres the block while the text inside stays ordinary
  inline text. Anything else inlined into this line hits the same trap.

## The masthead holds still

**The landing headline does not animate, and that is the point.**
Everything else on the page swells because the reader is doing something;
the masthead holds still because it is the thing being arrived at. It was
measured breathing between 485 and 643 weight before it was frozen, and
is set solid at 640 — the top of its own range, so it reads as the heavy
state it was reaching for rather than as a frame caught mid-cycle.

It uses plain spans, not `HeatText`: with nothing to drive per character
there is no reason to split the line into fourteen inline-blocks, and the
`aria-label` that split made necessary goes with it. `HeatText` is still
used by `TrackHead`, which does still animate. Holding still is also what
makes the line's width deterministic, which is what lets `cloudnet` be
matched to it exactly.

**There is no effect on this line at all. It is solid type on the void,
and that is deliberate.** `components/Haze.tsx` used to sit here: an
`feTurbulence` and `feDisplacementMap` pair that refracted the headline
as though through hot air, on the argument that with the weight axis
frozen the heat should move from the object to the MEDIUM. It was
removed at the client's direction, along with its `.haze` rule, its
`data-heat="haze"` case in the field, and the `px` measurement in the
read pass that nothing else used.

Two things are worth keeping from it if anyone is tempted again. A
displacement filter cannot be made to look like heat by animating its
`scale` alone — that fades a fixed pattern of bends up and down, and
reads as bad registration rather than as moving air. And the obvious way
to add local softness, compositing a masked blurred copy OVER the sharp
one, produces a GLOW rather than a defocus: source-over attenuates the
backdrop by the source's alpha, so the sharp letter survives underneath
its own halo. Nothing on this page glows.

## The phone gets a rail, not a hamburger

Below `md` the four section anchors sit on their own line under the
lockup, and they appear only once the bar is STUCK — the same signal that
turns the stock solid.

They were simply absent, on the argument that a menu button would be a
control that opens a list of anchors you would reach by scrolling anyway.
**That argument holds for a menu BUTTON and not for the anchors.** The
landing page is 10,502px on a 390px screen, about twelve screens, and
"scroll until you find the FAQ" was the desktop reader's problem solved
and the phone reader's ignored: desktop got four labels reachable in one
movement, the phone got a sign-up button.

So it is a rail — no button to press, no panel to open, no state. The
same row the desktop bar carries, on its own line because there is no
width to share.

### Things that will bite you here

- **It is hidden by HEIGHT, not by `display`.** `block-size: 0` keeps the
  row measurable from the first frame and lets the bar grow into it over
  the same 200ms the stock takes to go solid. `display: none` would make
  the arrival a jump. `visibility: hidden` goes with it, because a
  zero-height overflow box still hands its links to the tab order and to
  a tap.
- **It appears only when stuck, and that is not just taste.** Over the
  hero the bar is transparent so the composition is uninterrupted, and a
  row of labels laid over the cloud and the scatter is precisely the
  interruption being avoided — pointing at sections the reader has not
  been given a reason to want yet.
- **No `nav-roll` on these.** The roll is a hover affordance, and on a
  touch screen `:hover` sticks after a tap: the label would turn a
  quarter and stay there.
- **The bar's height is load-bearing.** Stuck, it is 124px on a phone
  against 113px without the rail, and `ANCHOR` in `lib/ui.ts` is the
  scroll margin that clears it — `scroll-mt-[8.75rem] lg:scroll-mt-32`.
  It is one constant rather than the six copies of `scroll-mt-32` it
  replaced, for the same reason `SHELL` and `GUTTER` are: the number is a
  function of the nav's height, which is a single fact about the site.
  Change the bar and change that, or every anchor lands under it.
- **`scroll-padding-top` on the root is NOT the mechanism, deliberately.**
  It does not override a scroll margin, it ADDS to it. The note under
  `html` in globals.css is the same warning from the other side.

## Everything is a 44px target on a touch screen

Every link on this site is set as type, so it is exactly as tall as its
own line box — 18px for a name in the team list, 14px in the colophon.
Correct for a pointer, which is a pixel; wrong for a contact patch nearer
45px, on a page carrying fifteen names, eleven colophon links and four
channels in the flame block.

Three rules in globals.css do it, all inside one `@media (pointer:
coarse)` block: `.tap-list` sets the ROW so a list keeps its rhythm
rather than growing padding the ink sits inside, `.tap-block a` (and
`.legal a`) adds `padding-block` to a link in prose, and `.tap-lockup`
pads the two wordmark lockups.

### Things that will bite you here

- **It is a media query on POINTER, never on width.** A phone in
  landscape is 844px wide and still has a thumb on it; a narrow window on
  a laptop has a mouse. Width has never been the question.
- **`.tap-block a` sets padding and NOTHING else.** Padding on an inline
  box is hit-tested but does not enter line layout, so it grows the
  target by 27px without moving a character. `display: inline-block`
  instead grows the line box, pushes the paragraph around, and breaks any
  link that is already `inline-flex` — the two track links carry an arrow
  in a flex gap.
- **`.tap-lockup` must not reach a pointer.** The same padding on a
  desktop, where the mark is 44px rather than 32, made the nav bar 10px
  taller and pushed the whole page down by it. Measured: 103 to 113, and
  every anchor's clearance changed with it.
- **Its padding must be SYMMETRIC.** `Intro.tsx` aims the flying clip at
  the nav lockup's vertical CENTRE, so an uneven pad lands the flame off
  the mark.
- **Verify by enumerating, not by tapping.** Walk every `a[href]`,
  `button` and `summary` on all five pages at 320, 360, 390, 414 and 430
  and assert `height >= 40`. The one legitimate exception is the
  sr-only "Skip to content" link, which is 1px until it is focused.

## The nav labels roll

Each label is two faces of a cube edge: the one you read, and one hinged
below it at ninety degrees. Hovering (or focusing) turns the pair a
quarter turn, so the word reads as printed on a drum rather than as
having simply changed colour.

- **The geometry is one number.** With `line-height: 1.2`, half the box
  is 0.6em, so pushing each face 0.6em along its own Z after rotating
  puts them on adjacent faces of a cube centred on the origin. Get it
  wrong and the faces either pull apart mid-turn or clip through each
  other.
- **No `overflow: hidden` anywhere in it.** It is the obvious way to hide
  the face turning away, and it flattens the 3D — a clipping container
  forces its children back into the plane. `backface-visibility` does the
  hiding.
- **The second copy is a pseudo-element, not a second span.** Written
  twice in the markup the link's text content becomes "TracksTracks",
  which is what find-in-page matches and what a copy-paste returns.
- **Its colour is set, not inherited**, so the heat field driving the
  link's colour every frame cannot reach it. The arriving word is always
  the bright one.

## Coming into view

`components/ScrollReveal.tsx` reveals every content block on every page —
117 of them on the landing page, 61 on Spark, 103 on Forge. Each block is
hinged along its own bottom edge and tipped 26 degrees away from the
reader, so it comes UP into the page rather than sliding onto it. It does not
work from a list of selectors, which goes stale the moment anyone adds a
section. It walks the page and keeps every block-level element that holds
content AND has no block-level descendant holding content: the leaves of
the layout. That is "every component" without naming any of them, and it
cannot double-animate, because an element and its own parent can never
both be leaves.

### Things that will bite you here

- **It plays in BOTH directions**, at the client's direction, so three
  observers are doing three different jobs and none of them can be
  merged. `io` triggers the reveal on a root shrunk 25% at the bottom.
  `full` reveals anything entirely on screen, which covers the trigger's
  one bad case — a short block coming to rest inside that bottom quarter,
  fully visible and fully invisible — and the bottom of the document,
  where the page runs out of scroll and nothing can reach the shrunk
  root. `rearm` resets a block, on a root EXPANDED by a fifth of the
  screen, so it must be properly gone before it hides again. Reset on
  either of the other two roots and content blinks out while it is being
  read.
- **`full` uses `threshold: 0.99`, not 1.** A ratio of exactly 1 is
  unreliable at subpixel sizes; a block sitting at 0.9999 never fires.
- **A negative bottom `rootMargin` is REQUIRED.**
  Without one the reveal fires the instant a block touches the bottom
  edge — measured at 897px of a 900px viewport — so the whole 720ms runs
  while the block is still off screen and it has already settled by the
  time anyone can read it. The animation ran perfectly and was invisible;
  that is what "there is no scroll animation" turned out to mean. It is
  `-25%` now, which fires at 75% down the screen.
  The cost is a dead band across the bottom of the viewport: whatever
  sits in it when the page runs out of scroll can never enter the shrunk
  root, and that stranded the last two footer blocks at opacity 0
  permanently. **`full` is what pays for it** — anything at least 99% on
  screen is revealed regardless of the shrunk root, which covers both the
  bottom of the document and a short block coming to rest inside the dead
  band. Take the margin out and the effect disappears; take `full` out and
  content does.

  This paragraph used to describe a `flush` handler — a passive scroll
  listener that revealed whatever was left once the document bottom was
  reached, then removed itself. **There is no such function in
  ScrollReveal.tsx and there has not been for some time**; `full` replaced
  it and does the same job from an observer instead of a scroll listener.
  Left here as a marker: the residual gap is a block TALLER than the
  viewport sitting at the document bottom, which can reach neither the
  shrunk root nor 0.99 of itself. Nothing on the site is currently shaped
  like that, so it has never bitten — but a long footer block would.
- **`threshold: 0`, never a fraction.** A block taller than the viewport
  can never reach a percentage of ITSELF, and a fast scroll can carry a
  short one past a band between frames.
- **Anything folded inside a `<details>` must be excluded.** A closed
  disclosure never renders its answer, so the observer cannot fire for
  it — it would sit at opacity 0 forever and opening a FAQ item would
  show an empty panel. The disclosure IS that content's reveal.
- **Verify by scrolling every page end to end and counting the blocks
  that NEVER reached `data-reveal="in"`.** It must be zero. Counting what
  is still `"out"` when the pass finishes tests nothing, because the
  reveal plays in both directions and every block well above the viewport
  is correctly re-armed by then — that reading says 101 of 117 are
  broken on a page where none of them are. Give the observer a good
  second to settle at the end, or the test lies either way.
- **Perspective is per element, not on a shared ancestor.** One ancestor
  would put every block on the same vanishing point, so blocks at the
  edges of a wide row would swing while the middle one barely moved.
- **The angle and the lens have to be read together.** 14 degrees at
  1100px was measurably rotating and visually nothing; a shallow angle
  through a long lens flattens straight back out. 26 at 760 reads.
- **The nav is excluded on purpose.** It is fixed, so there is nothing to
  reveal — and its labels are two faces of a rolling cube whose geometry
  lives in a `transform`. A reveal on those faces overwrites it and the
  roll comes apart.

## The palette

- `--color-void: #000000` — carried from the previous build at the
  client's direction. Nothing can go under it, so recession is done with
  weight and colour, never with a darker background.
- `--color-flame: #bee449` — measured, not chosen: the median of every
  green pixel in the club's logo. **The one saturated colour on the
  page.** The more places it appears the less any of them mean.
- `--color-bone: #ece9e4` — type. Not `#ffffff`: pure white on black
  halates and closes counters, and the display face runs to 900.
- `--color-ash: #9d9a94` — secondary text. 7.48:1 on the void.
- `--color-dim: #787570` — **the readability floor.** 4.58:1, the
  dimmest ink on the page that still clears AA. Anything a reader has to
  READ stops here.
- `--color-edge: #2a2a28` — rules and dividers, and rules ONLY. At
  1.46:1 it is invisible as type. The footer's `·` between Privacy and
  Terms was set in it and could not be seen at all.

**The accent never appears as a glow, a gradient, or a border on a card.
It is ink.** There are no cards on this page and nothing floats;
structure is made of rules and space.

**Recession is a COLOUR, never an opacity.** `--color-ash` at
`opacity: 0.55` looks like a dimmer ash and is in fact 2.81:1, which
fails AA outright — that is what the Forge rail's unbuilt steps were set
to, so the description of a layer you had not read yet was the least
readable text on the site. `--color-dim` exists so "make it quieter" has
somewhere to land that was checked against the void rather than against a
screenshot. **Measure it. Do not eyeball a transparency.**

## The type

Archivo for display, chosen for its axes rather than its resting
appearance — an expanded grotesque is also simply less worn than the
condensed poster faces every club site reaches for. Newsreader for body:
a reading serif with an optical-size axis so it stays open at small sizes
on a dark field. **A serif body under a grotesque display is the pairing
doing the most work here** — it is the fastest way to stop this reading
as a product landing page.

### The display scale

**Five named settings, and no inline `font-variation-settings` anywhere
in markup.** A face with two live axes invites a fresh guess at every
call site, and after three pages that was twelve distinct `wght`/`wdth`
pairs across seven files — 620/110 against 620/112 against 640/110
against 640/106, four decisions and one visible result. The count was the
tell, not any single value.

| class | setting | job |
|---|---|---|
| `.type-hero` | 640 / 106 | the landing headline, and nothing else |
| `.type-display` | 800 / 116 | track names, flame-block headings |
| `.type-head` | 760 / 114 | section headings, session numbers |
| `.type-strong` | 700 / 112 | the workhorse — names, keys, buttons |
| `.type-lead` | 640 / 110 | subtitles, standfirsts, FAQ questions |

Each carries `font-family` too, so a call site says `type-strong`, never
`font-display [font-variation-settings:...]`. `.label`, `.wordmark`,
`.nav-link` and `.nav-cta` are the nav/gutter family and stay separate —
they are all 0.04em at `wdth` 125 for the reason in the slop audit below.

- **`.type-hero` is LOCKED at 640/106.** `cloudnet` is sized `3.77em`
  against this exact string in this face at this weight, measured. Change
  either number and that ratio has to be re-measured or the mark stops
  being as wide as the words under it.
- **The heat field does not touch any of these.** It writes
  `font-variation-settings` per character on `[data-heat="type"]` only,
  which is HeatText's split spans. Nothing collides.

### Measure, duration and rhythm

The same disease in three other places, fixed the same way — a scale
instead of a free number.

- **Measure.** `--container-tight|read|wide|broad|shell` (34/40/46/52/86
  rem), generating `max-w-tight` and friends. It was ten distinct widths
  between 30 and 52rem, and **a 2rem step is not a decision a reader can
  perceive** — it reads as nudging, not as intent. The page's idea is
  still that the measure CHANGES per section; it now changes in steps
  somebody chose. `max-w-[15rem]` on the hero CTAs is the one survivor
  and is load-bearing — see the Draw.tsx notes.
- **Duration.** `--t-quick|base|slow|reveal` (200/320/460/720ms). It was
  thirteen values between 180 and 720. **The intro sequence deliberately
  does not use these:** its durations are pinned to `CUE` in Intro.tsx
  (`done: 4575` is `land` plus the clip's 180ms fade plus the stock's
  320ms arrival) and are not free to round.
- **Rhythm.** `--space-section: 12vh` and `--space-section-dense: 10vh`.
  The two-step is deliberate — the landing page has six sections and can
  afford the air, the track pages carry seven each plus ten sessions —
  but it was two magic numbers that happened to differ, which is
  indistinguishable from drift.

### Shared structure

- **`lib/ui.ts`** holds `SHELL`, `GUTTER` and `ANCHOR`. All three pages
  declared the first two identically and independently; change the gutter
  on one and the other two silently keep the old one, with nothing
  failing anywhere. `ANCHOR` is the newest and had six copies written as
  `scroll-mt-32`.
- **`SHELL` carries the notch, and it is the only place that does** apart
  from the nav, the intro's skip button and `Legal.tsx` — the four things
  that are not inside it. `app/layout.tsx` sets `viewportFit: "cover"`,
  which is what makes `env(safe-area-inset-*)` report anything at all and
  what lets the page paint its own black into a cutout instead of leaving
  the browser's letterbox there. It is half a decision: with cover on,
  every edge-anchored thing has to clear those insets itself, hence
  `px-[max(1.25rem,env(safe-area-inset-left))]` rather than `px-6`. A
  device with no cutout renders the design's own numbers.
- **`GUTTER` stacks at `gap-6` below `lg`, not `gap-10`.** 2.5rem between
  a section's label and its first line is a desktop measure. On a phone,
  where the two are the only things on screen, it separates them into two
  unrelated objects and costs a fifth of the fold on each of eleven
  sections.
- **`components/JoinBlock.tsx`** is the flame block that closes every
  page. It existed three times as fifteen lines of markup with a
  byte-identical button class and only the copy different — which is why
  the landing page's copy was on a 12vh rhythm and the tracks' on 10vh.
- **`.pullquote`** is the outcome line — the sentence saying what you
  leave with. Four call sites, three top margins, two measures. The
  margin belongs to the call site; the rule and the inset do not.
- **`.chip`** is a tool name. Spark set these at px-4/py-2 in bone and
  Forge at px-3/py-1.5 in ash — the same object, two sizes, on sibling
  pages. Standardised on the larger and brighter: these name software a
  member will actually open, and ash inside a bordered box recedes twice.
  **It stays a rectangle.** There is no `border-radius` anywhere on this
  site and this is not the place to start one.

### Things that will bite you here

- **Anything hanging off the spine must use `GUTTER`, not a percentage
  that approximates it.** TrackHead indented its intro with
  `lg:ml-[22%]`, which equals the 14rem+4rem column at exactly one window
  width: at the shell's full 86rem the column is 20.9%, and at a 1100px
  container it is 288px against 22%'s 242px. A percentage cannot track a
  fixed column.
- **`gap-px` in a grid whose children carry `border-t` does nothing you
  want.** It is the idiom for hairline dividers drawn by a parent
  background, and there is no parent background here — the rules come
  from the borders. Its real effect was to butt adjacent top rules into
  one continuous line, so a two-column pair read as one item. The grids
  carry real gaps now, and the `sm:pr-*`/`pl-12` that were standing in
  for those gaps are gone with them.

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
- `components/Brand.tsx` — the seven borrowed tool logos, masked so they
  take the page's ink. Read its header before adding one: the sourcing
  rule and the alpha/wordmark traps are both in there.
- `components/Draw.tsx` — the freehand marks, and the notes on the
  roughening pass that produced their path data. Like the trace behind
  `Mark.tsx`, the output is generated: redraft and re-run, never
  hand-edit.
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
- **Width comes from the WIDTH AXIS, never from letter-spacing.** Micro
  type tracked out to 0.18em is the eyebrow every generated landing page
  opens with, and this page had it on `.label`, on `.nav-link` (0.14em)
  and on the Sign up CTA. They are 0.04em now at `wdth` 125, so the width
  sits in the letterforms. That is also the argument the rest of the page
  already makes - the type carries the idea in its own shapes rather than
  in an effect layered over it - and Archivo's axis was loaded the whole
  time. Measured: the faculty line runs 262px at `wdth` 100 against 334px
  at 125, so the axis really is doing the work.
- **No "A / B" eyebrow above the headline.** Two facts joined by a middle
  dot and floated over a huge title reads as a slot that had to be
  filled. The hero states them as two stacked lines instead.
- **No em dashes in user-visible copy.** `lib/content.ts` and
  `app/page.tsx` were rewritten to restructure the sentences rather than
  swap the character. Code comments still use them; they do not ship.
- No emoji, no gradients, no stock photography, no invented numbers, no
  testimonials, no builder badge. Each of those is a choice, not an
  oversight.
- **Scroll reveals were on that list and are not any more.** They were
  banned because a reveal on everything is the cheapest way to make a
  page feel authored when nothing about its structure is. The client
  asked for them on every component, so the rule is now about HOW rather
  than whether: they travel about a centimetre, and they stagger by
  SIBLING so a row of three arrives as a row of three. Long travel would
  put this back where it started. See `components/ScrollReveal.tsx`.

  **This entry used to say they "fire once and stop observing", and that
  replay-on-scroll-up would undo the fix.** Both were true when it was
  written and neither is now: the client later asked for the reveal to
  play in BOTH directions, which is what `rearm` does, and the
  "Coming into view" section above describes that as the current
  behaviour. The two paragraphs contradicted each other for a while.
  Travel distance and sibling staggering are what the rule rests on now;
  replay is a client decision, not a regression. **If it is ever revisited,
  the thing to weigh is that ~120 leaf blocks on the landing page each
  fade and tip 26°, and re-hide when scrolled away — the mitigations
  reduce that, they do not make it invisible.**

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
