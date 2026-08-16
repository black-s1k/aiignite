import Link from "next/link";
import { HeatText } from "@/components/HeatText";
import { Intro } from "@/components/Intro";
import { Mark } from "@/components/Mark";
import { Nav } from "@/components/Nav";
import {
  ABOUT,
  CLUB,
  FAQ,
  GLANCE,
  LOGISTICS,
  PURPOSE,
  TEAM,
  TRACKS,
  WHY,
} from "@/lib/content";
import { SIGNUP } from "@/lib/signup";

/**
 * The page explains itself completely, in the order a student actually
 * asks: what is this, why does it exist, is it for me, what will I
 * build, who runs it, what if I am unsure, how do I join.
 *
 * The layout idea is a single asymmetric column that never centres.
 * Everything hangs off one left axis and the measure changes per
 * section, so the page has a spine but not a template. Structure is made
 * of rules and space. There are no cards and nothing floats.
 *
 * The section labels in the left gutter are load-bearing rather than
 * decorative: they are what lets someone landing mid-page know where
 * they are without a heading shouting it.
 *
 * The two tracks get their own pages rather than being unrolled here.
 * Between them they carry ten sessions, four tool stacks and two
 * detailed formats, and pouring that into the landing page would bury
 * the five facts a first-time reader came for. What stays here is the
 * choice between them; the syllabus is one click away for the people who
 * want it.
 */

const SHELL = "mx-auto w-full max-w-[86rem] px-6 sm:px-10 lg:px-16";
const GUTTER = "grid gap-10 lg:grid-cols-[14rem_minmax(0,1fr)] lg:gap-16";

