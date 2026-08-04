import { Reveal } from "@/components/Reveal";
import { Sheet } from "@/components/Sheet";
import { FORGE_WORKSHOPS } from "@/lib/content";

/**
 * Numbered 01–04 with an unbroken rail down the left.
 *
 * The numbers are here because the order is real information — you
 * cannot evaluate a retrieval loop you have not built yet — and the
 * rail is what makes that visible. No dividers between items: a
 * divider would cut the rail and undo the only thing it is saying.
 */
export function Forge() {
  return (
    <Sheet id="forge" slug="Forge · curriculum" press="forge">
      <Reveal>
        <span aria-hidden className="mb-6 block h-1.5 w-16 bg-forge" />
        <h2 className="max-w-2xl font-display text-hed font-extrabold uppercase text-forge">
          Four workshops, one system
        </h2>
        <p className="mt-6 max-w-xl text-lg text-muted">
          Taken in order. Each session picks up the pipeline you finished in the
          last one, so by the fourth you are deploying the thing you started in
          the first.
        </p>
      </Reveal>

      <ol className="mt-16">
        {FORGE_WORKSHOPS.map((w, i) => (
          <Reveal
            as="li"
            key={w.n}
            delay={i * 70}
            className="grid grid-cols-[2.5rem_minmax(0,1fr)] gap-x-5 sm:grid-cols-[4rem_minmax(0,1fr)] sm:gap-x-8"
          >
            <div className="flex flex-col items-center">
              <span className="font-mono text-sm font-medium tabular-nums text-forge">
                {w.n}
              </span>
              {i < FORGE_WORKSHOPS.length - 1 && (
                <span aria-hidden className="mt-3 w-px flex-1 bg-forge/40" />
              )}
            </div>

            <div className="min-w-0 pb-14">
              <h3 className="-mt-1 font-display text-2xl font-extrabold uppercase leading-none tracking-tight text-graphite sm:text-3xl">
                {w.title}
              </h3>
              <p className="mt-4 max-w-xl text-base text-muted">{w.body}</p>
            </div>
          </Reveal>
        ))}
      </ol>
    </Sheet>
  );
}
