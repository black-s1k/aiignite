"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Mark } from "@/components/Mark";
import { CLUB } from "@/lib/content";

/**
 * The opening sequence. A drawing builds itself, names itself, burns
 * off, and hands what is left to the nav — at which point the page has
 * already started.
 *
 * The ordering is the whole idea. The mark comes LAST, not first,
 * because the end state of this sequence (mark + wordmark) is identical
 * to the lockup that lives permanently in the nav. So the sequence does
 * not finish and get replaced by the page; its final frame flies into
 * the nav slot and BECOMES the page. Opening on the logo instead would
 * spend the identity before anyone has a reason to care, and then leave
 * the drawing to top it.
 *
 * Every transition here is either a rise or a burn, because that is the
 * page's own vocabulary — the drawing does not fade out, it burns off
 * from the bottom up, and the mark does not appear, it ignites. A
 * crossfade would be the one thing that makes this read as a video that
 * played rather than as the page starting itself.
 *
 * It runs on every load, at the client's direction — the drawing is the
 * point, not a one-time reveal. That makes the skip affordances the
 * thing carrying the weight rather than a nicety: any click, key, scroll
 * or touch ends it immediately, so a reader who has seen it and just
 * wants the FAQ is never held for more than the moment it takes to
 * reach for the page.
 */

/** The whole timeline in one place, in ms, so it can be tuned by reading
 *  it rather than by hunting through CSS. Durations of the moves
 *  themselves live in globals.css next to what they animate. */
const CUE = {
  /** The clip runs 3.68s: 2.25s drawing, a 0.75s resolve that opens the
   *  space underneath at ~2.78s, then a hold on the finished drawing. The
   *  name is written into that gap during the hold, never on top of the
   *  drawing — so if the clip is ever recut, this is the number to move
   *  first, and every cue below it shifts by the same amount. */
  name: 2850,

  /** The drawing collapses inward. 300ms, and it should feel abrupt. */
  burn: 3500,

  /** The split second. 110ms after the collapse lands there is nothing on
   *  screen but the name — and then the flame is simply there. That empty
   *  beat is doing the work: without it the two moves overlap and read as
   *  a crossfade between a drawing and a logo, which is the thing this is
   *  meant not to be. */
  mark: 3910,

  fly: 4730,

  /** The flight is 750ms, so this is +780: it must not fire until the
   *  flame has actually arrived. Landing and unmounting on the same
   *  millisecond is what put a frame with no logo on the screen. */
  land: 5510,
  done: 5740,
} as const;

/** How long to wait for the clip to actually start before giving up on
 *  it and running the sequence anyway. On a slow connection a black
 *  hold is worse than a drawing that starts a beat late. */
const START_TIMEOUT = 1500;

/** How large the closing lockup gets before the viewport is the limit.
 *  Past this it stops being a title and starts being a banner. */
const MAX_SCALE = 3.2;

/** Share of the viewport the lockup is allowed to span. Matches the
 *  page's own gutter (px-6 at this size) so the name lines up with the
 *  copy it hands over to. */
const FIT = 0.86;

type Phase = "draw" | "name" | "mark" | "burn" | "fly" | "land" | "out";

