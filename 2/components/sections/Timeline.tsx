import { Reveal } from "@/components/Reveal";
import { Section } from "@/components/Section";
import { TIMELINE } from "@/lib/content";

/**
 * Numbered vertical phases. Genuinely sequential, so the rail is honest
 * here for the same reason it is in <Forge />.
 */
export function Timeline() {
  return (
    <Section id="timeline" eyebrow="Rollout">
      <Reveal>
        <h2 className="text-3xl font-display tracking-display max-w-3xl text-balance">
          Where we are.
        </h2>
      </Reveal>

      <ol className="mt-14 sm:mt-20">
        {TIMELINE.map((p, i) => {
          const last = i === TIMELINE.length - 1;
          return (
            <Reveal
              as="li"
              key={p.n}
              delay={i * 0.05}
              className="grid grid-cols-[auto_1fr] gap-x-5 sm:gap-x-10"
            >
              <div className="flex flex-col items-center">
                <span
                  aria-hidden
                  className={`mt-1.5 block size-1.5 shrink-0 ${
                    last ? "bg-accent" : "bg-border"
                  }`}
                />
                {!last && <span aria-hidden className="bg-border mt-3 w-px flex-1" />}
              </div>

              <div className="min-w-0 pb-10 sm:pb-12">
                <div className="flex flex-wrap items-baseline gap-x-4 gap-y-1">
                  <span className="text-muted font-mono text-xs tabular-nums">
                    {p.n}
                  </span>
                  <h3 className="text-lg font-display tracking-display">{p.phase}</h3>
                  <span
                    className={`text-xs ${last ? "text-accent" : "text-muted"}`}
                  >
                    {p.when}
                  </span>
                </div>
                <p className="text-muted mt-3 max-w-xl text-sm">{p.detail}</p>
              </div>
            </Reveal>
          );
        })}
      </ol>
    </Section>
  );
}
