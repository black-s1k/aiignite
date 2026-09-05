import { SHELL, GUTTER } from "@/lib/ui";
import { CLUB } from "@/lib/content";
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
      className={`${id ? "scroll-mt-32 " : ""}bg-flame py-[var(--space-section)] text-void`}
    >
      <div className={SHELL}>
        <div className={GUTTER}>
          {/* void/60 on the flame is 5.08:1 — measured, and the reason
              this is not dimmer. */}
          <p className="label !text-void/60 lg:pt-3">Join</p>
          <div className="max-w-read">
            <h2 className="type-display text-title text-void">{heading}</h2>
            <p className="mt-6 text-lead text-void/75">{children}</p>
            <a
              href={SIGNUP.href}
              className="group mt-10 inline-flex items-center gap-4 bg-void px-8 py-4 type-strong text-read text-flame transition-[gap] duration-300 ease-[var(--ease-heat)] hover:gap-7"
            >
              Sign up for {CLUB.name}
              <span aria-hidden>&rarr;</span>
            </a>
            <p className="mt-5 text-small text-void/60">{SIGNUP.note}</p>
            {footer ? <p className="mt-8 text-small">{footer}</p> : null}
          </div>
        </div>
      </div>
    </section>
  );
}
