/**
 * The single grain definition for the site.
 *
 * Lifted verbatim out of IgniteVideoScroll so the hero and the page below it
 * share one texture — two different feTurbulence seeds would show a visible
 * seam where the hero section ends.
 *
 * Applied at 5% opacity over the page background. See <Grain />.
 */
export const GRAIN =
  "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='140' height='140'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='3'/%3E%3C/filter%3E%3Crect width='140' height='140' filter='url(%23n)' opacity='0.55'/%3E%3C/svg%3E\")";
