/**
 * Every fact the page states, in one place.
 *
 * The brief for this build was ordinary content described plainly — so
 * the copy here is not written to be clever. It answers, in order, the
 * questions a student actually has: what is this, is it for me, what
 * will I make, when is it, how do I join.
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

/** The one-paragraph answer to "what is this". */
export const ABOUT = [
  "AI Ignite is a student club at York University. We meet weekly through the fall term to build things with AI tools — not to talk about them.",
  "Most students leave university knowing AI exists and never having made anything with it. That gap is the whole reason this club runs. Every session ends with something you built and can show someone.",
] as const;

export const TRACKS = [
  {
    key: "forge",
    name: "Forge",
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

/** Plain logistics. The questions people email to ask. */
export const FACTS = [
  { q: "Who can join", a: "Any York student, any faculty, any year. No application." },
  { q: "Cost", a: "Free. Nothing to buy, nothing to install before your first session." },
  { q: "When", a: "Weekly through the fall term, starting September 1, 2026." },
  { q: "Where", a: "Lassonde School of Engineering. Room announced with the schedule." },
  { q: "Commitment", a: "Come to what interests you. Neither track takes attendance." },
] as const;
