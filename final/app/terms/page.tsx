import type { Metadata } from "next";
import { Legal } from "@/components/Legal";
import { CLUB } from "@/lib/content";

export const metadata: Metadata = {
  title: `Terms · ${CLUB.name}`,
  description: `The terms for taking part in ${CLUB.name}: who can join, what we expect at a session, and who owns what you build.`,
};

/**
 * A student club has no customers, no subscription and no software to
 * license, so most of what a terms page normally contains would be
 * fiction here. What is left is genuinely worth writing down, because
 * members ask about it: who can come, what is expected of them, and who
 * owns the thing they build on a Thursday evening.
 *
 * Anything that would be invented is left out rather than padded.
 */
export default function Page() {
  return (
    <Legal title="Terms" updated="16 August 2026">
      <p>
        {CLUB.name} is a student club at {CLUB.university}, not a company
        and not a course. These are the terms for taking part. They are
        short because there is not much to say.
      </p>

      <h2>Who can join</h2>
      <p>
        Any currently registered {CLUB.university} student, from any
        faculty and any year. There is no application and no fee. You do
        not need to have written code before, which is what the Spark
        track is for.
      </p>

      <h2>What we ask of you</h2>
      <ul>
        <li>
          Turn up ready to build something. Sessions are hands-on and there
          is no lecture to sit through.
        </li>
        <li>
          Treat the people in the room the way the{" "}
          {CLUB.university} Student Code of Conduct requires. It applies at
          our sessions, and we will ask anyone who ignores it to leave.
        </li>
        <li>
          Use the AI tools within their own terms, and within the
          University&rsquo;s rules on academic honesty. What you build here
          is yours to keep, but handing in club work as coursework is
          between you and your instructor, and we cannot authorise it.
        </li>
      </ul>

      <h2>Who owns what you build</h2>
      <p>
        You do. We claim no rights over anything you make at a session. If
        we would like to show your project publicly, we will ask you first
        and take no for an answer.
      </p>

      <h2>What we cannot promise</h2>
      <p>
        Sessions run on the schedule we publish, but rooms move and dates
        occasionally change; we will email you when they do. The tools we
        use are third-party services that we do not control, and any of
        them may change their pricing, their free tier, or their terms
        without telling us. We teach what works at the time.
      </p>
      <p>
        Nothing here is professional advice, and taking part does not
        create an employment or contractual relationship with the club or
        with the University.
      </p>

      <h2>Changes</h2>
      <p>
        If these terms change, the date at the top of this page changes
        with them. We will say so at a session rather than expecting anyone
        to re-read this.
      </p>

      <h2>Questions</h2>
      <p>
        Email{" "}
        <a
          className="text-bone underline underline-offset-4"
          href={`mailto:${CLUB.contact}`}
        >
          {CLUB.contact}
        </a>
        .
      </p>
    </Legal>
  );
}
