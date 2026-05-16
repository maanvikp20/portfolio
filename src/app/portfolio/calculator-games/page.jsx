import Link from "next/link";
import Navbar from "@/src/components/Navbar";
import { getAllProjects } from "@/src/controllers/projectController";

export const dynamic = "force-dynamic";

export default async function SoftwarePortfolioPage() {
  const projects = await getAllProjects();

  const calculatorGamesProjects = projects.filter(
    (p) => p.category === "calculator-games",
  );

  return (
    <main className="relative min-h-screen">
      <Navbar />

      <section className="pt-32 pb-16 px-8 md:px-16">
        <div className="max-w-6xl mx-auto">
          <h1
            className="text-5xl md:text-7xl font-bold leading-tight mb-4 transition-colors duration-300"
            style={{
              fontFamily: "var(--font-instrument-serif)",
              color: "var(--text-primary)",
            }}
          >
            Calculator Games
            <br />
            Projects
          </h1>
          <div
            className="w-20 h-0.5 mb-12"
            style={{ backgroundColor: "var(--text-primary)" }}
          />

          {calculatorGamesProjects.length === 0 ? (
            <p
              className="text-lg opacity-60"
              style={{ color: "var(--text-secondary)" }}
            >
              No projects yet — check back soon.
            </p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {calculatorGamesProjects.map((project) => (
                <div
                  key={project._id}
                  className="rounded-2xl p-6 transition-all duration-300 hover:scale-[1.02]"
                  style={{
                    border: "1px solid rgba(var(--overlay-color), 0.15)",
                    backgroundColor: "rgba(var(--overlay-color), 0.03)",
                  }}
                >
                  <div className="mb-4">
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

                  <h2
                    className="text-2xl font-bold mb-3"
                    style={{
                      fontFamily: "var(--font-instrument-serif)",
                      color: "var(--text-primary)",
                    }}
                  >
                    {project.title}
                  </h2>

                  <p
                    className="mb-6 line-clamp-3 text-sm leading-relaxed"
                    style={{ color: "var(--text-secondary)" }}
                  >
                    {project.description}
                  </p>

                  {project.technologies?.length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-6">
                      {project.technologies.map((tech) => (
                        <span
                          key={tech}
                          className="text-xs px-2 py-1 rounded-md"
                          style={{
                            backgroundColor: "rgba(var(--overlay-color), 0.06)",
                            color: "var(--text-secondary)",
                          }}
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                  )}

                  <Link
                    href={`/portfolio/calculator-games/${project.slug}`}
                    className="inline-block text-sm font-medium underline underline-offset-4 hover:opacity-70 transition"
                    style={{ color: "var(--text-primary)" }}
                  >
                    View Details →
                  </Link>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </main>
  );
}