export function Intro() {
  const [phase, setPhase] = useState<Phase>("draw");
  const [gone, setGone] = useState(false);

  const rootRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const lockupRef = useRef<HTMLDivElement>(null);
  const flameRef = useRef<HTMLSpanElement>(null);
  const timers = useRef<number[]>([]);

  const clear = () => {
    timers.current.forEach(clearTimeout);
    timers.current = [];
  };

  /** The nav lives outside this component's tree, and it has to know
   *  which beat we are on — the name has to appear up there at the same
   *  moment it goes out down here. Mirroring the phase onto <html> lets
   *  that be one CSS rule instead of shared state. */
  const go = (p: Phase) => {
    setPhase(p);
    document.documentElement.setAttribute("data-intro", p);
  };

  const finish = useCallback(() => {
    clear();
    document.documentElement.removeAttribute("data-intro");
    setGone(true);
  }, []);

  /** Skip. Fades rather than cutting, so dismissing it does not feel
   *  like something broke. */
  const skip = useCallback(() => {
    clear();
    go("out");
    timers.current.push(window.setTimeout(finish, 260));
  }, [finish]);

  // ---- the sequence ---------------------------------------------------
  useEffect(() => {
    // The one audience that never sees it. Everyone else gets it on
    // every load.
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      finish();
      return;
    }

    document.documentElement.setAttribute("data-intro", "draw");

    // Sized to the viewport rather than to a breakpoint. The lockup is
    // one long line — "AI IGNITE AT YORK" — so a fixed scale that reads
    // well on a laptop runs straight off the side of a phone. Measuring
    // the natural width and dividing is the only version that cannot be
    // wrong on a screen size nobody tested. The flight reads its scale
    // back off the rendered boxes, so it follows this automatically.
    const fit = () => {
      const lock = lockupRef.current;
      if (!lock) return;
      lock.style.transform = "none";
      const natural = lock.getBoundingClientRect().width;
      if (!natural) return;
      const s = Math.min(MAX_SCALE, (window.innerWidth * FIT) / natural);
      lock.style.transform = `scale(${s})`;
    };
    fit();
    // Again once the display face has actually loaded: measured against
    // the fallback font the line comes out a different width, and the
    // first measurement happens long before Archivo arrives.
    document.fonts?.ready.then(fit).catch(() => {});
    window.addEventListener("resize", fit);

    const video = videoRef.current;
    let started = false;

    const start = () => {
      if (started) return;
      started = true;
      const at = (ms: number, fn: () => void) =>
        timers.current.push(window.setTimeout(fn, ms));

      // Fitted once more on the beat it becomes visible, which is the
      // only moment that has to be right.
      at(CUE.name, () => {
        fit();
        go("name");
      });
      at(CUE.burn, () => go("burn"));
      at(CUE.mark, () => go("mark"));
      at(CUE.fly, () => {
        // Only the flame travels. The name is not carried across the
        // screen — it goes out where it stands and comes back in up in
        // the nav, so the one thing your eye follows is the mark.
        const flame = flameRef.current;
        const anchor = document.querySelector<HTMLElement>(
          '[data-lockup="nav"]',
        );
        const navMark = document.querySelector<HTMLElement>(
          '[data-lockup="nav-mark"]',
        );
        if (!flame || !anchor || !navMark) return;

        // Read both boxes before writing any style — the heat field is
        // mid-frame and interleaving would force a layout inside it.
        const f = flame.getBoundingClientRect();
        const a = anchor.getBoundingClientRect();
        // The nav's mark is driven by the heat field, which writes a
        // scale on it every frame — so its rendered rect is the wrong
        // target. offsetWidth/Height are layout, which a transform does
        // not touch, and the anchor centres it.
        const mh = navMark.offsetHeight;
        const left = a.left;
        const top = a.top + (a.height - mh) / 2;

        // Its own top-left is the transform origin, so the solve is a
        // plain offset plus scale.
        flame.style.transform = `translate(${left - f.left}px, ${
          top - f.top
        }px) scale(${mh / f.height})`;

        go("fly");
      });
      // Hand over to the nav's own mark before unmounting: both are in
      // the same place by now, so the crossfade cannot be seen — but the
      // gap it replaces could be.
      at(CUE.land, () => go("land"));
      at(CUE.done, finish);
    };

    // Start on the clip actually playing, not on mount — otherwise a
    // slow first byte spends the first beats on a black screen.
    if (video) {
      video.addEventListener("playing", start, { once: true });
      const p = video.play();
      if (p) p.catch(finish); // Autoplay refused: no sequence to show.
    }
    timers.current.push(window.setTimeout(start, START_TIMEOUT));

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape" || e.key === " ") skip();
    };
    window.addEventListener("keydown", onKey);
    window.addEventListener("wheel", skip, { passive: true, once: true });
    window.addEventListener("touchmove", skip, { passive: true, once: true });

    return () => {
      clear();
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("wheel", skip);
      window.removeEventListener("touchmove", skip);
      window.removeEventListener("resize", fit);
      video?.removeEventListener("playing", start);
      document.documentElement.removeAttribute("data-intro");
    };
  }, [finish, skip]);

  if (gone) return null;

  return (
    <div
      ref={rootRef}
      className="intro"
      data-phase={phase}
      role="presentation"
      onClick={skip}
    >
      <div className="intro-stage">
        {/* The clip and the flame share one box: the flame has to ignite
            exactly where the drawing was standing, not somewhere near it,
            so it is centred on the clip's own frame rather than placed in
            the column under it. */}
        <div className="intro-frame">
          {/* Screen blend, not an alpha channel: the clip is keyed to
              flame on pure black, and screening that over the page's void
              makes the black ground vanish along with any compression
              noise in it. No alpha codec, so no Safari special case.

              h264 only, deliberately. On this content — hard-edged line
              art over flat black — VP9 encodes LARGER than h264 at
              matching quality, so a webm source would just hand Chrome
              and Firefox the heavier file. It is the one case where the
              usual webm-first ordering costs rather than saves. */}
          <video
            ref={videoRef}
            className="intro-video"
            muted
            playsInline
            preload="auto"
            poster="/draw-final.png"
            aria-hidden
          >
            <source src="/draw.mp4" type="video/mp4" />
          </video>

          <div className="intro-flame-slot">
            {/* Two nested spans on purpose: the outer one carries the
                flight to the nav, the inner one the ignition. Driving
                both from a single element would mean one transform
                overwriting the other mid-move. */}
            <span ref={flameRef} className="intro-flame">
              <span className="intro-flame-in">
                {/* Driven by the heat field, exactly like the nav's mark —
                    that is what makes the two the same colour. They read
                    the field at their own screen positions, and by the
                    time this one lands it IS at the nav's position, so at
                    the handover they resolve to the same value.

                    Safe to heat now only because the field no longer
                    writes opacity, and because the ignition and the
                    flight are carried by the two wrapper spans rather
                    than by this element — so the small scale the field
                    writes here composes with them instead of fighting. */}
                <Mark className="intro-flame-mark" />
              </span>
            </span>
          </div>
        </div>

        {/* The name alone, and it stays here. The flame is up in the
            drawing's place; these two never sit beside each other until
            the nav's own lockup takes over. */}
        <div ref={lockupRef} className="intro-lockup">
          <span className="wordmark intro-name whitespace-nowrap">
            {CLUB.name} at York
          </span>
        </div>
      </div>

      <button type="button" className="intro-skip label" onClick={skip}>
        Skip
      </button>
    </div>
  );
}
