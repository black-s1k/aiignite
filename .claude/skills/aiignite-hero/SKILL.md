---
name: aiignite-hero
description: Project context for the AI Club @ York 3D hero landing page — stack, brand-element specs, and asset conventions. Read this before working on app/, components/canvas/, or lib/three/.
---

# AI Club @ York — 3D Hero Landing Page

## What this is
An Awwwards-tier 3D hero landing page for York University's AI Club, inspired by
poch.studio's playful 3D-object-with-tiny-humans aesthetic. Full-screen interactive
3D layer sits behind fixed white-on-black corner chrome: club name top-left, "Contact
Us" top-right, an "AI" wordmark logo bottom-left (all independently `fixed`-positioned,
not a shared header bar — see `components/layout/`).

## Stack
Next.js (App Router, TypeScript) + Tailwind CSS v4 + React Three Fiber + drei + GSAP
(`@gsap/react`'s `useGSAP`) + zustand (imperative shared state for mouse parallax,
already a transitive dep of fiber/drei) + **Framer Motion** (`framer-motion`, v12) for
all DOM/UI animation — corner entrances, hover states, future page transitions.
**Directive from the user (2026-07-09): use Framer Motion from now on for anything
DOM-level.** GSAP stays scoped to the R3F/WebGL scene (Object3D refs via `useGSAP`) —
Framer Motion doesn't drive three.js objects, so this isn't a redundant pairing, it's
two tools for two different render trees. No physics engine.

## Current state (2026-07-09, latest)
`Scene.tsx` renders **only `LightingRig`** — all 4 element components (Anthropic/
ChatGPT/n8n/Perplexity) are unmounted, source intact in `components/canvas/elements/`.
The page's one and only "AI" mark is the flat 2D `components/layout/SideLogo.tsx`
image — **and it now has the mascot animation too**, done as a 2D Framer Motion
overlay (`components/layout/LogoMascot.tsx`), not the 3D canvas version. History:
`AnthropicElement` was first reworked to extrude the real logo in 3D with a mascot
(GSAP-driven, see below) and mounted in the canvas — user said this produced two
competing "AI" marks on screen (a 3D one small/gray near the top from lighting, the
2D `SideLogo` large/flat white lower down) and asked to delete the 3D one and keep
only the flat 2D logo. Then pointed out the kept version had no visible mascot — so
the mascot was rebuilt as a 2D DOM overlay directly on `SideLogo` instead of
resurrecting the 3D element. **The GSAP/3D mascot section below describes dormant,
unmounted code** (kept for the extraction methodology and in case 3D comes back) —
the live mascot is `LogoMascot.tsx`, Framer-Motion-driven, positioned in percentages
so it tracks `SideLogo`'s image box at any size.

## LogoMascot.tsx — the live 2D mascot (rewritten 2026-07-10, twice)
Percent-space `left`/`top` keyframes (relative to the logo image's own box, not the
viewport) animated via Framer Motion's `animate` + `times` arrays, `repeat: Infinity`.

