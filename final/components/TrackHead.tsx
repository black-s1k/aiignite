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
    <header className="pb-[8vh] pt-[clamp(6.5rem,17vh,9rem)] lg:pt-[14vh]">
      {/* The way back, and `lg:` only — which is a mobile fix rather than
          a preference.

          The nav is fixed and carries this exact lockup, at this exact
          size, in this exact corner. On a desktop the two are 90px apart
          with a nav bar's worth of empty stock between them, which reads
          as a masthead under a chrome bar. On a phone the page starts
          14vh down, so at 390x844 the second lockup landed 35px below the
          first — same mark, same word, same size, twice, one under the
          other. That does not read as structure, it reads as the page
          having rendered its header twice.

          So below `lg` the nav's lockup is the only one, and it is
          already a link home. Nothing is lost: `aria-label` on that one
          says the same thing this one does. */}
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

      {/* The top margin belongs to the lockup above, so it goes with it.
          With the lockup hidden this label IS the top of the page, and the
          header's own `pt` is what clears the nav. */}
      <p data-heat="label" className="label lg:mt-14">
        {title}
      </p>

      <h1 className="mt-5 text-vast sm:mt-6">
        <HeatText as="span" className="text-flame">
          {name}
        </HeatText>
      </h1>

      <p className="mt-6 max-w-tight text-pretty text-lead text-bone type-lead sm:mt-8">
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
      <div className={`mt-8 sm:mt-10 ${GUTTER}`}>
        {/* `hidden` below `lg` rather than left as an empty cell: the
            grid stacks on a phone, and a zero-height cell still spends
            the row gap above the paragraph it is there to indent. */}
        <div aria-hidden className="hidden lg:block" />
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
