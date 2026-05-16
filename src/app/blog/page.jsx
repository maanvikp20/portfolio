import Link from "next/link";
import Navbar from "@/src/components/Navbar";
import { getAllBlogs } from "@/src/controllers/blogController";

// always render page to get latest blogs
export const dynamic = "force-dynamic";

export default async function BlogIndexPage() {
  const rawBlogs = await getAllBlogs("published");
  const blogs = JSON.parse(JSON.stringify(rawBlogs));

  return (
    <main className="relative min-h-screen">
      <Navbar />

      <section className="pt-32 pb-16 px-8 md:px-16">
        <div className="max-w-4xl mx-auto">
          <h1
            className="text-5xl md:text-7xl font-bold leading-tight mb-4 transition-colors duration-300"
            style={{
              fontFamily: "var(--font-instrument-serif)",
              color: "var(--text-primary)",
            }}
          >
            Writings
          </h1>
          <div
            className="w-20 h-0.5 mb-16"
            style={{ backgroundColor: "var(--text-primary)" }}
          />

          {blogs.length === 0 ? (
            <p className="text-lg opacity-60" style={{ color: "var(--text-secondary)" }}>
              No articles published yet — check back soon.
            </p>
          ) : (
            <div className="flex flex-col gap-12">
              {blogs.map((blog) => (
                <article
                  key={blog._id}
                  className="group pb-12 border-b flex flex-col md:flex-row gap-8 items-start"
                  style={{ borderColor: "rgba(var(--overlay-color), 0.1)" }}
                >
                  {blog.coverImage && (
                    <img
                      src={blog.coverImage}
                      alt={blog.title}
                      className="w-full md:w-48 h-32 object-cover rounded-xl opacity-90 group-hover:opacity-100 transition"
                    />
                  )}
                  
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2 text-xs" style={{ color: "var(--text-secondary)" }}>
                      <span className="capitalize font-medium">{blog.category}</span>
                      {blog.publishedAt && (
                        <>
                          <span>•</span>
                          <span>
                            {new Date(blog.publishedAt).toLocaleDateString(undefined, {
                              month: "long",
                              day: "numeric",
                              year: "numeric"
                            })}
                          </span>
                        </>
                      )}
                    </div>

                    <h2
                      className="text-3xl font-bold mb-3 group-hover:opacity-70 transition"
                      style={{
                        fontFamily: "var(--font-instrument-serif)",
                        color: "var(--text-primary)",
                      }}
                    >
                      <Link href={`/blog/${blog.slug}`}>{blog.title}</Link>
                    </h2>

                    <p className="text-sm line-clamp-2 mb-4 leading-relaxed" style={{ color: "var(--text-secondary)" }}>
                      {blog.excerpt || blog.content}
                    </p>

                    <Link
                      href={`/blog/${blog.slug}`}
                      className="inline-block text-sm font-medium underline underline-offset-4 hover:opacity-70 transition"
                      style={{ color: "var(--text-primary)" }}
                    >
                      Read Article →
                    </Link>
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>
      </section>
    </main>
  );
}