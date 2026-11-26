import {
  getPublicProjects,
  getPublicBlogs,
  getPublicSkills,
  getPublicCertifications,
  getPublicExperiences,
} from "@/src/lib/publicData";
import PortfolioClient from "./PortfolioClient";
import { buildMetadata } from "@/src/lib/seo";

export const metadata = buildMetadata({
  title: "Portfolio",
  description:
    "Projects, experience, skills, and certifications of Maanvik Poddar, an electrical engineering student.",
  path: "/portfolio",
});

// the page renders per request, but its data comes from a cache that is
// refreshed whenever content is saved in admin (see src/lib/cache.js)
export const dynamic = "force-dynamic";

// fetch everything and shape it for the client; returns null if the database is unreachable
async function loadPortfolioData() {
  try {
    const [allProjects, rawBlogs, rawSkills, rawCerts, rawExperiences] =
      await Promise.all([
        getPublicProjects(),
        getPublicBlogs("published"),
        getPublicSkills(),
        getPublicCertifications(),
        getPublicExperiences(),
      ]);

    // plain json objects
    const projects = JSON.parse(JSON.stringify(allProjects || []));

    // filter projects on category
    const byCategory = (category) =>
      projects.filter((p) => p && p.category === category).slice(0, 3);

    return {
      electronics: byCategory("electronics"),
      software: byCategory("software"),
      calculatorGames: byCategory("calculator-games"),
      blogs: JSON.parse(JSON.stringify(rawBlogs || [])),
      skills: JSON.parse(JSON.stringify(rawSkills || [])),
      certifications: JSON.parse(JSON.stringify(rawCerts || [])),
      experiences: JSON.parse(JSON.stringify(rawExperiences || [])),
    };
  } catch (error) {
    console.error("Portfolio data load failed:", error);
    return null;
  }
}

export default async function Page() {
  const data = await loadPortfolioData();

  // fallback so the page doesn't completely crash if the database is down
  if (!data) return <PortfolioClient />;

  return <PortfolioClient {...data} />;
}
