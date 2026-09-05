"use client";

import { useCallback, useEffect, useRef, useState } from "react";

/**
 * The opening sequence. A drawing builds itself, burns off, and hands
 * the flame to the nav — at which point the page has already started.
 *
 * The drawing hands to a mascot clip, and the mascot lands in the nav.
 *
 * The landing is the part worth understanding. The clip ends with its
 * flame parked near the top left OF ITS OWN FRAME — but that frame is a
 * fixed-ratio box centred in the viewport, so its top left is somewhere
 * out in the middle of the screen, and it moves with every window size.
 * Aiming the clip at a corner is therefore impossible from inside the
 * clip.
 *
 * So the CLIP is what flies. Over its last two thirds of a second the
 * whole element is scaled and translated so that the exact point its
 * flame comes to rest on is mapped onto the nav's mark — solved at run
 * time from the real boxes, which is what makes it land in the corner on
 * every screen instead of only on the one it was tuned on. The flame's
 * own motion is already heading up and left in that window, so the two
 * read as one flight rather than as a picture being moved.
 *
 * There is no separate mark flying any more. There does not need to be:
 * the clip's flame arrives at the nav's position, at the nav's size, and
 * the nav's own mark simply comes up underneath it.
 *
 * Every transition is either a rise or a burn, because that is the
 * page's own vocabulary — the drawing does not fade out, it burns off.
 * A crossfade would be the one thing that makes this read as a video
 * that played rather than as the page starting itself.
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
  /** Both clips are played faster rather than cut: 2.25x on each, so
   *  3.68s of drawing runs in 1.67s and 4.46s of mascot in 2.04s.
   *  Nothing is missing from either, it just runs.
   *
   *  There was a `name` beat here — the wordmark written out under the
   *  drawing and held to be read. It is gone at the client's direction,
   *  and nothing below moved when it went: every cue here is pinned to a
   *  clip, not to the name. */
  /** The drawing collapses inward. Still 300ms, because that is a real
   *  beat rather than a share of the clip. */
  burn: 1560,

  /** The split second. 110ms after the collapse lands there is nothing on
   *  screen but the name, and then the mascot is simply there. Held at
   *  410ms rather than scaled: an empty beat is measured in perception,
   *  not in frames. */
  play: 1970,

  /** The move starts while the flame is still travelling, which is the
   *  only way it does not visibly park somewhere that is not the corner.
   *
   *  That is only safe because the CLIP has had its trail removed from
   *  CLEAN_FROM onward — a soft mask baked into the encode, centred on the
   *  flame's own path. The element is what flies, so anything still
   *  painted in it flies too; with the embers gone there is nothing left
   *  to drag. Measured on the shipped file: from that point the farthest
   *  lit pixel IS the flame's own edge, and the flame's pixel count is
   *  unchanged from the unmasked encode, so nothing of it was eaten.
   *
   *  Waiting for the clip to END instead also works and was tried, but it
   *  leaves the flame sitting still mid-screen for a beat first, which
   *  reads as it stopping in the wrong place. */
  home: 3845,

  /** The flame is on the nav by now, at the nav's size. Only here does
   *  the page get to exist: the stock clears, the nav's own mark comes up
   *  under the clip, and the clip goes out. */
  land: 4055,

  /** The clip takes 180ms to go, then the page takes 320ms to arrive —
   *  one after the other, not together. +520 covers both with a little
   *  margin, because unmounting mid-fade pops. */
  done: 4575,
} as const;

/** Where the clip leaves its flame, as fractions of the VIDEO's own
 *  frame — measured off the last frame of public/mascot.mp4 (largest lit
 *  blob, so scattered embers do not drag the answer), not guessed.
 *
 *  This is what makes the handover invisible. Start the flight from the
 *  mark's resting place mid-stage instead and the flame jumps hundreds of
 *  pixels backwards before flying. Re-cut the clip and re-measure these. */
const EXIT = { cx: 0.1012, cy: 0.1486, h: 0.1556 };

/**
 * The flight's own curve, and the one easing on the site that is not
 * `--ease-heat`.
 *
 * It sat inline as a bare `cubic-bezier(0.32, 0.64, 0.28, 1)`, close
 * enough to `--ease-heat` (0.22, 0.61, 0.36, 1) to read as a typo of it.
 * It is not one: this decelerates harder at the end, which is what puts
 * the flame down on the nav rather than drifting it in. Named so the
 * next person can tell a decision from a slip.
 *
 * It cannot read the CSS variable — this is a Web Animation, and the
 * duration beside it (HOMING) is measured off the encode, so the whole
 * move is defined in JS or not at all.
 */
const EASE_FLIGHT = "cubic-bezier(0.32, 0.64, 0.28, 1)";

/** The clip's native aspect, for solving where `object-fit: contain`
 *  actually put the picture inside the element's box. */
const CLIP_AR = 1280 / 720;

/** Seconds into the clip from which the encode carries no trail at all —
 *  the farthest lit pixel IS the flame's own edge. The mask that does it
 *  is a circle baked into the encode that SHRINKS across the preceding
 *  five frames, so the embers are drawn in progressively rather than
 *  cut in one step, which pops. Re-encode that ramp and this moves. */
const CLEAN_FROM = 1.875;

/** How long the clip takes to carry its flame from where its own frame
 *  parks it to where the nav actually is. Matched to the window the flame
 *  is its own beat now rather than a window inside the clip: the clip
 *  has finished and is holding a still frame while this runs. */
const HOMING = 210;

/** The mark's own proportions, for solving the ink inside its box. */
const ART = 236 / 341;

/** How long to wait for the clip to actually start before giving up on
 *  it and running the sequence anyway. On a slow connection a black
 *  hold is worse than a drawing that starts a beat late. */
const START_TIMEOUT = 1500;

