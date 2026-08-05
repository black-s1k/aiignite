import { CLUB } from "@/lib/content";

/**
 * A colophon, not a footer: on a printed sheet this is the block that
 * says who made it, where, and on what. It carries the advisor credit,
 * the Lassonde registration, and the institutional lockups.
 *
 * Those lockups go in one ink. A real two-colour job would not fire up
 * a third drum just for a logo, and it is also the practical answer —
 * York red sitting between an indigo and an acid green is a genuine
 * clash, and every university brand kit ships a one-colour version for
 * exactly this situation. Drop the mono/white SVGs into public/marks/
 * and swap the placeholders below.
 */
const SOCIALS = [
  { label: "Instagram", href: "#" },
  { label: "LinkedIn", href: "#" },
];

const link =
  "underline decoration-graphite/30 underline-offset-4 transition-colors hover:decoration-graphite";

export function Colophon() {
  return (
    <footer
      data-press="colophon"
      className="mx-auto w-full max-w-6xl border-t border-graphite/25 px-5 py-16 sm:px-8 sm:py-20"
    >
      <div className="grid gap-12 md:grid-cols-[7rem_minmax(0,1fr)] md:gap-x-10">
        <p className="tag md:pt-2">Colophon</p>

        <div className="grid gap-10 sm:grid-cols-2">
          <div>
            <p className="font-display text-3xl font-extrabold uppercase leading-none tracking-tight text-graphite">
              {CLUB.name}
            </p>
            <p className="mt-3 max-w-xs text-sm text-muted">{CLUB.tagline}</p>

            {/* One-ink institutional lockups go here. */}
            <div className="mt-8 flex items-center gap-5 text-xs text-muted">
              <span className="border border-graphite/30 px-3 py-2 font-mono uppercase tracking-wider">
                York U mark
              </span>
              <span className="border border-graphite/30 px-3 py-2 font-mono uppercase tracking-wider">
                Lassonde mark
              </span>
            </div>
          </div>

          <dl className="space-y-6 text-sm">
            <div>
              <dt className="tag">Faculty advisor</dt>
              <dd className="mt-2">{CLUB.advisor.name}</dd>
              <dd className="text-muted">{CLUB.advisor.dept}</dd>
            </div>
            <div>
              <dt className="tag">Registered through</dt>
              <dd className="mt-2 text-muted">
                {CLUB.home}, {CLUB.at}
              </dd>
            </div>
            <div>
              <dt className="tag">Sponsorship</dt>
              <dd className="mt-2">
                <a href={`mailto:${CLUB.sponsorEmail}`} className={link}>
                  {CLUB.sponsorEmail}
                </a>
              </dd>
            </div>
            <div>
              <dt className="tag">Elsewhere</dt>
              <dd className="mt-2 flex gap-5">
                {SOCIALS.map((s) => (
                  <a key={s.label} href={s.href} className={link}>
                    {s.label}
                  </a>
                ))}
              </dd>
            </div>
          </dl>
        </div>
      </div>

      <p className="tag mt-16 border-t border-graphite/25 pt-5">
        Printed in two inks · Indigo and Flame Green
      </p>
    </footer>
  );
}
