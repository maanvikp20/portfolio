// Cached versions of the reads the public pages use. The admin dashboard keeps
// using the controllers directly so it always sees drafts and fresh data.
import { cached } from "@/src/lib/cache";
import {
  getAllProjects,
  getProjectBySlug,
  getProjectsByCategory,
} from "@/src/controllers/projectController";
import { getAllBlogs, getBlogBySlug } from "@/src/controllers/blogController";
import { getAllSkills } from "@/src/controllers/skillController";
import { getAllCertifications } from "@/src/controllers/certificationController";
import { getAllExperiences } from "@/src/controllers/experienceController";

export const getPublicProjects = cached(getAllProjects, ["public-projects"]);
export const getPublicProjectsByCategory = cached(getProjectsByCategory, [
  "public-projects-by-category",
]);
export const getPublicProject = cached(getProjectBySlug, ["public-project"]);
export const getPublicBlogs = cached(getAllBlogs, ["public-blogs"]);
export const getPublicBlog = cached(getBlogBySlug, ["public-blog"]);
export const getPublicSkills = cached(getAllSkills, ["public-skills"]);
export const getPublicCertifications = cached(getAllCertifications, [
  "public-certifications",
]);
export const getPublicExperiences = cached(getAllExperiences, [
  "public-experiences",
]);