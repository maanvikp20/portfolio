import Link from "next/link";
import { notFound } from "next/navigation";
import Navbar from "@/src/components/Navbar";
import { getAllProjects } from "@/src/controllers/projectController";

export const dynamic = "force-dynamic";

export default async function CategoryListPage({ params }) {
  const { category } = await params;

  const validCategories = ["electronics", "software", "calculator-games"];
  if (!validCategories.includes(category)) {
    notFound();
  }

  const allProjects = await getAllProjects();

  const filteredProjects = allProjects.filter((p) => p.category === category);

  const cleanCategoryName = category
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");

  return (
    <main className="relative min-h-screen">
      <Navbar />

      <section className="pt-32 pb-24 px-8 md:px-16">
        <div className="max-w-4xl mx-auto">
          {/* Back Navigation */}
          <Link
            href="/portfolio"
            className="inline-flex items-center gap-2 text-sm mb-12 hover:opacity-70 transition underline underline-offset-4"
            style={{ color: "var(--text-secondary)" }}
          >
            ← Back to Main Portfolio
          </Link>

          <h1
            className="text-5xl md:text-6xl font-bold leading-tight mb-3 transition-colors duration-300"
            style={{
              fontFamily: "var(--font-instrument-serif)",
              color: "var(--text-primary)",
            }}
          >
            {cleanCategoryName}
          </h1>

          <p className="text-sm mb-12" style={{ color: "var(--text-secondary)" }}>
            A comprehensive archive of engineering logs, development architectures, and projects under {cleanCategoryName}.
          </p>

          <div
            className="w-full h-px mb-12"
            style={{ backgroundColor: "rgba(var(--overlay-color), 0.12)" }}
          />

          {/* Render List */}
          {filteredProjects.length === 0 ? (
            <p className="text-sm italic opacity-50" style={{ color: "var(--text-secondary)" }}>
              No production projects currently deployed in this index. Check back soon.
            </p>
          ) : (
            <div className="flex flex-col gap-12">
              {filteredProjects.map((project) => (
                <div 
                  key={project._id || project.slug}
                  className="flex flex-col sm:flex-row items-start sm:items-center gap-6 group"
                >
                  {/* Image Render */}
                  <div
                    className="w-full sm:w-44 h-28 rounded-xl flex-shrink-0 overflow-hidden border shadow-sm"
                    style={{
                      borderColor: "rgba(var(--overlay-color), 0.12)",
                      backgroundColor: "rgba(var(--overlay-color), 0.02)",
                    }}
                  >
                    {project.coverImage ? (
                      <img
                        src={project.coverImage}
                        alt={project.title}
                        className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition duration-300"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center opacity-30 text-xs">
                        No Preview Asset
                      </div>
                    )}
                  </div>

                  {/* Metadata and Link Redirection */}
                  <div className="flex-1">
                    <h2
                      className="text-2xl font-bold mb-1.5 transition duration-200 group-hover:opacity-70"
                      style={{
                        fontFamily: "var(--font-instrument-serif)",
                        color: "var(--text-primary)",
                      }}
                    >
                      {project.title}
                    </h2>
                    <p
                      className="text-sm mb-3 line-clamp-2 max-w-2xl leading-relaxed"
                      style={{ color: "var(--text-secondary)" }}
                    >
                      {project.description}
                    </p>
                    <Link
                      href={`/portfolio/${category}/${project.slug}`}
                      className="text-sm font-medium hover:opacity-70 transition underline underline-offset-4"
                      style={{ color: "var(--text-secondary)" }}
                    >
                      Explore Project Documentation →
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </main>
  );
}