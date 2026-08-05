import { CLUB } from "@/lib/content";

/**
 * The one moment below the fold where the ink leaves the trim edges: it
 * spirals in off both sides, strikes the club's AI mark, and releases
 * back to the bands as you scroll out. The mark itself is printed by
 * the press — see `formed()` in lib/press/shader.ts — so there is no
 * image here to keep in sync with it.
 *
 * The section is deliberately tall and its contents sticky. The height
 * is the scroll runway the formation needs; the sticky child is what
 * holds the finished mark on screen at the top of the arc instead of
 * letting it slide past at the same speed as the page.
 *
 * `data-press-form` is the contract with Press.tsx: it drives the
 * formation off this element's own scroll progress, and writes the
 * result back as `--form` so the type below can arrive with the mark
 * rather than on a separate timer that would drift out of step.
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
        {/* The mark is ink, not markup, so the heading carries the name
            for anyone who can't see it being struck. */}
        <h2 id="mark-heading" className="sr-only">
          {CLUB.name} at {CLUB.at}
        </h2>

        {/* Sits under where the mark lands. Real text, not part of the
            plate — it is selectable, and it sets in the same face the
            rest of the page uses.

            The fallback is 1, not 0. Press.tsx lowers it on its first
            frame, long before this section is reached, so nobody sees
            it start visible — but if WebGL is unavailable, or the
            script never runs at all, real copy must not be left at zero
            opacity waiting for something that is never coming. */}
        <div
          className="mt-[36vh] flex flex-col items-center"
          style={{
            // Deliberately not opacity: var(--form). Tracking the ink
            // one-to-one puts the words at half opacity on top of the
            // swirl while it is still unwinding, and both lose. This
            // maps the last quarter of the formation onto the full fade,
            // so the mark lands first and the words arrive after it.
            // Out-of-range values clamp, so no min/max is needed.
            opacity: "calc((var(--form, 1) - 0.75) * 4)",
            transition: "opacity 120ms linear",
          }}
        >
          <p className="font-display text-hed font-extrabold uppercase leading-none tracking-tight text-overprint">
            Ignite
          </p>
          <p className="tag mt-5 text-center">{CLUB.tagline}</p>
        </div>
      </div>
    </section>
  );
}