**Hard constraint, settled 2026-07-10 (don't re-litigate without new user input):**
the mascot's footprint must NEVER overlap the white glyph paint — user's reference
was signage lettering standing on a mounting bar, not embedded in it. This directly
reverses an earlier decision (mascot sized wider than the gap "to bridge/cover it")
— that was wrong; the correct read was to stay clear of the white on both the slide
edge and inside the gap. Concretely: `POINTS` are offset via the edge's own
perpendicular (not just `+x`) during slide, and mascot width (10%) is kept narrower
than the real gap (~12.4%) during climb, both verified by overlaying the mascot's
actual footprint circle on the real logo image at every waypoint (PIL script — draw
the path + a circle of the mascot's diameter at each point over `public/logo-ai.png`
— faster and more reliable than reasoning about clearances in the abstract).

**History**: v1 slid down the "I" stroke's inner edge. v2 moved the slide to the
outer (right) edge but had the transition between slide-bottom and the climb cut
*laterally through* the solid "I" shape (a straight-line interpolation between a
point outside "I" and a point inside the gap necessarily crosses the solid glyph
between them) — visible in a user-supplied video as the mascot appearing to sit
partly inside the white stroke. v2 also glided smoothly position-wise between
climb-bottom and climb-top while the limb articulation animated on its own
timeline, so the "climbing" never visibly correlated with upward progress.

**v3** fixed the geometry crossing: an 11-point path where the slide→climb and
climb→slide transitions detour through the open black space below the baseline and
above the top edge — both letters' real extents, not guessed — instead of cutting
through solid geometry. The climb itself is broken into 4 discrete linear steps
between the real gap-bottom/gap-top points, each step paired with an
alternating-side `grab()` pose (contralateral: reaching arm + tucked opposite-side
leg lift together, mirroring a real climbing/crawling gait) so the body visibly
advances each grab rather than floating independently of the limbs. All per-limb
rotation arrays (`TORSO_ROT`, `ARM_L`, `ARM_R`, `LEG_L`, `LEG_R`) are derived from
one `POSES: Pose[]` array via `.map()` — never hand-type these as separate arrays,
they *will* drift out of sync/length with `POINTS`/`TIMES` (11 entries each) if
edited independently. v3 sized the mascot at 18% — deliberately *wider* than the
real gap (~12.4%) to bridge/touch both edges. **v4 reversed that** — see
the "Hard constraint" note above; mascot is 10% (narrower than the gap) and
every `POINTS` waypoint is offset to keep the mascot's full footprint, not just its
center, clear of the white paint.

**v5 (current, 2026-07-10)**: v4 kept the body centered on the gap's midline for
all 4 climb steps, only the limb *rotation* varied — user feedback: it read as
"floating," reaching for support but never touching the walls. Root cause, found
by solving the actual nested transform chain (arm rotation about the shoulder →
torso rotation about the hip → outer percent-space translate) rather than
eyeballing: with the body centered, even a fully-horizontal arm falls ~2pt short
of either wall — the ~12.6pt gap (confirmed near-constant via pixel regression:
both wall edges are straight lines, not curves, R² residual < 0.1pt) is wider
than the reach. Fixed by making the climb an actual chimney/stem climb: each step
now offsets the body 2.5pt off the midline *into* whichever wall that step's hand
grabs (baked directly into `POINTS`, alternating sides — this is what makes the
path zigzag rather than run a straight vertical line up the gap), and the
grabbing arm's rotation in `grab()` was root-solved (not eyeballed) so the
hand-circle's edge — not just its center — lands just inside the real wall line.
Verified two ways: (1) numerically, a nearest-white-pixel scan around each solved
hand position against the real alpha mask — first pass at a 0.15pt clearance
target still overlapped by ~0.3px (the wall fit's own residual ate the margin),
widened to 0.4pt and reverified clean with 1.2–1.7px of real clearance; (2)
visually, the same full-path-over-the-real-image overlay technique, confirming
the zigzag stays inside the gap the whole way and no segment cuts through solid
geometry. Legs are geometrically too short to reach either wall from any
achievable body offset (checked, no solution exists) — they stay a suggestive
tucked/push gesture, only the grabbing hand is a verified contact point. One
keyframe's y also moved (97.31 → 95.5): the original value sat past where the
letters' pixel data actually ends (97.24), i.e. grabbing a wall that had already
run out — caught by the same nearest-white-pixel check coming back empty.
`components/layout/LogoMascot.tsx`'s own top-of-file comment has the full math
writeup if this needs revisiting again.

The percentages were derived from the same real-image pixel analysis as
`lib/three/aiGlyphPaths.ts` (`col/558*100`, `row/399*100` against the actual
558×399 `public/logo-ai.png`), not eyeballed — see the extraction method in
"AnthropicElement rework" below. Before trusting any waypoint by eye again,
regenerate/verify by overlaying the path on the actual logo image (a quick
PIL script — draw the points + connecting lines over `public/logo-ai.png` — is
faster and more reliable than reasoning about percentages in the abstract, and is
how the v3 path was validated with no live browser access).

`SideLogo.tsx`'s `<img>` was switched to `next/image`'s `<Image>` (explicit
`width={558} height={399}`) to fix an ESLint `no-img-element` warning introduced
when the plain `<img>` was pulled out of the `motion.img` it used to be, wrapped
in a new `relative inline-block` box so `LogoMascot` has a percentage frame to
position against.

## AnthropicElement rework — real logo geometry + mascot, dormant/unmounted (2026-07-09)
`AnthropicElement.tsx` extrudes the *actual* "AI" wordmark (`public/logo-ai.png`),
not a generic placeholder. Outline coordinates in `lib/three/aiGlyphPaths.ts`
(`A_OUTER`, `A_HOLE`, `I_OUTER`) were pulled directly off the real image via
`scipy.ndimage.label` (connected components: the "A" blob vs. the "I" bar blob,
plus the enclosed background region = the "A"'s triangular counter/hole) and
`skimage.measure.find_contours` + `approximate_polygon` (contour trace + polygon
simplification) — not eyeballed. **Both shapes share one un-recentered coordinate
space** (centered as a *pair* during extraction) — never call `.center()` on either
geometry individually, that would destroy the real gap between them. This same
pixel→percent conversion is what `LogoMascot.tsx`'s path is derived from.

A generic mascot (`components/canvas/MinionCharacter.tsx` — capsule body, plain dot
eyes, blue overalls; deliberately *not* a reproduction of the specific copyrighted
character the user referenced, see file comment) slides down the "I" bar's inner
(left) face, then climbs back up through the *actual* empty gap between "A" and the
bar, back to its exact starting point — the slide and climb curves share literal
endpoints (`I_LEFT_EDGE_TOP`/`I_LEFT_EDGE_BOTTOM`), which is what makes `repeat: -1`
loop with no teleport/snap. A trailing `.set(progress, {t:0})` at the end of the
GSAP timeline is load-bearing: without it, the first slide tween after the first
repeat cycle sees `progress.t` already at `1` and produces zero visible motion.
**This whole component is currently unmounted — see "Current state" above.**

## Brand fidelity decision (still applies to ChatGPT/n8n/Perplexity if they return)
We do **not** hand-sculpt fake 3D replicas of Anthropic (the AI company)/OpenAI/n8n/
Perplexity's logos for those three elements if/when they come back. That was flagged
as trademark-risky and tends to look cheap/"vibe coded" compared to using the real
thing — each stays neutral placeholder geometry (no brand colors) that becomes a
**texture surface** once the user supplies real logo image files from each company's
official brand kit (see "Asset pipeline" below). This does not apply to the
Anthropic*Element* file — that now renders the *club's own* "AI" mark (a different,
unrelated use of the same old filename/codename — see "AnthropicElement rework" above).

## The four elements (ChatGPT/n8n/Perplexity specs; Anthropic superseded above)
1. **Anthropic** — superseded, see "AnthropicElement rework" above.
2. **ChatGPT** — a sphere/crest rotating continuously on Y via `useFrame` delta-time.
   A tiny human sits on top doing a static run-in-place loop. **Critical nuance**:
   the human's wrapper group must be a *sibling* of the rotating sphere mesh, not a
   child — otherwise it inherits the spin. Never solve this with counter-rotation
   math unless a later requirement specifically demands true parenting.
3. **n8n** — node spheres linked by `CatmullRomCurve3` + drei `<Tube>` pipes. 2-3 tiny
   humans: one pendulum-swings from a pipe midpoint (`gsap.to(pivot.rotation, {z, yoyo:true, repeat:-1})`),
   others do staggered idle breathing loops on node spheres.
4. **Perplexity** — 2-3 nested `torusGeometry` rings, each with a different initial
   tilt and independent per-axis angular velocity via `useFrame`. No human — per spec.

General animation rule: continuous/unbounded motion → `useFrame` delta-time;
finite/eased/held/yoyo sequences → GSAP timeline via `useGSAP`, mutating Object3D
refs directly (never React state for animation loops).

## Mouse parallax gotcha
The canvas is `pointer-events-none` so header text stays clickable. That means R3F's
built-in pointer tracking (`useThree().pointer`) never fires. Parallax is wired via a
window-level `pointermove` listener → zustand store (`hooks/useMouseParallax.ts`),
read imperatively via `store.getState()` inside each element's `useFrame` (never the
reactive hook, to avoid re-render thrash), smoothed with `THREE.MathUtils.damp`
(frame-rate independent, unlike a fixed-factor lerp).

Also: `<Canvas className="pointer-events-none">` alone does NOT work — R3F sets an
inline `style.pointerEvents = 'auto'` on its wrapper div by default, and inline
styles beat Tailwind classes in the cascade. Must pass `style={{ pointerEvents: 'none' }}`
explicitly.

## Shadow map gotcha
`<Canvas shadows="soft">` maps to `THREE.PCFSoftShadowMap`, which the installed
three.js (0.185.1) has deprecated — it silently downgrades to `PCFShadowMap` and
logs a console warning. Use `shadows="variance"` (→ `THREE.VSMShadowMap`) instead
to actually get soft shadows. (A second console warning, `THREE.Clock deprecated,
use THREE.Timer instead`, comes from inside `@react-three/fiber@9.6.1` itself
instantiating `new THREE.Clock()` for `state.clock` — that one is upstream, not
fixable from this codebase; ignore it until fiber updates.)

## Asset pipeline (for when real assets arrive)
- `public/logos/{brand}.png` and `public/models/{brand}.glb` — referenced by URL
  string (`useTexture`, `useGLTF`), no bundler config needed.
- `lib/three/assets.ts` exports `LOGO_PATHS` / `MODEL_PATHS` typed
  `Partial<Record<Brand, string>>`. Entries are **absent** until a real file exists —
  Suspense only covers the loading state, not a missing/404 file (that's a thrown
  error Suspense won't catch). Swap-in is "drop the file + add the key," not just
  "drop the file."

## Deferred libraries (don't add without revisiting why)
- `@react-three/postprocessing` — defer until real logo textures/materials exist;
  tuning bloom/vignette against placeholder gray now would need redoing.
- `lenis` — defer until a phase introduces actual scrollable content.
- `@react-three/rapier` — not needed; a GSAP yoyo tween covers pendulum-style motion
  without a physics engine.

## Corner chrome + logo asset
- `components/layout/Header.tsx` — two independent `motion.div`/`motion.a`, `fixed`
  to `top-left`/`top-right`, fade+slide in on mount via Framer Motion.
- `components/layout/SideLogo.tsx` — `motion.img` fixed to the vertical middle of
  the left edge (shifted diagonally up from an original bottom-left placement per
  user feedback), `pointer-events-none` (decorative, shouldn't intercept clicks).
- `public/logo-ai.png` — the club's "AI" wordmark. **Source note**: the file the
  user supplied had its transparency baked into a checkerboard pattern instead of
  a real alpha channel (`hasAlpha: no`), and the mark itself was black — invisible
  on this site's black background. It was reprocessed (luminance-threshold keying
  → real alpha, recolored white, cropped to content bbox) before landing in
  `public/`. If a fresh source file arrives, check `sips -g hasAlpha` before
  assuming it's usable as-is.

## Key files
- `components/layout/SideLogo.tsx` — the live logo + mascot host (`next/image` + `LogoMascot`)
- `components/layout/LogoMascot.tsx` — the live 2D mascot, Framer Motion percent-path
- `components/canvas/SceneCanvas.tsx` — the fixed full-screen `<Canvas>`
- `components/canvas/Scene.tsx` — currently just `LightingRig` (see "Current state")
- `components/canvas/elements/AnthropicElement.tsx` — dormant 3D glyph + GSAP mascot loop
- `components/canvas/MinionCharacter.tsx` — dormant 3D mascot mesh
- `lib/three/aiGlyphPaths.ts` — extracted real logo outline coordinates (3D units;
  `LogoMascot.tsx`'s percent path is derived from the same pixel analysis, not this file)
- `lib/three/layout.ts` — `FORMATION`, the single source of truth for element positions
- `hooks/useMouseParallax.ts` — the zustand store + listener described above
- `components/layout/Header.tsx` — fixed top-corner chrome
- Full original plan with all validated package versions/gotchas:
  `/Users/nrup/.claude/plans/jolly-jumping-newell.md`