export default function Home() {
  return (
    <>
      <a
        href="#why"
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
            {CLUB.faculty} · Launching {CLUB.term}
          </p>

          <h1 className="text-vast">
            <HeatText as="span" className="text-bone">
              AI Ignite
            </HeatText>
            <HeatText as="span" className="text-flame">
              at York
            </HeatText>
          </h1>

          <div className="mt-12 max-w-[36rem] sm:mt-14 sm:ml-[8%] lg:ml-[22%]">
            <p className="font-display text-lead text-bone [font-variation-settings:'wght'_640,'wdth'_110]">
              {CLUB.tagline}
            </p>
            <p className="mt-5 text-read text-ash">
              A hands-on AI club at {CLUB.university} where students from every
              faculty build real AI tools instead of only learning that they
              exist.
            </p>

            <div className="mt-10 flex flex-wrap items-center gap-4">
              <a
                href={SIGNUP.href}
                className="bg-flame px-7 py-3.5 font-display text-read text-void transition-colors duration-200 hover:bg-bone [font-variation-settings:'wght'_700,'wdth'_112]"
              >
                Join the club
              </a>
              <a
                href="#tracks"
                className="border border-edge px-7 py-3.5 font-display text-read text-bone transition-colors duration-200 hover:border-flame hover:text-flame [font-variation-settings:'wght'_620,'wdth'_112]"
              >
                Explore tracks
              </a>
            </div>
          </div>
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

        {/* ---- Why ---------------------------------------------------
            The problem before the pitch. A club page that opens by
            describing itself is asking for trust it has not earned; one
            that opens by naming something the reader already feels is
            making an argument. */}
        <section id="why" className={`${SHELL} scroll-mt-32 py-[12vh]`}>
          <div className={GUTTER}>
            <p data-heat="label" className="label lg:pt-3">
              {WHY.label}
            </p>
            <div className="max-w-[40rem]">
              <h2 className="font-display text-title text-bone [font-variation-settings:'wght'_760,'wdth'_114]">
                {WHY.heading}
              </h2>
              {WHY.body.map((p) => (
                <p key={p} className="mt-6 text-lead text-ash">
                  {p}
                </p>
              ))}
              {ABOUT.map((p) => (
                <p key={p} className="mt-6 text-read text-ash">
                  {p}
                </p>
              ))}
            </div>
          </div>
        </section>

        {/* ---- Mission and vision ------------------------------------ */}
        <section className={`${SHELL} pb-[12vh]`}>
          <div className={GUTTER}>
            <p data-heat="label" className="label lg:pt-3">
              What we are for
            </p>
            <dl className="grid max-w-[52rem] gap-px sm:grid-cols-2">
              {PURPOSE.map((p) => (
                <div key={p.k} data-heat="rule" className="border-t border-edge pt-6 sm:pr-10">
                  <dt className="font-display text-read text-flame [font-variation-settings:'wght'_700,'wdth'_112]">
                    {p.k}
                  </dt>
                  <dd className="mt-4 text-read text-ash">{p.v}</dd>
                </div>
              ))}
            </dl>
          </div>
        </section>

        {/* ---- Two tracks --------------------------------------------
            The one real decision the page asks a reader to make, so it
            gets the most space and the plainest language. Each side is
            described by what you leave with, because that is the actual
            question. */}
        <section id="tracks" className={`${SHELL} scroll-mt-32 pb-[12vh]`}>
          <div className={GUTTER}>
            <p data-heat="label" className="label lg:pt-3">
              Two tracks, one club
            </p>
            <div>
              <h2 className="max-w-[30rem] font-display text-title text-bone [font-variation-settings:'wght'_760,'wdth'_114]">
                Pick the one that fits where you are starting
              </h2>
              <p className="mt-6 max-w-[38rem] text-read text-ash">
                Both run in parallel, share community events, and finish the
                term with a joint showcase. You can switch, and you can come to
                both.
              </p>

              <div className="mt-14 grid gap-px lg:grid-cols-2">
                {TRACKS.map((t) => (
                  <article
                    key={t.key}
                    data-heat="rule"
                    className="track border-t border-edge pt-8 lg:[&:last-child]:pl-12"
                  >
                    <p data-heat="label" className="label">
                      {t.audience}
                    </p>
                    <h3 className="mt-5 font-display text-[clamp(2.6rem,6vw,4rem)] leading-[0.94] text-bone [font-variation-settings:'wght'_800,'wdth'_116]">
                      {t.name}
                    </h3>
                    <p className="mt-4 text-small text-flame">
                      {t.shape}
                    </p>
                    <p className="mt-6 max-w-[30rem] text-read text-ash">
                      {t.blurb}
                    </p>

                    <p className="mt-7 max-w-[30rem] border-l border-flame pl-5 text-read text-bone">
                      {t.outcome}
                    </p>

                    <p className="mt-6 text-small text-ash">{t.cadence}</p>

                    <p className="mt-8">
                      <Link
                        href={t.href}
                        className="group inline-flex items-center gap-3 font-display text-read text-flame transition-[gap] duration-300 ease-[var(--ease-heat)] hover:gap-5 [font-variation-settings:'wght'_680,'wdth'_112]"
                      >
                        See the {t.name} sessions
                        <span aria-hidden>&rarr;</span>
                      </Link>
                    </p>
                  </article>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ---- At a glance ------------------------------------------- */}
        <section className={`${SHELL} pb-[12vh]`}>
          <div className={GUTTER}>
            <p data-heat="label" className="label lg:pt-3">
              At a glance
            </p>
            <dl className="max-w-[46rem]">
              {GLANCE.map((g) => (
                <div
                  key={g.k}
                  data-heat="rule"
                  className="grid gap-1 border-b border-edge py-4 sm:grid-cols-[13rem_minmax(0,1fr)] sm:gap-8"
                >
                  <dt className="text-small text-ash">{g.k}</dt>
                  <dd className="text-read text-bone">{g.v}</dd>
                </div>
              ))}
            </dl>
          </div>
        </section>

        {/* ---- Who runs it -------------------------------------------
            Fifteen real names. A club launching with no history has
            exactly one form of credibility available to it, which is
            people willing to attach their names to the thing, so this
            section is set as type rather than as a grid of avatars. */}
        <section id="team" className={`${SHELL} scroll-mt-32 pb-[12vh]`}>
          <div className={GUTTER}>
            <p data-heat="label" className="label lg:pt-3">
              Who runs it
            </p>
            <div className="max-w-[52rem]">
              <div className="grid gap-10 sm:grid-cols-2">
                {TEAM.lead.map((p) => (
                  <div key={p.name} data-heat="rule" className="border-t border-edge pt-6">
                    <p className="font-display text-lead text-bone [font-variation-settings:'wght'_700,'wdth'_112]">
                      {p.name}
                    </p>
                    <p className="mt-1 text-small text-flame">{p.role}</p>
                  </div>
                ))}
              </div>

              <div className="mt-14 grid gap-x-12 gap-y-10 sm:grid-cols-2">
                {TEAM.groups.map((g) => (
                  <div key={g.k}>
                    <p data-heat="label" className="label">
                      {g.k}
                    </p>
                    <ul className="mt-4 grid gap-1.5">
                      {g.people.map((n) => (
                        <li key={n} className="text-read text-bone">
                          {n}
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>

              <div data-heat="rule" className="mt-14 border-t border-edge pt-6">
                <p data-heat="label" className="label">
                  Faculty advisor
                </p>
                <p className="mt-3 font-display text-lead text-bone [font-variation-settings:'wght'_620,'wdth'_112]">
                  {CLUB.advisor.name}
                </p>
                <p className="mt-1 text-small text-ash">{CLUB.advisor.dept}</p>
              </div>
            </div>
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
          do something. Spend it anywhere else and it stops meaning
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
                href={SIGNUP.href}
                className="group mt-10 inline-flex items-center gap-4 bg-void px-8 py-4 font-display text-read text-flame transition-[gap] duration-300 ease-[var(--ease-heat)] hover:gap-7 [font-variation-settings:'wght'_700,'wdth'_112]"
              >
                Sign up for {CLUB.name}
                <span aria-hidden>&rarr;</span>
              </a>
              <p className="mt-5 text-small text-void/60">{SIGNUP.note}</p>
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
              {CLUB.fullName}
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
            <p data-heat="label" className="label mt-6">
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
              Tracks
            </p>
            <p className="mt-2 text-small">
              <Link className="text-bone underline underline-offset-4" href="/spark">
                The Spark Track
              </Link>
            </p>
            <p className="mt-2 text-small">
              <Link className="text-bone underline underline-offset-4" href="/forge">
                The Forge Track
              </Link>
            </p>
          </div>
          <div>
            <p data-heat="label" className="label">
              Home
            </p>
            <p className="mt-2 text-small text-bone">{CLUB.faculty}</p>
            <p className="text-small text-ash">{CLUB.university}</p>
            {/* Both are real pages describing what this site and this
                club actually do, not boilerplate. See app/privacy and
                app/terms. If the site's behaviour changes, they are
                wrong until they change too. */}
            <p className="mt-4 text-small">
              <Link
                className="text-ash underline underline-offset-4"
                href="/privacy"
              >
                Privacy
              </Link>
              <span className="px-2 text-edge">·</span>
              <Link
                className="text-ash underline underline-offset-4"
                href="/terms"
              >
                Terms
              </Link>
            </p>
          </div>
        </div>
      </footer>
    </>
  );
}
