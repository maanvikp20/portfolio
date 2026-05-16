import Link from "next/link";
import { notFound } from "next/navigation";
import Navbar from "@/src/components/Navbar";
import { getBlogBySlug } from "@/src/controllers/blogController";

// always render page to get latest blog content
export const dynamic = "force-dynamic";

export default async function BlogDetailPage({ params }) {
  const { slug } = await params;
  
  let blog;
  try {
    const rawBlog = await getBlogBySlug(slug);
    blog = JSON.parse(JSON.stringify(rawBlog));
  } catch (error) {
    notFound();
  }

  return (
    <main className="relative min-h-screen">
      <Navbar />

      <section className="pt-32 pb-24 px-8 md:px-16">
        <div className="max-w-3xl mx-auto">
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 text-sm mb-12 hover:opacity-70 transition underline underline-offset-4"
            style={{ color: "var(--text-secondary)" }}
          >
            ← Back to Writings
          </Link>

          <div className="flex items-center gap-3 mb-4 text-sm" style={{ color: "var(--text-secondary)" }}>
            <span className="font-medium capitalize px-2.5 py-0.5 rounded-full text-xs" style={{ backgroundColor: "rgba(var(--overlay-color), 0.06)" }}>
              {blog.category}
            </span>
            {blog.publishedAt && (
              <span>
                {new Date(blog.publishedAt).toLocaleDateString(undefined, {
                  month: "long",
                  day: "numeric",
                  year: "numeric"
                })}
              </span>
            )}
          </div>

          <h1
            className="text-4xl md:text-6xl font-bold leading-tight mb-6"
            style={{
              fontFamily: "var(--font-instrument-serif)",
              color: "var(--text-primary)",
            }}
          >
            {blog.title}
          </h1>

          {blog.author && (
            <p className="text-sm mb-8 italic" style={{ color: "var(--text-secondary)" }}>
              By {blog.author.name}
            </p>
          )}

          {blog.coverImage && (
            <img
              src={blog.coverImage}
              alt={blog.title}
              className="w-full h-96 object-cover rounded-2xl mb-10 shadow-sm"
            />
          )}

          {/* Render layout text content blocks */}
          <div 
            className="prose prose-neutral max-w-none text-base md:text-lg leading-relaxed whitespace-pre-line"
            style={{ color: "var(--text-primary)" }}
          >
            {blog.content}
          </div>

          {blog.tags?.length > 0 && (
            <div className="mt-16 pt-8 border-t flex flex-wrap gap-2" style={{ borderColor: "rgba(var(--overlay-color), 0.1)" }}>
              {blog.tags.map((tag) => (
                <span
                  key={tag}
                  className="text-xs px-3 py-1 rounded-md"
                  style={{
                    backgroundColor: "rgba(var(--overlay-color), 0.05)",
                    color: "var(--text-secondary)",
                  }}
                >
                  #{tag}
                </span>
              ))}
            </div>
          )}
        </div>
      </section>
    </main>
  );
}