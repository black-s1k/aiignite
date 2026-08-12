"use client";

import { useEffect, useRef } from "react";

/**
 * The signature. A line of display type whose letterforms are driven by
 * heat rather than by an animation curve.
 *
 * Every character gets a heat value from 0 to 1, and that value drives
 * the font's WEIGHT and WIDTH axes — so a hot letter is physically
 * heavier and wider, the way a hot thing swells. This is the whole
 * reason the build uses Archivo: it carries wdth 62-125 alongside
 * wght 100-900, and both moving together is what separates "heat" from
 * "a wave animation on the font weight".
 *
 * Two heat sources, added:
 *
 *   AMBIENT — a front that travels along the line and never quite
 *   repeats, because it is the sum of three waves at unrelated speeds.
 *   Related speeds resynchronise on a period a reader can catch, and
 *   the moment they catch it the thing stops looking like fire.
 *
 *   THE POINTER — you are a heat source. Moving across the words heats
 *   the letters you pass. This is the part that makes it feel like a
 *   material rather than a loop, and it is why the ambient front is
 *   kept deliberately low-amplitude: it is a bed for the interaction,
 *   not the performance.
 *
 * Written straight to the DOM in a rAF loop. Per-character React state
 * at 60fps would be dozens of reconciliations a frame for something
 * that is purely presentational.
 */

type Props = {
  children: string;
  className?: string;
  /** Cool and hot ends of the weight axis. */
  weight?: [number, number];
  /** Cool and hot ends of the width axis. */
  width?: [number, number];
  as?: "h1" | "h2" | "p" | "span";
};

export function HeatLine({
  children,
  className = "",
  // Weight does most of the work and width does the rest, deliberately
  // in that proportion. Width is what makes this read as SWELLING
  // rather than as bolding — but every character is an inline-block, so
  // a wide width range makes each letter shove its neighbours along and
  // the line visibly churns. This range is the most swell the line will
  // take while still sitting still.
  weight = [200, 900],
  width = [90, 116],
  as: Tag = "span",
}: Props) {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const host = ref.current;
    if (!host) return;

    const chars = Array.from(
      host.querySelectorAll<HTMLElement>("span[data-i]"),
    );
    if (!chars.length) return;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const [w0, w1] = weight;
    const [x0, x1] = width;

    // Measured once and refreshed on resize rather than per frame:
    // getBoundingClientRect on every character every frame is a forced
    // layout each time, and it is the one thing that would make this
    // expensive.
    let centres: number[] = [];
    let hostBox = { left: 0, width: 1, top: 0, height: 1 };
    const measure = () => {
      const hb = host.getBoundingClientRect();
      hostBox = { left: hb.left, width: hb.width || 1, top: hb.top, height: hb.height || 1 };
      centres = chars.map((c) => {
        const b = c.getBoundingClientRect();
        return (b.left + b.width / 2 - hb.left) / hostBox.width;
      });
    };
    measure();

    const ro = new ResizeObserver(measure);
    ro.observe(host);

    // Pointer heat, in the same 0..1 space as the character centres.
    // Starts off the line so nothing is lit until the reader arrives.
    let pointer = -1;
    let pointerHeat = 0;
    const onMove = (e: PointerEvent) => {
      const b = host.getBoundingClientRect();
      pointer = (e.clientX - b.left) / (b.width || 1);
      // Falls off with vertical distance too, so passing well above or
      // below the line does not light it up from across the page.
      const dy = Math.max(0, Math.abs(e.clientY - (b.top + b.height / 2)) - b.height / 2);
      pointerHeat = Math.max(0, 1 - dy / 160);
    };
    const onLeave = () => {
      pointerHeat = 0;
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("pointerleave", onLeave, { passive: true });

    let raf = 0;
    let running = true;
    const onVis = () => {
      running = !document.hidden;
    };
    document.addEventListener("visibilitychange", onVis);

    const start = performance.now();

    const frame = (now: number) => {
      raf = requestAnimationFrame(frame);
      if (!running) return;

      const t = (now - start) / 1000;

      for (let i = 0; i < chars.length; i++) {
        const u = centres[i] ?? 0;

        // Ambient: three waves at unrelated speeds, so the pattern
        // never resolves into a countable loop.
        //
        // It has to carry most of the range on its own, not sit under
        // the pointer as a faint bed. Half this page's readers are on a
        // phone and will never produce a pointer event, so if the
        // ambient is subtle the signature simply does not exist for
        // them. An earlier version compressed this into 0.12-0.46 and
        // every letter came out the same mid weight.
        // The SPATIAL frequencies matter as much as the amplitudes. `u`
        // runs 0..1 across the line, so the dominant term needs to be
        // near a full 2*PI to put a whole hot-and-cool cycle inside the
        // words. At 3.1 it was under half a cycle and the crest spent
        // most of its time off the end of the line entirely — measured,
        // weight never got past 501 of a possible 900.
        let h =
          0.5 +
          0.34 * Math.sin(u * 5.6 - t * 0.62) +
          0.11 * Math.sin(u * 11.3 + t * 0.91) +
          0.05 * Math.sin(u * 17.1 - t * 1.31);
        h = 0.02 + h * 0.94;

        // Pointer: a local front. Squared falloff rather than linear,
        // because heat is local — a linear falloff lights the whole
        // line dimly and reads as a brightness slider.
        if (pointerHeat > 0 && pointer > -0.5) {
          const d = Math.abs(u - pointer);
          const near = Math.max(0, 1 - d / 0.22);
          h += near * near * pointerHeat * 0.85;
        }

        h = h < 0 ? 0 : h > 1 ? 1 : h;

        const wght = Math.round(w0 + (w1 - w0) * h);
        const wdth = Math.round((x0 + (x1 - x0) * h) * 10) / 10;
        chars[i].style.fontVariationSettings = `"wght" ${wght}, "wdth" ${wdth}`;
      }
    };
    raf = requestAnimationFrame(frame);

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      document.removeEventListener("visibilitychange", onVis);
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerleave", onLeave);
    };
  }, [children, weight, width]);

  // Split on the server so the full line is in the HTML: it has to be
  // readable and selectable with no JS, and a screen reader should get
  // the sentence rather than a stream of letters — hence aria-label on
  // the host and aria-hidden on the pieces.
  const parts = Array.from(children);

  return (
    <Tag
      ref={ref as React.RefObject<never>}
      className={`heat ${className}`}
      aria-label={children}
    >
      {parts.map((ch, i) =>
        ch === " " ? (
          <span key={i} data-space aria-hidden />
        ) : (
          <span key={i} data-i={i} aria-hidden>
            {ch}
          </span>
        ),
      )}
    </Tag>
  );
}
