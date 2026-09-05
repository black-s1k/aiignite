import type { Metadata } from "next";
import Link from "next/link";
import { JoinBlock } from "@/components/JoinBlock";
import { Nav } from "@/components/Nav";
import { TrackHead } from "@/components/TrackHead";
import { SHELL, GUTTER } from "@/lib/ui";
import { CLUB, SPARK, TRACKS } from "@/lib/content";

const track = TRACKS.find((t) => t.key === "spark")!;

export const metadata: Metadata = {
  title: `${SPARK.title} · ${CLUB.name}`,
  description: `${SPARK.subtitle} Six standalone sessions at ${CLUB.university}. Members vote on what to build, then build it together. You leave each one with a working AI tool.`,
};

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
        <section className="border-t border-edge py-[var(--space-section-dense)]" data-heat="rule">
          <div className={GUTTER}>
            <p data-heat="label" className="label lg:pt-3">
              {SPARK.poll.label}
            </p>
            <div className="max-w-read">
              <h2 className="text-title text-bone type-head">
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
        <section className="border-t border-edge py-[var(--space-section-dense)]" data-heat="rule">
          <div className={GUTTER}>
            <p data-heat="label" className="label lg:pt-3">
              Who it is for
            </p>
            <div className="max-w-read">
              <ul className="grid gap-4">
                {SPARK.who.map((w) => (
                  <li key={w} className="marker-line text-read text-bone">
                    {w}
                  </li>
                ))}
              </ul>
              <p className="mt-10 max-w-tight pullquote text-read">
                {SPARK.outcome}
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
              {SPARK.format.map((f) => (
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

        {/* ---- The six sessions --------------------------------------
            Numbered and set large. Each entry answers one question and
            stops: what do I walk out holding. */}
        <section className="border-t border-edge py-[var(--space-section-dense)]" data-heat="rule">
          <div className={GUTTER}>
            <p data-heat="label" className="label lg:pt-3">
              Six sessions
            </p>
            <ol className="max-w-wide">
              {SPARK.sessions.map((s) => (
                <li
                  key={s.n}
                  data-heat="rule"
                  className="grid gap-x-8 gap-y-3 border-b border-edge py-8 sm:grid-cols-[3.5rem_minmax(0,1fr)]"
                >
                  <p className="text-lead text-flame type-head">
                    {s.n}
                  </p>
                  <div>
                    <h3 className="text-sub text-bone type-strong">
                      {s.name}
                    </h3>
                    <p className="mt-3 max-w-tight text-read text-ash">
                      <span className="text-flame">You build: </span>
                      {s.build}
                    </p>
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </section>

        {/* ---- Tools -------------------------------------------------- */}
        <section className="border-t border-edge py-[var(--space-section-dense)]" data-heat="rule">
          <div className={GUTTER}>
            <p data-heat="label" className="label lg:pt-3">
              What you will use
            </p>
            <ul className="flex max-w-wide flex-wrap gap-x-3 gap-y-3">
              {SPARK.tools.map((t) => (
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
        </section>

        {/* ---- What you leave with ----------------------------------- */}
        <section className="border-t border-edge py-[var(--space-section-dense)]" data-heat="rule">
          <div className={GUTTER}>
            <p data-heat="label" className="label lg:pt-3">
              After all six
            </p>
            <ul className="grid max-w-read gap-4">
              {SPARK.leaveWith.map((l) => (
                <li key={l} className="marker-line text-read text-bone">
                  {l}
                </li>
              ))}
            </ul>
          </div>
        </section>
      </main>

      <JoinBlock
        heading="Come to the first Spark session"
        footer={
          <Link className="text-void/70 underline underline-offset-4" href="/forge">
            Already code? The Forge track goes deeper
          </Link>
        }
      >
        Sessions begin {CLUB.launch}. Nothing to install, nothing to prepare,
        and no session assumes you were at the last one.
      </JoinBlock>
    </>
  );
}
