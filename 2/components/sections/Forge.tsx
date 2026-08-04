import { Reveal } from "@/components/Reveal";
import { Section } from "@/components/Section";
import { FORGE_WORKSHOPS } from "@/lib/content";

/**
 * Numbered 01–04 with a continuous rail down the left. The rail is the
 * whole point: these workshops are a chain, not a menu. No horizontal
 * rules between items — they'd cut the rail and undo that.
 */
export function Forge() {
  return (
    <Section id="forge" eyebrow="Forge track · curriculum">
      <Reveal>
        {/* The chartreuse rule is the track marker here. The eyebrow and the
            01–04 numbers already carry Forge — setting the heading in accent
            as well would be a third signal and blow the accent budget. */}
        <span aria-hidden className="bg-accent mb-7 block h-px w-12" />
        <h2 className="text-3xl font-display tracking-display max-w-3xl text-balance">
          Four workshops, one system.
        </h2>
        <p className="text-muted mt-6 max-w-2xl text-lg">
          Taken in order. Each session builds directly on the pipeline you finished
          in the last one, so by the fourth you&rsquo;re deploying something you started
          in the first.
        </p>
      </Reveal>

      <ol className="mt-14 sm:mt-20">
        {FORGE_WORKSHOPS.map((w, i) => (
          <Reveal
            as="li"
            key={w.n}
            delay={i * 0.06}
            className="grid grid-cols-[auto_1fr] gap-x-5 sm:gap-x-10"
          >
            {/* Rail: the number, then the line that ties it to the next step. */}
            <div className="flex flex-col items-center">
              <span className="text-accent font-display tracking-display text-lg leading-none tabular-nums sm:text-2xl">
                {w.n}
              </span>
              {i < FORGE_WORKSHOPS.length - 1 && (
                <span aria-hidden className="bg-border mt-4 w-px flex-1" />
              )}
            </div>

            <div className="min-w-0 pb-12 sm:pb-16">
              <h3 className="text-2xl font-display tracking-display -mt-1 text-balance">
                {w.title}
              </h3>
              <p className="text-muted mt-4 max-w-2xl text-base">{w.body}</p>
            </div>
          </Reveal>
        ))}
      </ol>
    </Section>
  );
}
