import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { verifyAdminToken } from "@/src/lib/verifyToken";
import { getAllBlogs } from "@/src/controllers/blogController";
import { getAllProjects } from "@/src/controllers/projectController";
import { getAllSkills } from "@/src/controllers/skillController";
import { getAllCertifications } from "@/src/controllers/certificationController";
import { getAllExperiences } from "@/src/controllers/experienceController";
import AdminWorkspace from "./AdminWorkspace";

export const dynamic = "force-dynamic";

export default async function AdminDashboardPage() {
  const cookieStore = await cookies();

  // server side auth check
  try {
    verifyAdminToken(cookieStore);
  } catch (error) {
    console.log("Admin Rejected Access:", error.message);
    redirect("/admin/login");
  }

  // fetch all data for admin dashboard
  const [blogsRaw, projectsRaw, skillsRaw, certsRaw, expRaw] = await Promise.all([
    getAllBlogs("all"),
    getAllProjects(),
    getAllSkills(),
    getAllCertifications(),
    getAllExperiences(),
  ]);

  // parse data to json to make it usable on client
  const initialData = {
    blogs: JSON.parse(JSON.stringify(blogsRaw || [])),
    projects: JSON.parse(JSON.stringify(projectsRaw || [])),
    skills: JSON.parse(JSON.stringify(skillsRaw || [])),
    certifications: JSON.parse(JSON.stringify(certsRaw || [])),
    experiences: JSON.parse(JSON.stringify(expRaw || [])),
  };

  return <AdminWorkspace initialData={initialData} />;
}