type Phase = "draw" | "burn" | "play" | "home" | "land" | "out";

export function Intro() {
  const [phase, setPhase] = useState<Phase>("draw");
  const [gone, setGone] = useState(false);

  const videoRef = useRef<HTMLVideoElement>(null);
  const mascotRef = useRef<HTMLVideoElement>(null);
  const timers = useRef<number[]>([]);
  /** The clip's move to the corner, held so a skip mid-air can stop it. */
  const flight = useRef<Animation | null>(null);

  const clear = () => {
    timers.current.forEach(clearTimeout);
    timers.current = [];
    // PAUSE, not cancel. The flight fills forwards, so cancelling drops
    // the transform and the flame snaps back to the middle of the screen
    // — very visible during skip()'s 260ms fade. Paused, it fades out
    // from wherever it had got to.
    flight.current?.pause();
    flight.current = null;
    mascotRef.current?.pause();
  };

  /** The nav lives outside this component's tree, and it has to know
   *  which beat we are on — the lockup has to appear up there at the
   *  same moment the name goes out down here. Mirroring the phase onto
   *  <html> lets that be one CSS rule instead of shared state. */
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

    const video = videoRef.current;
    let started = false;

    const start = () => {
      if (started) return;
      started = true;
      const at = (ms: number, fn: () => void) =>
        timers.current.push(window.setTimeout(fn, ms));

      at(CUE.burn, () => go("burn"));

      at(CUE.play, () => {
        // Rewound first: the sequence runs on every load, and a clip left
        // at its last frame from a previous run would show that frame
        // during the fade-in before it started.
        const mascot = mascotRef.current;
        if (mascot) {
          mascot.currentTime = 0;
          mascot.play().catch(() => {});
        }
        go("play");
      });

      at(CUE.home, () => {
        // The clip flies, not a mark. Solve where its flame comes to rest
        // in PAGE coordinates, then move the whole element so that point
        // lands on the nav.
        const mascot = mascotRef.current;
        const anchor = document.querySelector<HTMLElement>(
          '[data-lockup="nav"]',
        );
        const navMark = document.querySelector<HTMLElement>(
          '[data-lockup="nav-mark"]',
        );
        if (!mascot || !anchor || !navMark) return;

        // Do NOT pause: the flame is still travelling inside the frame
        // and its motion is half of what makes this read as one flight.
        // But never paint a frame from before the trail is masked out —
        // a slow decode would otherwise drag embers into the corner.
        if (mascot.currentTime < CLEAN_FROM) mascot.currentTime = CLEAN_FROM;

        // Read every box before writing any style — the heat field is
        // mid-frame and interleaving would force a layout inside it.
        const v = mascot.getBoundingClientRect();
        const a = anchor.getBoundingClientRect();
        // The nav's mark is driven by the heat field, which writes a
        // scale on it every frame, so its rendered rect is the wrong
        // target. offsetWidth/Height are layout, which a transform does
        // not touch.
        const mw = navMark.offsetWidth;
        const mh = navMark.offsetHeight;

        // `object-fit: contain` letterboxes the picture inside the
        // element, so the element's rect is NOT where the frame is. The
        // displayed box has to be solved before EXIT means anything —
        // this is the step that makes it correct at any window shape
        // rather than only at the one it was measured on.
        const dw = Math.min(v.width, v.height * CLIP_AR);
        const dh = dw / CLIP_AR;
        const px = v.left + (v.width - dw) / 2 + EXIT.cx * dw;
        const py = v.top + (v.height - dh) / 2 + EXIT.cy * dh;

        // Match the INK, not the box: the mark is contain-fitted too, and
        // its box is 6/9 at base but 8/11 from `sm` up.
        const target = Math.min(mw / ART, mh) / (EXIT.h * dh);
        const nx = a.left + mw / 2;
        const ny = a.top + a.height / 2;

        // Scale happens about the element's own centre, then translate.
        // So the exit point lands at centre + (exit - centre) * scale,
        // and the translate is whatever is left over to reach the nav.
        const ex = v.left + v.width / 2;
        const ey = v.top + v.height / 2;
        const tx = nx - (ex + (px - ex) * target);
        const ty = ny - (ey + (py - ey) * target);

        // Transform only, so it composites, and forwards so the landed
        // frame holds through the crossfade.
        flight.current = mascot.animate(
          [
            { transform: "none" },
            {
              transform: `translate(${tx.toFixed(2)}px, ${ty.toFixed(
                2,
              )}px) scale(${target.toFixed(4)})`,
            },
          ],
          {
            duration: HOMING,
            easing: EASE_FLIGHT,
            fill: "forwards",
          },
        );

        go("home");
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
      video?.removeEventListener("playing", start);
      document.documentElement.removeAttribute("data-intro");
    };
  }, [finish, skip]);

  if (gone) return null;

  return (
    <div
      className="intro"
      data-phase={phase}
      role="presentation"
      onClick={skip}
    >
      <div className="intro-stage">
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

          {/* The mascot. Same treatment as the drawing above it —
              screened over the void, so the clip's black ground drops out
              and only the creature is left. Muted, and carrying no audio
              track at all, so nothing here can ask for sound.

              It shares the drawing's box, and it is this element that
              flies: over its last two thirds of a second the whole clip
              is scaled and shifted so the point its flame parks on lands
              exactly on the nav's mark. Solved from the real boxes at run
              time, so it finds the corner on any screen. */}
          <video
            ref={mascotRef}
            className="intro-mascot"
            muted
            playsInline
            preload="auto"
            aria-hidden
          >
            <source src="/mascot.mp4" type="video/mp4" />
          </video>
        </div>
      </div>

      <button type="button" className="intro-skip label" onClick={skip}>
        Skip
      </button>
    </div>
  );
}
