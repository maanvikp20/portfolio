import { getAllProjects } from "@/src/controllers/projectController";
import { getAllBlogs } from "@/src/controllers/blogController";
import { getAllSkills } from "@/src/controllers/skillController";
import { getAllCertifications } from "@/src/controllers/certificationController";
import PortfolioClient from "./PortfolioClient";

export const dynamic = "force-dynamic"; // most recent data on every request
export const revalidate = 0; // sets cache lifetime to 0 seconds, no caching of rendered page
export const fetchCache = "force-no-store"; // ensures data bypasses cache and always fetches fresh from server and controllers

export default async function Page() {
  try {
    // gets all data together to have less lag
    const [allProjects, rawBlogs, rawSkills, rawCerts] = await Promise.all([
      getAllProjects() || [],
      getAllBlogs("published") || [],
      getAllSkills() || [],
      getAllCertifications() || [],
    ]);

    // Data turned into JS objects so it can be passed safely to page with any issues along with fallbacks to prevent full crash
    const projects = JSON.parse(JSON.stringify(allProjects || []));
    const blogs = JSON.parse(JSON.stringify(rawBlogs || []));
    const skills = JSON.parse(JSON.stringify(rawSkills || []));
    const certifications = JSON.parse(JSON.stringify(rawCerts || []));

    // filter projects on category
    const electronics = projects
      .filter((p) => p && p.category === "electronics")
      .slice(0, 3);
    const software = projects
      .filter((p) => p && p.category === "software")
      .slice(0, 3);
    const calculatorGames = projects
      .filter((p) => p && p.category === "calculator-games")
      .slice(0, 3);

    // pass data to client
    return (
      <PortfolioClient
        electronics={electronics}
        software={software}
        calculatorGames={calculatorGames}
        blogs={blogs}
        skills={skills}
        certifications={certifications}
      />
    );
  } catch (error) {
    console.error(
      "Database resolution error during navigation tracing:",
      error,
    );
    // create fallback incase of failure so page doesn't completely crash
    return <PortfolioClient />;
  }
}
