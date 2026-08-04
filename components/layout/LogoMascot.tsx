"use client";

import { motion, type Easing, type Transition } from "framer-motion";

/**
 * Percent-space path (relative to the logo image's own box), real edges from
 * the same pixel extraction as lib/three/aiGlyphPaths.ts. The mascot must never
 * visibly overlap the white glyph paint — like signage lettering standing on a
 * mounting bar, not embedded in it:
 *   0-2  SLIDE      down "I"'s OUTER (right) edge, offset outward along the
 *        edge's own perpendicular (not just +x) so it hugs the border from
 *        the black side without straddling it
 *   3    UNDER-PASS below the baseline (clear of both glyphs' bottom) —
 *        crosses laterally where there is no solid geometry, instead of
 *        cutting through the "I" stroke like an earlier version did
 *   4-8  CLIMB      up the real gap between "A"'s outer-right edge and "I"'s
 *        inner-left edge, ZIGZAGGING between the two walls (not centered on
 *        the midline — a centered body leaves both hands short of either
 *        wall, which is exactly what read as "floating") — see the chimney-
 *        stem physics note below
 *   9    OVER-PASS  above the top edge, mirroring under-pass
 *   10   back to SLIDE_TOP — identical to point 0, closes the loop
 *
 * CLIMB physics (2026-07-10 rewrite): both walls of the real gap are true,
 * near-parallel straight edges — pixel regression against public/logo-ai.png
 * (row/399*100, col/558*100) gives A's outer-right edge as x = 0.2828*y +
 * 43.28 and I's inner-left edge as x = 0.2828*y + 55.92 (residual < 0.1pt
 * across the full height — these are straight lines, not curves). Gap width
 * is a near-constant ~12.6pt. Earlier versions kept the body centered on the
 * gap's midline the whole climb, which reads as floating: with the body
 * centered, even a fully-horizontal arm falls ~2pt short of either wall (the
 * gap is wider than the reach). Real contact requires the body itself to
 * lean into whichever wall that step's hand is grabbing — like chimney/stem
 * climbing a narrow crack, not hanging in open space and gesturing at it.
 * So each climb step now offsets the body 2.5pt off the midline toward the
 * wall being grabbed, alternating sides — POINTS below bake in
 * midline(y) ± 2.5 directly. The corresponding arm rotation in POSES.grab() was solved
 * numerically (not eyeballed) by composing the actual nested SVG transform
 * chain (arm-local rotation about the shoulder, then torso rotation about
 * the hip, then the outer div's percent-space translate) and root-finding
 * for the rotation where the hand-circle's edge — not just its center —
 * lands just inside the wall line with a 0.4pt clearance target. Verified
 * against the real alpha mask afterward (nearest-white-pixel scan around
 * each solved hand position): a first pass at 0.15pt clearance still
 * overlapped by ~0.3px per hand (the linear wall fit's own residual eats
 * into a too-tight margin), widened to 0.4pt and reverified clean with
 * ~1.2-1.7px of real clearance on every grab. Legs are geometrically too short to reach
 * either wall from any achievable body offset (verified: no root exists),
 * so leg poses stay a suggestive tucked/pushing gesture rather than claiming
 * literal contact — only the grabbing hand is a verified touch point.
 */
const POINTS: [number, number][] = [
  [76.71, 1.27], // 0  SLIDE_TOP    — beside I's outer edge, top
  [89.5, 48.5], // 1  slide bow
  [103.32, 95.88], // 2  SLIDE_BOTTOM — beside I's outer-bottom corner
  [90.17, 103.07], // 3  under-pass
  [79.11, 95.5], // 4  gap entry (grab 1) — leaned onto I's wall (midline+2.5). y
  //    nudged up from the gap's true bottom (97.24) to 95.5: right at 97.24 the
  //    letters end and there's no wall left to grab, verified by a nearest-white-
  //    pixel scan finding nothing within 8px at 97.31.
  [67.92, 73.62], // 5  climb step (grab 2) — leaned onto A's wall (midline-2.5)
  [66.22, 49.94], // 6  climb step (grab 3) — leaned onto I's wall (midline+2.5)
  [54.52, 26.25], // 7  climb step (grab 4) — leaned onto A's wall (midline-2.5)
  [50.33, 2.57], // 8  gap exit / crest — back to gap midline, top
  [63.55, -2.94], // 9  over-pass
  [76.71, 1.27], // 10 SLIDE_TOP — loop close
];

