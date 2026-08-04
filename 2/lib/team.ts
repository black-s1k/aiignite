/**
 * TODO: replace the placeholders below with the real roster once every
 * member has confirmed consent to have their name published.
 *
 * 15 people total, across: President, VP, Technical Lead (Forge),
 * Technical Lead (Spark), Finance, Marketing, and Support Management.
 *
 * The <Team /> component renders whatever is in this array — adding the
 * remaining entries here is the only change needed.
 */

export type TeamMember = {
  name: string;
  role: string;
};

export const TEAM: TeamMember[] = [
  { name: "Name pending", role: "President" },
  { name: "Name pending", role: "Vice President" },
];

/** Shown alongside the roster so the page is honest about what's missing. */
export const TEAM_SIZE = 15;
