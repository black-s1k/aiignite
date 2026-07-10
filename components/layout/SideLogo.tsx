"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import LogoMascot from "./LogoMascot";

/**
 * Decorative brand mark, vertically centered and sitting a bit left of the
 * page's horizontal midline (not pinned to the edge) — purely visual, so
 * pointer-events stay off rather than intercepting clicks on anything beneath it.
 * The inner wrapper establishes the sizing box the mascot positions itself
 * against (percent-based, so it stays aligned with the real logo art).
 */
export default function SideLogo() {
  return (
    <motion.div
      initial={{ opacity: 0, x: -20, y: 20 }}
      animate={{ opacity: 1, x: 0, y: 0 }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1], delay: 0.15 }}
      className="pointer-events-none fixed top-1/2 left-[32%] z-20 -translate-y-1/2 select-none"
    >
      <div className="relative inline-block h-60 sm:h-72">
        <Image
          src="/logo-ai.png"
          alt="AI Club logo"
          width={558}
          height={399}
          priority
          className="h-full w-auto select-none"
        />
        <LogoMascot />
      </div>
    </motion.div>
  );
}
