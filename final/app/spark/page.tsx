import type { Metadata } from "next";
import Link from "next/link";
import { Nav } from "@/components/Nav";
import { TrackHead } from "@/components/TrackHead";
import { CLUB, SPARK, TRACKS } from "@/lib/content";
import { SIGNUP } from "@/lib/signup";

const track = TRACKS.find((t) => t.key === "spark")!;

export const metadata: Metadata = {
  title: `${SPARK.title} · ${CLUB.name}`,
  description: `${SPARK.subtitle} Six standalone sessions at ${CLUB.university}. Members vote on what to build, then build it together. You leave each one with a working AI tool.`,
};

const SHELL = "mx-auto w-full max-w-[86rem] px-6 sm:px-10 lg:px-16";
const GUTTER = "grid gap-10 lg:grid-cols-[14rem_minmax(0,1fr)] lg:gap-16";

export default function Page() {
  return (
    <>
      <Nav />

      <main className={SHELL}>
        <TrackHead
          name={SPARK.name}
          title={SPARK.title}
          subtitle={SPARK.subtitle}
          shape={track.shape}
          intro={SPARK.intro}
        />

        {/* ---- The poll ----------------------------------------------
            First, not buried in the format section, because it is the
            one thing about this track that no other club is doing. */}
        <section className="border-t border-edge py-[10vh]" data-heat="rule">
          <div className={GUTTER}>
            <p data-heat="label" className="label lg:pt-3">
              {SPARK.poll.label}
            </p>
            <div className="max-w-[38rem]">
              <h2 className="font-display text-title text-bone [font-variation-settings:'wght'_760,'wdth'_114]">
                {SPARK.poll.heading}
              </h2>
              {SPARK.poll.body.map((p) => (
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
                {SPARK.who.map((w) => (
                  <li key={w} className="marker-line text-read text-bone">
                    {w}
                  </li>
                ))}
              </ul>
              <p className="mt-10 max-w-[34rem] border-l border-flame pl-5 text-read text-bone">
                {SPARK.outcome}
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
              {SPARK.format.map((f) => (
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

        {/* ---- The six sessions --------------------------------------
            Numbered and set large. Each entry answers one question and
            stops: what do I walk out holding. */}
        <section className="border-t border-edge py-[10vh]" data-heat="rule">
          <div className={GUTTER}>
            <p data-heat="label" className="label lg:pt-3">
              Six sessions
            </p>
            <ol className="max-w-[48rem]">
              {SPARK.sessions.map((s) => (
                <li
                  key={s.n}
                  data-heat="rule"
                  className="grid gap-x-8 gap-y-3 border-b border-edge py-8 sm:grid-cols-[3.5rem_minmax(0,1fr)]"
                >
                  <p className="font-display text-lead text-flame [font-variation-settings:'wght'_760,'wdth'_116]">
                    {s.n}
                  </p>
                  <div>
                    <h3 className="font-display text-sub text-bone [font-variation-settings:'wght'_700,'wdth'_112]">
                      {s.name}
                    </h3>
                    <p className="mt-3 max-w-[34rem] text-read text-ash">
                      <span className="text-bone">You build: </span>
                      {s.build}
                    </p>
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </section>

        {/* ---- Tools -------------------------------------------------- */}
        <section className="border-t border-edge py-[10vh]" data-heat="rule">
          <div className={GUTTER}>
            <p data-heat="label" className="label lg:pt-3">
              What you will use
            </p>
            <ul className="flex max-w-[44rem] flex-wrap gap-x-3 gap-y-3">
              {SPARK.tools.map((t) => (
                <li
                  key={t}
                  data-heat="rule"
                  className="border border-edge px-4 py-2 text-small text-bone"
                >
                  {t}
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* ---- What you leave with ----------------------------------- */}
        <section className="border-t border-edge py-[10vh]" data-heat="rule">
          <div className={GUTTER}>
            <p data-heat="label" className="label lg:pt-3">
              After all six
            </p>
            <ul className="grid max-w-[40rem] gap-4">
              {SPARK.leaveWith.map((l) => (
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
                Come to the first Spark session
              </h2>
              <p className="mt-6 text-lead text-void/75">
                Sessions begin {CLUB.launch}. Nothing to install, nothing to
                prepare, and no session assumes you were at the last one.
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
                <Link className="text-void/70 underline underline-offset-4" href="/forge">
                  Already code? The Forge track goes deeper
                </Link>
              </p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
