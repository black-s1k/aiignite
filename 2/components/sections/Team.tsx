import { Reveal } from "@/components/Reveal";
import { Section } from "@/components/Section";
import { TEAM, TEAM_SIZE } from "@/lib/team";

/**
 * Wired to lib/team.ts, which currently holds two placeholders. The copy
 * below says so plainly rather than padding the grid with fake people.
 */
export function Team() {
  const remaining = TEAM_SIZE - TEAM.length;

  return (
    <Section id="team" eyebrow="Team">
      <Reveal>
        <h2 className="text-3xl font-display tracking-display max-w-3xl text-balance">
          Fifteen people across both tracks.
        </h2>
        <p className="text-muted mt-6 max-w-2xl text-lg">
          President, VP, Technical Leads for Forge and Spark, Finance, Marketing, and
          Support Management.
        </p>
      </Reveal>

      <ul className="border-border bg-border mt-14 grid gap-px border sm:mt-20 sm:grid-cols-2 lg:grid-cols-3">
        {TEAM.map((m, i) => (
          <Reveal
            as="li"
            key={`${m.role}-${i}`}
            delay={i * 0.06}
            className="bg-surface p-6 sm:p-7"
          >
            <p className="text-muted text-lg">{m.name}</p>
            <p className="eyebrow mt-3">{m.role}</p>
          </Reveal>
        ))}

        {remaining > 0 && (
          <Reveal
            as="li"
            delay={TEAM.length * 0.06}
            className="bg-surface flex items-center p-6 sm:p-7"
          >
            <p className="text-muted text-sm">
              {/* JSX drops the space between an expression and a text node that
                  wraps to the next line — hence the explicit one. */}
              {remaining}{" "}
              more roles to be announced once every member has confirmed
              they&rsquo;re happy to be listed.
            </p>
          </Reveal>
        )}
      </ul>
    </Section>
  );
}
