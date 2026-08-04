"use client";

import { useEffect, useRef } from "react";
import { GRAIN } from "@/lib/grain";

/* ------------------------------------------------------------------
   AI Ignite — scroll-scrubbed video hero

   Assets (in /public):
     ignite-scroll-1440.mp4   desktop
     ignite-scroll-1080.mp4   mobile
     ignite-poster.jpg        first paint + reduced-motion fallback

   The videos are encoded all-intra (every frame a keyframe), which is
   what makes seeking instant instead of stuttery. Do not re-encode.
------------------------------------------------------------------ */

const SCROLL_VH = 420; // scroll distance mapped to the 6s clip
const EASE = 0.12; // scrub smoothing; lower = heavier//more cinematic

export default function IgniteVideoScroll() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = videoRef.current;
    const section = sectionRef.current;
    if (!video || !section) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) return; // poster stays, no scrubbing

    // pick the right file for the viewport
    video.src =
      window.innerWidth < 768 ? "/ignite-scroll-1080.mp4" : "/ignite-scroll-1440.mp4";
    video.load();

    // iOS refuses to decode until the video has been touched by a gesture
    const unlock = () => {
      video.play().then(() => video.pause()).catch(() => {});
    };
    document.addEventListener("touchstart", unlock, { once: true, passive: true });

    let duration = 0;
    let current = 0;
    let raf = 0;
    let ready = false;

    const onMeta = () => {
      duration = video.duration || 6;
      ready = true;
    };
    video.addEventListener("loadedmetadata", onMeta);

    // cache viewport height — iOS address-bar collapse changes innerHeight mid-scroll
    let vh = window.innerHeight;
    const onResize = () => {
      vh = window.innerHeight;
    };
    window.addEventListener("resize", onResize);

    const tick = () => {
      raf = requestAnimationFrame(tick);
      if (!ready) return;

      const rect = section.getBoundingClientRect();
      const span = section.offsetHeight - vh;
      const p = span > 0 ? Math.min(1, Math.max(0, -rect.top / span)) : 0;

      const target = p * (duration - 0.03);
      current += (target - current) * EASE;

      // only seek on a meaningful delta, otherwise the decoder thrashes
      if (Math.abs(video.currentTime - current) > 0.008) {
        video.currentTime = current;
      }
    };
    raf = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(raf);
      video.removeEventListener("loadedmetadata", onMeta);
      window.removeEventListener("resize", onResize);
      document.removeEventListener("touchstart", unlock);
    };
  }, []);

  return (
    <div
      ref={sectionRef}
      data-hero-scroll
      style={{ height: `${SCROLL_VH}vh` }}
      className="relative"
    >
      <div className="sticky top-0 h-screen w-full overflow-hidden">
        <video
          ref={videoRef}
          poster="/ignite-poster.jpg"
          muted
          playsInline
          preload="auto"
          disablePictureInPicture
          aria-hidden
          // object-contain, not cover: the source is a 1440² square and the
          // wordmark sits in its bottom third, so cover crops the payoff off
          // any landscape viewport. The video matte is #090909 against a
          // #0A0A0A page — the letterboxing is invisible.
          className="absolute inset-0 h-full w-full object-contain"
        />

        {/* grain lives here, not in the video — saved ~4MB of encode weight.
            The sticky container makes its own stacking context, so the fixed
            site-wide <Grain /> can't reach over it. Same constant, though. */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 opacity-[0.05] mix-blend-overlay"
          style={{ backgroundImage: GRAIN, backgroundRepeat: "repeat" }}
        />

        {/* real text for SEO + screen readers; the video is decoration */}
        <h1 className="sr-only">
          AI Ignite at York — Ignite the spark. Let AI do the rest.
        </h1>

        {/* text-muted rather than the original text-white/25 — at 25% this is
            ~2:1 against the page black and fails the contrast audit. */}
        <div className="text-muted absolute inset-x-0 bottom-10 text-center text-[10px] uppercase tracking-[0.34em]">
          Scroll
        </div>
      </div>
    </div>
  );
}
