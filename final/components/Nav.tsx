"use client";

import { useEffect, useRef } from "react";
import { Mark } from "@/components/Mark";
import { CLUB, NAV } from "@/lib/content";
import { SIGNUP } from "@/lib/signup";

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
      {/* Full-bleed, unlike the page shell: the bar is a frame around the
          content, not part of the column. The wordmark rides the left
          gutter and the CTA the right one, so the row reads as the edge
          of the page rather than a second, narrower column floating
          above it. */}
      <div className="flex w-full items-center gap-6 px-6 py-5 sm:px-10 sm:py-7 lg:px-16">
        {/* data-lockup: the intro's closing frame is this same lockup,
            scaled up, and it flies onto this box to land. Renaming or
            restructuring this element will strand that flight. */}
        <a
          href="#top"
          data-lockup="nav"
          className="flex shrink-0 items-center gap-3 sm:gap-4"
          aria-label={`${CLUB.name}, home`}
        >
          {/* The intro's flame and name fly onto these two boxes
              separately, so each needs its own handle. The wrapper is
              display:flex rather than a bare span because an inline-block
              would add descender space under the mark and make the box
              taller than the mark it holds. */}
          <span data-lockup="nav-mark" className="flex">
            <Mark className="h-9 w-6 sm:h-11 sm:w-8" />
          </span>
          <span data-lockup="nav-word" className="wordmark whitespace-nowrap">
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
                className="nav-link transition-colors duration-200 hover:!text-bone"
              >
                {n.label}
              </a>
            </li>
          ))}
        </ul>

        <a
          href={SIGNUP.href}
          className="ml-auto shrink-0 border border-flame px-5 py-2.5 font-display text-[0.8125rem] uppercase tracking-[0.14em] text-flame transition-colors duration-200 hover:bg-flame hover:text-void md:ml-0 sm:px-6 sm:py-3 [font-variation-settings:'wght'_680,'wdth'_112]"
        >
          Sign up
        </a>
      </div>
    </nav>
  );
}
