import Link from "next/link";
import { notFound } from "next/navigation";
import Navbar from "@/src/components/Navbar";
import { getAllProjects } from "@/src/controllers/projectController";

export const dynamic = "force-dynamic";

export default async function ProjectDetailPage({ params }) {
  // Extract url segments
  const { category, slug } = await params;
  
  const projects = await getAllProjects();

  // Find matches across any category string
  const project = projects.find(
    (p) => p.slug === slug && p.category === category,
  );

  if (!project) notFound();

  // Generate display titles
  const cleanCategoryName = category
    .split("-")
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");

  return (
    <main className="relative min-h-screen">
      <Navbar />

      <section className="pt-32 pb-24 px-8 md:px-16">
        <div className="max-w-3xl mx-auto">
          <Link
            href={`/portfolio/${category}`}
            className="inline-flex items-center gap-2 text-sm mb-12 hover:opacity-70 transition underline underline-offset-4"
            style={{ color: "var(--text-secondary)" }}
          >
            ← Back to {cleanCategoryName}
          </Link>

          <div className="mb-6">
            <span
              className="text-xs font-medium px-3 py-1 rounded-full"
              style={{
                backgroundColor: "rgba(var(--overlay-color), 0.08)",
                color: "var(--text-secondary)",
              }}
            >
              {project.status || "Completed"}
            </span>
          </div>

          <h1
            className="text-5xl md:text-6xl font-bold leading-tight mb-6 transition-colors duration-300"
            style={{
              fontFamily: "var(--font-instrument-serif)",
              color: "var(--text-primary)",
            }}
          >
            {project.title}
          </h1>

          <div
            className="w-16 h-0.5 mb-10"
            style={{ backgroundColor: "var(--text-primary)" }}
          />

          {/* Image */}
          {project.coverImage && (
            <div 
              className="w-full mb-12 rounded-2xl overflow-hidden border shadow-sm" 
              style={{ borderColor: "rgba(var(--overlay-color), 0.12)" }}
            >
              <img 
                src={project.coverImage} 
                alt={project.title} 
                className="w-full h-auto max-h-[480px] object-cover"
              />
            </div>
          )}

          <p
            className="text-lg md:text-xl leading-relaxed mb-12"
            style={{
              fontFamily: "var(--font-instrument-serif)",
              color: "var(--text-secondary)",
            }}
          >
            {project.description}
          </p>

          {project.technologies?.length > 0 && (
            <div>
              <h2
                className="text-sm font-medium uppercase tracking-widest mb-4 opacity-60"
                style={{ color: "var(--text-primary)" }}
              >
                Technologies
              </h2>
              <div className="flex flex-wrap gap-3">
                {project.technologies.map((tech) => (
                  <span
                    key={tech}
                    className="text-sm px-4 py-2 rounded-xl"
                    style={{
                      border: "1px solid rgba(var(--overlay-color), 0.15)",
                      backgroundColor: "rgba(var(--overlay-color), 0.04)",
                      color: "var(--text-primary)",
                    }}
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </section>
    </main>
  );
}