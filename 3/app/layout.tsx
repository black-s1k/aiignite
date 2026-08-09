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
      // The inline script below adds `intro-armed` to this element before
      // React hydrates, which is the entire point of it — the class has
      // to be on the page at first paint. React then finds a className on
      // <html> that is not in the server HTML and reports a mismatch.
      //
      // The difference is intentional and correct, so it is declared
      // rather than worked around. This is the same pattern every
      // pre-hydration theme script uses, and it is scoped tightly: React
      // only suppresses this ELEMENT's own attributes, not its subtree,
      // so a genuine mismatch anywhere inside still surfaces. The one
      // thing it hides here is the font-variable className, which comes
      // from next/font as a static string and cannot legitimately differ.
      //
      // The alternative — setting the class from a mount effect instead —
      // trades this warning for a visible flash of the hero before the
      // overlay covers it, which is a real defect rather than a console
      // message about an intended difference.
      suppressHydrationWarning
      className={`${bigShoulders.variable} ${publicSans.variable} ${splineMono.variable} antialiased`}
    >
      <body>
        {/* One line, and it looks like it does nothing. It is a
            SCRIPTING TEST, not a condition: the class only ever lands in
            a browser that runs JS, and the overlay is hidden until it
            does. Without it, a reader with scripting off or a bundle
            that fails to load would sit staring at a poster frame with
            nothing able to start the video or clear the overlay.

            It has to be inline and here, before the rest of the body is
            parsed, because it must beat the first paint. Doing this
            after hydration would mean a flash of hero, then a cover, and
            then the sequence — which is the one order that looks
            broken. */}
        <script
          dangerouslySetInnerHTML={{
            __html: "document.documentElement.classList.add('intro-armed')",
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
