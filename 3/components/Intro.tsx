"use client";

import { useEffect, useRef } from "react";

/**
 * The title sequence. Circuit board, the flame forming, the flame
 * resolving into a halftone — then it clears and hands the sheet to the
 * live hero underneath.
 *
 * KNOWN AND ACCEPTED: THE CLIP CONTAINS MISSPELLED TYPE. It is generated
 * video, so its lettering is hallucinated rather than typeset. From
 * roughly 5s it reads "AI ZONITE · YORK UNIVERSITY", "FALL 2826",
 * "LASSONDE SCHOOL OF EN6INEERING", and both track chips are gibberish.
 *
 * It ran cut at 4.5s for exactly that reason. The client's call
 * (2026-08-08) is to ship the full 10s regardless, as an MVP. That is a
 * reasonable trade and this comment exists so nobody "discovers" the
 * misspellings later and assumes they were missed.
 *
 * The fix, when it comes, is a corrected clip — not code. Two lines to
 * re-cut if it is ever wanted back: encode with `-t 4.5`, and see the
 * note on timings below. Nothing else in this file depends on the length.
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
 * That animation is a BACKSTOP, and it is CANCELLED the moment playback
 * actually begins. It cannot simply be set longer than the clip: at 10s
 * that would mean a dead poster frame held for twelve seconds whenever
 * the script arms the overlay and React then fails to hydrate. So it
 * fires early enough to rescue that case quickly, and playback disarms
 * it — after which the deadline is re-armed from the clip's own
 * remaining duration.
 *
 * This is also why dismissal is driven from playback position rather
 * than a timer: the CSS timeline starts when the stylesheet applies, but
 * playback cannot begin until hydration nor finish until the clip has
 * buffered. Timing it from CSS faded the overlay out mid-clip on slow
 * loads. Because everything is measured against `video.duration`,
 * changing the clip's length needs no code change at all.
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
    if (video) {
      listeners.push(["ended", video], ["error", video], ["timeupdate", video]);
    }

    // Re-armable, because the right deadline changes once we know
    // playback has actually started and how long is left to run.
    let bail = 0;
    const deadline = (ms: number) => {
      window.clearTimeout(bail);
      bail = window.setTimeout(() => clear(), ms);
    };

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

    // Once frames are genuinely running, the CSS backstop is wrong — it
    // was sized to rescue a page where nothing ever started, and would
    // now cut the clip off partway. Disarm it, and set a deadline from
    // what is actually left to play plus slack for buffering.
    const onPlaying = () => {
      el.dataset.playing = "true";
      const left = Number.isFinite(video?.duration ?? NaN)
        ? (video!.duration - video!.currentTime) * 1000
        : 12000;
      deadline(left + 4000);
    };
    video?.addEventListener("playing", onPlaying);

    // play() is a promise, and it rejects when a browser declines to
    // autoplay. Clearing on that rejection is the difference between a
    // held poster frame and simply getting on with the page.
    if (video) {
      video.preload = "auto";
      video.play().catch(() => clear());
    } else {
      clear();
    }

    // Until playback proves otherwise, assume it is never going to start.
    deadline(8000);

    return () => {
      window.clearTimeout(bail);
      video?.removeEventListener("playing", onPlaying);
      for (const [type, target] of listeners) {
        target.removeEventListener(type, clear);
      }
    };
  }, []);

  return (
    <div ref={ref} className="intro" aria-hidden>
      <video
        className="intro-video"
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
