import { Reveal } from "@/components/Reveal";
import { Section } from "@/components/Section";
import { GLANCE } from "@/lib/content";

/**
 * Compact fact table. A <dl> because that's what it is — four label/value
 * pairs, not a list of features.
 */
export function Glance() {
  return (
    <Section id="glance" eyebrow="At a glance">
      <dl className="border-border border-t">
        {GLANCE.map((row, i) => (
          // Reveal renders the div itself — <dl> allows a div wrapping dt/dd,
          // but not a div wrapping a div.
          <Reveal
            key={row.label}
            delay={i * 0.05}
            className="border-border grid gap-1 border-b py-6 sm:grid-cols-[14rem_1fr] sm:gap-8 sm:py-7"
          >
            <dt className="text-muted text-sm">{row.label}</dt>
            <dd className="text-lg text-balance">{row.value}</dd>
          </Reveal>
        ))}
      </dl>
    </Section>
  );
}
