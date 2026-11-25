// Site-wide constants. Set NEXT_PUBLIC_SITE_URL in Vercel if the domain ever changes.
export const SITE_URL = (
  process.env.NEXT_PUBLIC_SITE_URL || "https://maanvikpoddar.vercel.app"
).replace(/\/$/, "");

export const SITE_NAME = "Maanvik Poddar";

export const SITE_DESCRIPTION =
  "Portfolio and blog of Maanvik Poddar, an electrical engineering student building at the intersection of hardware and software.";
