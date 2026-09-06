import Link from "next/link";
import { Mark } from "@/components/Mark";
import { CLUB } from "@/lib/content";

/**
 * The shell the two legal pages share.
 *
 * They are set as a single narrow column of running prose, which is the
 * one place on this site where a centred measure is right: nobody reads
 * a privacy policy by scanning, and the asymmetric spine that carries
 * the landing page would be decoration on a document whose whole job is
 * to be read in order.
 *
 * Same palette, same faces, same rules. A legal page that looks like it
 * came from a different site is the tell that it was pasted in.
 */
export function Legal({
  title,
  updated,
  children,
}: {
  title: string;
  updated: string;
  children: React.ReactNode;
}) {
  return (
    // The inline padding matches `SHELL` and carries the same notch
    // clearance. It cannot use `SHELL` itself, which is 86rem wide and
    // would give this column a different left edge from its own
    // `max-w-read`. See the header of lib/ui.ts for the `env()`.
    <main className="mx-auto w-full max-w-read px-[max(1.25rem,env(safe-area-inset-left))] pb-[var(--space-section)] pt-[var(--space-section)] sm:px-[max(2.5rem,env(safe-area-inset-left))]">
      {/* Same padded hit area as the nav's lockup — see the note there. */}
      <Link
        href="/"
        className="tap-lockup inline-flex items-center gap-3 no-underline"
        aria-label={`${CLUB.name}, home`}
      >
        <Mark className="h-8 w-6" />
        <span className="wordmark whitespace-nowrap">{CLUB.name}</span>
      </Link>

      <h1 className="mt-10 text-balance text-title text-bone type-head sm:mt-14">
        {title}
      </h1>

      <p data-heat="label" className="label mt-5">
        Last updated {updated}
      </p>

      <div className="legal mt-10 sm:mt-12">{children}</div>

      <p className="tap-block mt-14 text-small sm:mt-16">
        <Link className="text-ash underline underline-offset-4" href="/">
          Back to {CLUB.name}
        </Link>
      </p>
    </main>
  );
}
