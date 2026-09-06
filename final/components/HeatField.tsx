"use client";

import { useEffect } from "react";
import { HeatField as Field } from "@/lib/heat";

/**
 * Mounts the heat field and drives everything on the page from it.
 *
 * ONE loop, ONE field, and elements opt in declaratively with a
 * `data-heat` attribute. The alternative — every component running its
 * own listener and its own animation — is how a page ends up with
 * fifteen rAF loops fighting over the same frame.
 *
 * Sources of heat, all of which are things the reader actually does:
 *
 *   POINTER  the obvious one. You are hot.
 *   SCROLL   movement is friction is heat. This is also the only source
 *            a touch device reliably produces, so without it the whole
 *            page would be inert on half the traffic.
 *   EMBERS   a slow drift of warmth along the bottom, so a page nobody
 *            has touched yet is still alive. Weak on purpose: it is a
 *            pilot light, not the performance.
 *
 * ---- The one performance rule ----
 * READ ALL RECTS, THEN WRITE ALL STYLES. Interleaving them makes the
 * browser flush layout once per element instead of once per frame,
 * which is the difference between this being free and being the most
 * expensive thing on the page.
 */

type Node = {
  el: HTMLElement;
  kind: string;
  /** Viewport-normalised centre, refreshed in the read pass. */
  x: number;
  y: number;
  /** Per-character offset along its parent line, 0..1. */
  u: number;
  /** How much of the flame this element takes at full heat, 0..1. Read
   *  from `--draw-warm` ONCE per collect, never per frame — the knob
   *  lives in CSS beside the colour it modifies, and the loop just
   *  honours it. Defaults to 1, which is every element that has not
   *  asked for anything. */
  warm: number;
};

