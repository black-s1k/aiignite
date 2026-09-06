import type { Metadata, Viewport } from "next";
import { Archivo, Newsreader } from "next/font/google";
import { HeatField } from "@/components/HeatField";
import { ScrollReveal } from "@/components/ScrollReveal";
import { CLUB } from "@/lib/content";
import "./globals.css";

/**
 * Two families, chosen for what they can do rather than how they look
 * standing still.
 *
 * Archivo is here for its AXES. The `wdth` axis is requested explicitly
 * — next/font ships weight only by default to keep the file small — and
 * without it the heat has nothing to swell. An expanded grotesque is
 * also simply less worn than the condensed poster faces every club site
 * reaches for.
 *
 * Newsreader is a reading serif with an optical-size axis, so it stays
 * open at small sizes on a dark field where a text face would normally
 * close up. Setting body copy in a serif under a grotesque display is
 * the pairing doing the most work here: it is the fastest way to stop a
 * page looking like a product landing page.
 */
const archivo = Archivo({
  variable: "--font-archivo",
  subsets: ["latin"],
  axes: ["wdth"],
  display: "swap",
});

const newsreader = Newsreader({
  variable: "--font-newsreader",
  subsets: ["latin"],
  display: "swap",
});

const DESCRIPTION =
  "A student club at York University's Lassonde School of Engineering. Weekly sessions through Fall 2026 building things with AI tools. Two tracks: Forge for students who code, Spark for everyone else. Free, no application.";

/**
 * The absolute origin every canonical and OpenGraph URL is resolved
 * against.
 *
 * It read `https://aiignite.ca` for a while, which nobody owns yet. That
 * is not a cosmetic error: `metadataBase` is what turns the relative
 * `url: "/"` below into the absolute `og:url` a scraper fetches, so
 * every link shared to LinkedIn, Instagram or Discord pointed at a
 * domain that does not resolve, and the preview card came back empty.
 * The page looked fine to anyone who reached it and broken to everyone
 * deciding whether to.
 *
 * The order below is deliberate:
 *
 *   1. NEXT_PUBLIC_SITE_URL, if set. This is the switch to throw the day
 *      the real domain is bought — set it to `https://aiignite.ca`, add
 *      the domain in Vercel, rebuild, and nothing else in the codebase
 *      changes.
 *   2. VERCEL_PROJECT_PRODUCTION_URL, which Vercel injects at build time
 *      and which always names the project's real production host. It
 *      carries no scheme, hence the template.
 *   3. The known .vercel.app host, so a local `next build` produces the
 *      same absolute URLs the deployed build does rather than silently
 *      falling back to localhost.
 *
 * Inlined at BUILD time, like NEXT_PUBLIC_SIGNUP_URL — setting it later
 * means rebuilding. See the note in lib/signup.ts.
 */
const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ??
  (process.env.VERCEL_PROJECT_PRODUCTION_URL
    ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
    : "https://aiignite.vercel.app");

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: `${CLUB.fullName} · ${CLUB.university}`,
  description: DESCRIPTION,
  openGraph: {
    type: "website",
    siteName: CLUB.name,
    title: `${CLUB.fullName} · ${CLUB.university}`,
    description: DESCRIPTION,
    url: "/",
    locale: "en_CA",
  },
};

/**
 * `viewportFit: "cover"` is what makes `env(safe-area-inset-*)` report
 * anything other than zero, and it is the switch that lets the page paint
 * its own black into a notch or a home indicator instead of leaving the
 * browser's letterbox there. It is only half of the decision: with cover
 * on, every edge-anchored thing on the site has to clear those insets
 * itself, which is why the shell, the nav and the intro's skip button all
 * carry a `max(..., env(...))` rather than a flat padding.
 *
 * `colorScheme: "dark"` so the UI the page does not draw — the scrollbar,
 * the overscroll gutter, a form control — comes back dark as well. Without
 * it a black page ends in a white rubber-band on iOS.
 */
export const viewport: Viewport = {
  themeColor: "#000000",
  colorScheme: "dark",
  viewportFit: "cover",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${archivo.variable} ${newsreader.variable}`}>
      <body>
        {/* One field, one loop. Everything with a data-heat attribute
            is driven from here — see components/HeatField.tsx. */}
        <HeatField />
        {/* Reveals content as it comes into view, every page. One
            observer, no loop — see the header for why it is shaped the
            way it is. */}
        <ScrollReveal />
        {children}
      </body>
    </html>
  );
}
