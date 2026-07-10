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

## LogoMascot.tsx — the live 2D mascot (2026-07-09, path revised same day)
Percent-space `left`/`top` keyframes (relative to the logo image's own box, not the
viewport) animated via Framer Motion's `animate` + `times` arrays, `repeat: Infinity`.
**Revised path** (first version slid down the "I" stroke's *inner* edge — user said
it should be the *outer* (right) edge instead, climbing back up through the real gap
next to "A" same as before): slide down `I_OUTER`'s top-right→bottom-right corners,
then climb back up through the same gap waypoints as before, first/last keyframes
identical for a seamless loop. **Mascot size bumped 5%→14% of the logo's box width**
— deliberately wider than the real gap (~12.4%) so it visually covers/bridges the
gap as it shuffles from the outer edge across into the climb, rather than reading as
a tiny icon crossing a much wider empty span with a jarring lateral jump. The
percentages were derived from the same real-image pixel analysis as
`lib/three/aiGlyphPaths.ts` (`col/558*100`, `row/399*100` against the actual
558×399 `public/logo-ai.png`), not eyeballed — see the extraction method in
"AnthropicElement rework" below. `SideLogo.tsx`'s `<img>` was switched to
`next/image`'s `<Image>` (explicit `width={558} height={399}`) to fix an ESLint
`no-img-element` warning introduced when the plain `<img>` was pulled out of the
`motion.img` it used to be, wrapped in a new `relative inline-block` box so
`LogoMascot` has a percentage frame to position against.

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
