import type { Metadata } from "next";
import { Archivo_Black, Inter } from "next/font/google";
import { Grain } from "@/components/Grain";
import "./globals.css";

/**
 * Archivo Black is not negotiable: the wordmark baked into the hero video is
 * set in it, so any other display face mismatches at the frame where the
 * video resolves into the page. Single weight — Archivo Black has only 400.
 */
const archivoBlack = Archivo_Black({
  variable: "--font-archivo-black",
  weight: "400",
  subsets: ["latin"],
  display: "swap",
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const DESCRIPTION =
  "A student club at York University's Lassonde School of Engineering, launching September 1, 2026. Two tracks — Forge for students who code, Spark for everyone else. Pick one and start building with AI.";

export const metadata: Metadata = {
  // Absolute base for the OG tags below. Without it Next emits relative
  // image URLs, which most crawlers refuse to resolve.
  metadataBase: new URL("https://aiignite.ca"),
  title: "AI Ignite at York — Ignite the Spark. Let AI do the Rest.",
  description: DESCRIPTION,
  applicationName: "AI Ignite at York",
  openGraph: {
    type: "website",
    siteName: "AI Ignite at York",
    title: "AI Ignite at York — Ignite the Spark. Let AI do the Rest.",
    description: DESCRIPTION,
    url: "/",
    locale: "en_CA",
    images: [
      {
        // The hero's resolved final frame, so the share card and the page
        // land on the same wordmark.
        url: "/ignite-poster.jpg",
        width: 1440,
        height: 1440,
        alt: "The AI Ignite wordmark, assembled from 0, 1, A and I characters in the shape of a flame.",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "AI Ignite at York",
    description: DESCRIPTION,
    images: ["/ignite-poster.jpg"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${archivoBlack.variable} ${inter.variable} h-full antialiased`}
    >
      <body className="bg-bg text-text min-h-full">
        <Grain />
        <div className="relative z-10">{children}</div>
      </body>
    </html>
  );
}
