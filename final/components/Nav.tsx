"use client";

import { useEffect, useRef, useState } from "react";
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
  /** The section currently crossing the middle of the screen, so the bar
   *  can say where you are. Null over the hero, which is not a section
   *  anyone navigated to. */
  const [current, setCurrent] = useState<string | null>(null);

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

  // ---- which section you are in ---------------------------------------
  useEffect(() => {
    const sections = NAV.map((n) => n.href.split("#")[1])
      .map((id) => (id ? document.getElementById(id) : null))
      .filter((el): el is HTMLElement => !!el);
    // The track pages carry the same nav but none of these anchors.
    if (!sections.length) return;

    // A thin band across the middle of the viewport: whichever section is
    // crossing it is the one you are reading. Measuring against the top
    // edge instead would flip to the next section the moment its heading
    // appeared, while the previous one still filled the screen.
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) setCurrent(e.target.id);
        }
      },
      { rootMargin: "-45% 0px -45% 0px", threshold: 0 },
    );
    sections.forEach((el) => io.observe(el));
    return () => io.disconnect();
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
      {/* The inline padding is the shell's, plus the notch. `env()` only
          reports anything because app/layout.tsx sets `viewportFit:
          "cover"`, and this bar spans the full width, so it is the one
          element on the site that lands under a landscape cutout if it
          does not ask. */}
      <div className="flex w-full items-center gap-4 px-[max(1.25rem,env(safe-area-inset-left))] py-4 pr-[max(1.25rem,env(safe-area-inset-right))] sm:gap-6 sm:px-[max(2.5rem,env(safe-area-inset-left))] sm:py-7 sm:pr-[max(2.5rem,env(safe-area-inset-right))] lg:px-[max(4rem,env(safe-area-inset-left))] lg:pr-[max(4rem,env(safe-area-inset-right))]">
        {/* data-lockup: the intro's closing frame is this same lockup,
            scaled up, and it flies onto this box to land. Renaming or
            restructuring this element will strand that flight. */}
        {/* `tap-lockup` grows this to a 44px target on a touch screen and
            does nothing on a pointer — see the rule in globals.css for
            why that second half matters. */}
        <a
          href="#top"
          data-lockup="nav"
          className="tap-lockup flex shrink-0 items-center gap-3 sm:gap-4"
          aria-label={`${CLUB.name}, home`}
        >
          {/* The intro's flame and name fly onto these two boxes
              separately, so each needs its own handle. The wrapper is
              display:flex rather than a bare span because an inline-block
              would add descender space under the mark and make the box
              taller than the mark it holds. */}
          <span data-lockup="nav-mark" className="flex">
            {/* The one mark on the site that burns. Everywhere else it
                is a logo; here it is the thing the intro just flew into
                place, and it has to still be alive when it gets there.

                Note for the intro: `Intro.tsx` reads this element's
                `offsetWidth`/`offsetHeight` to solve where the flying
                clip has to land, so the flight follows any size written
                here without being retuned. */}
            <Mark className="h-8 w-[1.4rem] sm:h-11 sm:w-8" alive />
          </span>
          <span data-lockup="nav-word" className="wordmark whitespace-nowrap">
            {CLUB.name}
          </span>
        </a>

        {/* Not collapsed into a hamburger below `md` — see the rail
            under this row, which is where the same anchors go.

            `ml-auto` is what holds these to the right edge now that the
            sign-up button has gone from beside them. Below `md` this list
            is hidden and the row is the lockup alone, which is correct:
            the rail underneath carries the anchors. */}
        <ul className="ml-auto hidden items-center gap-8 md:flex">
          {NAV.map((n) => (
            <li key={n.href}>
              {/* Two faces of a cube edge. On hover the pair rolls a
                  quarter turn and the second face arrives in the first
                  one's place — the label appears printed on a drum rather
                  than to have simply swapped colour.

                  The second copy is a pseudo-element rather than a second
                  span, and that is the accessible choice here rather than
                  a shortcut: written twice in the markup, the link's text
                  content becomes "TracksTracks", which is what find-in-
                  page searches and what a copy-paste returns. Decoration
                  belongs in CSS. */}
              <a
                href={n.href}
                data-heat="label"
                data-current={
                  current && n.href.endsWith(`#${current}`) ? "" : undefined
                }
                aria-current={
                  current && n.href.endsWith(`#${current}`) ? "true" : undefined
                }
                className="nav-link nav-roll transition-colors duration-200"
              >
                <span className="nav-roll-in" data-label={n.label}>
                  <span className="nav-roll-face">{n.label}</span>
                </span>
              </a>
            </li>
          ))}
        </ul>

      </div>

      {/* ---- The phone's way through the page -----------------------
          The same four anchors, on their own line, below `md`.

          They were simply absent, on the argument that a menu button
          would be a control that opens a list of anchors you would reach
          by scrolling anyway. That argument holds for a menu BUTTON and
          not for the anchors: the landing page is 10,168px on a 390px
          screen, about twelve screens, and "scroll until you find the
          FAQ" is the desktop reader's problem solved and the phone
          reader's ignored. Desktop gets four labels it can reach in one
          movement; the phone got nothing.

          So it is a rail, not a menu — no button to press, no panel to
          open, no state. It is the same row the desktop bar carries, set
          on its own line because there is no width to share.

          It appears only once the bar is STUCK, which is the same signal
          that turns the stock solid. Over the hero the bar is
          transparent so the composition is uninterrupted, and a row of
          labels laid over the cloud and the scatter is exactly the
          interruption that is being avoided — and it would be pointing
          at sections the reader has not been given a reason to want yet.

          `overflow-x-auto` because four words plus their tracking run
          past 320px, and a rail that scrolls is honest where a rail that
          wraps to two lines steals a fifth of a phone screen. The
          scrollbar is hidden rather than styled: it would be the only
          scrollbar drawn on the site.

          No `nav-roll` on these. The roll is a hover affordance, and on
          a touch screen `:hover` sticks after a tap — the label would
          turn a quarter and stay there. The current-section rule under
          the label is the state that matters here and it works from
          scroll position rather than from a pointer.

          The height is load-bearing elsewhere: stuck, the bar is 124px on
          a phone against 113px without this row, and `ANCHOR` in
          lib/ui.ts is the scroll margin that clears it. Change the height
          here and that constant has to move with it — it is one constant
          rather than six copies precisely so that is one edit. */}
      <div className="nav-rail md:hidden">
        <ul className="flex items-center gap-7 overflow-x-auto px-[max(1.25rem,env(safe-area-inset-left))] pb-1.5 pr-[max(1.25rem,env(safe-area-inset-right))] sm:gap-8 sm:px-[max(2.5rem,env(safe-area-inset-left))] sm:pb-3">
          {NAV.map((n) => (
            <li key={n.href} className="shrink-0">
              <a
                href={n.href}
                data-heat="label"
                data-current={
                  current && n.href.endsWith(`#${current}`) ? "" : undefined
                }
                aria-current={
                  current && n.href.endsWith(`#${current}`) ? "true" : undefined
                }
                className="nav-link block py-3"
              >
                {n.label}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  );
}
