/**
 * The two layout strings every page is built from.
 *
 * They were declared, identically and independently, at the top of
 * app/page.tsx, app/spark/page.tsx and app/forge/page.tsx. Three copies
 * of a shared decision is how a spine stops being shared: change the
 * gutter on one page and the other two silently keep the old one, and
 * nothing anywhere fails.
 *
 * app/privacy and app/terms go through components/Legal.tsx, which is a
 * single narrow reading column on purpose and correctly does NOT use
 * these — see its header.
 */

/**
 * The page shell. Everything on a page sits inside one of these, so the
 * left edge of the content is the same left edge on every page and at
 * every width.
 */
/**
 * The horizontal inset, and the one place the notch is dealt with.
 *
 * `viewportFit: "cover"` in app/layout.tsx is what puts the page under a
 * notch and a home indicator in the first place, so the padding has to
 * clear them: `max()` takes the design's own inset or the device's,
 * whichever is larger, which means a phone with no cutout renders exactly
 * the numbers below and a phone held in landscape with a notch on the left
 * gets its column pushed clear of it. A flat `px-6` would put the first
 * character of every line under the camera.
 *
 * 1.25rem at the bottom of the ramp rather than 1.5: at 320px the shell
 * was spending 48 of 320 pixels on margin, and the section headings — set
 * at a 2.5rem floor — were wrapping a word early because of it.
 */
export const SHELL =
  "mx-auto w-full max-w-shell px-[max(1.25rem,env(safe-area-inset-left))] sm:px-[max(2.5rem,env(safe-area-inset-left))] lg:px-[max(4rem,env(safe-area-inset-left))]";

/**
 * The asymmetric spine: a 14rem gutter holding a mark and a label, and
 * the content column beside it.
 *
 * The 14rem is load-bearing beyond the label it started with — the
 * freehand marks in components/Draw.tsx were put there specifically
 * because this column already existed and was mostly empty. Narrow it
 * and they have nowhere to go.
 *
 * Anything that needs to hang off the same axis must use THIS, not a
 * percentage that approximates it. A percentage only agrees with a
 * fixed column at one window width; components/TrackHead.tsx used to
 * indent its intro by `lg:ml-[22%]` and drifted off the spine at every
 * other size.
 */
/**
 * Below `lg` the two cells simply stack, and the gap between them is the
 * one number that changes: 2.5rem of air between a section's label and its
 * own first line is a desktop measure — read on a phone, where the label
 * and the copy under it are the only two things on screen, it separates
 * them into two unrelated objects and costs a fifth of the fold on every
 * section. 1.5rem still reads as a gap and buys back about 16px per
 * section across a page that carries eleven of them.
 */
export const GUTTER =
  "grid gap-6 lg:grid-cols-[14rem_minmax(0,1fr)] lg:gap-16";

/**
 * How far above a section an anchor lands, so the fixed nav does not sit
 * on top of the heading you just jumped to.
 *
 * It is a constant rather than a `scroll-mt-32` written at each of the
 * six anchored sections for the same reason `SHELL` and `GUTTER` are:
 * the number is a function of the NAV'S HEIGHT, which is a single fact
 * about the site, and six copies of it means the next person to change
 * the bar fixes five of them.
 *
 * The two values are the two bars. From `md` up the nav is one row and
 * 113px tall. Below it the row of section anchors sits under the lockup
 * — see the rail in Nav.tsx — and the bar is 124px, so a flat 8rem left
 * four pixels between the bar and the heading it had just scrolled to.
 * 8.75rem is 140px, which is 16px of clearance on the taller bar.
 *
 * `scroll-padding-top` on the root would be the tidier mechanism and is
 * deliberately NOT used: it does not override a scroll margin, it ADDS
 * to it, so the two together would land every anchor 120px too low. The
 * note in globals.css under `html` is the same warning from the other
 * side.
 */
export const ANCHOR = "scroll-mt-[8.75rem] lg:scroll-mt-32";
