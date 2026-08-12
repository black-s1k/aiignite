<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

# AI Ignite — the press build

Third build of the AI Ignite site, started 2026-08-04. `../2` is the
previous one and is being left alone, not migrated.

## Why this exists

`2/` was rebuilt from scratch because it had drifted into the house style
of generated design: `#0a0a0a` background with a single `#ccff00` acid
accent, hairline rules, 4px radius cap, `0.3em` uppercase eyebrows. That
combination is a recognised AI-design default, not a decision. Its hero
was also a 5.8MB scroll-scrubbed video across 420vh in which over half
the frame-to-frame motion happened in one fifth of the clip.

**Do not reintroduce the scroll-scrubbed video.** Tying a video's
playhead to scroll position is the specific thing that was wrong — it
makes scrolling feel like dragging, and it hides most of a clip's motion
in a fraction of its length.

There IS a video now, added 2026-08-08, but it is the opposite
arrangement: a 10s title sequence that plays once at its own speed and
then gets out of the way. See "The title sequence" below.

The palette question is subtler, because this build now *is* on black —
`#000000`, at that. See "On being on black" below. That was a deliberate
call by the client (2026-08-05), and the defence is execution, not
avoidance. Read that section before touching a colour.

## The one idea

The page is a two-ink print, simulated live in WebGL, and the inks carry
the argument:

- **Flame Green `#bee449` = Spark**, the track for everyone else
- **White `#e8e6f0` = Forge**, the track for students who code
- **their overlap `#f9fcf4` = the club**

The stock is matte black `#000000`, so the process is a **screenprint,
not a risograph**, and that inverts the arithmetic. Translucent ink on
light stock filters what passes through it, so inks MULTIPLY and overlaps
go dark. Ink on black stock has nothing to filter — it only adds — so
inks SCREEN and overlaps go hot. `--color-overprint` is the screen blend
of the two inks, not a picked value; recompute it if either ink changes.

The palette comes from the club's logo, read the way a printer reads a
job. The logo is a green flame and white type on a black field, and as
of 2026-08-09 that is now all the palette is — Forge was an ice blue I
introduced, and the client's call was to make it white. **Spark is
measured**: the median of the logo's green pixels, quoted unchanged,
because the logo is already artwork on black.

**`--color-forge` and `--color-chalk` hold the same value on purpose.**
A two-colour screenprint has one white ink; it prints the type and it
prints this track. They stay separate tokens because they mean different
things and either may move without the other.

**One consequence to know:** white screens with anything to give white,
so `--color-overprint` is no longer a third COLOUR — it is a third
VALUE, brighter than either ink. That is unavoidable arithmetic, not a
tuning choice, and it is why the overprint now reads as a hot core
rather than as a mixture.

## On being on black

This build spent its first two days explicitly avoiding a near-black
page, because near-black plus one acid accent is the generated-design
default in the list above and the club's own colours land straight on
it. The client asked for black stock anyway. That is their call, and the
job is to make it not read as the default. These are load-bearing:

- **Two inks, not one accent on a void.** The green never appears alone.
- **Visible tooth.** The fibre pass is the only thing on the sheet that
  is neither ink nor void. It is ADDED on this stock, not multiplied —
  any percentage of `#000` is `#000` — and it is one-sided, because
  black is the floor and a symmetric offset would clamp its lower half
  away and quietly raise the mean.
- **Type is bone `#e8e6f0`, never `#ffffff`.** Pure white on black
  halates and closes the counters of a condensed face.
- **No glow, no gradient bloom.** The only light on the page is where
  two halftone screens overlap, and that is arithmetic.

The light-stock version is not lost — it is commit `85912ff` on
`demo-waving-dots`, pale lilac with an indigo/flame pair, and the ink
model there is a multiply. If the stock ever goes back, that commit is
the reference and every ratio in `chapters.ts` inverts with it.

The signature is **moiré**. Each ink is screened at its own halftone
angle. Apart, they sit at the textbook 75°/15° separation that printers
use precisely to avoid interference. As the tracks converge (hero,
signup) the angles converge too and the sheet blooms into live moiré.
Registration drift is driven by scroll velocity, so scrolling literally
pulls the sheet through the press.

