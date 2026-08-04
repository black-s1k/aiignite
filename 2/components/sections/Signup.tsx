import { Button } from "@/components/ui/button";
import { Reveal } from "@/components/Reveal";
import { Section } from "@/components/Section";
import { CLUB } from "@/lib/content";

/**
 * One primary action for the whole page. Points at a Google Form via
 * NEXT_PUBLIC_SIGNUP_URL — we don't capture emails ourselves.
 *
 * NEXT_PUBLIC_* is inlined at build time, so the fallback below only ever
 * shows up if the env var was missing when the site was built.
 */
const SIGNUP_URL = process.env.NEXT_PUBLIC_SIGNUP_URL || "#";

export function Signup() {
  return (
    <Section id="signup" eyebrow="Sign up">
      <Reveal className="flex flex-col items-start">
        <h2 className="text-4xl font-display tracking-display max-w-3xl text-balance">
          Pick a track. That&rsquo;s the whole commitment.
        </h2>
        <p className="text-muted mt-8 max-w-xl text-lg">
          Sessions begin {CLUB.launch}. Tell us which track fits and we&rsquo;ll send you
          the schedule before the term starts.
        </p>

        <Button
          asChild
          // The default variant carries a 3px focus ring — a box-shadow halo on
          // the accent, which this design system doesn't allow. Zeroed out so
          // the flat chartreuse outline from globals.css is what shows.
          className="mt-12 h-12 px-8 text-sm tracking-[0.08em] uppercase focus-visible:border-transparent focus-visible:ring-0"
        >
          <a href={SIGNUP_URL} target="_blank" rel="noopener noreferrer">
            Sign up for AI Ignite
          </a>
        </Button>

        <p className="text-muted mt-6 text-xs">
          Opens a Google Form. Takes about a minute.
        </p>
      </Reveal>
    </Section>
  );
}
