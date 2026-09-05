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
export const SHELL =
  "mx-auto w-full max-w-shell px-6 sm:px-10 lg:px-16";

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
export const GUTTER =
  "grid gap-10 lg:grid-cols-[14rem_minmax(0,1fr)] lg:gap-16";