export function HeatField() {
  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const field = new Field();
    field.seed(reduced ? 0.5 : 0.3);

    /** Drops the cached rects, so the next frame does a full read pass.
     *  Assigned once the loop's state exists, below; a no-op until then,
     *  which covers the first `collect()` call — nothing is cached yet. */
    let invalidate = () => {};

    let nodes: Node[] = [];
    const collect = () => {
      nodes = Array.from(
        document.querySelectorAll<HTMLElement>("[data-heat]"),
      ).map((el) => {
        const w = parseFloat(getComputedStyle(el).getPropertyValue("--draw-warm"));
        return {
          el,
          kind: el.dataset.heat || "type",
          x: 0.5,
          y: 0.5,
          u: 0,
          warm: Number.isFinite(w) ? w : 1,
        };
      });
      // A new node set has no cached position, and an old one's may have
      // moved under whatever changed the DOM. Either way the next frame
      // has to read.
      invalidate();
    };
    collect();

    // Sections arrive and leave as the reader scrolls, but the set of
    // heat-sensitive elements is static in this page — so this only has
    // to re-run if the DOM changes, not every frame.
    const mo = new MutationObserver(collect);
    mo.observe(document.body, { childList: true, subtree: true });

    // ---- sources ----------------------------------------------------
    let px = -1;
    let py = -1;
    let lx = -1;
    let ly = -1;
    let pStrength = 0;
    const onMove = (e: PointerEvent) => {
      lx = px;
      ly = py;
      px = e.clientX / window.innerWidth;
      py = e.clientY / window.innerHeight;
      pStrength = 1;
    };
    const onLeave = () => {
      pStrength = 0;
      lx = ly = -1;
    };
    const onDown = (e: PointerEvent) => {
      // A deliberate touch is hotter than a passing one, which is what
      // makes tapping on a phone feel like striking a match.
      field.inject(
        e.clientX / window.innerWidth,
        e.clientY / window.innerHeight,
        2.2,
        0.16,
      );
    };

    let lastScroll = window.scrollY;
    let scrollHeat = 0;
    const onScroll = () => {
      const y = window.scrollY;
      scrollHeat = Math.min(1, Math.abs(y - lastScroll) / 90);
      lastScroll = y;
    };

    // A resize moves every rect on the page and does not change scrollY,
    // so it is the one case the read gate below cannot infer. It is also
    // what fires when a phone's URL bar retracts.
    const onResize = () => invalidate();
    window.addEventListener("resize", onResize, { passive: true });

    if (!reduced) {
      window.addEventListener("pointermove", onMove, { passive: true });
      window.addEventListener("pointerleave", onLeave, { passive: true });
      window.addEventListener("pointerdown", onDown, { passive: true });
      window.addEventListener("scroll", onScroll, { passive: true });
    }

    // ---- loop -------------------------------------------------------
    //
    // ---- The phone's frame budget ----
    // Everything below costs the same per frame on every device: 92
    // `getBoundingClientRect` calls and 92 style writes on the landing
    // page. On a desktop that is genuinely free. On a phone it is not —
    // measured at a 6x CPU throttle, which is roughly a mid-range
    // Android, the page held 45fps at rest with 43 of 136 frames over
    // 32ms. Not broken, and visibly not smooth either, on the one
    // signature the whole design rests on.
    //
    // So two budgets, and neither of them touches what the field LOOKS
    // like — the simulation, the ambient wave and every value written
    // are identical on both. What changes is how often.
    //
    // The device test is POINTER, not width. A phone in landscape is
    // 844px wide and still has a phone's processor and a thumb; a narrow
    // window on a laptop has neither. Width has never been the question
    // here.
    const coarse = window.matchMedia("(pointer: coarse)").matches;

    // 1. Cap the write rate at 40fps on a touch device. The heat moves
    //    at the speed of a diffusion, not of a scroll — the fastest
    //    thing it does is a pointer trail, which nothing on a phone
    //    produces — so 25ms between writes is under the threshold at
    //    which any of this is perceptible, and it hands a third of the
    //    frame budget back to the scroller. The simulation still steps
    //    on the real elapsed time, so the physics are unchanged.
    const minStep = coarse ? 0.024 : 0;

    // 2. Re-read the rects only when they can have moved. A rect is a
    //    function of scroll position and viewport size and nothing else
    //    — no element on this page moves under its own power, and the
    //    two that are transformed (the mark, the flying clip) are
    //    transformed rather than laid out, which `getBoundingClientRect`
    //    would report but nothing here reads. So a frame with the same
    //    scrollY and the same viewport as the last one is a frame whose
    //    read pass is 92 forced layouts for an answer already held.
    //
    //    The MutationObserver above already re-collects on a DOM change,
    //    and it invalidates this too — see `collect`.
    let lastReadY = NaN;
    let lastReadW = 0;
    let lastReadH = 0;
    invalidate = () => {
      lastReadY = NaN;
    };

    let raf = 0;
    let prev = performance.now();
    let acc = 0;
    let visible = true;
    const onVis = () => {
      visible = !document.hidden;
      if (visible) prev = performance.now();
    };
    document.addEventListener("visibilitychange", onVis);

    const frame = (now: number) => {
      raf = requestAnimationFrame(frame);
      if (!visible) return;

      // Clamped: a backgrounded tab returning with a two-second step
      // would blow the diffusion up rather than fast-forward it.
      const dt = Math.min(0.05, (now - prev) / 1000);
      prev = now;
      const t = now / 1000;

      // The write budget. `acc` carries the real elapsed time, so a
      // skipped frame is not lost time — it is added to the next step,
      // and the simulation advances by exactly as much per second on a
      // phone as on a desktop. On a fine pointer `minStep` is 0 and this
      // is always true on the first test, which is a comparison rather
      // than a branch anyone can feel.
      acc += dt;
      if (acc < minStep) return;
      // Clamped for the same reason `dt` is one line up: on a skipped
      // frame this is a SUM of clamped steps, so it can exceed the cap
      // the clamp exists to enforce.
      const step = Math.min(0.05, acc);
      acc = 0;

      if (!reduced) {
        if (pStrength > 0 && px >= 0) {
          // Injected ALONG THE SEGMENT since the last event, not just at
          // the current point. A pointer moving quickly generates far
          // fewer events than frames, so a single-point injection leaves
          // a dotted trail with cold gaps between the dots — measured, a
          // fast drag across the headline moved the weight by 32 out of
          // a possible 700.
          const steps = lx < 0 ? 1 : Math.min(12, Math.ceil(Math.hypot(px - lx, py - ly) * 40) || 1);
          for (let k = 1; k <= steps; k++) {
            const f = k / steps;
            field.inject(
              lx < 0 ? px : lx + (px - lx) * f,
              ly < 0 ? py : ly + (py - ly) * f,
              (11 * dt) / steps,
              0.085,
            );
          }
          lx = px;
          ly = py;
        }
        if (scrollHeat > 0) {
          // Injected along the whole width at mid-height: scrolling
          // warms the sheet broadly rather than at one point.
          field.inject(0.5, 0.55, scrollHeat * 2.6 * step, 0.55);
          scrollHeat *= 0.9;
        }
        // Embers.
        field.inject(0.5 + 0.42 * Math.sin(t * 0.21), 1.02, 0.9 * step, 0.3);
        field.step(step);
      }

      // ---- read pass: every rect, no writes -----------------------
      //
      // Skipped entirely when nothing that can move a rect has moved.
      // scrollY and the viewport are the whole input: no element here
      // moves under its own power, and `collect`/`onResize` invalidate
      // the cache for the two cases that are not scroll. Measured on the
      // landing page that is 92 `getBoundingClientRect` calls, each of
      // which can force a style and layout flush, not made on a frame
      // whose answer has not changed — which on a page being read rather
      // than scrolled is most of them.
      const vw = window.innerWidth;
      const vh = window.innerHeight;
      const sy = window.scrollY;
      if (sy !== lastReadY || vw !== lastReadW || vh !== lastReadH) {
        lastReadY = sy;
        lastReadW = vw;
        lastReadH = vh;
        for (const n of nodes) {
          const r = n.el.getBoundingClientRect();
          // Skip anything off screen — its style cannot be seen and the
          // sample would be clamped to an edge anyway.
          if (r.bottom < -80 || r.top > vh + 80) {
            n.y = -9;
            continue;
          }
          n.x = (r.left + r.width / 2) / vw;
          n.y = (r.top + r.height / 2) / vh;
        }
      }

      // ---- write pass: every style, no reads ----------------------
      //
      // Heat is AMBIENT PLUS FIELD, and the ambient half is not
      // optional. The simulation decays to nothing within a couple of
      // seconds of the last touch — correct for a diffusion model, and
      // fatal for a page, because a reader who arrives and does not move
      // the mouse gets dead type. Worse on a phone, where there is no
      // pointer at all and only scrolling injects.
      //
      // So the ambient is a standing wave computed straight from
      // position and time — no simulation, cannot decay — and the field
      // adds interactive heat on top of it. The page is always alive;
      // touching it makes it hotter.
      for (const n of nodes) {
        if (n.y < -1) continue;

        const ambient =
          0.30 +
          0.20 * Math.sin(n.x * 5.6 - t * 0.55) +
          0.09 * Math.sin(n.x * 11.3 + t * 0.83) +
          0.05 * Math.sin(n.y * 7.1 - t * 0.41);

        const h = Math.max(0, Math.min(1, ambient + field.sample(n.x, n.y)));
        const el = n.el;

        switch (n.kind) {
          case "type": {
            // The signature: hot type is heavier AND wider. Width is
            // what makes it read as swelling rather than bolding, but
            // it is kept narrow-range because each character is an
            // inline-block and a big range makes the line churn.
            const w = Math.round(200 + 700 * h);
            const wd = Math.round((90 + 26 * h) * 10) / 10;
            el.style.fontVariationSettings = `"wght" ${w}, "wdth" ${wd}`;
            break;
          }
          case "rule":
            // Rules warm toward the flame instead of just brightening.
            el.style.borderColor = `color-mix(in oklab, var(--color-flame) ${(h * 62).toFixed(1)}%, var(--color-edge))`;
            break;
          case "label":
            el.style.color = `color-mix(in oklab, var(--color-flame) ${(h * 78).toFixed(1)}%, var(--color-ash))`;
            break;
          case "draw":
            // Two channels, like the type's two axes: a freehand line
            // warms toward the flame AND thickens, so it reads as ink
            // taking heat rather than as a colour swap. Capped under
            // the label's 78% so a mark never out-shouts the word it
            // sits above — they are one object.
            // The cold end is a variable, not a constant: `.draw-bone`
            // sets `--draw-base` to the type's colour so a mark can sit
            // in the foreground and still take heat the same way.
            el.style.color = `color-mix(in oklab, var(--color-flame) ${(h * 66 * n.warm).toFixed(1)}%, var(--draw-base, var(--color-ash)))`;
            el.style.setProperty("--draw-w", (1.35 + 0.95 * h).toFixed(2));
            break;
          case "mark":
            // Brightness, NOT opacity. Fading the mark up from 0.55 meant
            // its resting state was rgb(105,126,40) composited over the
            // void — not a dimmer flame, a different colour, and one that
            // did not match the same mark rendered at full strength in
            // the intro. The flare is the same gesture either way; this
            // version keeps the logo the logo while it is cold.
            el.style.filter = `brightness(${(1 + 0.22 * h).toFixed(3)})`;
            el.style.transform = `scale(${(1 + 0.07 * h).toFixed(3)})`;
            break;
        }
      }
    };
    raf = requestAnimationFrame(frame);

    return () => {
      cancelAnimationFrame(raf);
      mo.disconnect();
      document.removeEventListener("visibilitychange", onVis);
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerleave", onLeave);
      window.removeEventListener("pointerdown", onDown);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onResize);
    };
  }, []);

  return null;
}
