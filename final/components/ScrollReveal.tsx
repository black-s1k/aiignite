"use client";

import { useEffect } from "react";

/**
 * Reveals content as it comes into view, across every page.
 *
 * The page used to ban this outright — it is on the slop-audit list of
 * generated-site tells, and for good reason: a reveal on everything is
 * the cheapest way to make a page feel authored when nothing about its
 * structure is. It is here at the client's direction, so the job is to
 * make it the version that does not read that way:
 *
 *   - It moves a SMALL distance. Long travel is what makes these feel
 *     like a template; a centimetre of rise reads as settling.
 *   - It plays in BOTH directions, at the client's direction. A block
 *     resets only once it is well clear of the viewport, so nothing ever
 *     disappears while it is still being read.
 *   - It staggers by SIBLING, so a row of three arrives as a row of
 *     three rather than as three unrelated events.
 *
 * ---- How the targets are chosen ----
 * Not from a hand-written list of selectors, which goes stale the moment
 * anyone adds a section. It walks the page and keeps every block-level
 * element that holds content AND has no block-level descendant holding
 * content — the leaves of the layout. That is "every component" without
 * naming any of them, and it cannot double-animate, because an element
 * and its own parent can never both be leaves.
 *
 * No loop and no scroll listener: one IntersectionObserver, and the
 * motion itself is a CSS transition. The heat field owns the only rAF on
 * this page and that stays true.
 */

/** Containers whose children lay themselves out — a leaf inside one of
 *  these is still a leaf, but the container never is. */
const BLOCKISH = new Set([
  "block",
  "flex",
  "grid",
  "list-item",
  "table",
  "table-row",
  "flow-root",
]);

function isContentBlock(el: HTMLElement): boolean {
  // The sequence's own overlay, and the headline, which has an arrival of
  // its own that this would fight.
  if (el.closest(".intro, .hero-line")) return false;

  // Anything folded inside a <details> except the summary itself. A
  // closed disclosure never renders its answer, so the observer can never
  // fire for it — and it would sit at opacity 0 forever, so opening a FAQ
  // item would show an empty panel. The disclosure IS that content's
  // reveal; it does not need a second one.
  const details = el.closest("details");
  if (details && el.tagName !== "SUMMARY") return false;

  if (!BLOCKISH.has(getComputedStyle(el).display)) return false;
  const r = el.getBoundingClientRect();
  if (r.width < 8 || r.height < 8) return false;
  return el.textContent!.trim().length > 0 || !!el.querySelector("img, svg");
}

export function ScrollReveal() {
  useEffect(() => {
    // The one audience that never sees it. Bailing here also leaves the
    // markup untouched, so nothing can be left hidden if this never runs.
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    // The nav is deliberately not in here. It is fixed, so it is on
    // screen from the first frame and there is nothing to reveal — and
    // its labels are two faces of a rolling cube whose geometry lives in
    // a `transform`. A reveal on those faces overwrites that transform
    // and the roll comes apart.
    const scopes = document.querySelectorAll<HTMLElement>(
      "main, body > footer",
    );

    const blocks: HTMLElement[] = [];
    scopes.forEach((scope) => {
      scope.querySelectorAll<HTMLElement>("*").forEach((el) => {
        if (isContentBlock(el)) blocks.push(el);
      });
    });

    // Keep only the leaves. An ancestor of another candidate is a layout
    // wrapper, and revealing both would run the move twice on the same
    // pixels — the child inside a parent that is itself sliding.
    const leaves = blocks.filter(
      (el) => !blocks.some((other) => other !== el && el.contains(other)),
    );

    // Stagger among siblings rather than across the page, so a row of
    // cards arrives as a row and a long page never accumulates a
    // multi-second delay on its last item.
    const seen = new Map<Element, number>();
    leaves.forEach((el) => {
      const parent = el.parentElement ?? document.body;
      const i = seen.get(parent) ?? 0;
      seen.set(parent, i + 1);
      el.dataset.reveal = "out";
      el.style.setProperty("--r", String(Math.min(i, 5)));
    });

    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (!e.isIntersecting) continue;
          (e.target as HTMLElement).dataset.reveal = "in";
        }
      },
      // Fires once the block is a quarter of the way up the screen, not
      // the instant it touches the bottom edge.
      //
      // With no margin at all it triggered with its top at 897px of a
      // 900px viewport — measured — so the whole 720ms ran while the
      // block was still off the bottom of the screen and it was already
      // settled by the time anyone could read it. The animation was
      // running perfectly and was invisible.
      //
      // The cost of the negative margin is a dead band across the bottom
      // of the viewport. The `full` observer below is what pays for it.
      //
      // threshold 0 rather than a fraction: a block taller than the
      // viewport can never reach a percentage of ITSELF, and a fast
      // scroll can carry a short one past a band between frames.
      { rootMargin: "0px 0px -25% 0px", threshold: 0 },
    );

    // The safety net. Anything entirely on screen is revealed regardless
    // of the delayed trigger above — a short block can come to rest
    // inside that bottom quarter and sit there fully visible and fully
    // invisible, which is the trigger's one bad case. This also covers
    // the bottom of the document, where the page runs out of scroll and
    // nothing can ever reach the shrunk root.
    const full = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (!e.isIntersecting) continue;
          (e.target as HTMLElement).dataset.reveal = "in";
        }
      },
      // 0.99, not 1: a ratio of exactly 1 is unreliable at subpixel
      // sizes, and a block sitting at 0.9999 would never fire.
      { threshold: 0.99 },
    );

    // The re-arm. A block goes back to its hidden state only once it is
    // well clear of the viewport — this root is EXPANDED by a fifth of
    // the screen in both directions, so a block has to be properly gone
    // before it resets.
    //
    // It cannot share either observer above: their roots are shrunk or
    // exact, so a block sitting just inside the viewport is reported as
    // not intersecting while it is plainly on screen. Reset on that
    // signal and content blinks out under the reader's eyes.
    const rearm = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) continue;
          (e.target as HTMLElement).dataset.reveal = "out";
        }
      },
      { rootMargin: "20% 0px 20% 0px", threshold: 0 },
    );

    leaves.forEach((el) => {
      io.observe(el);
      full.observe(el);
      rearm.observe(el);
    });

    return () => {
      io.disconnect();
      full.disconnect();
      rearm.disconnect();
    };
  }, []);

  return null;
}
