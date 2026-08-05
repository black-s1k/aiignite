<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

# AI Ignite — the risograph press build

Third build of the AI Ignite site, started 2026-08-04. `../2` is the
previous one and is being left alone, not migrated.

## Why this exists

`2/` was rebuilt from scratch because it had drifted into the house style
of generated design: `#0a0a0a` background with a single `#ccff00` acid
accent, hairline rules, 4px radius cap, `0.3em` uppercase eyebrows. That
combination is a recognised AI-design default, not a decision. Its hero
was also a 5.8MB scroll-scrubbed video across 420vh in which over half
the frame-to-frame motion happened in one fifth of the clip.

**Do not reintroduce either.** No near-black-plus-neon palette. No
pre-rendered video for the hero.

## The one idea

The page is a two-ink risograph print, simulated live in WebGL, and the
inks carry the argument:

- **Federal Blue `#3d5588` = Forge**, the track for students who code
- **Fluorescent Pink `#ff48b0` = Spark**, the track for everyone else
- **their overprint `#3d185e` = the club**

Riso inks are semi-transparent, so overlaps multiply into a genuine third
colour. `--color-overprint` is the arithmetic product of the two inks,
not a picked value — recompute it if either ink changes.

The signature is **moiré**. Each ink is screened at its own halftone
angle. Apart, they sit at the textbook 75°/15° separation that printers
use precisely to avoid interference. As the tracks converge (hero,
signup) the angles converge too and the sheet blooms into live moiré.
Registration drift is driven by scroll velocity, so scrolling literally
pulls the sheet through the press.

## The three states

The coverage field has exactly three states, and the whole behavioural
system is which one is active:

- **Gathered** (`uDisperse` 0) — the landing page. One mass, wobbling
  like set jelly: a volume-preserving squash plus a radial displacement
  that varies with *angle*, so the rim leads and lags itself. That phase
  difference is the difference between jelly and a pulsing circle.
- **Dispersed** (`uDisperse` 1) — everywhere else. Bands at both trim
  edges, Forge left and Spark right, inner edges running a travelling
  wave that scroll pushes along.
- **Formed** (`uForm` 0→1→0) — the `Mark` section only. Ink leaves the
  edges and reassembles into the club's lockup as horizontal strips
  sliding in from alternating sides, holds, then comes apart again.

  Strips because the transform must be exactly invertible: a fragment
  shader can only ask "what belongs at this pixel", so freely scattered
  pieces have no closed-form answer. A strip never moves vertically, so
  its row is a function of screen y alone and its source is `x` minus
  travel — one sample per pixel, and the bounds test is on the SOURCE
  coordinate, which is what lets a strip be drawn far outside the mark's
  final box while it is still flying.

  The plate is `public/logo-lockup.png`, an alpha mask extracted from
  the real logo (flame + AI IGNITE + AT YORK). The script tagline is
  deliberately NOT in it — its strokes are about one screen cell wide at
  any sane ruling, so a halftone turns them into specks. It is set as
  real text in `Mark.tsx` instead. **If a proper vector logo turns up,
  replace the plate** — the current one is keyed out of a screenshot.

`uDisperse` is read straight off scroll position, never damped toward a
target, so it is exactly reversible on the way back up and cannot
overshoot. It only ever increases. **Do not reintroduce per-section
coverage that can reach zero** — that is what made the ink vanish
between sections and slam back at the next one, and it is the specific
complaint this system was built to fix.

## Where things are

- `lib/press/shader.ts` — the press. Coverage field → per-ink halftone
  screen → registration offset → multiply composite. Commented in order.
- `lib/press/chapters.ts` — what the press does per section. Read the
  gain and `converge` columns top to bottom and you get the structure of
  the pitch. Sections opt in via `data-press="<key>"`.
- `components/Press.tsx` — the renderer. Imperative and ref-based; it
  runs every frame, so nothing it touches may go through React state.
- `components/Sheet.tsx` — the only layout idea: mono slug in a left
  gutter, measure beside it.

## Things that will bite you

- **Never `convertSRGBToLinear()` the ink colours.** A raw
  `ShaderMaterial` is the one material three.js does not append the
  output-colour-space chunk to, so linear values reach the sRGB
  framebuffer unconverted and every ink prints several stops dark
  (Federal Blue lands on maroon). The palette was also derived as an
  sRGB multiply, so the shader has to multiply in the same space.
- **Nothing may be opaque except type.** An opaque background on any
  element punches a card-shaped hole through the ink behind it. Use
  borders for dividers, never a filled cell over a gap.
- **Fluorescent Pink is not a text colour** — 2.3:1 on this stock, fails
  at any size. It is a fill, a rule, or a mark. Type that sits on it is
  graphite. See the measured table in `globals.css`.
- **`chapters.ts` x coordinates are fractions of the half-width**, not
  absolute units: ±1 is the trim edge at any viewport. Absolute values
  look right on the display they were tuned on and then slide off the
  side of a phone, taking the signature with them.
- **The mark plate is sampled with `v` as-is.** three.js applies `flipY`
  when it uploads the image, so inverting `v` in the shader as well
  strikes the logo upside down.
- **`band + waveAmp` must stay under 0.118** — that sum is the wave's
  inward crest and the text column starts at 0.122. Emphasise a section
  with ink density, ruling or converge, never by widening past it.
- **`--form` falls back to 1, not 0.** The Mark section's IGNITE lockup
  is real copy whose opacity is driven by the press; if it defaulted to
  0 it would stay invisible whenever WebGL or JS didn't run.
- **`Reveal` must never hide content it cannot guarantee it will show.**
  It only arms elements genuinely below the fold. An earlier version
  hid everything on mount and waited for the observer to undo it, which
  left 30 elements stuck at `data-shown="false"` and the whole page
  below the hero blank.
- Next warns `Failed to find font override values for font Big Shoulders`
  — no metrics for a fallback face. `--font-display` names Arial Narrow
  explicitly for that reason; it is the closest condensed metric match.

## Still to do

- Institutional lockups. `Colophon.tsx` has placeholder boxes for the
  York and Lassonde marks. Get the **one-colour** versions from the
  brand kits and render them in graphite — a real two-ink job would not
  fire a third drum for a logo, and York red beside Fluorescent Pink is
  a genuine clash.
- `NEXT_PUBLIC_SIGNUP_URL` is unset, so the sign-up button falls back to
  `#`. It is inlined at build time, so it must be set before building.
- Social links in `Colophon.tsx` point at `#`.
