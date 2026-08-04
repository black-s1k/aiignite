import { Reveal } from "@/components/Reveal";
import { Sheet } from "@/components/Sheet";

/**
 * The only section that is purely an argument, so it gets the most
 * paper and the least ink — the press pulls its coverage out to the
 * margins here and leaves the measure clean.
 */
export function Problem() {
  return (
    <Sheet id="why" slug="The gap" press="problem" rule={false}>
      <Reveal>
        <h2 className="max-w-3xl font-display text-hed font-extrabold uppercase text-graphite">
          Most students graduate knowing AI exists.
        </h2>
      </Reveal>

      <Reveal delay={90}>
        <p className="mt-5 max-w-3xl font-display text-hed font-extrabold uppercase text-forge">
          Far fewer can build with it.
        </p>
      </Reveal>

      <Reveal delay={180}>
        <p className="mt-12 max-w-xl text-lg text-muted">
          The distance between what a course covers and what a team expects on
          your first day keeps growing. The students who close it before they
          graduate are the ones who get hired.
        </p>
      </Reveal>

      <Reveal delay={240}>
        <p className="mt-6 max-w-xl text-lg">
          AI Ignite exists to close it, for any York student, in any program.
        </p>
      </Reveal>
    </Sheet>
  );
}
