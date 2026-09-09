import type { Metadata } from "next";
import Link from "next/link";
import { Mark } from "@/components/Mark";
import { Nav } from "@/components/Nav";
import { CLUB, SOCIALS } from "@/lib/content";
import { SIGNUP } from "@/lib/signup";
import { SHELL, GUTTER } from "@/lib/ui";

/**
 * Where "Join the club" goes.
 *
 * The hero button used to fire `SIGNUP.href` straight out of the page —
 * today a `mailto:`, which opens a mail client over the site with no
 * warning and no way back, and which is the wrong first move for a
 * reader who has decided they are interested but has not decided how
 * much. This page is the intermediate step that was missing: every way
 * in, on one screen, with the cost of each one stated.
 *
 * It is ordered by commitment, cheapest first. The Discord asks for
 * nothing and answers questions; the sign-up asks for a name and a
 * track. A page that led with the form would be asking for the most from
 * the person least ready to give it.
 *
 * There is no flame block at the bottom, deliberately. Every other page
 * closes with one because it needs to send the reader HERE — this page
 * is that destination, and a call to action on it would point at itself.
 */

export const metadata: Metadata = {
  title: `Join · ${CLUB.name}`,
  description: `Every way to join ${CLUB.fullName}: the Discord, Instagram, LinkedIn, the YUConnect listing, and the sign-up itself. Free, open to every York student, no application.`,
};