## The three states

The coverage field has exactly three states, and the whole behavioural
system is which one is active:

- **Gathered** (`uDisperse` 0) — the landing page. The club's flame,
  struck from the real logo artwork (`public/logo-flame.png`) by both
  drums on one centre, and burning.

  The two inks are separated by a **spread**, not an offset: the white
  plate is struck ~5% larger (`GATHERED.trap`), which is what a press
  does so no hairline of stock shows at a colour boundary. Offsetting
  the drums instead — which is what this did first — puts the entire
  fringe on one side and reads as a drop shadow. The rim a spread
  produces grows with distance from the centre, so it is finest where
  the artwork is dense and widest at the tips, which is also how it
  behaves on press. Only the white drum is spread; spreading both just
  makes one larger flame with no rim at all.

  It used to be an abstract mass wobbling like set jelly. Right motion,
  wrong shape — the club's mark *is* a flame, so there was no reason to
  approximate a shape the logo already provides.

  The deformation is applied to the SAMPLE COORDINATE, not to a distance
  field. That is what lets real artwork move like fire: the plate stays
  fixed and the sheet warps under it, so every lick and every gap
  between licks deforms correctly without any of them being modelled.

  The weighting is the whole trick. A flame is anchored at its base and
  free at its tips, so the lateral lick is scaled by `h*h` — quadratic in
  height up the plate. An unweighted displacement just slides the whole
  flame sideways, which reads as a logo on a wobble rather than as
  something burning. Measured: ~15% of the flame's own pixels change per
  1.4s with no scrolling, and it is all in the top half.

  **The lick's SPATIAL frequencies are load-bearing — keep them all
  above ~9.0 radians across the height.** They are what decides whether
  the deformation is a lick or a lean. At 1.5+ cycles from base to tip,
  the upper flame leans one way while the part below it leans the other
  and it reads as a ripple travelling up. An earlier version used 4.6,
  which is under one cycle, so across the whole upper flame it acted as
  a constant offset — and with `h*h` on top, the entire top translated
  sideways as a slab. That measured 44px of drift on a 440px-wide flame
  and read as the logo falling over. Amplitude controls how far it
  moves; spatial frequency controls whether the movement is fire.

  Measure a change here in the FLAME's own frame, not a fixed window.
  The flame gains and loses about 76px of height as it breathes, which
  drags artwork through any fixed crop and shows up as lean that is not
  there. Tracked properly, the residual lean is 14px, about 3%.

  No bounds test on the sample. The plate carries a transparent border
  and is sampled ClampToEdge, so off-artwork returns alpha 0 by itself;
  a hard test would put a straight cut across the licks at exactly the
  moment they swing furthest.
- **Dispersed** (`uDisperse` 1) — everywhere else. Bands at both trim
  edges, Forge left and Spark right, inner edges running a travelling
  wave that scroll pushes along. They print as a **tint**: `dispersed()`
  ends with a flat `0.56` reduction, applied there rather than in the
  chapter ink columns so that thinning the waves does not also thin the
  flame and the mark. Those are objects; the bands are atmosphere
  running down the margin beside 900px of body copy.

- **The handoff between the first two is a JOURNEY, not a crossfade**,
  and this is the part most likely to get broken by a well-meaning
  simplification back to `mix()`.

  A `mix(gathered, dispersed, uDisperse)` is a crossfade by
  construction: the bands fade up at the trim while the flame is still
  fading out on the right, both are on screen at once, and nothing ever
  appears to have moved. That is two things taking turns, not an
  animation, and it was the specific complaint this was built to fix.

  Instead the flame is physically dragged off. Each drum's copy travels
  to its OWN trim edge — Forge crosses the entire sheet, straight
  through the word THE SPARK, because it starts beside Spark on the
  right — while the sample box is squeezed in x and drawn out in y, so
  a compact flame arrives at the trim already shaped like a band. Ink
  thins as it stretches, further than conservation alone requires,
  because Forge's route runs across the measure.

  Then each state gets its own envelope and they combine with `max()`,
  not `mix()`. The windows overlap — they have to, or there is a hole —
  but **the order is the whole point**: the band does not start until
  `uDisperse` 0.58, by which time the flame is already two thirds of the
  way to that same edge. The overlap happens in one place, late.
  `max()` rather than a sum so the shared region does not print double.

  `go = pow(uDisperse, 1.5)`, not squared. Squared looked better on its
  own but left the flame only half way across when the bands had to
  start arriving, and arriving first is what sells it as one motion.
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
  real text in `Mark.tsx` instead.

