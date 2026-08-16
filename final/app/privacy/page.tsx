import type { Metadata } from "next";
import { Legal } from "@/components/Legal";
import { CLUB } from "@/lib/content";

export const metadata: Metadata = {
  title: `Privacy · ${CLUB.name}`,
  description: `What ${CLUB.name} does with the information you give us when you sign up, and what this website collects. It sets no cookies and runs no analytics.`,
};

/**
 * Written from what the code actually does, checked against it rather
 * than adapted from a template. Every claim below is verifiable in this
 * repository: there is no analytics script, no cookie is set, nothing is
 * written to localStorage or sessionStorage, and the page makes no
 * network request to a third party at runtime.
 *
 * If any of that changes, this page is wrong and has to change in the
 * same commit. A privacy policy describing a site other than the one it
 * ships with is worse than none, because it is a false statement rather
 * than a missing one.
 */
export default function Page() {
  return (
    <Legal title="Privacy" updated="16 August 2026">
      <p>
        {CLUB.name} is a student club at {CLUB.university}. This page covers
        two separate things: what this website collects while you read it,
        and what we do with the details you send us if you decide to join.
      </p>

      <h2>What this website collects</h2>
      <p>
        Nothing. There is no analytics script on this site, no tracking
        pixel, and no advertising code. It sets no cookies. It stores
        nothing in your browser. We cannot tell how many people have read
        this page, and we have chosen not to be able to.
      </p>
      <p>
        The two typefaces are served from this site rather than from
        Google, so loading the page does not tell a third party that you
        opened it. The only file the page fetches is the drawing that
        plays at the start, which comes from the same server.
      </p>
      <p>
        Our web host keeps standard server logs, which normally include IP
        addresses and are held briefly for security and reliability. That
        is the host&rsquo;s processing, not ours, and we do not build
        profiles from it or connect it to anything below.
      </p>

      <h2>What we collect when you sign up</h2>
      <p>
        Signing up sends us your name, your program and year, which track
        you want, and the email address you write from or enter. That is
        all we ask for, and we do not ask for your student number.
      </p>
      <p>We use it for exactly two things:</p>
      <ul>
        <li>Sending you the schedule and session reminders.</li>
        <li>
          Knowing roughly how many people to expect, so we can book a room
          that fits.
        </li>
      </ul>
      <p>
        We do not sell it, rent it, or share it with sponsors. If a session
        is ever run with a partner organisation, they get a headcount and
        nothing else. Every email we send has a way to stop receiving
        them, and stopping does not remove you from the club.
      </p>

      <h2>How long we keep it</h2>
      <p>
        Until the end of the academic year, or until you ask us to delete
        it, whichever comes first. There is no archive.
      </p>

      <h2>Asking us to delete it</h2>
      <p>
        Email{" "}
        <a
          className="text-bone underline underline-offset-4"
          href={`mailto:${CLUB.contact}?subject=Delete%20my%20details`}
        >
          {CLUB.contact}
        </a>{" "}
        and we will delete your details and confirm when it is done. You do
        not have to give a reason.
      </p>

      <h2>Who to ask about this</h2>
      <p>
        The club executive, at{" "}
        <a
          className="text-bone underline underline-offset-4"
          href={`mailto:${CLUB.contact}`}
        >
          {CLUB.contact}
        </a>
        . We are a student club rather than a company, and our faculty
        advisor is {CLUB.advisor.name} in {CLUB.advisor.dept}.
      </p>
    </Legal>
  );
}
