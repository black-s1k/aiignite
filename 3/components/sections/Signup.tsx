import { Reveal } from "@/components/Reveal";
import { Sheet } from "@/components/Sheet";
import { CLUB } from "@/lib/content";

/**
 * The one action on the page, and the only place both drums run at full
 * flood with their screens converged — the sheet is at maximum ink
 * exactly where the reader is asked to decide.
 *
 * Points at a Google Form via NEXT_PUBLIC_SIGNUP_URL; we don't collect
 * anything ourselves. NEXT_PUBLIC_* is inlined at build time, so the
 * fallback only appears if the var was missing when the site was built.
 */
const SIGNUP_URL = process.env.NEXT_PUBLIC_SIGNUP_URL || "#";

export function Signup() {
  return (
    <Sheet id="signup" slug="Sign up" press="signup">
      <Reveal>
        <h2 className="max-w-3xl font-display text-mega font-extrabold uppercase leading-[0.82] text-graphite">
          Pick a track
        </h2>
        {/* Graphite, not muted. This is the only paragraph on the page
            that sits under live ink, and muted grey over a halftone is
            the one combination that stops being text. */}
        <p className="mt-6 max-w-xl text-lg">
          That is the whole commitment. Sessions start {CLUB.launch}. Tell us
          which track fits and we will send the schedule before term does.
        </p>
      </Reveal>

      <Reveal delay={110}>
        {/* A printed button: a hard block of ink with a second block
            offset behind it, the way a two-pass overprint sits. It
            settles onto its shadow on hover — the sheet registering. */}
        <a
          href={SIGNUP_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="group relative mt-14 inline-block"
        >
          <span
            aria-hidden
            className="absolute inset-0 translate-x-2 translate-y-2 bg-spark transition-transform duration-300 ease-[var(--ease-press)] group-hover:translate-x-0 group-hover:translate-y-0"
          />
          <span className="relative block bg-overprint px-9 py-5 font-display text-2xl font-extrabold uppercase tracking-tight text-paper sm:text-3xl">
            Sign up for AI Ignite
          </span>
        </a>
      </Reveal>

      <Reveal delay={170}>
        <p className="tag mt-6">Opens a Google Form · about a minute</p>
      </Reveal>
    </Sheet>
  );
}
