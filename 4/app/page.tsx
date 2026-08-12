import { HeatText } from "@/components/HeatText";
import { Mark } from "@/components/Mark";
import { ABOUT, CLUB, FACTS, TRACKS } from "@/lib/content";

/**
 * One page, five plain answers, in the order a student actually asks
 * them: what is this, is it for me, what will I make, when is it, how
 * do I join.
 *
 * The layout idea is a single asymmetric column that never centres.
 * Everything hangs off one left axis and the measure changes per
 * section, so the page has a spine but not a template. Structure is
 * made of rules and space — there are no cards, and nothing floats.
 */

const SHELL = "mx-auto w-full max-w-[86rem] px-6 sm:px-10 lg:px-16";

export default function Home() {
  return (
    <>
      <a
        href="#about"
        className="sr-only focus:not-sr-only focus:absolute focus:left-6 focus:top-6 focus:z-50 focus:bg-flame focus:px-4 focus:py-2 focus:text-void"
      >
        Skip to content
      </a>

      {/* ---- Masthead ------------------------------------------------ */}
      <header className={`${SHELL} pt-8 sm:pt-10`}>
        <div data-heat="rule" className="flex items-center justify-between gap-6 border-b border-edge pb-5">
          <div className="flex items-center gap-3">
            <Mark className="h-7 w-5 shrink-0" />
            <p data-heat="label" className="label !text-bone">
              {CLUB.name} · {CLUB.university}
            </p>
          </div>
          <p data-heat="label" className="label hidden sm:block">{CLUB.faculty}</p>
          <p data-heat="label" className="label">{CLUB.term}</p>
        </div>
      </header>

      <main>
        {/* ---- The line ----------------------------------------------
            The only place on the page that raises its voice, and the
            one carrying the signature. Two lines rather than one so the
            heat has somewhere to travel to. */}
        <section className={`${SHELL} pt-[14vh] pb-[10vh] sm:pt-[18vh]`}>
          <h1 className="text-vast">
            <HeatText as="span" className="text-bone">
              Ignite
            </HeatText>
            <HeatText as="span" className="text-flame">
              the spark
            </HeatText>
          </h1>

          {/* Offset right and held to a reading measure — the page's
              first deliberate asymmetry, and the moment the serif
              arrives against the grotesque. */}
          <p className="mt-12 max-w-[34rem] text-lead text-bone sm:mt-16 sm:ml-[8%] lg:ml-[22%]">
            A student club at {CLUB.university}, running weekly through{" "}
            {CLUB.term}. We build things with AI tools — we do not sit around
            talking about them.
          </p>
        </section>

        {/* ---- Facts strip ------------------------------------------- */}
        <section className={SHELL}>
          <ul data-heat="rule" className="grid grid-cols-2 gap-px border-y border-edge bg-edge sm:grid-cols-4">
            {[
              ["Cost", "Free"],
              ["Application", "None"],
              ["Open to", "Any York student"],
              ["Starts", CLUB.launch],
            ].map(([k, v]) => (
              <li key={k} className="bg-void px-1 py-6 sm:px-2">
                <p data-heat="label" className="label">{k}</p>
                <p className="mt-2 font-display text-read text-bone [font-variation-settings:'wght'_600,'wdth'_112]">
                  {v}
                </p>
              </li>
            ))}
          </ul>
        </section>

        {/* ---- What it is -------------------------------------------- */}
        <section id="about" className={`${SHELL} py-[12vh]`}>
          <div className="grid gap-10 lg:grid-cols-[14rem_minmax(0,1fr)] lg:gap-16">
            <p data-heat="label" className="label lg:pt-3">What it is</p>
            <div className="max-w-[42rem]">
              {ABOUT.map((p) => (
                <p key={p} className="mb-6 text-lead text-bone last:mb-0">
                  {p}
                </p>
              ))}
            </div>
          </div>
        </section>

        {/* ---- The two tracks ---------------------------------------- */}
        <section className={`${SHELL} pb-[12vh]`}>
          <div className="grid gap-10 lg:grid-cols-[14rem_minmax(0,1fr)] lg:gap-16">
            <p data-heat="label" className="label lg:pt-3">Two tracks</p>
            <div className="max-w-[42rem]">
              <p className="text-lead text-bone">
                Pick the one that fits. You can switch, and you can come to
                both — nobody is checking.
              </p>
            </div>
          </div>

          <div data-heat="rule" className="mt-14 grid gap-px border-t border-edge bg-edge lg:grid-cols-2">
            {TRACKS.map((t) => (
              <article key={t.key} className="bg-void pt-10 lg:px-1">
                <h2 className="text-title text-bone">
                  <HeatText
                    as="span"
                    className={t.key === "spark" ? "text-flame" : "text-bone"}
                  >
                    {t.name}
                  </HeatText>
                </h2>
                <p data-heat="label" className="label mt-4">{t.who}</p>
                <p className="mt-6 max-w-[32rem] text-read text-ash">
                  {t.blurb}
                </p>

                <p data-heat="label" className="label mt-10 !text-bone">{t.shape}</p>
                <ol className="mt-4 max-w-[32rem]">
                  {t.sessions.map((s, i) => (
                    <li
                      key={s}
                      data-heat="rule"
                      className="flex gap-5 border-b border-edge py-3 text-read text-bone last:border-b-0"
                    >
                      <span data-heat="label" className="label w-6 shrink-0 pt-1.5">
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

        {/* ---- Plain logistics --------------------------------------- */}
        <section className={`${SHELL} pb-[12vh]`}>
          <div className="grid gap-10 lg:grid-cols-[14rem_minmax(0,1fr)] lg:gap-16">
            <p data-heat="label" className="label lg:pt-3">The details</p>
            <dl data-heat="rule" className="max-w-[46rem] border-t border-edge">
              {FACTS.map((f) => (
                <div
                  key={f.q}
                  data-heat="rule"
                  className="grid gap-2 border-b border-edge py-5 sm:grid-cols-[11rem_minmax(0,1fr)] sm:gap-8"
                >
                  <dt data-heat="label" className="label sm:pt-1">{f.q}</dt>
                  <dd className="text-read text-bone">{f.a}</dd>
                </div>
              ))}
            </dl>
          </div>
        </section>

        {/* ---- Join --------------------------------------------------- */}
        <section className={`${SHELL} pb-[14vh]`}>
          <h2 className="text-title">
            <HeatText as="span" className="text-bone">
              Come to the first one
            </HeatText>
          </h2>
          <p className="mt-8 max-w-[36rem] text-lead text-ash">
            Sessions begin {CLUB.launch}. Tell us which track fits and we will
            send the schedule before term starts.
          </p>
          <a
            href={process.env.NEXT_PUBLIC_SIGNUP_URL || "#"}
            className="group mt-10 inline-flex items-center gap-4 border-b-2 border-flame pb-2 font-display text-lead text-flame transition-[gap] duration-300 ease-[var(--ease-heat)] hover:gap-7 [font-variation-settings:'wght'_700,'wdth'_112]"
          >
            Sign up
            <span aria-hidden>&rarr;</span>
          </a>
          <p data-heat="label" className="label mt-5">Opens a form · about a minute</p>
        </section>
      </main>

      {/* ---- Colophon ------------------------------------------------- */}
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
            <p data-heat="label" className="label">Faculty advisor</p>
            <p className="mt-2 text-small text-bone">{CLUB.advisor.name}</p>
            <p className="text-small text-ash">{CLUB.advisor.dept}</p>
          </div>
          <div>
            <p data-heat="label" className="label">Contact</p>
            <p className="mt-2 text-small">
              <a className="text-bone underline underline-offset-4" href={`mailto:${CLUB.contact}`}>
                {CLUB.contact}
              </a>
            </p>
            <p className="text-small">
              <a className="text-ash underline underline-offset-4" href={`mailto:${CLUB.sponsors}`}>
                {CLUB.sponsors}
              </a>
            </p>
          </div>
          <div>
            <p data-heat="label" className="label">Home</p>
            <p className="mt-2 text-small text-bone">{CLUB.faculty}</p>
            <p className="text-small text-ash">{CLUB.university}</p>
          </div>
        </div>
      </footer>
    </>
  );
}
