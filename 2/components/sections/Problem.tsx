import { Reveal } from "@/components/Reveal";
import { Section } from "@/components/Section";

/**
 * Large type, no decoration. This is the only section that gets to be
 * mostly empty space — it earns the rest of the page.
 */
export function Problem() {
  return (
    <Section id="mission" eyebrow="The problem" bare>
      <Reveal>
        <h2 className="text-3xl font-display tracking-display max-w-3xl text-balance">
          Most students graduate knowing AI exists.{" "}
          <span className="text-muted">Far fewer know how to build with it.</span>
        </h2>
      </Reveal>

      <Reveal delay={0.08}>
        <p className="text-muted mt-10 max-w-2xl text-lg">
          The gap between what&rsquo;s taught in class and what&rsquo;s expected on day one
          of a job keeps widening. The students who close it before they graduate are
          the ones who stand out.
        </p>
      </Reveal>

      <Reveal delay={0.14}>
        <p className="mt-6 max-w-2xl text-lg">
          AI Ignite exists to close that gap for every York student, regardless of
          program.
        </p>
      </Reveal>
    </Section>
  );
}
