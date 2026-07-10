"use client";

import { motion, type Transition } from "framer-motion";

/**
 * Percent-space waypoints (relative to the logo image's own box): slides down
 * the "I" stroke's OUTER (right) edge — the side facing away from "A" — then
 * climbs back up through the real gap between "A" and "I", looping seamlessly
 * (first/last waypoints match exactly). Coordinates converted from the same
 * real-image contour extraction used for lib/three/aiGlyphPaths.ts (see
 * SKILL.md), not eyeballed. Percent-based so this stays aligned regardless of
 * the logo's rendered size at any breakpoint.
 */
const LEFT = [71.42, 86.22, 98.03, 74.52, 47.91, 71.42];
const TOP = [2.76, 50.07, 97.37, 97.31, 2.57, 2.76];
const POS_TIMES = [0, 0.2, 0.38, 0.55, 0.85, 1];

const DURATION = 6;

/**
 * Phase boundaries shared by every limb keyframe, so body articulation stays in
 * lock-step with the position path above:
 *   0.00 → 0.38  SLIDE   — plunging down the outer edge
 *   0.38 → 0.55  SHUFFLE — reaching the floor, scooting toward the gap
 *   0.55 → 0.85  CLIMB   — hauling up the gap (four alternating grabs)
 *   0.85 → 1.00  CREST   — cresting the top, resetting to the slide pose
 * Every array below has 9 values and starts/ends identical for a seamless loop.
 */
const LIMB_TIMES = [0, 0.19, 0.38, 0.55, 0.625, 0.7, 0.775, 0.85, 1];

const limbCycle = (times = LIMB_TIMES): Transition => ({
  duration: DURATION,
  times,
  repeat: Infinity,
  ease: "easeInOut",
});

/**
 * A lively, articulated little-yellow-worker — deliberately a generic
 * silhouette, not a reproduction of the specific copyrighted character
 * referenced for this task. Sized wide (14% of the logo's box) to exceed the
 * real gap between "A" and "I" (~12.4%), so it reads as bridging/covering the
 * gap rather than a tiny icon crossing empty space.
 *
 * Motion is built from independently-pivoting joints (each a `motion.g` with
 * `transformBox: fill-box` so its `transformOrigin` is its own shoulder/hip)
 * layered on top of the wrapper's position path:
 *   - SLIDE  : arms flung up, torso leaned back, legs splayed + a speed wobble.
 *   - CLIMB  : arms and legs alternate (reach ↔ pull) while the torso bobs up
 *              in steps, so it visibly hauls itself hand-over-hand up the gap.
 * All joint timelines share DURATION + LIMB_TIMES, keeping the body action in
 * phase with where the character is on the letterform.
 */
export default function LogoMascot() {
  return (
    <motion.div
      className="pointer-events-none absolute z-10 aspect-square w-[14%] -translate-x-1/2 -translate-y-1/2"
      animate={{
        left: LEFT.map((v) => `${v}%`),
        top: TOP.map((v) => `${v}%`),
      }}
      transition={{
        duration: DURATION,
        times: POS_TIMES,
        repeat: Infinity,
        ease: ["easeIn", "easeOut", "easeInOut", "easeInOut", "easeInOut"],
      }}
    >
      <svg viewBox="0 0 100 100" className="h-full w-full overflow-visible">
        {/* Whole-body lean + step-bob: leans back down the slide, sways and
            heaves upward on each climb grab. Pivot low, around the hips. */}
        <motion.g
          style={{ transformBox: "fill-box", transformOrigin: "50% 62%" }}
          animate={{
            rotate: [-10, -8, -10, 0, 4, -4, 4, -4, -10],
            y: [0, 0.8, 0, 1.6, -1, 1.6, -1, 0.4, 0],
          }}
          transition={limbCycle()}
        >
          {/* Legs (behind torso). Pivot at the hip = each group's top-centre. */}
          <motion.g
            style={{ transformBox: "fill-box", transformOrigin: "50% 0%" }}
            animate={{ rotate: [-8, -12, -8, 25, -5, 25, -5, 25, -8] }}
            transition={limbCycle()}
          >
            <rect x="39.5" y="70" width="9" height="20" rx="4.5" fill="#f2c94c" />
            <ellipse cx="44" cy="90" rx="6" ry="3.5" fill="#1a1a1a" />
          </motion.g>
          <motion.g
            style={{ transformBox: "fill-box", transformOrigin: "50% 0%" }}
            animate={{ rotate: [10, 14, 10, -5, 25, -5, 25, -5, 10] }}
            transition={limbCycle()}
          >
            <rect x="51.5" y="70" width="9" height="20" rx="4.5" fill="#f2c94c" />
            <ellipse cx="56" cy="90" rx="6" ry="3.5" fill="#1a1a1a" />
          </motion.g>

          {/* Arms (behind torso). Pivot at the shoulder = each group's
              top-centre. On the climb they alternate reach ↔ pull, opposite the
              same-side leg, so it moves hand-over-hand. */}
          <motion.g
            style={{ transformBox: "fill-box", transformOrigin: "50% 0%" }}
            animate={{ rotate: [-150, -160, -150, -20, -165, -25, -165, -30, -150] }}
            transition={limbCycle()}
          >
            <rect x="30" y="48" width="8" height="22" rx="4" fill="#f2c94c" />
            <circle cx="34" cy="70" r="5" fill="#f7d774" />
          </motion.g>
          <motion.g
            style={{ transformBox: "fill-box", transformOrigin: "50% 0%" }}
            animate={{ rotate: [150, 160, 150, 165, 25, 165, 25, 165, 150] }}
            transition={limbCycle()}
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
            animate={{ scaleY: [1, 1, 0.1, 1, 1, 0.1, 1, 1] }}
            transition={limbCycle([0, 0.3, 0.32, 0.34, 0.7, 0.72, 0.74, 1])}
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
