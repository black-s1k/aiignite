"use client";

import { useEffect, useRef } from "react";

/**
 * The title sequence. Circuit board, the flame forming, the flame
 * resolving into a halftone — then it clears and hands the sheet to the
 * live hero underneath.
 *
 * WHY IT STOPS WHERE IT STOPS. The supplied clip runs 10s and carries on
 * into a full hero layout, but that layout's lettering is generated and
 * wrong: "AI ZONITE", "FALL 2826", "LASSONDE SCHOOL OF EN6INEERING", and
 * two track chips of pure gibberish. None of it can ship on a club's own
 * site. The cut at 4.5s is the last frame before any type appears, which
 * turns the problem into a feature: the video does the cinematic build,
 * and the real DOM hero does the typography — sharp, selectable,
 * translatable, and actually spelled correctly.
 *
 * ---- The one rule ----
 * NOTHING HERE MAY MAKE THE CLIP FETCHABLE UNLESS IT IS GOING TO PLAY.
 *
 * The obvious build — `autoPlay` plus `preload="auto"` in the markup,
 * and hide it with CSS when it is not wanted — looks correct and is not.
 * `display: none` does not stop a download, and tearing the src out on
 * mount does not abort one already in flight: measured, a repeat view
 * still pulled the entire 502KB for a video it never showed. So the
 * element ships with `preload="none"` and NO autoplay attribute, and
 * playback is started from here. No play call, no bytes.
 *
 * ---- The failsafe ----
 * The overlay is hidden by default and only shown when the inline script
 * in layout.tsx adds `intro-armed`. That inverted default is deliberate:
 * if scripting is unavailable the class never lands, the overlay never
 * displays, and the reader gets the hero immediately — rather than
 * staring at a poster frame waiting on a video that has nothing to start
 * it. If the script runs but this component never hydrates, a CSS
 * animation hides the overlay anyway, so no failure here can leave the
 * page covered.
 *
 * That animation is a BACKSTOP and its delay is longer than the clip.
 * Normal dismissal is driven from the video's own playback position
 * below, because the CSS timeline starts when the stylesheet applies
 * while playback cannot start until hydration and cannot finish until
 * the clip has buffered. Driving it from CSS meant the overlay faded out
 * mid-clip on any slow load.
 *
 * The markup is server-rendered on purpose. Mounting after hydration
 * would paint the hero first and then cover it, which is the one
 * sequence that looks broken.
 */
export function Intro() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    // Armed by the inline script, which has already checked the session.
    // Reduced motion is handled in CSS as well, but it is checked here
    // too so that preference also means "download nothing".
    const armed =
      document.documentElement.classList.contains("intro-armed") &&
      !window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!armed) return;

    // Marked as seen immediately rather than on completion. Someone who
    // navigates away two seconds in has decided; making them sit through
    // it again on the way back would be the wrong reading of that.
    try {
      sessionStorage.setItem("ignite-intro", "1");
    } catch {
      // Private mode, or storage disabled. The sequence simply replays.
    }

    const video = el.querySelector("video");

    let done = false;
    const listeners: [string, EventTarget][] = [
      ["pointerdown", el],
      ["keydown", window],
      ["wheel", window],
      ["touchmove", window],
    ];
    if (video) listeners.push(["ended", video], ["error", video], ["timeupdate", video]);

    const clear = (e?: Event) => {
      // The fade is started from the video's own position rather than on
      // `ended`, so the last half second of the clip plays THROUGH the
      // crossfade and dissolves into the live hero. Waiting for `ended`
      // holds the final frame still and then fades a freeze-frame, which
      // is the difference between a handoff and a cut.
      if (e?.type === "timeupdate") {
        if (!video || !Number.isFinite(video.duration)) return;
        if (video.duration - video.currentTime > 0.55) return;
      }
      if (done) return;
      done = true;
      el.dataset.gone = "true";
      for (const [type, target] of listeners) {
        target.removeEventListener(type, clear);
      }
      // Stopped only once it is no longer visible, so pausing can never
      // freeze a frame the reader is still looking at.
      window.setTimeout(() => video?.pause(), 500);
    };

    // Any intent to get on with it ends the sequence. Deliberately not
    // `scroll`: Lenis owns that and the page beneath is already
    // scrollable, so wheel and touch are the honest signals of intent.
    for (const [type, target] of listeners) {
      target.addEventListener(type, clear, { passive: true });
    }

    // play() is a promise, and it rejects when a browser declines to
    // autoplay. Clearing on that rejection is the difference between a
    // held poster frame and simply getting on with the page.
    if (video) {
      video.preload = "auto";
      video.play().catch(clear);
    } else {
      clear();
    }

    // Backstop, slightly past where the CSS animation finishes, for the
    // case where playback stalls and `ended` never arrives.
    const bail = window.setTimeout(clear, 8000);

    return () => {
      window.clearTimeout(bail);
      for (const [type, target] of listeners) {
        target.removeEventListener(type, clear);
      }
    };
  }, []);

  return (
    <div ref={ref} className="intro" aria-hidden>
      <video
        className="h-full w-full object-cover"
        // Biased right of centre so the flame — the only thing that has
        // to survive — stays in frame when a 16:9 clip is cropped to a
        // phone. At laptop proportions this crops almost nothing.
        style={{ objectPosition: "68% 50%" }}
        src="/intro.mp4"
        poster="/intro-poster.jpg"
        // No autoPlay, and preload="none". See the note above: these two
        // absences are what stop the clip downloading for people who are
        // never going to be shown it.
        preload="none"
        muted
        playsInline
      />

      {/* A real control, not just "click anywhere" — that is
          undiscoverable and unreachable from a keyboard. It leaves the
          tab order with the overlay when the overlay hides. */}
      <button
        type="button"
        className="intro-skip tag"
        onClick={() => {
          if (ref.current) ref.current.dataset.gone = "true";
        }}
      >
        Skip
      </button>
    </div>
  );
}
