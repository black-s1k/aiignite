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
    <main className="mx-auto w-full max-w-read px-6 pb-[var(--space-section)] pt-[var(--space-section)] sm:px-10">
      <Link
        href="/"
        className="inline-flex items-center gap-3 no-underline"
        aria-label={`${CLUB.name}, home`}
      >
        <Mark className="h-8 w-6" />
        <span className="wordmark whitespace-nowrap">{CLUB.name}</span>
      </Link>

      <h1 className="mt-14 text-title text-bone type-head">
        {title}
      </h1>

      <p data-heat="label" className="label mt-5">
        Last updated {updated}
      </p>

      <div className="legal mt-12">{children}</div>

      <p className="mt-16 text-small">
        <Link className="text-ash underline underline-offset-4" href="/">
          Back to {CLUB.name}
        </Link>
      </p>
    </main>
  );
}
