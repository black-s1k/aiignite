import { HeatText } from "@/components/HeatText";
import { Intro } from "@/components/Intro";
import { Mark } from "@/components/Mark";
import { Nav } from "@/components/Nav";
import { ABOUT, CLUB, FAQ, LOGISTICS, SESSION, TRACKS } from "@/lib/content";

/**
 * One page that explains itself completely, in the order a student
 * actually asks: what is this, is it for me, what happens when I turn
 * up, what will I make, what if I am unsure, how do I join.
 *
 * The layout idea is a single asymmetric column that never centres.
 * Everything hangs off one left axis and the measure changes per
 * section, so the page has a spine but not a template. Structure is made
 * of rules and space — there are no cards and nothing floats.
 *
 * The section labels in the left gutter are load-bearing rather than
 * decorative: they are what lets someone landing mid-page know where
 * they are without a heading shouting it.
 */

const SHELL = "mx-auto w-full max-w-[86rem] px-6 sm:px-10 lg:px-16";
const GUTTER = "grid gap-10 lg:grid-cols-[14rem_minmax(0,1fr)] lg:gap-16";

export default function Home() {
  return (
    <>
      <a
        href="#about"
        className="sr-only focus:not-sr-only focus:absolute focus:left-6 focus:top-6 focus:z-50 focus:bg-flame focus:px-4 focus:py-2 focus:text-void"
      >
        Skip to content
      </a>

      <Intro />

      <Nav />

      <main id="top">
        {/* ---- The line ---------------------------------------------- */}
        <section className={`${SHELL} pt-[22vh] pb-[8vh] sm:pt-[26vh]`}>
          <p data-heat="label" className="label mb-8">
            {CLUB.faculty} · {CLUB.term}
          </p>

          <h1 className="text-vast">
            <HeatText as="span" className="text-bone">
              Ignite
            </HeatText>
            <HeatText as="span" className="text-flame">
              the spark
            </HeatText>
          </h1>

          <p className="mt-12 max-w-[34rem] text-lead text-bone sm:mt-14 sm:ml-[8%] lg:ml-[22%]">
            A student club at {CLUB.university}, running weekly through{" "}
            {CLUB.term}. We build things with AI tools — we do not sit around
            talking about them.
          </p>
        </section>

        {/* ---- Logistics, before anyone has to scroll for them --------
            The reference site puts date, time and place in the first
            screen, and it is right: these are the facts a student needs
            before any argument about why the club is good. */}
        <section className={SHELL}>
          <dl
            data-heat="rule"
            className="grid border-y border-edge sm:grid-cols-3"
          >
            {LOGISTICS.map((l) => (
              <div
                key={l.k}
                data-heat="rule"
                className="border-b border-edge py-6 last:border-b-0 sm:border-b-0 sm:border-r sm:pr-8 sm:last:border-r-0 sm:[&:not(:first-child)]:pl-8"
              >
                <dt data-heat="label" className="label">
                  {l.k}
                </dt>
                <dd className="mt-2 font-display text-lead text-bone [font-variation-settings:'wght'_620,'wdth'_112]">
                  {l.v}
                </dd>
                <dd className="mt-1 text-small text-ash">{l.sub}</dd>
              </div>
            ))}
          </dl>
        </section>

        {/* ---- What it is -------------------------------------------- */}
        <section id="about" className={`${SHELL} scroll-mt-32 py-[12vh]`}>
          <div className={GUTTER}>
            <p data-heat="label" className="label lg:pt-3">
              What it is
            </p>
            <div className="max-w-[42rem]">
              {ABOUT.map((p) => (
                <p key={p} className="mb-6 text-lead text-bone last:mb-0">
                  {p}
                </p>
              ))}
            </div>
          </div>

          {/* Who backs it. The reference earns trust with a row of
              partner logos and three years of history; this club has
              neither yet, so it uses what is actually true instead of
              manufacturing a track record. */}
          <div className={`${GUTTER} mt-16`}>
            <p data-heat="label" className="label lg:pt-3">
              Who runs it
            </p>
            <dl className="max-w-[42rem] grid gap-8 sm:grid-cols-2">
              <div>
                <dt data-heat="label" className="label">
                  Faculty advisor
                </dt>
                <dd className="mt-2 text-read text-bone">
                  {CLUB.advisor.name}
                </dd>
                <dd className="text-small text-ash">{CLUB.advisor.dept}</dd>
              </div>
              <div>
                <dt data-heat="label" className="label">
                  Home
                </dt>
                <dd className="mt-2 text-read text-bone">{CLUB.faculty}</dd>
                <dd className="text-small text-ash">{CLUB.university}</dd>
              </div>
            </dl>
          </div>
        </section>

        {/* ---- Two tracks -------------------------------------------- */}
        <section id="tracks" className={`${SHELL} scroll-mt-32 pb-[12vh]`}>
          <div className={GUTTER}>
            <p data-heat="label" className="label lg:pt-3">
              Who it is for
            </p>
            <div className="max-w-[42rem]">
              <p className="text-lead text-bone">
                Two tracks, split by one question: have you written code
                before. Pick the one that fits — you can switch, and you can
                come to both.
              </p>
            </div>
          </div>

          <div
            data-heat="rule"
            className="mt-14 grid gap-px border-t border-edge bg-edge lg:grid-cols-2"
          >
            {TRACKS.map((t) => (
              <article key={t.key} className="bg-void pt-10 lg:px-1">
                {/* The audience is named before the track is, because
                    "Forge" means nothing to someone who has just arrived
                    and "if you already code" means everything. */}
                <p data-heat="label" className="label !text-bone">
                  {t.audience}
                </p>
                <h2 className="mt-3 text-title">
                  <HeatText
                    as="span"
                    className={t.key === "spark" ? "text-flame" : "text-bone"}
                  >
                    {t.name}
                  </HeatText>
                </h2>
                <p className="mt-6 max-w-[32rem] text-read text-ash">
                  {t.blurb}
                </p>

                <p data-heat="label" className="label mt-10 !text-bone">
                  {t.shape}
                </p>
                <ol className="mt-4 max-w-[32rem]">
                  {t.sessions.map((s, i) => (
                    <li
                      key={s}
                      data-heat="rule"
                      className="flex gap-5 border-b border-edge py-3 text-read text-bone last:border-b-0"
                    >
                      <span
                        data-heat="label"
                        className="label w-6 shrink-0 pt-1.5"
                      >
                        {String(i + 1).padStart(2, "0")}
                      </span>
                      <span>{s}</span>
                    </li>
                  ))}
                </ol>
              </article>
            ))}
          </div>
        </section>

        {/* ---- What a session is ------------------------------------- */}
        <section id="session" className={`${SHELL} scroll-mt-32 pb-[12vh]`}>
          <div className={GUTTER}>
            <p data-heat="label" className="label lg:pt-3">
              A session
            </p>
            <div className="max-w-[42rem]">
              <h2 className="text-title">
                <HeatText as="span" className="text-bone">
                  What actually happens
                </HeatText>
              </h2>
              <p className="mt-6 text-lead text-ash">
                {SESSION.length}. Nobody is going to lecture at you for an
                hour.
              </p>
            </div>
          </div>

          <ol data-heat="rule" className="mt-14 border-t border-edge">
            {SESSION.steps.map((s) => (
              <li
                key={s.at}
                data-heat="rule"
                className="grid gap-3 border-b border-edge py-7 lg:grid-cols-[14rem_16rem_minmax(0,1fr)] lg:gap-16"
              >
                <span data-heat="label" className="label lg:pt-2">
                  {s.at}
                </span>
                <h3 className="font-display text-lead text-bone [font-variation-settings:'wght'_640,'wdth'_110]">
                  {s.title}
                </h3>
                <p className="max-w-[34rem] text-read text-ash">{s.body}</p>
              </li>
            ))}
          </ol>

          <div className={`${GUTTER} mt-12`}>
            <p data-heat="label" className="label lg:pt-3">
              What to bring
            </p>
            <ul className="flex max-w-[42rem] flex-wrap gap-x-8 gap-y-3">
              {SESSION.bring.map((b) => (
                <li key={b} className="text-read text-bone">
                  <span aria-hidden className="mr-3 text-flame">
                    /
                  </span>
                  {b}
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* ---- FAQ ---------------------------------------------------
            Native <details>, not a JS accordion. It works before
            hydration, it is keyboard-operable for free, and the browser
            will find text inside a closed one on Ctrl+F. */}
        <section id="faq" className={`${SHELL} scroll-mt-32 pb-[12vh]`}>
          <div className={GUTTER}>
            <p data-heat="label" className="label lg:pt-3">
              Before you ask
            </p>
            <div className="max-w-[46rem]">
              {FAQ.map((f) => (
                <details key={f.q} data-heat="rule" className="faq border-b border-edge">
                  <summary className="flex cursor-pointer items-start gap-5 py-5 font-display text-lead text-bone [font-variation-settings:'wght'_580,'wdth'_108]">
                    <span aria-hidden className="faq-sign mt-1 shrink-0 text-flame">
                      +
                    </span>
                    {f.q}
                  </summary>
                  <p className="max-w-[36rem] pb-6 pl-10 text-read text-ash">
                    {f.a}
                  </p>
                </details>
              ))}
            </div>
          </div>
        </section>
      </main>

      {/* ---- Join ----------------------------------------------------
          The one full-bleed flame block on the page. The loudest colour
          appears exactly once, at the only moment the reader is asked to
          do something — spend it anywhere else and it stops meaning
          anything here. */}
      <section id="join" className="scroll-mt-32 bg-flame py-[12vh] text-void">
        <div className={SHELL}>
          <div className={GUTTER}>
            <p className="label !text-void/60 lg:pt-3">Join</p>
            <div className="max-w-[42rem]">
              <h2 className="font-display text-title text-void [font-variation-settings:'wght'_800,'wdth'_116]">
                Come to the first one
              </h2>
              <p className="mt-6 text-lead text-void/75">
                Sessions begin {CLUB.launch}. Tell us which track fits and we
                will send the schedule before term starts. It takes about a
                minute and you can change your mind later.
              </p>
              <a
                href={process.env.NEXT_PUBLIC_SIGNUP_URL || "#"}
                className="group mt-10 inline-flex items-center gap-4 bg-void px-8 py-4 font-display text-read text-flame transition-[gap] duration-300 ease-[var(--ease-heat)] hover:gap-7 [font-variation-settings:'wght'_700,'wdth'_112]"
              >
                Sign up for {CLUB.name}
                <span aria-hidden>&rarr;</span>
              </a>
              <p className="mt-5 text-small text-void/60">
                Opens a form · no York login needed
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ---- Colophon ------------------------------------------------ */}
      <footer data-heat="rule" className={`${SHELL} border-t border-edge py-12`}>
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <Mark className="h-8 w-6" />
            <p className="mt-4 font-display text-read text-bone [font-variation-settings:'wght'_700,'wdth'_112]">
              {CLUB.name}
            </p>
            <p className="mt-1 text-small text-ash">{CLUB.tagline}</p>
          </div>
          <div>
            <p data-heat="label" className="label">
              General
            </p>
            <p className="mt-2 text-small">
              <a
                className="text-bone underline underline-offset-4"
                href={`mailto:${CLUB.contact}`}
              >
                {CLUB.contact}
              </a>
            </p>
          </div>
          <div>
            <p data-heat="label" className="label">
              Sponsor a session
            </p>
            <p className="mt-2 text-small">
              <a
                className="text-bone underline underline-offset-4"
                href={`mailto:${CLUB.sponsors}`}
              >
                {CLUB.sponsors}
              </a>
            </p>
          </div>
          <div>
            <p data-heat="label" className="label">
              Home
            </p>
            <p className="mt-2 text-small text-bone">{CLUB.faculty}</p>
            <p className="text-small text-ash">{CLUB.university}</p>
          </div>
        </div>
      </footer>
    </>
  );
}
