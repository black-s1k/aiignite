import Link from "next/link";
import { HeatText } from "@/components/HeatText";
import { Mark } from "@/components/Mark";
import { CLUB } from "@/lib/content";
import { GUTTER } from "@/lib/ui";

/**
 * The masthead both track pages share.
 *
 * It repeats the landing page's opening move at a smaller size, so
 * arriving here from a link feels like going deeper into the same site
 * rather than landing on a different one. The mark returns to the top
 * left and doubles as the way back, which is where a reader will look
 * for it anyway.
 */
export function TrackHead({
  name,
  title,
  subtitle,
  shape,
  intro,
}: {
  name: string;
  title: string;
  subtitle: string;
  shape: string;
  intro: readonly string[];
}) {
  return (
    <header className="pt-[14vh] pb-[8vh]">
      <Link
        href="/"
        className="inline-flex items-center gap-3 no-underline"
        aria-label={`${CLUB.name}, home`}
      >
        <Mark className="h-8 w-6" />
        <span className="wordmark whitespace-nowrap">{CLUB.name}</span>
      </Link>

      <p data-heat="label" className="label mt-14">
        {title}
      </p>

      <h1 className="mt-6 text-vast">
        <HeatText as="span" className="text-flame">
          {name}
        </HeatText>
      </h1>

      <p className="mt-8 max-w-tight text-lead text-bone type-lead">
        {subtitle}
      </p>

      <p className="mt-4 text-small text-flame">{shape}</p>

      {/* The intro hangs off the same spine every section below it uses.
          It was indented with `sm:ml-[8%] lg:ml-[22%]` — a percentage
          chosen to look like the 14rem gutter, which it only equals at
          one window width. The gutter is 14rem plus a 4rem gap, so at
          the shell's full 86rem that is 20.9%, and every narrower window
          drifted further off: at a 1100px container, 18rem is 288px
          against 22%'s 242px. Half a centimetre of misalignment on the
          one axis the whole site is built on.

          Using GUTTER itself cannot drift, and the empty first cell is
          the point — this paragraph starts where every label below it
          starts. */}
      <div className={`mt-10 ${GUTTER}`}>
        <div aria-hidden />
        <div className="max-w-read">
          {intro.map((p) => (
            <p key={p} className="mt-5 text-read text-ash first:mt-0">
              {p}
            </p>
          ))}
        </div>
      </div>
    </header>
  );
}
