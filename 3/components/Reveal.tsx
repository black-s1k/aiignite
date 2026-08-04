"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Ink wipe on scroll. The animation is CSS (`.reveal` in globals.css);
 * this only decides when to flip the flag.
 *
 * Two rules, and both exist because getting them wrong breaks the page
 * rather than just the animation:
 *
 * 1. The server sends every element already shown. Shipping the hidden
 *    state would clip the entire page away in the HTML and leave it
 *    that way for anyone whose JS never arrives.
 *
 * 2. An element is only armed if it is genuinely below the fold when
 *    this runs. Hiding unconditionally and waiting for the observer to
 *    undo it makes the observer a single point of failure for content
 *    that is already on screen — if it doesn't fire, the reader is
 *    looking at a blank sheet. Measuring first means the worst case is
 *    a missing animation instead of missing content.
 *
 * It is also the better behaviour: animating something the reader is
 * already looking at is motion for its own sake.
 */
export function Reveal({
  children,
  delay = 0,
  className,
  as: Tag = "div",
}: {
  children: React.ReactNode;
  delay?: number;
  className?: string;
  as?: "div" | "li" | "section" | "header" | "p";
}) {
  const ref = useRef<HTMLElement>(null);
  const [shown, setShown] = useState(true);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    // Already on screen, or scrolled past. Leave it alone.
    if (el.getBoundingClientRect().top < window.innerHeight * 0.92) return;

    setShown(false);

    const io = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        setShown(true);
        io.disconnect();
      },
      { rootMargin: "0px 0px -10% 0px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <Tag
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      ref={ref as any}
      className={`reveal ${className ?? ""}`}
      data-shown={shown}
      style={delay ? ({ "--reveal-delay": `${delay}ms` } as React.CSSProperties) : undefined}
    >
      {children}
    </Tag>
  );
}
