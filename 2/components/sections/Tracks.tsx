import { Reveal } from "@/components/Reveal";
import { Section } from "@/components/Section";
import { cn } from "@/lib/utils";

/**
 * The "which one am I?" section. Forge carries the accent, Spark is plain
 * white — two tracks made separable without a second accent colour.
 */

type Track = {
  name: string;
  forWhom: string;
  who: string;
  body: string;
  facts: string[];
  accent: boolean;
};

const TRACKS: Track[] = [
  {
    name: "Forge",
    forWhom: "You're in Forge if",
    who: "you already write code.",
    body: "A sequential, project-backed curriculum. Every student builds on one ongoing data pipeline across all four workshops — each session layers onto the last, ending in a deployment-ready AI system.",
    facts: [
      "CS, Software Engineering, Data Science, graduate students",
      "Four sessions, taken in order",
      "Presented by graduate students who've built these systems",
    ],
    accent: true,
  },
  {
    name: "Spark",
    forWhom: "You're in Spark if",
    who: "you've never written a line.",
    body: "Before each session members vote in a poll to pick the project they'll build. Every session opens with a short presentation, then hands-on building time where everyone finishes something.",
    facts: [
      "All faculties, all years, no experience needed",
      "Six sessions, take them in any order",
      "No coding from scratch — Claude, Cursor, n8n, Lovable",
    ],
    accent: false,
  },
];

export function Tracks() {
  return (
    <Section id="tracks" eyebrow="Two tracks">
      <Reveal>
        <h2 className="text-3xl font-display tracking-display max-w-3xl text-balance">
          Pick the one that matches where you are now.
        </h2>
        <p className="text-muted mt-6 max-w-2xl text-lg">
          Both run in parallel under the same club, share community events, and end
          in a joint showcase. You choose your track at signup.
        </p>
      </Reveal>

      <div className="border-border mt-14 grid border sm:mt-20 md:grid-cols-2">
        {TRACKS.map((t, i) => (
          <Reveal
            key={t.name}
            delay={i * 0.1}
            className={cn(
              "bg-surface flex flex-col p-7 sm:p-9",
              // Hairline between the two panels: below md they stack, so the
              // divider moves from the left edge to the top edge.
              i === 1 && "border-border border-t md:border-t-0 md:border-l",
            )}
          >
            <span
              aria-hidden
              className={cn("mb-7 block h-px w-12", t.accent ? "bg-accent" : "bg-text")}
            />

            <h3
              className={cn(
                "text-2xl font-display tracking-display",
                t.accent ? "text-accent" : "text-text",
              )}
            >
              {t.name}
            </h3>

            <p className="mt-5 text-lg">
              <span className="text-muted">{t.forWhom} </span>
              {t.who}
            </p>

            <p className="text-muted mt-4 text-base">{t.body}</p>

            <ul className="border-border mt-7 space-y-3 border-t pt-7">
              {t.facts.map((f) => (
                <li key={f} className="flex gap-3 text-sm">
                  <span
                    aria-hidden
                    className={cn(
                      "mt-2 h-px w-3 shrink-0",
                      t.accent ? "bg-accent" : "bg-text/40",
                    )}
                  />
                  <span className="text-muted">{f}</span>
                </li>
              ))}
            </ul>
          </Reveal>
        ))}
      </div>
    </Section>
  );
}
