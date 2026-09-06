import { SHELL, GUTTER, ANCHOR } from "@/lib/ui";
import { CLUB, SOCIALS } from "@/lib/content";
import { SIGNUP } from "@/lib/signup";

/**
 * The flame block that closes every page.
 *
 * The one full-bleed use of the accent on the site. The loudest colour
 * appears exactly once per page, at the only moment the reader is asked
 * to do something — spend it anywhere else and it stops meaning
 * anything here.
 *
 * It existed three times, once per page, as fifteen lines of markup with
 * a byte-identical class string on the button and only the copy
 * different. That is the shape copy-paste leaves behind, and it is why
 * the landing page's block was on a `12vh` rhythm while the two track
 * pages were on `10vh` — nobody chose that, it just drifted.
 *
 * `id="join"` is only on the landing page's instance, because only the
 * landing page has a nav that anchors to it. Passing it explicitly
 * keeps that fact at the call site rather than hiding a page-specific
 * id inside a shared component.
 */
export function JoinBlock({
  id,
  heading,
  children,
  footer,
}: {
  id?: string;
  heading: string;
  /** The standfirst under the heading. */
  children: React.ReactNode;
  /** The cross-link to the other track, where there is one. */
  footer?: React.ReactNode;
}) {
  return (
    <section
      id={id}
      className={`${id ? `${ANCHOR} ` : ""}bg-flame py-[var(--space-section)] text-void`}
    >
      <div className={SHELL}>
        <div className={GUTTER}>
          {/* void/60 on the flame is 5.08:1 — measured, and the reason
              this is not dimmer. */}
          <p className="label !text-void/60 lg:pt-3">Join</p>
          <div className="max-w-read">
            <h2 className="type-display text-balance text-title text-void">{heading}</h2>
            <p className="mt-5 text-pretty text-lead text-void/75 sm:mt-6">{children}</p>
            {/* `w-full` below `sm` so the ask is a full-width bar rather
                than a shrink-wrapped box floating in the left third of a
                phone screen — it is the one thing on the page a reader is
                being asked to press. `justify-between` puts the arrow on
                the far edge, which is where a full-width button's arrow
                belongs; from `sm` up the button shrink-wraps again and
                the two sit next to each other as before. */}
            <a
              href={SIGNUP.href}
              className="group mt-8 flex w-full items-center justify-between gap-4 bg-void px-6 py-4 type-strong text-read text-flame transition-[gap] duration-300 ease-[var(--ease-heat)] hover:gap-7 sm:mt-10 sm:inline-flex sm:w-auto sm:justify-start sm:px-8"
            >
              Sign up for {CLUB.name}
              <span aria-hidden>&rarr;</span>
            </a>
            <p className="mt-5 text-small text-void/60">{SIGNUP.note}</p>

            {/* Every channel, at the moment of the ask.

                The sign-up is a form and a commitment; these are not.
                Someone who is not ready to put their name down will
                still open a Discord, and the block that asks them to
                join is the one place where "or just come and look at us
                first" costs nothing to offer.

                Set BELOW the note and at `text-small`, so the hierarchy
                is unambiguous: one black button is the ask, this row is
                the alternative. A second row of equal-weight buttons
                would make the reader choose rather than act.

                Ink is solid void, not void/60 like the note above it.
                These are targets, and 14.4:1 against the flame is the
                point of putting them on the accent block at all. */}
            {/* No `data-heat` here, and that is not an oversight — the
                same reason the "Join" label above omits it. The field
                warms a label TOWARD THE FLAME, which is a brightening on
                the void and a disappearance on the flame itself. This
                block is the one place on the site where the accent is
                the ground, so nothing in it opts into the heat. */}
            <p className="label !text-void/60 mt-9">Find us</p>
            {/* `tap-list` on a touch screen: the four channels wrap to
                two rows on a phone, and at 23px tall with 8px between
                them the two rows were a 54px band of near-touching
                targets. The rule floors each row at 44px and leaves a
                pointer untouched — see globals.css. The middle dots ride
                the row rather than being spaced away from it, because
                they sit inside the `li` alongside the link. */}
            <ul className="tap-list mt-3 flex flex-wrap items-center gap-x-1 gap-y-2 text-small">
              {SOCIALS.map((s, i) => (
                <li key={s.name} className="flex items-center">
                  <a
                    className="text-void underline underline-offset-4 decoration-void/40 transition-colors duration-200 hover:decoration-void"
                    href={s.href}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {s.name}
                  </a>
                  {/* The same middle dot the colophon uses between
                      Privacy and Terms, so the two rows read as one
                      device rather than two. Never after the last. */}
                  {i < SOCIALS.length - 1 ? (
                    <span aria-hidden className="px-2 text-void/40">
                      &middot;
                    </span>
                  ) : null}
                </li>
              ))}
            </ul>

            {footer ? (
              <p className="tap-block mt-8 text-small">{footer}</p>
            ) : null}
          </div>
        </div>
      </div>
    </section>
  );
}
