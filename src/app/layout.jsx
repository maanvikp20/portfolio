import React from "react";
import "./globals.css";
import { Instrument_Serif } from "next/font/google";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { Analytics } from "@vercel/analytics/next";
import { SITE_URL, SITE_NAME, SITE_DESCRIPTION } from "@/src/lib/site";
import MotionProvider from "@/src/components/MotionProvider";

const instrumentSerif = Instrument_Serif({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-instrument-serif",
});

export const metadata = {
  metadataBase: new URL(SITE_URL),
  // pages set a short title; it becomes "Title | Maanvik Poddar"
  title: { default: SITE_NAME, template: `%s | ${SITE_NAME}` },
  description: SITE_DESCRIPTION,
  openGraph: {
    type: "website",
    siteName: SITE_NAME,
    title: SITE_NAME,
    description: SITE_DESCRIPTION,
    url: "/",
  },
  twitter: {
    card: "summary_large_image",
    title: SITE_NAME,
    description: SITE_DESCRIPTION,
  },
};

// Runs before first paint so the saved theme is applied with no flash.
// Dark is the default; only an explicit "light" choice turns it off.
const themeScript = `
(function () {
  try {
    var saved = localStorage.getItem("theme");
    if (saved === "light") document.documentElement.classList.remove("dark");
    else document.documentElement.classList.add("dark");
  } catch (e) {
    document.documentElement.classList.add("dark");
  }
})();
`;

export default function RootLayout({ children }) {
  return (
    // suppressHydrationWarning: the script above edits <html class> before React hydrates
    <html
      lang="en"
      className={instrumentSerif.variable}
      suppressHydrationWarning
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body>
        <MotionProvider>{children}</MotionProvider>
        <SpeedInsights />
        <Analytics />
      </body>
    </html>
  );
}
