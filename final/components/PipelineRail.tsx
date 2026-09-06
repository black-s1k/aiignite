"use client";

import { useEffect, useRef, useState } from "react";
import { usePrefersReducedMotion } from "@/lib/motion";

/**
 * The Forge track's structural idea, made visible while you read it.
 *
 * Forge is not four workshops; it is ONE pipeline that gains a layer
 * each session. That is the single hardest thing to convey in prose,
 * because prose arrives one workshop at a time and the point is what
 * accumulates. So the rail sticks alongside the workshops and fills in:
 * by the time you have read workshop three, three layers are lit and the
 * fourth is still dark.
 *
 * This is deliberately NOT a reveal animation. Nothing fades up as it
 * enters the viewport, which is the house style of every generated page
 * and carries no information. The rail is a position indicator that
 * happens to also be the diagram of the thing being described, and it is
 * driven by which workshop you are actually reading.
 *
 * It is decorative in the accessibility sense only: every workshop
 * carries its own heading and number in the document, so a screen reader
 * or a printed page loses nothing by skipping it.
 */
export function PipelineRail({
  layers,
}: {
  layers: readonly { n: string; k: string; v: string }[];
}) {
  /** Which workshop is being read. Only meaningful when the rail is
   *  tracking — under reduced motion the lit count is derived instead,
   *  which is why this is not the thing rendered directly. */
  const [tracked, setTracked] = useState(0);
  const ref = useRef<HTMLDivElement>(null);
  const reduced = usePrefersReducedMotion();

  // Everything lit, nothing tracking. The diagram still reads as a
  // diagram; it just stops responding to the scroll position.
  //
  // DERIVED, not stored. This used to be `setActive(layers.length - 1)`
  // in the effect below, which is a setState in an effect body — one
  // render with the wrong answer and then another with the right one, on
  // every mount. There is no state here: it is a function of the media
  // query and the layer count, and both are available during render.
  const active = reduced ? layers.length - 1 : tracked;

  useEffect(() => {
    // Nothing to observe when the rail is not tracking. No setState on
    // this path any more — the line above already has the answer.
    if (reduced) return;

    const marks = Array.from(
      document.querySelectorAll<HTMLElement>("[data-workshop]"),
    );
    if (!marks.length) return;

    // Reads only what the observer already computed. No getBoundingClientRect
    // in the callback, so this never forces a layout while the heat field
    // is mid-frame.
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (!e.isIntersecting) continue;
          const i = marks.indexOf(e.target as HTMLElement);
          if (i >= 0) setTracked(i);
        }
      },
      // A band across the middle of the screen: a workshop counts as the
      // one being read when it is in the middle, not when its top edge
      // clips the bottom of the window.
      { rootMargin: "-45% 0px -45% 0px", threshold: 0 },
    );

    marks.forEach((m) => io.observe(m));
    return () => io.disconnect();
  }, [reduced]);

  return (
    <div ref={ref} className="rail lg:sticky lg:top-32">
      <p data-heat="label" className="label">
        The pipeline
      </p>

      <ol className="mt-6 grid gap-0">
        {layers.map((l, i) => {
          const built = i <= active;
          return (
            <li
              key={l.n}
              data-built={built}
              className="rail-step grid grid-cols-[1.5rem_minmax(0,1fr)] gap-4 pb-7 last:pb-0"
            >
              <div className="rail-gutter">
                <span className="rail-dot" aria-hidden />
                {i < layers.length - 1 && (
                  <span className="rail-line" aria-hidden />
                )}
              </div>
              <div>
                <p className="rail-k text-small type-strong">
                  {l.k}
                </p>
                <p className="rail-v mt-1 text-small">{l.v}</p>
              </div>
            </li>
          );
        })}
      </ol>
    </div>
  );
}
