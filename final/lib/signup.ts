import { CLUB } from "@/lib/content";

/**
 * Where the sign-up button goes, and what we promise it will do.
 *
 * The two have to be decided TOGETHER, which is the whole reason this
 * file exists. Before it, the button fell back to `href="#"` when
 * NEXT_PUBLIC_SIGNUP_URL was unset while the line under it still read
 * "Opens a form" — so the most important control on the page did
 * nothing, and lied about it. That is the single most recognisable
 * tell of a site that was never actually used by its author.
 *
 * There is no unset case now. Without a form URL the button falls back
 * to email, which is a real destination that works today: the club has
 * an inbox before it has a form. The microcopy is derived from the same
 * branch, so it can never describe a destination other than the one the
 * button actually points at.
 *
 * The env var is inlined at BUILD time, not read per request. Setting it
 * later means rebuilding.
 */

const url = process.env.NEXT_PUBLIC_SIGNUP_URL;

const subject = encodeURIComponent(`Joining ${CLUB.name}`);
const body = encodeURIComponent(
  [
    `I would like to join ${CLUB.name}.`,
    "",
    "Name:",
    "Program and year:",
    "Track (Spark or Forge):",
  ].join("\n"),
);

export const SIGNUP = url
  ? {
      href: url,
      /** Both are true of the real form: it is external, and it does not
       *  sit behind Passport York. */
      note: "Opens a form · no York login needed",
    }
  : {
      href: `mailto:${CLUB.contact}?subject=${subject}&body=${body}`,
      /** Says exactly what happens, including the part a reader would
       *  otherwise be surprised by: their mail client opening. */
      note: `Opens your email app · we reply with the schedule`,
    };
