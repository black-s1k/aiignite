"use client";

import { useEffect } from "react";
import Lenis from "lenis";

/**
 * Lenis, for one specific reason: the press reads scroll velocity to
 * decide how far the second ink pass mis-registers. Native scroll on a
 * trackpad arrives as a burst of large, uneven deltas, which makes the
 * drift jitter rather than drift. Smoothing the scroll smooths the
 * input the press is measuring.
 *
 * Off entirely under reduced motion — hijacking scroll is exactly the
 * kind of motion that setting is asking us not to do.
 */
export function SmoothScroll() {
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const lenis = new Lenis({
      duration: 1.05,
      // Matches --ease-press closely enough that the page and the type
      // wipes feel like they share one deceleration.
      easing: (t: number) => 1 - Math.pow(1 - t, 3),
      // Touch devices already have momentum scrolling that people know
      // the feel of. Overriding it makes the page feel broken.
      smoothWheel: true,
      syncTouch: false,
    });

    let raf = 0;
    const frame = (time: number) => {
      lenis.raf(time);
      raf = requestAnimationFrame(frame);
    };
    raf = requestAnimationFrame(frame);

    return () => {
      cancelAnimationFrame(raf);
      lenis.destroy();
    };
  }, []);

  return null;
}
