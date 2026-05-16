"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import Navbar from "../../components/Navbar";
import Contact from "../../components/Contact";

// Reusable card for blog posts on the homepage
function BlogCard({ blog, index }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.05, ease: "easeOut" }}
      className="w-80 md:w-96 flex-shrink-0 rounded-2xl p-6 flex flex-col justify-between group transition-all duration-300 hover:scale-[1.01]"
      style={{
        border: "1px solid rgba(var(--overlay-color), 0.12)",
        backgroundColor: "rgba(var(--overlay-color), 0.02)",
      }}
    >
      <div>
        {blog.coverImage && (
          <img
            src={blog.coverImage}
            alt={blog.title}
            className="w-full h-44 object-cover rounded-xl mb-4 opacity-90 group-hover:opacity-100 transition"
          />
        )}
        <div className="flex items-center gap-3 mb-2">
          <span
            className="text-xs font-medium px-2.5 py-0.5 rounded-full capitalize"
            style={{
              backgroundColor: "rgba(var(--overlay-color), 0.06)",
              color: "var(--text-secondary)",
            }}
          >
            {blog.category || "General"}
          </span>
          {blog.publishedAt && (
            <span
              className="text-xs opacity-50"
              style={{ color: "var(--text-secondary)" }}
            >
              {new Date(blog.publishedAt).toLocaleDateString(undefined, {
                month: "short",
                day: "numeric",
                year: "numeric",
              })}
            </span>
          )}
        </div>
        <h3
          className="text-2xl font-bold mb-2 line-clamp-2 leading-tight"
          style={{
            fontFamily: "var(--font-instrument-serif)",
            color: "var(--text-primary)",
          }}
        >
          {blog.title}
        </h3>
        <p
          className="text-sm line-clamp-3 mb-6"
          style={{ color: "var(--text-secondary)" }}
        >
          {blog.excerpt || blog.content}
        </p>
      </div>

      <Link
        href={`/blog/${blog.slug}`}
        className="text-sm font-medium underline underline-offset-4 hover:opacity-70 transition block mt-auto"
        style={{ color: "var(--text-primary)" }}
      >
        Read Article →
      </Link>
    </motion.div>
  );
}

// Reusable row for projects in the project sections
function ProjectRow({ project, index, category }) {
  return (
    <motion.div
      initial={{ opacity: 0, x: 30 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.1, ease: "easeOut" }}
      className="flex items-center gap-6"
    >
      <div
        className="w-36 h-24 rounded-lg flex-shrink-0 hidden sm:block"
        style={{
          border: "1px solid rgba(var(--overlay-color), 0.15)",
          backgroundColor: "rgba(var(--overlay-color), 0.04)",
        }}
      />
      <div>
        <p
          className="text-xl font-bold mb-1"
          style={{
            fontFamily: "var(--font-instrument-serif)",
            color: "var(--text-primary)",
          }}
        >
          {project.title}
        </p>
        <p
          className="text-sm mb-2 line-clamp-2"
          style={{ color: "var(--text-secondary)" }}
        >
          {project.description}
        </p>
        <Link
          href={`/portfolio/${category}/${project.slug}`}
          className="text-sm hover:opacity-70 transition underline underline-offset-4"
          style={{ color: "var(--text-secondary)" }}
        >
          Read More →
        </Link>
      </div>
    </motion.div>
  );
}

// Reusable section for each project category
function ProjectSection({ title, href, category, projects }) {
  return (
    <motion.section
      className="px-8 md:px-16 py-16 border-t"
      style={{ borderColor: "rgba(var(--overlay-color), 0.15)" }}
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.7, ease: "easeOut" }}
    >
      <div className="flex flex-col md:flex-row gap-16">
        <div className="md:w-1/3">
          <Link
            href={href}
            className="text-4xl md:text-5xl font-bold leading-none pb-4 underline underline-offset-4 hover:opacity-70 transition block whitespace-pre-line"
            style={{
              fontFamily: "var(--font-instrument-serif)",
              color: "var(--text-primary)",
            }}
          >
            {title}
          </Link>
        </div>

        <div className="md:w-2/3 flex flex-col gap-10">
          {projects.length === 0 ? (
            <p
              className="text-sm opacity-50"
              style={{ color: "var(--text-secondary)" }}
            >
              No projects yet — check back soon.
            </p>
          ) : (
            projects.map((project, i) => (
              <ProjectRow
                key={project._id || project.slug}
                project={project}
                index={i}
                category={category}
              />
            ))
          )}
        </div>
      </div>
    </motion.section>
  );
}

