"use client";

import { motion } from "framer-motion";

const cornerTransition = { duration: 0.6, ease: [0.16, 1, 0.3, 1] as const };

/**
 * Name and Contact Us are independently fixed to the top-left/top-right corners
 * (not a shared header bar), so they stay pinned regardless of page scroll.
 */
export default function Header() {
  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: -16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={cornerTransition}
        className="pointer-events-auto fixed top-6 left-6 z-20 flex items-baseline gap-2.5 sm:top-8 sm:left-10"
      >
        <span className="text-2xl font-extrabold tracking-wide text-white">AI</span>
        <span className="text-base font-normal text-white/85">Club @ York</span>
      </motion.div>

      <motion.a
        href="#contact"
        initial={{ opacity: 0, y: -16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ ...cornerTransition, delay: 0.08 }}
        whileHover={{ backgroundColor: "#ffffff", color: "#000000" }}
        className="pointer-events-auto fixed top-6 right-6 z-20 rounded border border-white px-4 py-2 text-sm font-medium tracking-wide text-white sm:top-8 sm:right-10"
      >
        Contact Us
      </motion.a>
    </>
  );
}
