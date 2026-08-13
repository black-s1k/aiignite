/**
 * Every fact the page states, in one place.
 *
 * The brief was ordinary content described plainly, so nothing here is
 * written to be clever. It answers, in order, the questions a student
 * actually has: what is this, is it for me, what happens in a session,
 * what will I make, when is it, and what if I am not sure.
 *
 * The one rule this file follows: NOTHING CLAIMED THAT IS NOT TRUE. The
 * club launches in September 2026 and has no track record, no alumni and
 * no attendance numbers, so there are none here. Where credibility is
 * needed the page uses what is real — who backs it, who runs it, and
 * exactly what happens in a session — rather than inventing a history.
 */

export const CLUB = {
  name: "AI Ignite",
  university: "York University",
  faculty: "Lassonde School of Engineering",
  term: "Fall 2026",
  launch: "September 1, 2026",
  tagline: "Ignite the spark. Let AI do the rest.",
  advisor: {
    name: "Professor Enas Altarawneh",
    dept: "EECS, Lassonde School of Engineering",
  },
  contact: "hello@aiignite.ca",
  sponsors: "sponsors@aiignite.ca",
} as const;

/** The nav. Kept short on purpose — five is already too many. */
export const NAV = [
  { label: "About", href: "#about" },
  { label: "Tracks", href: "#tracks" },
  { label: "A session", href: "#session" },
  { label: "FAQ", href: "#faq" },
] as const;

/** Surfaced in the first screen, before anyone has to scroll. */
export const LOGISTICS = [
  { k: "Starts", v: "September 1, 2026", sub: "Weekly, through the fall term" },
  { k: "Where", v: "Lassonde, York University", sub: "Keele campus · room with the schedule" },
  { k: "Cost", v: "Free", sub: "No application, no membership fee" },
] as const;

export const ABOUT = [
  "AI Ignite is a student club at York University. We meet weekly through the fall term to build things with AI tools — not to talk about them.",
  "Most students leave university knowing AI exists and never having made anything with it. Closing that gap is the whole reason this club runs. Every session ends with something you built and can show someone.",
] as const;

/** Who is being spoken to, said out loud rather than implied. */
export const TRACKS = [
  {
    key: "forge",
    name: "Forge",
    audience: "If you already code",
    who: "For students who already code",
    blurb:
      "Four workshops taken in order. Each one picks up the pipeline you finished in the last, so the thing you deploy in week four is the thing you started in week one.",
    shape: "Sequential · 4 workshops",
    sessions: [
      "Retrieval over your own documents",
      "Agents that call real tools",
      "Evaluating a model honestly",
      "Fine-tuning, and when not to",
    ],
  },
  {
    key: "spark",
    name: "Spark",
    audience: "If you have never written a line",
    who: "For everyone else",
    blurb:
      "Six standalone sessions. No prerequisites, no order, nothing to install beforehand. Every session opens with a vote, and whatever the room picks is what the room builds that day.",
    shape: "Standalone · 6 sessions",
    sessions: [
      "Prompting, properly",
      "Automation workflows",
      "Building a web app with AI",
      "Data and research",
      "Agents that finish the task",
      "Whatever the room votes for",
    ],
  },
] as const;

/**
 * What actually happens, minute by minute. This is the section doing the
 * most work on the page: it replaces a promise with a description, which
 * is the only honest way for a club with no history to be credible.
 */
export const SESSION = {
  length: "Two hours, once a week",
  steps: [
    {
      at: "0:00",
      title: "Show and tell",
      body: "Ten minutes. Whoever made something last week shows it. Half of them are broken and that is the useful part.",
    },
    {
      at: "0:10",
      title: "The build, explained",
      body: "What we are making today and why it is worth making. No slides longer than the build itself.",
    },
    {
      at: "0:25",
      title: "You build it",
      body: "The bulk of the session. Everyone works on the same thing at once, so when you get stuck the person beside you is stuck on the same line.",
    },
    {
      at: "1:40",
      title: "Ship it",
      body: "It goes somewhere real — a link, a repo, a running workflow. You leave with a thing, not with notes.",
    },
  ],
  bring: [
    "A laptop, any laptop",
    "No installs before you arrive",
    "No prior AI experience for Spark",
    "Come to one, skip three, come again",
  ],
} as const;

/** Real objections, answered plainly. */
export const FAQ = [
  {
    q: "I have never written code. Is this actually for me?",
    a: "Yes — that is exactly who the Spark track is for. Six standalone sessions, no prerequisites, nothing to install. If you can use a browser you can keep up.",
  },
  {
    q: "Do I need to come every week?",
    a: "No. Spark sessions are standalone, so come to the ones that interest you. Forge is sequential and works best in order, but nobody takes attendance either way.",
  },
  {
    q: "Is it really free?",
    a: "Yes. No membership fee, no ticket, nothing to buy. Any tool that costs money is not a tool we build a session around.",
  },
  {
    q: "What if I join partway through the term?",
    a: "Fine for Spark, since every session stands alone. For Forge you can still come — you will just be picking up a pipeline mid-build, and we will point you at what you missed.",
  },
  {
    q: "Which faculty can join?",
    a: "Any. This is open to every York student regardless of programme or year, not just Lassonde.",
  },
  {
    q: "I want to sponsor or run a session.",
    a: `Email ${CLUB.sponsors}. We are looking for companies to sponsor sessions and for people who want to teach one.`,
  },
] as const;
