import type { Metadata } from "next";
import Link from "next/link";
import { JoinBlock } from "@/components/JoinBlock";
import { Nav } from "@/components/Nav";
import { PipelineRail } from "@/components/PipelineRail";
import { TrackHead } from "@/components/TrackHead";
import { SHELL, GUTTER } from "@/lib/ui";
import { CLUB, FORGE, TRACKS } from "@/lib/content";

const track = TRACKS.find((t) => t.key === "forge")!;

export const metadata: Metadata = {
  title: `${FORGE.title} · ${CLUB.name}`,
  description: `${FORGE.subtitle} Four sequential workshops at ${CLUB.university} building one pipeline: structured prompting, retrieval, programmatic evaluation, and fine-tuning.`,
};

export default function Page() {
  return (
    <>
      <Nav />

      <main className={SHELL}>
        <TrackHead
          name={FORGE.name}
          title={FORGE.title}
          subtitle={FORGE.subtitle}
          shape={track.shape}
          intro={FORGE.intro}
        />

        {/* ---- The pipeline ------------------------------------------ */}
        <section className="border-t border-edge py-[var(--space-section-dense)]" data-heat="rule">
          <div className={GUTTER}>
            <p data-heat="label" className="label lg:pt-3">
              {FORGE.pipeline.label}
            </p>
            <div className="max-w-read">
              <h2 className="text-title text-bone type-head">
                {FORGE.pipeline.heading}
              </h2>
              {FORGE.pipeline.body.map((p) => (
                <p key={p} className="mt-6 text-lead text-ash">
                  {p}
                </p>
              ))}
            </div>
          </div>
        </section>

        {/* ---- Who it is for ----------------------------------------- */}
        <section className="border-t border-edge py-[var(--space-section-dense)]" data-heat="rule">
          <div className={GUTTER}>
            <p data-heat="label" className="label lg:pt-3">
              Who it is for
            </p>
            <div className="max-w-read">
              <ul className="grid gap-4">
                {FORGE.who.map((w) => (
                  <li key={w} className="marker-line text-read text-bone">
                    {w}
                  </li>
                ))}
              </ul>
              <p className="mt-10 max-w-tight pullquote text-read">
                {FORGE.outcome}
              </p>
            </div>
          </div>
        </section>

        {/* ---- How a session runs ------------------------------------ */}
        <section className="border-t border-edge py-[var(--space-section-dense)]" data-heat="rule">
          <div className={GUTTER}>
            <p data-heat="label" className="label lg:pt-3">
              Ninety minutes
            </p>
            <ol className="grid gap-6 max-w-wide sm:grid-cols-3 sm:gap-x-8">
              {FORGE.format.map((f) => (
                <li key={f.k} data-heat="rule" className="border-t border-edge pt-5">
                  <p className="text-small text-flame type-strong">
                    {f.t}
                  </p>
                  <p className="mt-3 text-read text-bone type-lead">
                    {f.k}
                  </p>
                  <p className="mt-2 text-small text-ash">{f.v}</p>
                </li>
              ))}
            </ol>
          </div>
        </section>

        {/* ---- The four workshops ------------------------------------
            The rail in the gutter fills in as you read down these, so
            the accumulation the track is built on is visible rather than
            only asserted. See components/PipelineRail.tsx: the
            [data-workshop] attributes below are what it observes, so
            they are load-bearing rather than decorative. */}
        <section className="border-t border-edge py-[var(--space-section-dense)]" data-heat="rule">
          <div className={GUTTER}>
            <div className="lg:pt-3">
              <PipelineRail layers={FORGE.pipeline.layers} />
            </div>

            <ol className="max-w-wide">
              {FORGE.workshops.map((w) => (
                <li
                  key={w.n}
                  data-workshop={w.n}
                  data-heat="rule"
                  className="border-b border-edge py-10 first:pt-0"
                >
                  <div className="grid gap-x-8 gap-y-4 sm:grid-cols-[3.5rem_minmax(0,1fr)]">
                    <p className="text-lead text-flame type-head">
                      {w.n}
                    </p>
                    <div>
                      <h3 className="text-sub text-bone type-strong">
                        {w.name}
                      </h3>
                      <p className="mt-3 max-w-tight text-read text-ash">
                        {w.goal}
                      </p>

                      <p data-heat="label" className="label mt-8">
                        Key skills
                      </p>
                      <ul className="mt-3 grid max-w-tight gap-2">
                        {w.skills.map((s) => (
                          <li key={s} className="marker-line text-small text-bone">
                            {s}
                          </li>
                        ))}
                      </ul>

                      <p className="mt-8 max-w-tight pullquote text-read">
                        <span className="text-flame">You build: </span>
                        {w.build}
                      </p>

                      <ul className="mt-7 flex flex-wrap gap-2">
                        {w.tools.map((t) => (
                          <li
                            key={t}
                            data-heat="rule"
                            className="chip"
                          >
                            {t}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </section>

        {/* ---- The stack ---------------------------------------------- */}
        <section className="border-t border-edge py-[var(--space-section-dense)]" data-heat="rule">
          <div className={GUTTER}>
            <p data-heat="label" className="label lg:pt-3">
              Tools and ecosystem
            </p>
            <dl className="max-w-wide">
              {FORGE.stack.map((s) => (
                <div
                  key={s.k}
                  data-heat="rule"
                  className="grid gap-1 border-b border-edge py-4 sm:grid-cols-[15rem_minmax(0,1fr)] sm:gap-8"
                >
                  <dt className="text-small text-ash">{s.k}</dt>
                  <dd className="text-read text-bone">{s.v}</dd>
                </div>
              ))}
            </dl>
          </div>
        </section>

        {/* ---- What you leave with ----------------------------------- */}
        <section className="border-t border-edge py-[var(--space-section-dense)]" data-heat="rule">
          <div className={GUTTER}>
            <p data-heat="label" className="label lg:pt-3">
              After all four
            </p>
            <ul className="grid max-w-read gap-4">
              {FORGE.leaveWith.map((l) => (
                <li key={l} className="marker-line text-read text-bone">
                  {l}
                </li>
              ))}
            </ul>
          </div>
        </section>
      </main>

      <JoinBlock
        heading="Come to the first Forge workshop"
        footer={
          <Link className="text-void/70 underline underline-offset-4" href="/spark">
            Never written code? Start with the Spark track
          </Link>
        }
      >
        Workshops begin {CLUB.launch} and run biweekly. Bring a laptop and basic
        Python. Pick your dataset in session one and you will still be working
        on it in session four.
      </JoinBlock>
    </>
  );
}