const TIMES = [0, 0.16, 0.35, 0.42, 0.47, 0.56, 0.65, 0.74, 0.83, 0.9, 1];
const EASE: Easing[] = ["easeIn", "easeOut", "easeIn", "easeOut", "easeInOut", "easeInOut", "easeInOut", "easeInOut", "easeOut", "easeIn"];
const DURATION = 7;

const LEFT = POINTS.map(([x]) => `${x}%`);
const TOP = POINTS.map(([, y]) => `${y}%`);

type Pose = { torsoRot: number; torsoY: number; armL: number; armR: number; legL: number; legR: number };

const SLIDE: Pose = { torsoRot: -9, torsoY: 0, armL: -152, armR: 152, legL: -10, legR: 10 };
const TUCK: Pose = { torsoRot: 20, torsoY: 1.5, armL: -70, armR: 70, legL: 55, legR: -55 };
const CREST: Pose = { torsoRot: -14, torsoY: -1, armL: -170, armR: 170, legL: -5, legR: 5 };

/** One hand-over-hand grab onto a specific wall of the real gap: "I" grabs I's
 * inner-left edge with the right hand, "A" grabs A's outer-right edge with the
 * left hand. Body leans (torsoRot) and shifts (see the matching POINTS x, which
 * bakes in midline(y) ± 2.5) toward that wall so the reaching arm's rotation —
 * solved, not eyeballed, see the CLIMB physics note above POINTS — actually
 * closes the real distance to the wall instead of falling short of it. The
 * trailing arm tucks in; the contralateral (opposite-side) leg does a
 * suggestive push/lift — legs can't geometrically reach either wall from here,
 * so they read as mid-transition rather than claiming a touch they don't make. */
function grab(wall: "I" | "A"): Pose {
  return wall === "I"
    ? { torsoRot: 15, torsoY: 1, armR: -59.75, armL: 10, legL: 25, legR: -15 }
    : { torsoRot: -15, torsoY: 1, armL: 10.75, armR: -10, legR: -25, legL: 15 };
}

const POSES: Pose[] = [
  SLIDE, // 0 SLIDE_TOP
  { ...SLIDE, torsoRot: -11 }, // 1 slide bow — subtle wobble
  { ...SLIDE, torsoRot: -6 }, // 2 SLIDE_BOTTOM — settling in
  TUCK, // 3 under-pass — swinging beneath, knees tucked
  grab("I"), // 4 gap entry — right hand grabs I's wall
  grab("A"), // 5 climb step — left hand grabs A's wall
  grab("I"), // 6 climb step — right hand grabs I's wall
  grab("A"), // 7 climb step — left hand grabs A's wall
  CREST, // 8 gap exit — both-handed pull to top out
  TUCK, // 9 over-pass — swinging over the top
  SLIDE, // 10 SLIDE_TOP — loop close
];

const TORSO_ROT = POSES.map((p) => p.torsoRot);
const TORSO_Y = POSES.map((p) => p.torsoY);
const ARM_L = POSES.map((p) => p.armL);
const ARM_R = POSES.map((p) => p.armR);
const LEG_L = POSES.map((p) => p.legL);
const LEG_R = POSES.map((p) => p.legR);

const cycle = (): Transition => ({
  duration: DURATION,
  times: TIMES,
  repeat: Infinity,
  ease: "easeInOut",
});

