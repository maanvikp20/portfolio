import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { verifyAdminToken } from "@/src/lib/verifyToken";
import { getAllBlogs } from "@/src/controllers/blogController";
import { getAllProjects } from "@/src/controllers/projectController";
import { getAllSkills } from "@/src/controllers/skillController";
import { getAllCertifications } from "@/src/controllers/certificationController";
import AdminWorkspace from "./AdminWorkspace";

// Nav cache to force dynamic rendering and real-time db checks so admin sees latest data
export const dynamic = "force-dynamic";

export default async function AdminDashboardPage() {
  const cookieStore = await cookies();
  
  try {
    // Verify admin sesh token from cookies
    verifyAdminToken(cookieStore);
  } catch (error) {
    console.log("Admin Rejected Access:", error.message);
    redirect("/admin/login");
  }

  // Load dashboard upon token verification
  const [blogsRaw, projectsRaw, skillsRaw, certsRaw] = await Promise.all([
    getAllBlogs("published"),
    getAllProjects(),
    getAllSkills(),
    getAllCertifications()
  ]);

  // Data where mongodb docs converted to JSON with safety fallbacks
  const initialData = {
    blogs: JSON.parse(JSON.stringify(blogsRaw || [])),
    projects: JSON.parse(JSON.stringify(projectsRaw || [])),
    skills: JSON.parse(JSON.stringify(skillsRaw || [])),
    certifications: JSON.parse(JSON.stringify(certsRaw || []))
  };

  return <AdminWorkspace initialData={initialData} />;
}

