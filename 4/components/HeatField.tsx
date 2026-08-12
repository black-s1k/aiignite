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
};

export function HeatField() {
  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const field = new Field();
    field.seed(reduced ? 0.5 : 0.3);

    let nodes: Node[] = [];
    const collect = () => {
      nodes = Array.from(
        document.querySelectorAll<HTMLElement>("[data-heat]"),
      ).map((el) => ({ el, kind: el.dataset.heat || "type", x: 0.5, y: 0.5, u: 0 }));
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

    if (!reduced) {
      window.addEventListener("pointermove", onMove, { passive: true });
      window.addEventListener("pointerleave", onLeave, { passive: true });
      window.addEventListener("pointerdown", onDown, { passive: true });
      window.addEventListener("scroll", onScroll, { passive: true });
    }

    // ---- loop -------------------------------------------------------
    let raf = 0;
    let prev = performance.now();
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
          field.inject(0.5, 0.55, scrollHeat * 2.6 * dt, 0.55);
          scrollHeat *= 0.9;
        }
        // Embers.
        field.inject(0.5 + 0.42 * Math.sin(t * 0.21), 1.02, 0.9 * dt, 0.3);
        field.step(dt);
      }

      // ---- read pass: every rect, no writes -----------------------
      const vw = window.innerWidth;
      const vh = window.innerHeight;
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
          case "mark":
            el.style.opacity = String(0.55 + 0.45 * h);
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
    };
  }, []);

  return null;
}
