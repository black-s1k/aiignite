import { Reveal } from "@/components/Reveal";
import { Sheet } from "@/components/Sheet";
import { SPARK_SESSIONS } from "@/lib/content";

/**
 * Unnumbered, and no rail. Forge gets both because it is a sequence;
 * Spark is six independent sessions in any order, so numbering them
 * would assert a prerequisite chain that does not exist. The visual
 * difference between this section and Forge is the information.
 *
 * Each session lists what the room votes on. That vote is the actual
 * format of the track, so it is set as data — mono, on the same line
 * every time — rather than described in a sentence.
 */
export function Spark() {
  return (
    <Sheet id="spark" slug="Spark · sessions" press="spark">
      <Reveal>
        <span aria-hidden className="mb-6 block h-1.5 w-16 bg-spark" />
        <h2 className="max-w-2xl font-display text-hed font-extrabold uppercase text-graphite">
          Six sessions, you pick the build
        </h2>
        <p className="mt-6 max-w-xl text-lg text-muted">
          No prerequisites, no order, nothing to install beforehand. Every
          session opens with a vote, and whatever the room picks is what the
          room builds that day.
        </p>
      </Reveal>

      <ul className="mt-16 border-t border-graphite/25">
        {SPARK_SESSIONS.map((s, i) => (
          <Reveal
            as="li"
            key={s.title}
            delay={i * 55}
            className="border-b border-graphite/25 py-7"
          >
            <div className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-2">
              <h3 className="font-display text-2xl font-extrabold uppercase leading-none tracking-tight text-graphite sm:text-3xl">
                {s.title}
              </h3>
              {s.tools && <p className="tag shrink-0">{s.tools}</p>}
            </div>

            <p className="mt-4 flex items-baseline gap-3 font-mono text-xs text-muted">
              {/* The mark, not the word — pink can't carry text on this
                  stock, so it points instead. */}
              <span aria-hidden className="mt-1 h-2 w-2 shrink-0 bg-spark" />
              <span>
                <span className="sr-only">The room votes on: </span>
                {s.vote}
              </span>
            </p>
          </Reveal>
        ))}
      </ul>
    </Sheet>
  );
}
