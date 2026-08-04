"use client";

import { useEffect, useLayoutEffect, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";

/**
 * Scroll-reveal wrapper. Framer Motion is used for this and hover states
 * only — never the hero, which scrubs on rAF.
 *
 * Server-render emits plain, visible markup. If it rendered the motion
 * component directly, `initial={{opacity: 0}}` gets serialised into the HTML
 * and the entire page reads as blank until JS hydrates — or permanently, if
 * it never does. Framer only takes over once we know it's running.
 *
 * The swap happens in a layout effect, so the hidden state is committed
 * before first paint and there's no visible flash of the plain version.
 */

// useLayoutEffect warns when called during SSR, so only reach for it on the client.
const useIsoLayoutEffect = typeof window !== "undefined" ? useLayoutEffect : useEffect;

export function Reveal({
  children,
  delay = 0,
  className,
  as: Tag = "div",
}: {
  children: React.ReactNode;
  delay?: number;
  className?: string;
  as?: "div" | "li" | "section";
}) {
  const reduced = useReducedMotion();
  const [armed, setArmed] = useState(false);

  useIsoLayoutEffect(() => setArmed(true), []);

  if (reduced || !armed) return <Tag className={className}>{children}</Tag>;

  const Motion = motion[Tag];

  return (
    <Motion
      className={className}
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "0px 0px -12% 0px" }}
      transition={{ duration: 0.5, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </Motion>
  );
}
