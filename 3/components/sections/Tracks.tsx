import { Reveal } from "@/components/Reveal";
import { Sheet } from "@/components/Sheet";
import { TRACKS } from "@/lib/content";

/**
 * The fork. Two columns split by a hard rule, because the choice the
 * page is asking for is binary and the layout should not soften that.
 *
 * The press is at its most separated here: both drums at equal weight,
 * pushed to opposite edges, screens at their clean angles. This is the
 * one moment the two tracks are visibly two different things.
 */
export function Tracks() {
  return (
    <Sheet id="tracks" slug="Two tracks" press="tracks">
      <Reveal>
        <h2 className="max-w-2xl font-display text-hed font-extrabold uppercase text-balance text-chalk">
          Pick the one that fits
        </h2>
      </Reveal>

      {/* A hairline between the columns, drawn as a border on the second
          one. The obvious alternative — a 1px grid gap over a filled
          parent — needs an opaque background on each cell, and an opaque
          cell punches a card-shaped hole straight through the ink
          behind it. Nothing on this page may be opaque except type. */}
      <div className="mt-14 grid sm:grid-cols-2">
        {TRACKS.map((t, i) => (
          <Reveal key={t.key} delay={i * 100} className="h-full">
            <div
              className={[
                // Full height with the fact table pushed to the bottom, so
                // the two tables line up across the columns whatever the
                // blurbs do. A comparison that doesn't align isn't one.
                "flex h-full flex-col",
                i === 0
                  ? "sm:pr-10"
                  : "mt-14 sm:mt-0 sm:border-l sm:border-chalk/25 sm:pl-10",
              ].join(" ")}
            >
              {/* Same rule device the Forge and Spark sections open with,
                  in that track's ink — one marker vocabulary, used once
                  per track, rather than a second shape invented here. */}
              <span
                aria-hidden
                className={[
                  "mb-5 block h-1.5 w-12",
                  t.key === "forge" ? "bg-forge" : "bg-spark",
                ].join(" ")}
              />

              <h3 className="font-display text-hed font-extrabold uppercase leading-none text-chalk">
                {t.name}
              </h3>

              <p className="tag mt-4">{t.who}</p>

              <p className="mt-6 max-w-md text-base text-muted">{t.blurb}</p>

              {/* Two facts per track, in mono, in the same order for
                  both — the whole point of this section is that the
                  reader can compare them at a glance. */}
              <dl className="mt-8 flex gap-10 border-t border-chalk/25 pt-4 font-mono text-xs uppercase tracking-wider sm:mt-auto">
                <div>
                  <dt className="text-muted">Length</dt>
                  <dd className="mt-1 text-chalk">{t.count}</dd>
                </div>
                <div>
                  <dt className="text-muted">Shape</dt>
                  <dd className="mt-1 text-chalk">{t.shape}</dd>
                </div>
              </dl>
            </div>
          </Reveal>
        ))}
      </div>
    </Sheet>
  );
}
