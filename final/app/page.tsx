import { Fragment } from "react";
import Link from "next/link";
import { Brand } from "@/components/Brand";
import { Draw, type DrawName } from "@/components/Draw";
import { Intro } from "@/components/Intro";
import { JoinBlock } from "@/components/JoinBlock";
import { Mark } from "@/components/Mark";
import { Nav } from "@/components/Nav";
import {
  ABOUT,
  CLUB,
  FAQ,
  GLANCE,
  LOGISTICS,
  PURPOSE,
  SOCIALS,
  TEAM,
  TRACKS,
  WHY,
} from "@/lib/content";
import { SHELL, GUTTER, ANCHOR } from "@/lib/ui";

/**
 * The page explains itself completely, in the order a student actually
 * asks: what is this, why does it exist, is it for me, what will I
 * build, who runs it, what if I am unsure, how do I join.
 *
 * The layout idea is a single asymmetric column that never centres.
 * Everything hangs off one left axis and the measure changes per
 * section, so the page has a spine but not a template. Structure is made
 * of rules and space. There are no cards and nothing floats.
 *
 * The section labels in the left gutter are load-bearing rather than
 * decorative: they are what lets someone landing mid-page know where
 * they are without a heading shouting it.
 *
 * The two tracks get their own pages rather than being unrolled here.
 * Between them they carry ten sessions, four tool stacks and two
 * detailed formats, and pouring that into the landing page would bury
 * the five facts a first-time reader came for. What stays here is the
 * choice between them; the syllabus is one click away for the people who
 * want it.
 */

/**
 * A person's name, linked to their LinkedIn when they have given us one
 * and set as plain type when they have not.
 *
 * The fallback is the point. Four of the fifteen have not shared a
 * profile yet, and the alternatives are both worse than plain text: a
 * dead link punishes the reader for clicking, and a guessed URL sends
 * them to a stranger. Neither is worth the visual consistency.
 *
 * `rel="noopener"` because the link opens a new tab and the opened page
 * should not get a handle on this one; `noreferrer` because this site
 * does not tell other sites where its traffic came from, which is the
 * same position the privacy page takes.
 */
function Person({ name, linkedin }: { name: string; linkedin?: string }) {
  if (!linkedin) return <span className="text-bone">{name}</span>;
  return (
    <a
      href={linkedin}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={`${name} on LinkedIn`}
      className="person text-bone underline decoration-edge underline-offset-4 transition-colors duration-200 hover:decoration-flame hover:text-flame"
    >
      {name}
    </a>
  );
}

/**
 * The tagline, with its one "AI" set in the flame.
 *
 * Split from `CLUB.tagline` rather than written out as JSX with the
 * words around a hard-coded span. The string stays in `lib/content.ts`
 * where every other fact on the site lives, and rewording the line
 * cannot leave a stale copy behind in the markup.
 *
 * The split keeps its delimiter, and the delimiter is `\bAI\b` — word
 * boundaries, so this colours the word AI and never the letters inside
 * another one. If the tagline ever stops containing it the line renders
 * whole and unstyled rather than breaking.
 *
 * Two places render this: inside the cloud on desktop, under the
 * headline on a phone. It is a component so those cannot drift.
 */
function Tagline() {
  return (
    <>
      {CLUB.tagline.split(/\b(AI)\b/).map((part, i) =>
        part === "AI" ? (
          <span key={i} className="text-flame">
            {part}
          </span>
        ) : (
          <Fragment key={i}>{part}</Fragment>
        ),
      )}
    </>
  );
}

/**
 * The left gutter: a drawn mark over the section's label.
 *
 * The column was already 14rem wide and held one 13px label, so this
 * spends space the layout had reserved and never used rather than
 * introducing a new one. The mark and the label are one object — they
 * warm together, and the mark is capped cooler than the word so it never
 * out-shouts it.
 *
 * `aria-hidden` lives on the mark itself (see Draw.tsx). Every one of
 * these restates the label immediately beside it, so announcing them
 * would make a screen reader read the section name twice.
 */
function Gutter({ mark, children }: { mark: DrawName; children: React.ReactNode }) {
  return (
    <div className="lg:pt-3">
      <Draw name={mark} size={92} className="mb-5" />
      <p data-heat="label" className="label">
        {children}
      </p>
    </div>
  );
}

/**
 * Which mark sits over which logistics fact.
 *
 * Keyed by the label's own text and typed against it, so changing the
 * copy in `lib/content.ts` without picking a new mark is a BUILD error
 * rather than a mark that silently stops rendering.
 */
const LOGISTICS_MARK: Record<(typeof LOGISTICS)[number]["k"], DrawName> = {
  Starts: "calendar",
  Where: "pin",
  Cost: "tag",
};

