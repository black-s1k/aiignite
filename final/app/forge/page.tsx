import type { Metadata } from "next";
import Link from "next/link";
import { Nav } from "@/components/Nav";
import { PipelineRail } from "@/components/PipelineRail";
import { TrackHead } from "@/components/TrackHead";
import { CLUB, FORGE, TRACKS } from "@/lib/content";
import { SIGNUP } from "@/lib/signup";

const track = TRACKS.find((t) => t.key === "forge")!;

export const metadata: Metadata = {
  title: `${FORGE.title} · ${CLUB.name}`,
  description: `${FORGE.subtitle} Four sequential workshops at ${CLUB.university} building one pipeline: structured prompting, retrieval, programmatic evaluation, and fine-tuning.`,
};

const SHELL = "mx-auto w-full max-w-[86rem] px-6 sm:px-10 lg:px-16";
const GUTTER = "grid gap-10 lg:grid-cols-[14rem_minmax(0,1fr)] lg:gap-16";

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
        <section className="border-t border-edge py-[10vh]" data-heat="rule">
          <div className={GUTTER}>
            <p data-heat="label" className="label lg:pt-3">
              {FORGE.pipeline.label}
            </p>
            <div className="max-w-[38rem]">
              <h2 className="font-display text-title text-bone [font-variation-settings:'wght'_760,'wdth'_114]">
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
        <section className="border-t border-edge py-[10vh]" data-heat="rule">
          <div className={GUTTER}>
            <p data-heat="label" className="label lg:pt-3">
              Who it is for
            </p>
            <div className="max-w-[40rem]">
              <ul className="grid gap-4">
                {FORGE.who.map((w) => (
                  <li key={w} className="marker-line text-read text-bone">
                    {w}
                  </li>
                ))}
              </ul>
              <p className="mt-10 max-w-[34rem] border-l border-flame pl-5 text-read text-bone">
                {FORGE.outcome}
              </p>
            </div>
          </div>
        </section>

        {/* ---- How a session runs ------------------------------------ */}
        <section className="border-t border-edge py-[10vh]" data-heat="rule">
          <div className={GUTTER}>
            <p data-heat="label" className="label lg:pt-3">
              Ninety minutes
            </p>
            <ol className="grid max-w-[46rem] gap-px sm:grid-cols-3">
              {FORGE.format.map((f) => (
                <li key={f.k} data-heat="rule" className="border-t border-edge pt-5 sm:pr-8">
                  <p className="font-display text-small text-flame [font-variation-settings:'wght'_700,'wdth'_112]">
                    {f.t}
                  </p>
                  <p className="mt-3 font-display text-read text-bone [font-variation-settings:'wght'_640,'wdth'_110]">
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
        <section className="border-t border-edge py-[10vh]" data-heat="rule">
          <div className={GUTTER}>
            <div className="lg:pt-3">
              <PipelineRail layers={FORGE.pipeline.layers} />
            </div>

            <ol className="max-w-[48rem]">
              {FORGE.workshops.map((w) => (
                <li
                  key={w.n}
                  data-workshop={w.n}
                  data-heat="rule"
                  className="border-b border-edge py-10 first:pt-0"
                >
                  <div className="grid gap-x-8 gap-y-4 sm:grid-cols-[3.5rem_minmax(0,1fr)]">
                    <p className="font-display text-lead text-flame [font-variation-settings:'wght'_760,'wdth'_116]">
                      {w.n}
                    </p>
                    <div>
                      <h3 className="font-display text-sub text-bone [font-variation-settings:'wght'_700,'wdth'_112]">
                        {w.name}
                      </h3>
                      <p className="mt-3 max-w-[34rem] text-read text-ash">
                        {w.goal}
                      </p>

                      <p data-heat="label" className="label mt-8">
                        Key skills
                      </p>
                      <ul className="mt-3 grid max-w-[34rem] gap-2">
                        {w.skills.map((s) => (
                          <li key={s} className="marker-line text-small text-bone">
                            {s}
                          </li>
                        ))}
                      </ul>

                      <p className="mt-8 max-w-[34rem] border-l border-flame pl-5 text-read text-bone">
                        <span className="text-flame">You build: </span>
                        {w.build}
                      </p>

                      <ul className="mt-7 flex flex-wrap gap-2">
                        {w.tools.map((t) => (
                          <li
                            key={t}
                            data-heat="rule"
                            className="border border-edge px-3 py-1.5 text-small text-ash"
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
        <section className="border-t border-edge py-[10vh]" data-heat="rule">
          <div className={GUTTER}>
            <p data-heat="label" className="label lg:pt-3">
              Tools and ecosystem
            </p>
            <dl className="max-w-[46rem]">
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
        <section className="border-t border-edge py-[10vh]" data-heat="rule">
          <div className={GUTTER}>
            <p data-heat="label" className="label lg:pt-3">
              After all four
            </p>
            <ul className="grid max-w-[40rem] gap-4">
              {FORGE.leaveWith.map((l) => (
                <li key={l} className="marker-line text-read text-bone">
                  {l}
                </li>
              ))}
            </ul>
          </div>
        </section>
      </main>

      <section className="bg-flame py-[10vh] text-void">
        <div className={SHELL}>
          <div className={GUTTER}>
            <p className="label !text-void/60 lg:pt-3">Join</p>
            <div className="max-w-[40rem]">
              <h2 className="font-display text-title text-void [font-variation-settings:'wght'_800,'wdth'_116]">
                Come to the first Forge workshop
              </h2>
              <p className="mt-6 text-lead text-void/75">
                Workshops begin {CLUB.launch} and run biweekly. Bring a laptop
                and basic Python. Pick your dataset in session one and you will
                still be working on it in session four.
              </p>
              <a
                href={SIGNUP.href}
                className="group mt-10 inline-flex items-center gap-4 bg-void px-8 py-4 font-display text-read text-flame transition-[gap] duration-300 ease-[var(--ease-heat)] hover:gap-7 [font-variation-settings:'wght'_700,'wdth'_112]"
              >
                Sign up for {CLUB.name}
                <span aria-hidden>&rarr;</span>
              </a>
              <p className="mt-5 text-small text-void/60">{SIGNUP.note}</p>
              <p className="mt-8 text-small">
                <Link className="text-void/70 underline underline-offset-4" href="/spark">
                  Never written code? Start with the Spark track
                </Link>
              </p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
