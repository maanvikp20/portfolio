import { getAllProjects } from "@/src/controllers/projectController";
import { getAllBlogs } from "@/src/controllers/blogController";
import { getAllSkills } from "@/src/controllers/skillController";
import { getAllCertifications } from "@/src/controllers/certificationController";
import { getAllExperiences } from "@/src/controllers/experienceController";
import PortfolioClient from "./PortfolioClient";
import { buildMetadata } from "@/src/lib/seo";

export const metadata = buildMetadata({
  title: "Portfolio",
  description:
    "Projects, experience, skills, and certifications of Maanvik Poddar, an electrical engineering student.",
  path: "/portfolio",
});

export const dynamic = "force-dynamic"; // most recent data on every request
export const revalidate = 0; // sets cache lifetime to 0 seconds, no caching of rendered page
export const fetchCache = "force-no-store"; // ensures data bypasses cache and always fetches fresh from server and controllers

// fetch everything and shape it for the client; returns null if the database is unreachable
async function loadPortfolioData() {
  try {
    const [allProjects, rawBlogs, rawSkills, rawCerts, rawExperiences] =
      await Promise.all([
        getAllProjects(),
        getAllBlogs("published"),
        getAllSkills(),
        getAllCertifications(),
        getAllExperiences(),
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