export default function Home() {
  return (
    <>
      <a
        href="#why"
        className="sr-only focus:not-sr-only focus:absolute focus:left-6 focus:top-6 focus:z-50 focus:bg-flame focus:px-4 focus:py-2 focus:text-void"
      >
        Skip to content
      </a>

      <Intro />

      <Nav />

      <main id="top">
        {/* ---- The line ---------------------------------------------- */}
        {/* ---- One screen, on a phone as well as on a desktop -------
            The section is the one-screen box below `lg`, and the stage
            inside it is the one-screen box from `lg` up. That split is
            the whole mobile fix, and it is worth stating why it is not
            simply a smaller version of the same idea.

            The desktop stage is `min-h-svh` with `justify-end`, so the
            mark and the headline sit flush with the fold and the
            composition grows UPWARD as the type scales. Everything
            below — the tagline, the standfirst, the two buttons — is
            deliberately past the fold, because at desktop sizes the
            mark and the headline are 500 and 240 pixels tall and fill
            the screen on their own.

            On a phone they are not. `--text-hero` bottoms out at its
            2.4rem floor, so the same two objects are about 250px of a
            844px screen — and bottom-anchoring 250px of content in a
            844px box does exactly what it says: it leaves 300px of
            empty black under the nav and pushes the pitch and both
            calls to action a full screen down. Measured before this
            change, at 390x844 the "Join the club" button's top edge sat
            at y=1108 with the fold at 844; at 320x640 it was at 965.
            The first screen of the site on a phone was a headline and
            nothing else.

            So on a phone the composition that fills the screen is the
            WHOLE hero, not the top half of it, and the section is what
            carries `min-h-svh`.

            `safe center` rather than plain `center`: a flex column that
            centres content taller than itself overflows in BOTH
            directions, and the half that goes off the top edge is
            unreachable — scroll cannot go negative. `safe` falls back
            to start-alignment exactly in that case. It is written as a
            second declaration after `justify-start` so a browser that
            does not know the keyword drops it and keeps the safe
            behaviour rather than the dangerous one. Small phones (a
            320x640 window with a five-line standfirst) genuinely cannot
            fit the hero in one screen, and start-aligned with the CTA
            just past the fold is the correct answer there. */}
        <section
          className={`${SHELL} relative flex min-h-svh flex-col justify-start [justify-content:safe_center] pb-[clamp(2rem,7vh,4rem)] pt-[clamp(5.5rem,13vh,7rem)] lg:block lg:min-h-0 lg:pb-[8vh] lg:pt-0`}
        >
          {/* ---- The phone's composition box ---------------------------
              One wrapper around the WHOLE hero — mark, headline,
              tagline, standfirst, buttons — and the only thing it is
              here for is to give the phone's scatter something honest to
              be a percentage of.

              The layer used to be `absolute inset-0` on the stage, on
              the argument that the stage is exactly one screen so a
              percentage of it is a percentage of the screen. That was
              true and it is not any more: below `lg` the stage is no
              longer the one-screen box, the section is, and the section
              now centres its content, so the box a mark would be
              measuring against moves depending on how much copy is in
              it. This wrapper is exactly the ink instead. Nothing above
              `lg` is affected — it is a plain block there, and the
              desktop scatter still hangs off the stage. */}
          <div className="relative w-full">

          {/* ---- The same idea, at phone width -----------------------
              A separate layer rather than responsive tweaks on the
              desktop one, because the two compositions have nothing in
              common. The desktop scatter works by HORIZONTAL clearance —
              the margins left and right of a centred headline. On a
              390px screen the standfirst runs edge to edge and there is
              no continuous margin to run marks down.

              What there is instead is three BANDS where the centred
              content is much narrower than the screen: beside the cloud
              mark (~172px of 342), beside the headline, and beside the
              stacked buttons (capped at 15rem). Eight marks live in
              those, four a side, and every one of them is placed in a
              band and never in the two where the copy is full width —
              the tagline and the standfirst.

              The percentages are of this wrapper rather than of the
              section, and that is the whole reason the wrapper exists:
              they are a share of the CONTENT, which is the thing the
              marks have to clear, rather than a share of a box whose
              spare height moves the content around inside it. */}
          <div aria-hidden className="pointer-events-none absolute inset-0 lg:hidden">
            {/* Beside the cloud. */}
            <Draw name="chip" size={26} className="absolute left-[1%] top-[6%] rotate-[-12deg]" />
            <Draw name="nodes" size={24} className="absolute right-[1%] top-[10%] rotate-[10deg]" />
            <Brand name="anthropic" size={26} className="absolute left-[3%] top-[19%]" />
            <Brand name="openai" size={26} className="absolute right-[3%] top-[22%]" />

            {/* Beside the headline. */}
            <Draw name="pulse" size={26} className="absolute left-[2%] top-[35%] rotate-[-5deg]" />
            <Draw name="gear" size={24} className="absolute right-[2%] top-[38%] rotate-[-9deg]" />

            {/* Beside the buttons, which are capped at 15rem and so
                leave about 50px of margin a side on a 390px screen.

                Gone below 375px, and that is a measurement rather than a
                precaution: the cap is a fixed 15rem, so the margin beside
                it is whatever the screen has left over — 50px at 390 and
                20px at 320, which is less than the mark is wide. Measured
                at 320x640 they overlapped the "Explore tracks" button by
                9px. The band genuinely is not there at that width, so the
                phone's scatter is six marks rather than eight; widening
                the cap instead would cost the two marks beside the
                headline as well. */}
            <Brand name="n8n" size={26} className="absolute bottom-[7%] left-[1%] max-[374px]:hidden" />
            <Draw name="bot" size={24} className="absolute bottom-[3%] right-[1%] rotate-[7deg] max-[374px]:hidden" />
          </div>

          {/* ---- The stage: exactly one screen, from `lg` up ----------
              The mark, the desktop scatter and the headline live in
              here, and the headline is flush with the bottom of it.
              `justify-end` is what puts it there, so the block grows
              UPWARD from the fold as the type scales rather than
              downward past it.

              `svh`, not `vh`. On a phone `100vh` is the height with the
              browser chrome RETRACTED, so a stage sized in `vh` is taller
              than the screen the reader actually has until they scroll —
              which is precisely the overflow this is here to prevent.
              `svh` is the chrome-expanded height: always safe, sometimes
              a little short, which is the right way round.

              `lg:` on all of it. Below that the section above owns the
              one-screen job and this is a plain stack — see the note on
              the section for why bottom-anchoring 250px of mark and
              headline inside a 844px box is the wrong composition on a
              phone rather than a smaller version of the right one.

              `pt` only has to clear the nav. It is what stops a very
              short window pushing the mark up under it — the reason the
              headline and the cloud also carry a `vh` term in their own
              size, one section down in globals.css. */}
          <div className="relative flex flex-col justify-end lg:min-h-svh lg:pb-[4vh] lg:pt-[clamp(6rem,12vh,8rem)]">
          {/* Tech/AI marks, drawn in the same hand as everything else on
              the page rather than picked from an icon pack — see the note
              in Draw.tsx.

              Fifteen of them, scattered across the whole screen rather
              than pinned to the corners. Four in the corners reads as a
              frame — a decision made once and repeated; a scatter reads
              as a SURFACE the headline is sitting on, which is the point,
              and it is also how a notebook page actually looks. Every one
              of them is turned a few degrees off square for the same
              reason: nothing drawn by hand lands level, and fifteen level
              marks would undo the roughening pass one component down.

              Two rules keep a scatter this dense off the type, and they
              are worth stating because they are what makes the positions
              non-arbitrary:

              1. HORIZONTAL clearance does the work. The headline is
                 centred and the body column is inset, so everything left
                 of ~23% and right of ~73% of the section is empty at
                 EVERY window size and every one of those marks is safe
                 whatever the copy does vertically.
              2. The four marks that do sit over the middle are in real
                 gaps in the stack — above the standing label, in the band
                 between the headline and the tagline, and below the
                 buttons — and are placed as a share of the section's own
                 height so they travel with it.

              The exception is the top row, in fixed px. The section
              starts at the very top of the document — the nav floats
              `fixed` over it rather than pushing it down — so a `vh`
              share of the stage's top padding (now
              `pt-[clamp(6rem,12vh,8rem)]`, once `pt-[22vh]`) would put
              those four UNDER the nav on a short window.

              `lg:` because below that the body column is the full width
              of the screen and there are no margins left to scatter
              into. */}
          <div aria-hidden className="pointer-events-none absolute inset-0 hidden lg:block">
            {/* Above the standing label, clear of the nav. */}
            <Draw name="chip" size={50} className="absolute draw-bone left-[1%] top-32 rotate-[-14deg]" />
            <Draw name="terminal" size={40} className="absolute left-[30%] top-28 rotate-[9deg]" />
            <Draw name="sparkle" size={46} className="absolute draw-bone right-[31%] top-[7.5rem] rotate-[-7deg]" />
            <Draw name="nodes" size={40} className="absolute right-[2%] top-[8.5rem] rotate-[11deg]" />

            {/* Down both margins, past the headline. The small `cloud`
                that used to sit at right-[3%] is gone: the mark over the
                headline is a cloud, and a second one 300px away read as
                the same idea twice rather than as texture. The mark is
                still in Draw.tsx for anywhere else that wants it. */}
            <Draw name="code" size={42} className="absolute left-[5%] top-[29%] rotate-[-10deg]" />
            <Draw name="orbit" size={36} className="absolute right-[13%] top-[27%] rotate-[14deg]" />
            <Draw name="bulb" size={44} className="absolute draw-bone left-[14%] top-[41%] rotate-[8deg]" />
            <Draw name="gear" size={46} className="absolute right-[12%] top-[54%] rotate-[-7deg]" />

            {/* Level with the cloud's wires. These used to hang off the
                headline's bottom edge; that edge is the fold now, so
                they would have sat below it. */}
            <Draw name="chart" size={40} className="absolute left-[27%] top-[52%] rotate-[-11deg]" />
            <Draw name="branch" size={36} className="absolute draw-bone right-[27%] top-[54%] rotate-[10deg]" />

            {/* Alongside the body column. */}
            <Draw name="database" size={44} className="absolute left-[13%] top-[70%] rotate-[12deg]" />
            <Draw name="bot" size={40} className="absolute draw-bone right-[2%] top-[72%] rotate-[8deg]" />
            <Draw name="pulse" size={50} className="absolute draw-bone left-[4%] top-[88%] rotate-[-5deg]" />
            {/* HuggingFace, drawn rather than masked — see Brand.tsx for
                why it could not be borrowed. It is a logo, so it does
                NOT get the tilt the other drawn marks carry. */}
            <Draw name="huggingface" size={44} className="absolute left-[19%] top-[63%]" />

            {/* Under the buttons, and to the LEFT of them. The centred
                body column spans 29-71% of the section, so the old 62%
                perch is now directly beneath the button row with about
                eight pixels between them on a short window. */}
            <Draw name="layers" size={40} className="absolute left-[26%] top-[93%] rotate-[-9deg]" />

            {/* ---- The borrowed marks --------------------------------
                The seven tool logos, threaded into the gaps the drawn
                marks leave rather than grouped into a row. A row of
                vendor logos IS the partner-strip tell the slop audit
                banned; scattered among fifteen hand-drawn marks at the
                same value, they read as what is on the workbench.

                Not rotated, and that is the one place the two sets are
                allowed to differ. Turning a drawn mark off square is the
                hand showing; turning a LOGO off square is the alteration
                its brand guideline forbids. They sit level, and against
                fifteen tilted neighbours that reads as deference rather
                than as a mistake.

                Each renders only if `public/brand/<name>.svg` exists —
                see Brand.tsx. Until the files land the hero is exactly
                the fifteen drawn marks, with no holes where these go. */}
            {/* Three down each margin. Balance is checked against the
                ones that RENDER, not the ones listed: a slot with no
                file is invisible, so counting slots gives an even split
                that looks lopsided on the actual page. With Anthropic
                and OpenAI in and Cursor and LangChain still missing,
                what a reader sees is two a side. */}
            <Brand name="anthropic" size={34} className="absolute left-[18%] top-[24%]" />
            <Brand name="perplexity" size={32} className="absolute left-[8%] top-[57%]" />
            <Brand name="cursor" size={30} className="absolute left-[19%] top-[81%]" />

            <Brand name="openai" size={34} className="absolute right-[21%] top-[9rem]" />
            <Brand name="langchain" size={30} className="absolute right-[19%] top-[45%]" />
            <Brand name="n8n" size={34} className="absolute right-[6%] top-[85%]" />
          </div>

          {/* The two marks that cross the middle of the screen hang off
              the HEADLINE, not off a share of the section's height like
              the thirteen in the margins.

              They have to, and the numbers are worth keeping. The gap
              between the headline and the tagline is a constant 56px,
              but any `vh` share of the section scales with the window
              while the type inside it does not — measured back when the
              stage carried `pt-[26vh]`, the top of that gap wandered
              from 58.7% to 62.9% of the section across 1024x860 through
              1600x1200, a 40px swing. There is no percentage that
              puts a 40px mark inside a 56px gap at all five. `top-full`
              on a wrapper around the headline is the same edge at every
              one of them.

              The wrapper is a plain `relative` div and `hero-line` stays
              on the `h1`: ScrollReveal excludes anything inside
              `.hero-line` because the headline has an arrival of its
              own, and these should come up with the other thirteen. */}
          {/* The hero's own mark, over the headline.
              `size` is a clamp rather than a number so it tracks the
              type instead of standing still while the headline scales —
              3.77 is measured, not chosen: with the headline frozen it
              renders at exactly 3.770x its own font-size at every width
              (512.8px against a 136px cap, 409.4px against 108.6px), so
              `text-hero` plus `size="3.77em"` puts the mark's edges on
              the A and the e and keeps them there as the type scales.
              The ratio is a property of that string in that face at that
              weight — re-measure if any of the three changes.

              `hero-line` is on it for ScrollReveal's sake, not for CSS:
              the headline is excluded from the reveal because it has an
              arrival of its own, and a mark that tipped up while the
              words under it sat still would read as two separate objects
              rather than one masthead. */}
          <div className="relative mx-auto mb-2 w-fit text-hero sm:mb-6">
            <Draw name="cloudnet" size="3.77em" className="draw-bone hero-line" />

            {/* The tagline, sitting inside the cloud.
                The mark was a large empty outline; this is what makes it
                a container rather than a decoration.

                The box is measured off the cloud's own path, not guessed.
                Over the band y=30..58 of the 126-unit viewBox the outline
                never comes in past x=18 on the left or x=108 on the right
                — those are its narrowest points in that band, at the top
                edge where the shoulders curve in. 15% either side and
                24%..46% down is that rectangle, with a little to spare.

                Sized in `em` off the wrapper's `text-hero`, NOT with
                `text-lead`. The two scale on different curves: the mark
                follows the headline, while `text-lead` is capped from
                1024 up — so at 1024 the cloud is at its smallest and the
                type was at its largest, and "Let AI do the rest." came
                within a few pixels of the outline. In `em` the text is a
                fixed fraction of the cloud at every width.

                0.26em is ~29px, near enough the `text-lead` it replaces
                that nothing else on the page shifts register.

                `hero-line` for ScrollReveal's sake — without it this
                reveals on its own and slides around inside a mark that is
                holding still. */}
            {/* The flex box and the text are two elements on purpose.
                With `flex` on the paragraph itself, every run of text
                either side of the flame-set "AI" became its OWN flex
                item — the line broke into three columns and the word
                landed in the gutter between them. A flex parent with
                exactly one child centres the block; the text inside that
                child stays ordinary inline text and wraps like prose. */}
            <div className="hero-line absolute inset-x-[15%] top-[24%] hidden h-[22%] items-center justify-center lg:flex">
              <p className="text-center text-[0.26em] leading-[1.35] tracking-normal text-bone type-lead">
                <Tagline />
              </p>
            </div>
          </div>

          <div>
            {/* The one line on the page the heat does NOT drive.
                Everything else swells because the reader is doing
                something; the masthead holds still because it is the
                thing being arrived at. Measured before it was frozen, it
                was breathing between 485 and 643 weight — set solid at
                640, the top of its own range, so it reads as the heavy
                state it was reaching for rather than as a frame caught
                mid-cycle.

                Plain spans rather than `HeatText`: with nothing to drive
                per character there is no reason to split the line into
                fourteen inline-blocks, and the `aria-label` that split
                made necessary goes with it — a screen reader now just
                reads the text. `HeatText` is still used by the track
                pages, which do still animate.

                Holding still also makes the line's WIDTH deterministic,
                which is what lets the cloud mark above it be matched to
                the headline exactly instead of to a snapshot of a moving
                target. Change this weight or width and re-measure that
                ratio — see the mark's comment. */}
            <h1 className="text-hero hero-line text-center">
              <span className="block text-bone type-hero">
                AI Ignite
              </span>
              <span className="block text-flame type-hero">
                at York
              </span>
            </h1>
          </div>

          </div>

          {/* Centred under the headline, rather than hung off the left
              axis the rest of the page uses. The hero is the one section
              that is a composition instead of a column — the headline was
              already centred, and with the standing label gone an
              offset body left it lopsided rather than asymmetric. Every
              section below this still hangs off the spine.

              The top margin steps rather than holding at 3.5rem: below
              `sm` this block is INSIDE the fold rather than past it, so
              every rem here is competing with the buttons for the same
              screen. 1.75rem on a phone, and the old 3.5rem from `sm`
              up, where the block is scrolled to and the air is free.

              Only the tier BELOW `sm` moves, here and at the gap under
              the cloud above — deliberately, and it is the rule for
              every spacing change in this file. `sm` and up has to
              render the number it rendered before or the whole page
              below the hero shifts, which is a desktop regression paid
              for a phone. Verified by diffing the box of every heading,
              term, definition and link at 1024, 1280, 1440 and 1920
              against the same page before the change: zero moved. */}
          <div className="mx-auto mt-7 max-w-tight text-center sm:mt-14">
            {/* The phone's copy of the tagline. Two nodes rather than
                one repositioned, because a single node inside the cloud
                wrapper would sit ABOVE the headline in source order on
                mobile, and the headline has to come first. `hidden`
                removes the other from the accessibility tree entirely, so
                only ever one of them is announced. Below `lg` the cloud
                is ~175px wide and its interior would set this at 9px. */}
            <p className="text-balance text-lead text-bone type-lead lg:hidden">
              <Tagline />
            </p>
            {/* `text-pretty` rather than `text-balance`: balance
                equalises every line, which on a phone turns four lines of
                serif into four short ones with a ragged block shape.
                Pretty only refuses to leave a single word on the last
                line, which is the actual defect at this measure. */}
            <p className="mt-4 text-pretty text-read text-ash sm:mt-5">
              A hands-on AI club at {CLUB.university} where students from every
              faculty build real AI tools instead of only learning that they
              exist.
            </p>

            <div className="mt-8 flex flex-col items-center justify-center gap-3.5 sm:mt-10 sm:flex-row sm:flex-wrap sm:gap-4">
              {/* Goes to /join rather than firing SIGNUP.href straight
                  out of the page. That href is a `mailto:` today, so the
                  loudest control on the site opened a mail client over
                  the page with no warning and no way back — for a reader
                  who has decided they are interested but not yet how
                  much. /join is every way in on one screen, ordered by
                  what each one costs, with the sign-up itself last. */}
              <Link
                href="/join"
                className="w-full max-w-[15rem] bg-flame px-7 py-3.5 text-center text-read text-void transition-colors duration-200 hover:bg-bone sm:w-auto sm:max-w-none type-strong"
              >
                Join the club
              </Link>
              <a
                href="#tracks"
                className="w-full max-w-[15rem] border border-edge px-7 py-3.5 text-center text-read text-bone transition-colors duration-200 hover:border-flame hover:text-flame sm:w-auto sm:max-w-none type-lead"
              >
                Explore tracks
              </a>
            </div>
          </div>
          </div>
        </section>

        {/* ---- Logistics, before anyone has to scroll for them --------
            The reference site puts date, time and place in the first
            screen, and it is right: these are the facts a student needs
            before any argument about why the club is good. */}
        <section className={SHELL}>
          <dl
            data-heat="rule"
            className="grid border-y border-edge sm:grid-cols-3"
          >
            {LOGISTICS.map((l) => (
              <div
                key={l.k}
                data-heat="rule"
                className="border-b border-edge py-6 last:border-b-0 sm:border-b-0 sm:border-r sm:pr-8 sm:last:border-r-0 sm:[&:not(:first-child)]:pl-8"
              >
                <Draw name={LOGISTICS_MARK[l.k]} size={30} className="mb-4" />
                <dt data-heat="label" className="label">
                  {l.k}
                </dt>
                <dd className="mt-2 text-lead text-bone type-lead">
                  {l.v}
                </dd>
                <dd className="mt-1 text-small text-ash">{l.sub}</dd>
              </div>
            ))}
          </dl>
        </section>

        {/* ---- Why ---------------------------------------------------
            The problem before the pitch. A club page that opens by
            describing itself is asking for trust it has not earned; one
            that opens by naming something the reader already feels is
            making an argument. */}
        <section id="why" className={`${SHELL} ${ANCHOR} py-[var(--space-section)]`}>
          <div className={GUTTER}>
            <Gutter mark="gap">{WHY.label}</Gutter>
            <div className="max-w-read">
              <h2 className="text-title text-bone type-head">
                {WHY.heading}
              </h2>
              {WHY.body.map((p) => (
                <p key={p} className="mt-6 text-lead text-ash">
                  {p}
                </p>
              ))}
              {ABOUT.map((p) => (
                <p key={p} className="mt-6 text-read text-ash">
                  {p}
                </p>
              ))}
            </div>
          </div>
        </section>

        {/* ---- Mission and vision ------------------------------------ */}
        <section className={`${SHELL} pb-[var(--space-section)]`}>
          <div className={GUTTER}>
            <Gutter mark="compass">What we are for</Gutter>
            <dl className="grid gap-8 max-w-broad sm:grid-cols-2 sm:gap-x-10">
              {PURPOSE.map((p) => (
                <div key={p.k} data-heat="rule" className="border-t border-edge pt-6">
                  <dt className="text-read text-flame type-strong">
                    {p.k}
                  </dt>
                  <dd className="mt-4 text-read text-ash">{p.v}</dd>
                </div>
              ))}
            </dl>
          </div>
        </section>

        {/* ---- Two tracks --------------------------------------------
            The one real decision the page asks a reader to make, so it
            gets the most space and the plainest language. Each side is
            described by what you leave with, because that is the actual
            question. */}
        <section id="tracks" className={`${SHELL} ${ANCHOR} pb-[var(--space-section)]`}>
          <div className={GUTTER}>
            <Gutter mark="fork">Two tracks, one club</Gutter>
            <div>
              <h2 className="max-w-tight text-title text-bone type-head">
                Pick the one that fits where you are starting
              </h2>
              <p className="mt-6 max-w-read text-read text-ash">
                Both run in parallel, share community events, and finish the
                term with a joint showcase. You can switch, and you can come to
                both.
              </p>

              <div className="mt-14 grid gap-12 lg:grid-cols-2">
                {TRACKS.map((t) => (
                  <article
                    key={t.key}
                    data-heat="rule"
                    className="track border-t border-edge pt-8"
                  >
                    <Draw name={t.key} size={158} className="mb-7" />
                    <p data-heat="label" className="label">
                      {t.audience}
                    </p>
                    <h3 className="mt-5 text-[clamp(2.6rem,6vw,4rem)] leading-[0.94] text-bone type-display">
                      {t.name}
                    </h3>
                    <p className="mt-4 text-small text-flame">
                      {t.shape}
                    </p>
                    <p className="mt-6 max-w-tight text-read text-ash">
                      {t.blurb}
                    </p>

                    <p className="mt-7 max-w-tight pullquote text-read">
                      {t.outcome}
                    </p>

                    <p className="mt-6 text-small text-ash">{t.cadence}</p>

                    <p className="tap-block mt-8">
                      <Link
                        href={t.href}
                        className="group inline-flex items-center gap-3 text-read text-flame transition-[gap] duration-300 ease-[var(--ease-heat)] hover:gap-5 type-strong"
                      >
                        See the {t.name} sessions
                        <span aria-hidden>&rarr;</span>
                      </Link>
                    </p>
                  </article>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ---- At a glance ------------------------------------------- */}
        <section className={`${SHELL} pb-[var(--space-section)]`}>
          <div className={GUTTER}>
            <Gutter mark="eye">At a glance</Gutter>
            <dl className="max-w-wide">
              {GLANCE.map((g) => (
                <div
                  key={g.k}
                  data-heat="rule"
                  className="grid gap-1 border-b border-edge py-4 sm:grid-cols-[13rem_minmax(0,1fr)] sm:gap-8"
                >
                  <dt className="text-small text-ash">{g.k}</dt>
                  <dd className="text-read text-bone">{g.v}</dd>
                </div>
              ))}
            </dl>
          </div>
        </section>

        {/* ---- Who runs it -------------------------------------------
            Fifteen real names. A club launching with no history has
            exactly one form of credibility available to it, which is
            people willing to attach their names to the thing, so this
            section is set as type rather than as a grid of avatars. */}
        <section id="team" className={`${SHELL} ${ANCHOR} pb-[var(--space-section)]`}>
          <div className={GUTTER}>
            <Gutter mark="people">Who runs it</Gutter>
            <div className="max-w-broad">
              <div className="grid gap-10 sm:grid-cols-2">
                {TEAM.lead.map((p) => (
                  <div key={p.name} data-heat="rule" className="border-t border-edge pt-6">
                    <p className="tap-block text-read type-strong">
                      <Person name={p.name} linkedin={p.linkedin} />
                    </p>
                    <p className="mt-1 text-small text-flame">{p.role}</p>
                  </div>
                ))}
              </div>

              <div className="mt-14 grid gap-x-12 gap-y-10 sm:grid-cols-2">
                {TEAM.groups.map((g) => (
                  <div key={g.k}>
                    <p data-heat="label" className="label">
                      {g.k}
                    </p>
                    {/* `tap-list` floors each row at 44px on a touch
                        screen and does nothing at all on a pointer — see
                        the rule in globals.css. Fifteen names set at
                        18px with 6px between them is a 24px pitch, which
                        is a link you miss. */}
                    <ul className="tap-list mt-4 grid gap-1.5">
                      {g.people.map((n) => (
                        <li key={n.name} className="text-read">
                          <Person
                            name={n.name}
                            linkedin={"linkedin" in n ? n.linkedin : undefined}
                          />
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>

              <div data-heat="rule" className="mt-14 border-t border-edge pt-6">
                <p data-heat="label" className="label">
                  Faculty advisor
                </p>
                <p className="mt-3 text-lead text-bone type-lead">
                  {CLUB.advisor.name}
                </p>
                <p className="mt-1 text-small text-ash">{CLUB.advisor.dept}</p>
              </div>
            </div>
          </div>
        </section>

        {/* ---- FAQ ---------------------------------------------------
            Native <details>, not a JS accordion. It works before
            hydration, it is keyboard-operable for free, and the browser
            will find text inside a closed one on Ctrl+F. */}
        <section id="faq" className={`${SHELL} ${ANCHOR} pb-[var(--space-section)]`}>
          <div className={GUTTER}>
            <Gutter mark="speech">Before you ask</Gutter>
            <div className="max-w-wide">
              {FAQ.map((f) => (
                <details key={f.q} data-heat="rule" className="faq border-b border-edge">
                  <summary className="flex cursor-pointer items-start gap-5 py-5 text-lead text-bone type-lead">
                    <span aria-hidden className="faq-sign mt-1 shrink-0 text-flame">
                      +
                    </span>
                    {f.q}
                  </summary>
                  <p className="max-w-tight pb-6 pl-10 text-read text-ash">
                    {f.a}
                  </p>
                  {/* An answer may carry one outbound link. Optional, and
                      read with `in` rather than typed onto every entry,
                      so the six that are pure prose stay pure prose —
                      same pattern the team's LinkedIn fallback uses. */}
                  {"link" in f && f.link ? (
                    <p className="tap-block pb-6 pl-10 text-small">
                      <a
                        className="text-flame underline underline-offset-4 transition-colors duration-200 hover:text-bone"
                        href={f.link.href}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        {f.link.label}
                      </a>
                    </p>
                  ) : null}
                </details>
              ))}
            </div>
          </div>
        </section>
      </main>

      {/* ---- Join ----------------------------------------------------
          The one full-bleed flame block on the page. The loudest colour
          appears exactly once, at the only moment the reader is asked to
          do something. Spend it anywhere else and it stops meaning
          anything here. */}
      {/* No `footer` here. It carried a single Discord link, which the
          block's own "Find us" row now covers along with the other
          three — the track pages still pass one, for their cross-link to
          the opposite track. */}
      <JoinBlock id="join" heading="Come to the first one">
        Sessions begin {CLUB.launch}. Tell us which track fits and we will send
        the schedule before term starts. It takes about a minute and you can
        change your mind later.
      </JoinBlock>

      {/* ---- Colophon ------------------------------------------------ */}
      <footer data-heat="rule" className={`${SHELL} border-t border-edge py-12`}>
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <Mark className="h-8 w-6" />
            <p className="mt-4 text-read text-bone type-strong">
              {CLUB.fullName}
            </p>
            <p className="mt-1 text-small text-ash">{CLUB.tagline}</p>
          </div>
          <div>
            <p data-heat="label" className="label">
              General
            </p>
            <p className="tap-block mt-2 text-small">
              <a
                className="text-bone underline underline-offset-4"
                href={`mailto:${CLUB.contact}`}
              >
                {CLUB.contact}
              </a>
            </p>
            {/* Four channels rather than one, listed in the order a
                student actually uses them: the Discord is where the club
                is day to day, the two social accounts are where it is
                announced, and YUConnect is where York says it is real.

                Each is set as the platform name and nothing else. A row
                of social ICONS would be the one place on this page that
                borrowed someone else's shapes for decoration rather than
                to name a tool — see the note in Brand.tsx — and at
                footer size they would be six unlabelled glyphs.

                The list itself is SOCIALS in lib/content.ts, shared with
                the flame block's "Find us" row so a channel cannot be
                live in one and missing from the other. */}
            <p data-heat="label" className="label mt-6">
              Follow
            </p>
            <ul className="tap-list mt-2 grid gap-2 text-small">
              {SOCIALS.map((s) => (
                <li key={s.name}>
                  <a
                    className="text-bone underline underline-offset-4"
                    href={s.href}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {/* `long` where the channel needs a qualifier, which
                        today is only YUConnect. */}
                    {"long" in s ? s.long : s.name}
                  </a>
                </li>
              ))}
            </ul>
            <p data-heat="label" className="label mt-6">
              Sponsor a session
            </p>
            <p className="tap-block mt-2 text-small">
              <a
                className="text-bone underline underline-offset-4"
                href={`mailto:${CLUB.sponsors}`}
              >
                {CLUB.sponsors}
              </a>
            </p>
          </div>
          <div>
            <p data-heat="label" className="label">
              Tracks
            </p>
            <p className="tap-block mt-2 text-small">
              <Link className="text-bone underline underline-offset-4" href="/spark">
                The Spark Track
              </Link>
            </p>
            <p className="tap-block mt-2 text-small">
              <Link className="text-bone underline underline-offset-4" href="/forge">
                The Forge Track
              </Link>
            </p>
          </div>
          <div>
            <p data-heat="label" className="label">
              Home
            </p>
            <p className="mt-2 text-small text-bone">{CLUB.faculty}</p>
            <p className="text-small text-ash">{CLUB.university}</p>
            {/* Both are real pages describing what this site and this
                club actually do, not boilerplate. See app/privacy and
                app/terms. If the site's behaviour changes, they are
                wrong until they change too. */}
            <p className="tap-block mt-4 text-small">
              <Link
                className="text-ash underline underline-offset-4"
                href="/privacy"
              >
                Privacy
              </Link>
              <span className="px-2 text-dim">·</span>
              <Link
                className="text-ash underline underline-offset-4"
                href="/terms"
              >
                Terms
              </Link>
            </p>
          </div>
        </div>
      </footer>
    </>
  );
}
