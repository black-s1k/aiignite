import type { Metadata } from "next";
import { Archivo, Newsreader } from "next/font/google";
import { HeatField } from "@/components/HeatField";
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

export const metadata: Metadata = {
  metadataBase: new URL("https://aiignite.ca"),
  title: `${CLUB.name} — ${CLUB.university}`,
  description: DESCRIPTION,
  openGraph: {
    type: "website",
    siteName: CLUB.name,
    title: `${CLUB.name} — ${CLUB.university}`,
    description: DESCRIPTION,
    url: "/",
    locale: "en_CA",
  },
};

export const viewport = { themeColor: "#000000" };

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${archivo.variable} ${newsreader.variable}`}>
      <body>
        {/* One field, one loop. Everything with a data-heat attribute
            is driven from here — see components/HeatField.tsx. */}
        <HeatField />
        {children}
      </body>
    </html>
  );
}