**Both plates are keyed out of a screenshot** (`logo-lockup.png` at
617x276, `logo-flame.png` at 236x341, the flame keyed on green-ness
because it is the only green thing in the artwork). **If a proper vector
logo turns up, replace both** — they are the lowest-fidelity assets in
the build. Aspect ratios are read off the images at load, so a
replacement only has to be the same artwork, not the same size.

`uDisperse` is read straight off scroll position, never damped toward a
target, so it is exactly reversible on the way back up and cannot
overshoot. It only ever increases. **Do not reintroduce per-section
coverage that can reach zero** — that is what made the ink vanish
between sections and slam back at the next one, and it is the specific
complaint this system was built to fix.

## The title sequence

`components/Intro.tsx` + the `.intro` rules in `globals.css`. A 10s clip
plays once over the page, then dissolves into the live hero underneath.

**KNOWN AND ACCEPTED: THE CLIP CONTAINS MISSPELLED TYPE.** It is
generated video, so its lettering is hallucinated rather than typeset.
From roughly 5s it reads "AI ZONITE · YORK UNIVERSITY", "FALL 2826",
"LASSONDE SCHOOL OF EN6INEERING", and both track chips are gibberish.

It shipped cut at 4.5s — the last frame before any type appears — for
exactly that reason. The client's call (2026-08-08) is to run the full
10s regardless, as an MVP. This is recorded so nobody rediscovers the
misspellings later and assumes they were missed. **The fix is a
corrected clip, not code.** To re-cut, re-encode with `-t 4.5`; nothing
in the code depends on the length, because every timing is measured
against `video.duration` at runtime.

Master is `assets/do_the_second.mp4` — 1280x720, 10s, with an audio
track. It lives outside `public/` deliberately: only `public/` is
served, so it can be versioned without a visitor ever fetching it
directly. Regenerate `public/intro.mp4` with:

    ffmpeg -i assets/do_the_second.mp4 -an -c:v copy \
      -movflags +faststart public/intro.mp4

**`-c:v copy`, NOT a re-encode.** This started life at `-crf 28`, which
threw away 63% of the bitrate (1.88 Mbps down to 0.69) and measured SSIM
0.9878 against the source — soft exactly where this clip lives, on the
circuit board's fine detail and the flat dark gradients. Re-encoding to
win that back is worse than pointless: at `-crf 20` the output came out
**3.0MB, larger than the 2.3MB stream copy, and still lossy**. There is
nothing to gain by transcoding a file that is already H.264 High/yuv420p
at a sane bitrate.

`-an` is not optional — autoplay requires muted, so the audio track can
never play and is pure weight. `-movflags +faststart` is not optional
either: it moves the moov atom ahead of the media data so playback can
begin before the file finishes downloading.

**The remaining softness is resolution, not compression, and cannot be
fixed here.** The master is 720p and the overlay is full-bleed: on a
1440x900 viewport `cover` scales it to 1600x900, and on a 2x display
that is 3200 device pixels drawn from 1280 — a 2.5x upscale. The only
real fix is a 1080p or better master from whatever generated it.

**It plays on EVERY load, including refreshes** — client's call
(2026-08-09). It previously ran once per browser session, which is the
usual courtesy for a 10s sequence; that guard was removed deliberately,
not lost, so do not "fix" it back. Repeat plays come from the HTTP cache
rather than the network, so the cost is time rather than bandwidth, and
Skip is the escape hatch.

Five things here are load-bearing and all five look like they could be
simplified away:

