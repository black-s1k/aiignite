"use client";

import { useEffect, useRef } from "react";
import { Mark } from "@/components/Mark";
import { CLUB, NAV } from "@/lib/content";

/**
 * The page had no navigation at all, which is the single biggest thing
 * separating it from a site that explains itself: with one long scroll
 * and no way in, a reader who wants the FAQ has to hunt for it.
 *
 * It is a hairline rule and a row of type — no floating pill, no blur
 * panel, no shadow. Those are the house style of every generated header
 * and they would undo the rest of the page. The bar earns its separation
 * from the content with a rule and the stock behind it, nothing else.
 *
 * It only becomes solid once the reader has left the top. Over the
 * headline it is transparent so the hero is uninterrupted, which is also
 * why the backdrop is set from JS rather than being permanently on.
 */
export function Nav() {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    // Reads scrollY only — no getBoundingClientRect, so this listener
    // never forces a layout while the heat field is mid-frame.
    const onScroll = () => {
      el.dataset.stuck = window.scrollY > 80 ? "true" : "false";
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <nav
      ref={ref}
      data-stuck="false"
      className="nav fixed inset-x-0 top-0 z-40"
      aria-label="Primary"
    >
      <div className="mx-auto flex w-full max-w-[86rem] items-center gap-6 px-6 py-4 sm:px-10 lg:px-16">
        <a
          href="#top"
          className="flex shrink-0 items-center gap-3"
          aria-label={`${CLUB.name} — home`}
        >
          <Mark className="h-6 w-4" />
          <span
            data-heat="label"
            className="label !text-bone whitespace-nowrap"
          >
            {CLUB.name}
          </span>
        </a>

        {/* Hidden on small screens rather than collapsed into a hamburger:
            the page is one column of five sections, so a menu button
            would be a control that opens a list of anchors you would
            reach by scrolling anyway. */}
        <ul className="ml-auto hidden items-center gap-8 md:flex">
          {NAV.map((n) => (
            <li key={n.href}>
              <a
                href={n.href}
                data-heat="label"
                className="label transition-colors duration-200 hover:!text-bone"
              >
                {n.label}
              </a>
            </li>
          ))}
        </ul>

        <a
          href={process.env.NEXT_PUBLIC_SIGNUP_URL || "#join"}
          className="ml-auto shrink-0 border border-flame px-4 py-2 font-display text-micro uppercase tracking-[0.18em] text-flame transition-colors duration-200 hover:bg-flame hover:text-void md:ml-0 [font-variation-settings:'wght'_650,'wdth'_112]"
        >
          Sign up
        </a>
      </div>
    </nav>
  );
}
