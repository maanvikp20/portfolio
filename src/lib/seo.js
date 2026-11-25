import { SITE_NAME, SITE_DESCRIPTION } from "./site";

// One place that builds the title / canonical / Open Graph / Twitter tags for a page.
// `path` is relative (e.g. "/blog/my-post"); the root layout's metadataBase makes it absolute.
export function buildMetadata({
  title,
  description = SITE_DESCRIPTION,
  path = "/",
  image,
  type = "website",
  publishedTime,
  modifiedTime,
  tags,
}) {
  // falls back to the generated card in src/app/opengraph-image.jsx
  const images = [image || "/opengraph-image"];

  return {
    title,
    description,
    alternates: { canonical: path },
    openGraph: {
      type,
      url: path,
      siteName: SITE_NAME,
      title,
      description,
      images,
      ...(type === "article" ? { publishedTime, modifiedTime, tags } : {}),
    },
    twitter: { card: "summary_large_image", title, description, images },
  };
}
