"use client";

import { motion } from "framer-motion";

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
const TIMES = [0, 0.2, 0.38, 0.55, 0.85, 1];

/**
 * Mascot is sized wide enough (14% of the logo's box) to exceed the real gap
 * width between "A" and "I" (~12.4%) — big enough to visually cover/bridge that
 * gap as it shuffles across from the outer edge into the climb, rather than
 * reading as a tiny icon crossing a much wider empty span. Deliberately a
 * generic little-yellow-worker silhouette, not a reproduction of the specific
 * copyrighted character referenced for this task.
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
        duration: 6,
        times: TIMES,
        repeat: Infinity,
        ease: ["easeIn", "easeOut", "easeInOut", "easeInOut", "easeInOut"],
      }}
    >
      <svg viewBox="0 0 100 100" className="h-full w-full">
        <rect x="22" y="8" width="56" height="84" rx="28" fill="#f2c94c" />
        <circle cx="39" cy="34" r="6.5" fill="#1a1a1a" />
        <circle cx="61" cy="34" r="6.5" fill="#1a1a1a" />
        <rect x="26" y="56" width="48" height="36" rx="10" fill="#2f5fd6" />
      </svg>
    </motion.div>
  );
}
