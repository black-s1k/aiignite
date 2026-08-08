import type { Metadata } from "next";
import { Big_Shoulders, Public_Sans, Spline_Sans_Mono } from "next/font/google";
import { Intro } from "@/components/Intro";
import { Press } from "@/components/Press";
import { SmoothScroll } from "@/components/SmoothScroll";
import { CLUB } from "@/lib/content";
import "./globals.css";

/**
 * Three faces, three jobs, and the reason they go together is that they
 * all come out of public-sector printing rather than out of tech.
 *
 * Big Shoulders was drawn for Chicago's civic signage — a condensed
 * grotesque built to be read big and fast off a wall, which is exactly
 * what a poster headline is. Public Sans is the US federal body face,
 * deliberately characterless, and that restraint is what gives the
 * display face something to be loud against. Spline Sans Mono handles
 * anything that is data.
 */
const bigShoulders = Big_Shoulders({
  variable: "--font-big-shoulders",
  subsets: ["latin"],
  display: "swap",
});

const publicSans = Public_Sans({
  variable: "--font-public-sans",
  subsets: ["latin"],
  display: "swap",
});

const splineMono = Spline_Sans_Mono({
  variable: "--font-spline-mono",
  subsets: ["latin"],
  display: "swap",
});

const DESCRIPTION =
  "A student club at York University's Lassonde School of Engineering, launching September 1, 2026. Two tracks — Forge for students who code, Spark for everyone else. Pick one and start building.";

export const metadata: Metadata = {
  metadataBase: new URL("https://aiignite.ca"),
  title: `${CLUB.name} at ${CLUB.at} — ${CLUB.tagline}`,
  description: DESCRIPTION,
  applicationName: `${CLUB.name} at ${CLUB.at}`,
  openGraph: {
    type: "website",
    siteName: `${CLUB.name} at ${CLUB.at}`,
    title: `${CLUB.name} at ${CLUB.at}`,
    description: DESCRIPTION,
    url: "/",
    locale: "en_CA",
  },
  twitter: { card: "summary_large_image" },
};

// The stock colour, so the browser chrome and the overscroll gutter are
// the same sheet the page is printed on.
export const viewport = { themeColor: "#000000" };

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      className={`${bigShoulders.variable} ${publicSans.variable} ${splineMono.variable} antialiased`}
    >
      <body>
        {/* Runs before the rest of the body is parsed, which is the only
            place it can run and still beat the first paint. A second
            page view in the same session must not flash the title
            sequence, and finding that out after hydration would be too
            late — the overlay would already have been on screen.

            It ARMS rather than disarms, so the failure mode is right in
            both directions: with no scripting the class never lands, the
            overlay stays hidden, and the reader gets the hero at once.
            sessionStorage throws outright in some privacy modes rather
            than returning null, so the catch arms it too — replaying the
            sequence is the better error than never showing it. */}
        <script
          dangerouslySetInnerHTML={{
            __html:
              "try{if(!sessionStorage.getItem('ignite-intro'))document.documentElement.classList.add('intro-armed')}catch(e){document.documentElement.classList.add('intro-armed')}",
          }}
        />
        <SmoothScroll />
        <Press />
        {/* Above the press. Everything printed sits on top of the ink. */}
        <div className="relative z-10">{children}</div>
        {/* Last, and above everything. The hero underneath is fully
            rendered and interactive the whole time this is up, so the
            sequence is never load-bearing for content. */}
        <Intro />
      </body>
    </html>
  );
}
