import { CLUB } from "@/lib/content";

/**
 * Advisor credit, Lassonde attribution, sponsorship mailto, socials.
 *
 * No sponsor logos: outreach is underway and nothing is confirmed, so
 * there is nothing honest to put there yet. Same reason the social links
 * are marked as placeholders rather than pointed at guessed handles.
 */

const SOCIALS = [
  { label: "Instagram", href: "#" },
  { label: "LinkedIn", href: "#" },
];

const linkClass =
  "text-accent underline decoration-transparent underline-offset-4 transition-colors hover:decoration-current";

export function SiteFooter() {
  return (
    <footer className="border-border border-t">
      <div className="mx-auto w-full max-w-5xl px-5 py-16 sm:px-8 sm:py-20">
        <div className="grid gap-12 sm:grid-cols-2">
          <div>
            <p className="font-display tracking-display text-lg">{CLUB.name}</p>
            <p className="text-muted mt-3 max-w-xs text-sm">{CLUB.tagline}</p>
          </div>

          <dl className="space-y-6 text-sm">
            <div>
              <dt className="eyebrow">Faculty advisor</dt>
              <dd className="mt-2">{CLUB.advisor.name}</dd>
              <dd className="text-muted">{CLUB.advisor.dept}</dd>
            </div>
            <div>
              <dt className="eyebrow">Registered through</dt>
              <dd className="text-muted mt-2">{CLUB.home}</dd>
            </div>
            <div>
              <dt className="eyebrow">Sponsorship</dt>
              <dd className="mt-2">
                <a className={linkClass} href={`mailto:${CLUB.sponsorEmail}`}>
                  Sponsorship inquiries welcome
                </a>
              </dd>
            </div>
          </dl>
        </div>

        <div className="border-border mt-16 flex flex-wrap items-center justify-between gap-6 border-t pt-8">
          <p className="text-muted text-xs">
            &copy; {new Date().getFullYear()} AI Ignite at York
          </p>
          <ul className="flex gap-6 text-xs">
            {SOCIALS.map((s) => (
              <li key={s.label}>
                <a className={linkClass} href={s.href}>
                  {s.label}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </footer>
  );
}
