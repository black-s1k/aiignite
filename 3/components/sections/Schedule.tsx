import { Reveal } from "@/components/Reveal";
import { Sheet } from "@/components/Sheet";
import { FACTS, TIMELINE } from "@/lib/content";

/**
 * The document half of the sheet: the facts anyone actually needs
 * before signing up, and the build schedule behind them.
 *
 * Thinnest ink coverage and the finest screen on the page — a fine
 * halftone reads as a printed document, a coarse one reads as a poster,
 * and this section is the former.
 */
export function Schedule() {
  return (
    <Sheet id="details" slug="The details" press="schedule">
      <Reveal>
        <h2 className="max-w-2xl font-display text-hed font-extrabold uppercase text-chalk">
          What you are signing up for
        </h2>
      </Reveal>

      <dl className="mt-14 border-t border-chalk/25">
        {FACTS.map((row, i) => (
          <Reveal
            key={row.label}
            delay={i * 55}
            className="grid gap-1 border-b border-chalk/25 py-5 sm:grid-cols-[12rem_minmax(0,1fr)] sm:gap-8"
          >
            <dt className="tag sm:pt-1">{row.label}</dt>
            <dd className="text-lg text-balance">{row.value}</dd>
          </Reveal>
        ))}
      </dl>

      <Reveal delay={120}>
        <p className="tag mt-20">Build schedule</p>
      </Reveal>

      <ol className="mt-6">
        {TIMELINE.map((t, i) => (
          <Reveal
            as="li"
            key={t.n}
            delay={i * 55}
            className="flex flex-wrap items-baseline gap-x-5 gap-y-1 border-b border-chalk/15 py-4"
          >
            <span className="font-mono text-xs tabular-nums text-forge">{t.n}</span>
            <span className="flex-1 text-base">{t.phase}</span>
            <span className="font-mono text-xs text-muted">{t.when}</span>
          </Reveal>
        ))}
      </ol>
    </Sheet>
  );
}
