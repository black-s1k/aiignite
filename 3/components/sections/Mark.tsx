import { CLUB } from "@/lib/content";

/**
 * The one moment below the fold where the ink leaves the trim edges. It
 * comes in as horizontal strips from alternating sides, locks into the
 * club's lockup, holds, and comes apart again as you scroll out.
 *
 * The lockup is printed by the press from the real logo artwork — see
 * `formed()` in lib/press/shader.ts — so there is no image here to keep
 * in sync with it, and no wordmark set in type that could drift from the
 * brand.
 *
 * The script tagline is the one part of the logo NOT in the plate. Its
 * strokes are about one screen cell wide at any sane ruling, so a
 * halftone breaks them into unreadable specks. It is set below as real
 * text instead, which is sharper, selectable, and already the string in
 * lib/content.
 *
 * The section is deliberately tall with sticky contents: the height is
 * the scroll runway the assembly needs, and sticky is what holds the
 * finished lockup on screen instead of letting it slide past at page
 * speed.
 *
 * `data-press-form` is the contract with Press.tsx — it drives the
 * assembly off this element's own scroll progress and writes the result
 * back as `--form`, so the tagline arrives with the mark instead of on a
 * separate timer that would drift out of step.
 */
export function Mark() {
  return (
    <section
      id="mark"
      data-press="mark"
      data-press-form
      aria-labelledby="mark-heading"
      className="relative h-[220vh]"
    >
      <div className="sticky top-0 flex h-screen flex-col items-center justify-center px-5">
        {/* The lockup is ink, not markup, so the name has to be carried
            here for anyone who can't see it being struck. */}
        <h2 id="mark-heading" className="sr-only">
          {CLUB.name} at {CLUB.at} — {CLUB.tagline}
        </h2>

        <p
          aria-hidden
          // The lockup is struck a little above centre. It is relatively
          // shorter on a phone — it is sized off width, and a phone is
          // narrow and tall — so the clearance it needs is smaller there.
          className="mt-[30vh] text-center font-mono text-xs tracking-[0.14em] text-graphite sm:mt-[46vh] sm:text-sm"
          style={{
            // Deliberately not opacity: var(--form). Tracking the ink
            // one-to-one puts the tagline at half opacity while strips
            // are still flying across it and both lose. This maps the
            // last quarter of the assembly onto the full fade, so the
            // lockup lands first and the line arrives under it.
            // Out-of-range values clamp, so no min/max is needed.
            //
            // The fallback is 1, not 0: Press.tsx lowers it on its first
            // frame, long before this section is reached, but if WebGL
            // is unavailable or the script never runs, real copy must
            // not be left at zero opacity waiting for something that is
            // never coming.
            opacity: "calc((var(--form, 1) - 0.75) * 4)",
            transition: "opacity 120ms linear",
          }}
        >
          {CLUB.tagline}
        </p>
      </div>
    </section>
  );
}
