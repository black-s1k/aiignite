import { CLUB, TRACKS } from "@/lib/content";

/**
 * The sheet's front. A poster does not explain itself above the fold —
 * it states the thing at the largest size it can and lets the slug
 * lines at the top and bottom carry every fact.
 *
 * The tagline splits at its own full stop: "Ignite the spark" is the
 * headline, "Let AI do the rest" is the line under it. No copy was
 * written to fit this layout; the layout was cut to fit the copy.
 */
export function Hero() {
  return (
    <header
      data-press="hero"
      className="mx-auto flex min-h-svh w-full max-w-6xl flex-col justify-between px-5 pt-6 pb-8 sm:px-8 sm:pt-8 sm:pb-10"
    >
      {/* Slug line — the strip of set-in-lead facts along the head of
          a printed sheet. */}
      <div className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-2 border-b border-graphite/30 pb-3">
        <p className="tag text-graphite">
          {CLUB.name} · {CLUB.at}
        </p>
        <p className="tag">{CLUB.home}</p>
        <p className="tag">{CLUB.term}</p>
      </div>

      <div className="py-14">
        <h1 className="text-mega font-display font-extrabold uppercase text-graphite">
          <span className="block">Ignite</span>
          <span className="block text-overprint">the spark</span>
        </h1>

        <p className="mt-7 max-w-xl font-display text-hed font-medium uppercase leading-none tracking-tight text-forge">
          Let AI do the rest
        </p>
      </div>

      <div className="flex flex-col gap-6">
        {/* The two tracks, stated as the two inks. This is the first
            time the reader sees the colour system, and it is doing the
            explaining rather than decorating it. */}
        <ul className="flex flex-wrap gap-x-3 gap-y-2">
          {TRACKS.map((t) => (
            <li key={t.key} className="flex items-stretch">
              <span
                className={[
                  "px-3 py-1.5 font-display text-lg font-extrabold uppercase leading-none tracking-tight",
                  t.key === "forge" ? "bg-forge text-paper" : "bg-spark text-graphite",
                ].join(" ")}
              >
                {t.name}
              </span>
              <span className="border border-l-0 border-graphite/30 px-3 py-1.5 text-xs text-muted">
                {t.who}
              </span>
            </li>
          ))}
        </ul>

        <div className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-2 border-t border-graphite/30 pt-3">
          <p className="tag">First sessions {CLUB.launch}</p>
          <p className="tag" aria-hidden>
            Scroll ↓
          </p>
        </div>
      </div>
    </header>
  );
}