- **No `autoPlay` attribute, and `preload="none"`.** The obvious build —
  autoplay plus preload, hidden with CSS when unwanted — does not work:
  `display: none` does not stop a download, and removing the src on
  mount does not abort one in flight. Measured, a view that showed
  nothing still pulled the entire clip. Playback is started from JS, so
  no play call means no bytes — which is what keeps the download off
  anyone who has asked motion to stop.
- **The overlay is hidden by DEFAULT** and shown only when the inline
  script in `layout.tsx` adds `intro-armed`. That script is really a
  scripting test: with JS off the class never lands, nothing displays,
  and the reader gets the hero at once instead of a dead poster frame.
- **The CSS animation is a backstop, not the clock**, and it is
  DISARMED by `data-playing` as soon as frames run. It cannot just be
  set longer than the clip: at 10s that would hold a dead poster frame
  for twelve seconds whenever the script arms the overlay and React then
  fails to hydrate. So it fires early enough to rescue that quickly, and
  real playback cancels it — after which the deadline is re-armed from
  the clip's own remaining duration.
- **Dismissal fires ~0.9s BEFORE the end**, off `timeupdate`, so the clip
  is still running as it dips. Waiting for `ended` fades a freeze-frame,
  which is a cut rather than a handoff.
- **The handoff is a DIP TO BLACK, in two phases — not a crossfade.**
  Fading the overlay out directly puts two different hero layouts on
  screen at once: the clip's, at whatever scale `cover` cropped it to,
  ghosting through the real one at its own size, two sets of headline
  type dissolving through each other. It is the mismatch that gets
  noticed, not the fade. Phase one takes the video to nothing while the
  overlay stays opaque and its field settles to true black; phase two
  lifts that black off, so the hero comes up out of black. The video's
  fade is the one `linear` on the site — `--ease-press` is an entrance
  curve and dumps the brightness too early, so a dip on it blinks.
- **`contain` on phones, `cover` above.** A portrait viewport crops a
  16:9 frame so hard that the clip's own headline came out as "RK",
  which reads as a broken image. The overlay's background is `#101010`
  to match the clip's own field rather than the page's true black, so
  the letterbox that makes possible is invisible.

Verified: covers the viewport while playing and releases it after; the
sign-up CTA is hit-testable once clear; it replays on refresh; reduced
motion displays nothing and fetches nothing.

## Where things are

- `lib/press/shader.ts` — the press. Coverage field → per-ink halftone
  screen → registration offset → screen composite. Commented in order.
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
  framebuffer unconverted and every ink prints several stops dark (the
  whites land on mid grey). The palette was also derived as an sRGB screen
  blend, so the shader has to blend in the same space.
- **Nothing may be opaque except type.** An opaque background on any
  element punches a card-shaped hole through the ink behind it. Use
  borders for dividers, never a filled cell over a gap.
- **Balanced drums bleach the sheet.** Screening two bright inks at
  equal coverage drives the result toward white, so anywhere the two
  drums are level the colour is destroyed rather than mixed. This is the
  single biggest behavioural difference from the multiply version, where
  balance produced the richest colour. It is why the `mark` chapter runs
  0.22/0.80: at equal coverage the club's green flame printed as a white
  smudge.
- **The two ink columns in `chapters.ts` are not comparable numbers, and
  the ratio is the opposite of what it was on light stock.** Spark leads
  everywhere except the Forge section, because the flame is the club's
  colour and the sheet reads green-forward. On light stock Spark led for
  a different reason — it was the weaker ink and needed the area. If the
  stock ever changes, work out which reason applies before copying either
  set of numbers.
- **Every coverage value is about half its light-stock equivalent.** Ink
  on black only adds, so a dot that was a tint on paper is a light source
  here and the same numbers flood the sheet.
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
  brand kits and render them in chalk — a real two-ink job would not fire
  a third drum for a logo, and York red between white and an acid green
  is a genuine clash. On black stock the **white/reversed** version is
  the one to ask for, not the mono-dark one.
- `NEXT_PUBLIC_SIGNUP_URL` is unset, so the sign-up button falls back to
  `#`. It is inlined at build time, so it must be set before building.
- Social links in `Colophon.tsx` point at `#`.
