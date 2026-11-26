import Link from "next/link";
import { notFound } from "next/navigation";
import Navbar from "@/src/components/Navbar";
import Markdown from "@/src/components/Markdown";
import { getPublicProject } from "@/src/lib/publicData";
import { buildMetadata } from "@/src/lib/seo";
import { optimizeImage } from "@/src/lib/images";

export const dynamic = "force-dynamic";

const STATUS_LABELS = {
  completed: "Completed",
  "in-progress": "In progress",
  planned: "Planned",
};

// only http(s) links are ever rendered as hrefs
const isSafeUrl = (url) => typeof url === "string" && /^https?:\/\//i.test(url);

export async function generateMetadata({ params }) {
  const { category, slug } = await params;
  try {
    const project = await getPublicProject(category, slug);
    if (!project)
      return { title: "Project not found", robots: { index: false } };
    return buildMetadata({
      title: project.title,
      description: project.description,
      path: `/portfolio/${category}/${slug}`,
      image: project.coverImage || undefined,
    });
  } catch {
    return { title: "Project not found", robots: { index: false } };
  }
}

export default async function ProjectDetailPage({ params }) {
  // Extract url segments
  const { category, slug } = await params;

  const project = await getPublicProject(category, slug);

  if (!project) notFound();

  // Generate display titles
  const cleanCategoryName = category
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
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
              {STATUS_LABELS[project.status] || STATUS_LABELS.completed}
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
                src={optimizeImage(project.coverImage, 1400)}
                decoding="async"
                alt=""
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

          {(isSafeUrl(project.repoLink) || isSafeUrl(project.liveLink)) && (
            <div className="flex flex-wrap gap-4 mb-12">
              {isSafeUrl(project.repoLink) && (
                <a
                  href={project.repoLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm font-medium px-5 py-2.5 rounded-xl hover:opacity-70 transition"
                  style={{
                    border: "1px solid rgba(var(--overlay-color), 0.25)",
                    color: "var(--text-primary)",
                  }}
                >
                  View source →
                </a>
              )}
              {isSafeUrl(project.liveLink) && (
                <a
                  href={project.liveLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm font-medium px-5 py-2.5 rounded-xl hover:opacity-70 transition"
                  style={{
                    border: "1px solid rgba(var(--overlay-color), 0.25)",
                    color: "var(--text-primary)",
                  }}
                >
                  Live demo →
                </a>
              )}
            </div>
          )}

          {project.content && (
            <div className="mb-12">
              <Markdown>{project.content}</Markdown>
            </div>
          )}

          {project.tags?.length > 0 && (
            <div>
              <h2
                className="text-sm font-medium uppercase tracking-widest mb-4 opacity-80"
                style={{ color: "var(--text-primary)" }}
              >
                Technologies
              </h2>
              <div className="flex flex-wrap gap-3">
                {project.tags.map((tech) => (
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
