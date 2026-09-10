import { SHELL, GUTTER, ANCHOR } from "@/lib/ui";
import { SOCIALS } from "@/lib/content";

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
            {/* Every channel, and now the only thing in this block a
                  reader can act on.

                  It used to sit under a black "Sign up" button as the
                  quieter alternative to it. That button fired a `mailto:`
                  and was never wired to a form, so it was removed and
                  these inherit the job. They are set at `text-read`
                  rather than the `text-small` they carried underneath it:
                  a row that IS the ask cannot be typed like a footnote to
                  one. */}
            {/* No `data-heat` here, and that is not an oversight — the
                same reason the "Join" label above omits it. The field
                warms a label TOWARD THE FLAME, which is a brightening on
                the void and a disappearance on the flame itself. This
                block is the one place on the site where the accent is
                the ground, so nothing in it opts into the heat. */}
            <p className="label !text-void/60 mt-9">Find us</p>
            {/* `tap-list` on a touch screen: the five channels wrap to
                two rows on a phone, and at 23px tall with 8px between
                them the two rows were a 54px band of near-touching
                targets. The rule floors each row at 44px and leaves a
                pointer untouched — see globals.css. The middle dots ride
                the row rather than being spaced away from it, because
                they sit inside the `li` alongside the link. */}
            <ul className="tap-list mt-3 flex flex-wrap items-center gap-x-1 gap-y-2 text-read">
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