/**
 * A generic little-yellow-worker mascot — deliberately not a reproduction of
 * the specific copyrighted character referenced for this task. Sized at 10% of
 * the logo's box — narrower than the real gap between "A" and "I" (~12.4%) on
 * purpose, so it fits inside the gap with clearance on both sides rather than
 * touching either white edge (an earlier, wider version was deliberately sized
 * to bridge/touch both edges — reversed per feedback: it should never overlap
 * the white paint at all, only ride the black border/gap around it).
 */
export default function LogoMascot() {
  return (
    <motion.div
      className="pointer-events-none absolute z-10 aspect-square w-[10%] -translate-x-1/2 -translate-y-1/2"
      animate={{ left: LEFT, top: TOP }}
      transition={{ duration: DURATION, times: TIMES, repeat: Infinity, ease: EASE }}
    >
      <svg viewBox="0 0 100 100" className="h-full w-full overflow-visible">
        <motion.g
          style={{ transformBox: "fill-box", transformOrigin: "50% 62%" }}
          animate={{ rotate: TORSO_ROT, y: TORSO_Y }}
          transition={cycle()}
        >
          {/* Legs (behind torso). Pivot at the hip = each group's top-centre. */}
          <motion.g
            style={{ transformBox: "fill-box", transformOrigin: "50% 0%" }}
            animate={{ rotate: LEG_L }}
            transition={cycle()}
          >
            <rect x="39.5" y="70" width="9" height="20" rx="4.5" fill="#f2c94c" />
            <ellipse cx="44" cy="90" rx="6" ry="3.5" fill="#1a1a1a" />
          </motion.g>
          <motion.g
            style={{ transformBox: "fill-box", transformOrigin: "50% 0%" }}
            animate={{ rotate: LEG_R }}
            transition={cycle()}
          >
            <rect x="51.5" y="70" width="9" height="20" rx="4.5" fill="#f2c94c" />
            <ellipse cx="56" cy="90" rx="6" ry="3.5" fill="#1a1a1a" />
          </motion.g>

          {/* Arms (behind torso). Pivot at the shoulder = each group's top-centre. */}
          <motion.g
            style={{ transformBox: "fill-box", transformOrigin: "50% 0%" }}
            animate={{ rotate: ARM_L }}
            transition={cycle()}
          >
            <rect x="30" y="48" width="8" height="22" rx="4" fill="#f2c94c" />
            <circle cx="34" cy="70" r="5" fill="#f7d774" />
          </motion.g>
          <motion.g
            style={{ transformBox: "fill-box", transformOrigin: "50% 0%" }}
            animate={{ rotate: ARM_R }}
            transition={cycle()}
          >
            <rect x="62" y="48" width="8" height="22" rx="4" fill="#f2c94c" />
            <circle cx="66" cy="70" r="5" fill="#f7d774" />
          </motion.g>

          {/* Torso + overalls */}
          <rect x="33" y="30" width="34" height="42" rx="16" fill="#f2c94c" />
          <rect x="35" y="54" width="30" height="20" rx="8" fill="#2f5fd6" />
          <rect x="42" y="44" width="4" height="14" rx="2" fill="#2f5fd6" />
          <rect x="54" y="44" width="4" height="14" rx="2" fill="#2f5fd6" />

          {/* Eyes, with an occasional blink (squash on Y) to sell the life. */}
          <motion.g
            style={{ transformBox: "fill-box", transformOrigin: "50% 50%" }}
            animate={{ scaleY: [1, 1, 0.1, 1, 1, 0.1, 1, 1, 1, 1, 1] }}
            transition={{ ...cycle(), times: [0, 0.1, 0.12, 0.14, 0.5, 0.52, 0.54, 0.7, 0.85, 0.95, 1] }}
          >
            <circle cx="43" cy="42" r="6" fill="#1a1a1a" />
            <circle cx="57" cy="42" r="6" fill="#1a1a1a" />
            <circle cx="45" cy="40" r="1.8" fill="#ffffff" />
            <circle cx="59" cy="40" r="1.8" fill="#ffffff" />
          </motion.g>
        </motion.g>
      </svg>
    </motion.div>
  );
}
