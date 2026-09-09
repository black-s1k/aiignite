import { HeatText } from "@/components/HeatText";
import { GUTTER } from "@/lib/ui";

/**
 * The masthead both track pages share.
 *
 * It repeats the landing page's opening move at a smaller size, so
 * arriving here from a link feels like going deeper into the same site
 * rather than landing on a different one. The mark returns to the top
 * left and doubles as the way back, which is where a reader will look
 * for it anyway.
 *
 * ---- The top padding carries a FLOOR ----
 * The nav is a fixed bar of a fixed height — 103px measured from `md`
 * up — but `14vh` alone shrinks as the window gets shorter, which is
 * exactly backwards: the thing being cleared does not shrink with it.
 * With the lockup gone there is nothing taking up the slack, and a
 * 1440x760 laptop left 4px between the bar and the first line under it;
 * 1440x900 was 24px, which is not much better.
 *
 * 10.5rem is 168px, so clearance is ~65px on every desktop window
 * shorter than about 1200px and `14vh` takes over above that. Phones are
 * unaffected — their bar is shorter and their own clamp already measured
 * 39-69px.
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
    <header className="pb-[8vh] pt-[clamp(6.5rem,17vh,9rem)] lg:pt-[clamp(10.5rem,14vh,13rem)]">
      {/* No lockup here.

          The fixed nav carries this exact lockup, at this exact size, in
          this exact corner, on every page that renders it — and this
          page is one of them. A second copy 165px below the first is not
          a masthead, it is the same object twice; it read that way on a
          phone, where they were 35px apart, and it reads that way on a
          desktop too. The nav's is already a link home and its
          `aria-label` says the same thing this one's did, so nothing is
          lost by removing it.

          app/privacy and app/terms keep theirs, and must: those two
          pages do NOT render the nav, so their lockup is the only one on
          the page rather than the second. See components/Legal.tsx. */}
      {/* This label is now the top of the page at every width, and the
          header's own `pt` is what clears the nav. The `lg:mt-14` that
          used to space it from the lockup went with the lockup. */}
      <p data-heat="label" className="label">
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
