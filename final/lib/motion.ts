"use client";

import { useSyncExternalStore } from "react";

/**
 * Whether the reader has asked their system for reduced motion.
 *
 * The query itself appears in four places on this site — the heat field,
 * the scroll reveal, the intro and the Forge rail — because four separate
 * things have to answer for themselves what "still works, holds still"
 * means. See each one; the policy is never to simply stop, it is to hold
 * at a fixed, fully-formed state.
 *
 * ---- Why this is not a `useState` and an effect ----
 * The obvious shape is `useState(false)` plus an effect that reads the
 * media query and sets it. That is a setState called synchronously in an
 * effect body, which React's own lint rule rejects, and the rule is
 * right: it renders once with the wrong answer, then again with the
 * right one, on every mount.
 *
 * `useSyncExternalStore` is the API for exactly this — a value that
 * lives outside React and can change underneath it. It takes a server
 * snapshot as its third argument, which is what makes it safe here:
 * every page on this site is prerendered at build time by
 * `output: "export"`, so a lazy `useState` initialiser that touched
 * `window` would throw during the build rather than at run time.
 *
 * `false` is the correct server snapshot. It is the value that renders
 * the full motion, so hydration matches for the large majority who have
 * not asked for anything, and a reader who has gets one flip on mount —
 * the same single transition the effect version produced, minus the
 * wasted render for everyone else.
 *
 * It also picks up a change to the OS setting WHILE the page is open,
 * which the effect version could not: it read the query once on mount
 * and never subscribed.
 */
const QUERY = "(prefers-reduced-motion: reduce)";

function subscribe(onChange: () => void) {
  const mq = window.matchMedia(QUERY);
  mq.addEventListener("change", onChange);
  return () => mq.removeEventListener("change", onChange);
}

const getSnapshot = () => window.matchMedia(QUERY).matches;

/** The server never has a media query to read. See the note above for
 *  why `false` is the right answer rather than a guess. */
const getServerSnapshot = () => false;

export function usePrefersReducedMotion(): boolean {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}