// Main portfolio page that combines everything together
export default function PortfolioClient({
  electronics = [],
  software = [],
  calculatorGames = [],
  blogs = [],
  skills = [],
  certifications = [],
}) {
  return (
    <main className="relative min-h-screen overflow-hidden">
      <Navbar />

      {/* Header */}
      <section className="text-center pt-32 pb-20 px-8">
        <motion.h1
          className="text-5xl md:text-7xl font-bold leading-tight transition-colors duration-300"
          style={{
            fontFamily: "var(--font-instrument-serif)",
            color: "var(--text-primary)",
          }}
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          Hi there! I'm an Electrical
          <br />
          Engineer and Developer!
        </motion.h1>
      </section>

      {/* About Me */}
      <motion.section
        id="about"
        className="max-w-6xl mx-auto pb-24 px-8 scroll-mt-[72px]"
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.7, ease: "easeOut" }}
      >
        <div className="flex flex-col md:flex-row items-center gap-12 md:gap-20">
          <div className="md:w-3/5 flex flex-col gap-6">
            <h2
              className="text-4xl md:text-5xl font-bold"
              style={{
                fontFamily: "var(--font-instrument-serif)",
                color: "var(--text-primary)",
              }}
            >
              About Me
            </h2>
            <div
              className="w-20 h-0.5"
              style={{ backgroundColor: "var(--text-primary)" }}
            />
            <p
              className="text-xl md:text-2xl leading-relaxed"
              style={{
                fontFamily: "var(--font-instrument-serif)",
                color: "var(--text-secondary)",
              }}
            >
              Hey there, I'm{" "}
              <span style={{ color: "var(--text-primary)", fontWeight: 600 }}>
                Maanvik
              </span>
              ! I'm an electrical engineering student at the University of
              Illinois Urbana-Champaign, passionate about building at the
              intersection of hardware and software.
            </p>
          </div>

          <div className="md:w-2/5 flex justify-center">
            <img
              src="/profile.jpeg"
              alt="Maanvik"
              className="w-72 h-72 object-cover rounded-2xl shadow-sm"
              style={{ border: "1px solid rgba(var(--overlay-color), 0.25)" }}
            />
          </div>
        </div>
      </motion.section>

      {/* Horizontal Blog Scroll */}
      <motion.section
        className="py-16 border-t"
        style={{ borderColor: "rgba(var(--overlay-color), 0.15)" }}
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.7, ease: "easeOut" }}
      >
        <div className="px-8 md:px-16 mb-8 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <h2
              className="text-4xl md:text-5xl font-bold leading-none mb-3"
              style={{
                fontFamily: "var(--font-instrument-serif)",
                color: "var(--text-primary)",
              }}
            >
              Latest Writings
            </h2>
            <p className="text-sm" style={{ color: "var(--text-secondary)" }}>
              Thoughts on hardware engineering, embedded firmware architectural
              pipelines, and design.
            </p>
          </div>
          <Link
            href="/blog"
            className="text-sm font-medium underline underline-offset-4 hover:opacity-70 transition flex-shrink-0"
            style={{ color: "var(--text-primary)" }}
          >
            See All Articles →
          </Link>
        </div>

        <div className="w-full overflow-x-auto pb-6 px-8 md:px-16 flex gap-6 scrollbar-thin scrollbar-thumb-neutral-200">
          {blogs.length === 0 ? (
            <p
              className="text-sm opacity-50 py-4"
              style={{ color: "var(--text-secondary)" }}
            >
              No articles published yet.
            </p>
          ) : (
            blogs.map((blog, idx) => (
              <BlogCard key={blog._id || blog.slug} blog={blog} index={idx} />
            ))
          )}
        </div>
      </motion.section>

      {/* Projects */}
      <ProjectSection
        title={"Electronics\nProjects"}
        href="/portfolio/electronics"
        category="electronics"
        projects={electronics}
      />

      <ProjectSection
        title={"Software\nProjects"}
        href="/portfolio/software"
        category="software"
        projects={software}
      />

      <ProjectSection
        title={"Calculator\nGames"}
        href="/portfolio/calculator-games"
        category="calculator-games"
        projects={calculatorGames}
      />

      {/* Skills & Certifications */}
      <motion.section
        id="skills"
        className="px-8 md:px-16 py-20 border-t scroll-mt-[72px]"
        style={{ borderColor: "rgba(var(--overlay-color), 0.15)" }}
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.7, ease: "easeOut" }}
      >
        <div className="flex flex-col lg:flex-row gap-16">
          <div className="lg:w-1/4">
            <h2
              className="text-4xl md:text-5xl font-bold leading-none sticky top-32"
              style={{
                fontFamily: "var(--font-instrument-serif)",
                color: "var(--text-primary)",
              }}
            >
              Qualifications
              <br />& Tools
            </h2>
          </div>

          <div className="lg:w-3/4 grid grid-col-1 md:grid-cols-2 gap-12 lg:gap-16">
            {/* Skills */}
            <div>
              <h3
                className="text-xs uppercase tracking-widest font-bold mb-6 opacity-60"
                style={{ color: "var(--text-secondary)" }}
              >
                Core Engineering Competencies
              </h3>

              <div className="flex flex-col gap-6">
                {skills.length === 0
                  ? [
                      { name: "Embedded C", percent: 90 },
                      { name: "KiCAD PCB Architecture", percent: 85 },
                      { name: "Verilog / HDL Hardware Layouts", percent: 75 },
                      { name: "Next.js & Frontend Tooling", percent: 80 },
                      { name: "Python Engineering Scripts", percent: 85 },
                    ].map((skill, idx) => (
                      <div key={idx} className="w-full">
                        <div className="flex justify-between items-center mb-1.5 text-sm">
                          <span
                            className="font-semibold"
                            style={{ color: "var(--text-primary)" }}
                          >
                            {skill.name}
                          </span>
                          <span style={{ color: "var(--text-secondary)" }}>
                            {skill.percent}%
                          </span>
                        </div>
                        <div
                          className="w-full h-1.5 rounded-full"
                          style={{
                            backgroundColor: "rgba(var(--overlay-color), 0.06)",
                          }}
                        >
                          <div
                            className="h-full rounded-full transition-all duration-500"
                            style={{
                              width: `${skill.percent}%`,
                              backgroundColor: "var(--text-primary)",
                            }}
                          />
                        </div>
                      </div>
                    ))
                  : skills.map((skill, index) => (
                      <div key={skill._id || index} className="w-full">
                        <div className="flex justify-between items-center mb-1.5 text-sm">
                          <span
                            className="font-semibold"
                            style={{ color: "var(--text-primary)" }}
                          >
                            {skill.name}
                          </span>
                          <span style={{ color: "var(--text-secondary)" }}>
                            {skill.percent || 0}%
                          </span>
                        </div>
                        <div
                          className="w-full h-1.5 rounded-full"
                          style={{
                            backgroundColor: "rgba(var(--overlay-color), 0.06)",
                          }}
                        >
                          <motion.div
                            initial={{ width: 0 }}
                            whileInView={{ width: `${skill.percent || 0}%` }}
                            viewport={{ once: true }}
                            transition={{
                              duration: 0.8,
                              delay: index * 0.05,
                              ease: "easeOut",
                            }}
                            className="h-full rounded-full"
                            style={{ backgroundColor: "var(--text-primary)" }}
                          />
                        </div>
                      </div>
                    ))}
              </div>
            </div>

            {/* Certifications */}
            <div id="certifications" className="scroll-mt-[72px]">
              <h3
                className="text-xs uppercase tracking-widest font-bold mb-6 opacity-60"
                style={{ color: "var(--text-secondary)" }}
              >
                Verified Certifications
              </h3>

              <div className="flex flex-col gap-4">
                {certifications.length === 0 ? (
                  <p
                    className="text-sm italic opacity-50"
                    style={{ color: "var(--text-secondary)" }}
                  >
                    No certifications uploaded yet — update via the admin
                    control panel.
                  </p>
                ) : (
                  certifications.map((cert, index) => (
                    <motion.div
                      initial={{ opacity: 0, x: 20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.4, delay: index * 0.05 }}
                      key={cert._id || index}
                      className="p-4 rounded-xl flex flex-col justify-between group border transition"
                      style={{
                        borderColor: "rgba(var(--overlay-color), 0.08)",
                        backgroundColor: "rgba(var(--overlay-color), 0.01)",
                      }}
                    >
                      <div>
                        <h4
                          className="text-base font-bold leading-snug group-hover:opacity-70 transition"
                          style={{ color: "var(--text-primary)" }}
                        >
                          {cert.title}
                        </h4>
                        <p
                          className="text-xs mt-1"
                          style={{ color: "var(--text-secondary)" }}
                        >
                          Issuer:{" "}
                          <span className="font-medium">{cert.issuer}</span>{" "}
                          {cert.date && `• ${cert.date}`}
                        </p>
                      </div>
                      {cert.link && (
                        <a
                          href={cert.link}
                          target="_blank"
                          rel="noreferrer"
                          className="text-xs underline underline-offset-2 mt-3 block hover:opacity-70 transition font-medium"
                          style={{ color: "var(--text-primary)" }}
                        >
                          Verify Credential →
                        </a>
                      )}
                    </motion.div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      </motion.section>

      {/* Contact */}
      <Contact />
    </main>
  );
}