export default function Page() {
  return (
    <>
      <Nav />

      <main className={SHELL}>
        {/* Same masthead shape the track pages use, minus the animated
            name — this page is a destination rather than a chapter, and
            it does not need a second identity. `lg:` on the lockup for
            the reason in TrackHead: the fixed nav already carries one at
            this size, and on a phone the two land on top of each other. */}
        <header className="pb-[8vh] pt-[clamp(6.5rem,17vh,9rem)] lg:pt-[14vh]">
          <div className="hidden lg:block">
            <Link
              href="/"
              className="inline-flex items-center gap-3 no-underline"
              aria-label={`${CLUB.name}, home`}
            >
              <Mark className="h-8 w-6" />
              <span className="wordmark whitespace-nowrap">{CLUB.name}</span>
            </Link>
          </div>

          <p data-heat="label" className="label lg:mt-14">
            Join {CLUB.name}
          </p>

          <h1 className="mt-5 max-w-broad text-pretty text-title text-bone type-head sm:mt-6">
            Every way in, cheapest first
          </h1>

          <p className="mt-6 max-w-read text-pretty text-lead text-ash sm:mt-8">
            Free, open to every York student from any faculty and any year,
            and there is no application. Sessions begin {CLUB.launch}.
          </p>
        </header>

        {/* ---- The channels -------------------------------------------
            Each row is one target, and the whole row is the link rather
            than the name inside it — on a phone that is the difference
            between a 44px hit area and a 60px word. The rule above each
            is the same hairline the rest of the site is built from, so
            this reads as a continuation of the page it came from and not
            as a list of buttons. */}
        <section className="border-t border-edge py-[var(--space-section-dense)]" data-heat="rule">
          <div className={GUTTER}>
            <p data-heat="label" className="label lg:pt-3">
              Find us
            </p>
            <ul className="max-w-wide">
              {SOCIALS.map((s) => (
                <li key={s.name} data-heat="rule" className="border-b border-edge">
                  {/* ---- Why this is `fr` and not a fixed column -------
                      It was `sm:grid-cols-[10rem_...]` with the arrow in
                      a flex box beside the name. A grid column does not
                      clip its contents, so the moment a name was wider
                      than 10rem the name and its arrow simply ran on
                      into the next column and sat on top of the
                      description. "Instagram" and "YUConnect" at the top
                      of `--text-lead`'s clamp are about 12rem with the
                      arrow, so two of the four rows overlapped.

                      Fractions cannot do that: the columns divide the
                      width that exists, so the name gets a real share
                      rather than a guess at one, and every row resolves
                      to the same widths because every row is the same
                      width. The arrow moves to its own `auto` column at
                      the end of the row, where nothing can reach it.

                      Baseline alignment rather than the default stretch,
                      so a 30px name and an 18px line of prose sit on one
                      line rather than on two centres. */}
                  <a
                    href={s.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group grid grid-cols-[minmax(0,1fr)_auto] items-baseline gap-x-6 gap-y-2 py-7 transition-colors duration-200 sm:grid-cols-[minmax(0,1fr)_minmax(0,1.7fr)_auto] sm:gap-x-8"
                  >
                    <span className="text-pretty text-lead text-bone type-lead transition-colors duration-200 group-hover:text-flame">
                      {s.name}
                    </span>
                    {/* The arrow the rest of the site uses for a link
                        that leaves the page. `aria-hidden` because the
                        new tab is already announced by the link.

                        Beside the name on a phone, where the two columns
                        are the name and it; at the end of the row from
                        `sm` up. Placed explicitly at both sizes so it
                        can never be auto-flowed into the description's
                        cell. */}
                    <span
                      aria-hidden
                      className="text-flame transition-transform duration-200 group-hover:translate-x-1 sm:col-start-3 sm:row-start-1"
                    >
                      &rarr;
                    </span>
                    {/* Spans both columns under the name on a phone;
                        takes the middle column from `sm` up. */}
                    <span className="col-span-2 text-pretty text-read text-ash sm:col-span-1 sm:col-start-2 sm:row-start-1">
                      {s.what}
                    </span>
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* ---- The sign-up --------------------------------------------
            Last, and that is the argument the page is built on. It is the
            only thing here that asks the reader for something, so it
            comes after the four that do not. */}
        <section className="border-t border-edge py-[var(--space-section-dense)]" data-heat="rule">
          <div className={GUTTER}>
            <p data-heat="label" className="label lg:pt-3">
              Or sign up
            </p>
            <div className="max-w-read">
              <h2 className="text-pretty text-sub text-bone type-strong">
                Tell us which track fits and we will send the schedule
              </h2>
              <p className="mt-5 text-read text-ash">
                It takes about a minute, you can change your mind later, and
                you do not have to have picked a track to send it.
              </p>
              <a
                href={SIGNUP.href}
                className="group mt-8 inline-flex items-center gap-4 bg-flame px-8 py-4 text-read text-void type-strong transition-[gap] duration-300 ease-[var(--ease-heat)] hover:gap-7"
              >
                Sign up for {CLUB.name}
                <span aria-hidden>&rarr;</span>
              </a>
              {/* The same microcopy the other CTAs carry, from the same
                  source, so this button cannot end up describing a
                  different destination than the ones on the other pages.
                  See lib/signup.ts. */}
              <p className="mt-5 text-small text-dim">{SIGNUP.note}</p>
            </div>
          </div>
        </section>

        {/* ---- Back ----------------------------------------------------
            The one thing a reader who is not ready needs and would
            otherwise have to find in the nav. */}
        <section className="border-t border-edge py-[var(--space-section-dense)]" data-heat="rule">
          <div className={GUTTER}>
            <p data-heat="label" className="label lg:pt-3">
              Not yet
            </p>
            <div className="max-w-read">
              <p className="text-read text-ash">
                Still deciding? The two tracks are described in full, session
                by session, and the FAQ answers what the pages do not.
              </p>
              {/* `tap-list` floors each row at 44px on a touch screen —
                  these are three prose-sized links in a list, which is
                  exactly the case that rule exists for. It is NOT on the
                  channel list above: those rows are already ~90px tall,
                  and the rule sets `display: flex` on the anchor, which
                  would flatten that list's grid. */}
              <ul className="tap-list mt-6 grid gap-3 text-read">
                <li className="marker-line">
                  <Link className="text-bone underline underline-offset-4 transition-colors duration-200 hover:text-flame" href="/spark">
                    The Spark track, for anyone who has never written code
                  </Link>
                </li>
                <li className="marker-line">
                  <Link className="text-bone underline underline-offset-4 transition-colors duration-200 hover:text-flame" href="/forge">
                    The Forge track, for students who already code
                  </Link>
                </li>
                <li className="marker-line">
                  <Link className="text-bone underline underline-offset-4 transition-colors duration-200 hover:text-flame" href="/#faq">
                    Before you ask
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
