import Link from "next/link";
import { HeatText } from "@/components/HeatText";
import { Mark } from "@/components/Mark";
import { CLUB } from "@/lib/content";

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

      <p className="mt-8 max-w-[34rem] font-display text-lead text-bone [font-variation-settings:'wght'_620,'wdth'_110]">
        {subtitle}
      </p>

      <p className="mt-4 text-small text-flame">{shape}</p>

      <div className="mt-10 max-w-[38rem] sm:ml-[8%] lg:ml-[22%]">
        {intro.map((p) => (
          <p key={p} className="mt-5 text-read text-ash first:mt-0">
            {p}
          </p>
        ))}
      </div>
    </header>
  );
}
