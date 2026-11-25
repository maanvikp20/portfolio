import { SITE_URL } from "@/src/lib/site";
import { getAllBlogs } from "@/src/controllers/blogController";
import { getAllProjects } from "@/src/controllers/projectController";

// built on request (not at deploy time) so new posts and projects show up
export const dynamic = "force-dynamic";

const CATEGORIES = ["electronics", "software", "calculator-games"];

export default async function sitemap() {
  const now = new Date();

  const entries = [
    {
      url: SITE_URL,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 1,
    },
    {
      url: `${SITE_URL}/portfolio`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.9,
    },
    {
      url: `${SITE_URL}/blog`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.8,
    },
    ...CATEGORIES.map((c) => ({
      url: `${SITE_URL}/portfolio/${c}`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.7,
    })),
  ];

  // if the database is unreachable, still serve the static pages
  try {
    const [blogs, projects] = await Promise.all([
      getAllBlogs("published"),
      getAllProjects(),
    ]);

    for (const b of blogs) {
      entries.push({
        url: `${SITE_URL}/blog/${b.slug}`,
        lastModified: b.updatedAt || b.createdAt || now,
        changeFrequency: "yearly",
        priority: 0.6,
      });
    }
    for (const p of projects) {
      entries.push({
        url: `${SITE_URL}/portfolio/${p.category}/${p.slug}`,
        lastModified: p.updatedAt || p.createdAt || now,
        changeFrequency: "yearly",
        priority: 0.6,
      });
    }
  } catch {
    // static entries only
  }

  return entries;
}
