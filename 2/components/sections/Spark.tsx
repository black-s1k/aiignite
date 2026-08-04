import { Reveal } from "@/components/Reveal";
import { Section } from "@/components/Section";
import { SPARK_SESSIONS } from "@/lib/content";

/**
 * Deliberately a grid and deliberately unnumbered. These sessions are
 * independent and poll-driven — numbering them would imply a prerequisite
 * chain that doesn't exist. Contrast with <Forge />, which is a rail.
 */
export function Spark() {
  return (
    <Section id="spark" eyebrow="Spark track · sessions">
      <Reveal>
        {/* White rule mirrors Forge's chartreuse one — same marker language,
            the two tracks separable without a second accent colour. */}
        <span aria-hidden className="bg-text mb-7 block h-px w-12" />
        <h2 className="text-3xl font-display tracking-display max-w-3xl text-balance">
          Six sessions. You vote on what gets built.
        </h2>
        <p className="text-muted mt-6 max-w-2xl text-lg">
          Take them in any order — nothing here depends on anything else. Before each
          one, members vote in a poll to pick the project, and everybody leaves with
          it finished.
        </p>
      </Reveal>

      {/* gap-px over a border-coloured container: the background shows through
          as hairlines, so no doubled edges to clean up. */}
      <ul className="border-border bg-border mt-14 grid gap-px border sm:mt-20 sm:grid-cols-2 lg:grid-cols-3">
        {SPARK_SESSIONS.map((s, i) => (
          <Reveal
            as="li"
            key={s.title}
            delay={(i % 3) * 0.06}
            className="bg-surface hover:bg-bg flex flex-col p-6 transition-colors duration-200 sm:p-7"
          >
            <h3 className="text-lg font-display tracking-display text-balance">
              {s.title}
            </h3>
            <p className="text-muted mt-4 flex-1 text-sm">{s.vote}</p>
            {/* text-muted at full strength: at 70% of it this line drops to
                ~2.9:1 on the surface colour and fails AA. */}
            {s.tools && (
              <p className="text-muted mt-6 font-mono text-xs">{s.tools}</p>
            )}
          </Reveal>
        ))}
      </ul>
    </Section>
  );
}
