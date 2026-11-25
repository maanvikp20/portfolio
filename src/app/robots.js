import { SITE_URL } from "@/src/lib/site";

// /admin is kept out of search with a noindex tag (see src/app/admin/layout.jsx);
// blocking it here would stop crawlers from ever seeing that tag.
export default function robots() {
  return {
    rules: [{ userAgent: "*", allow: "/", disallow: ["/api/"] }],
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}
