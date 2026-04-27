"use client";
import { motion } from "framer-motion";
import Navbar from "../../../components/Navbar";
import Contact from "../../../components/Contact"

export default function page() {
  return (
    <main className="relative min-h-screen overflow-hidden">
      <Navbar />
      {/* Header */}
      <section className="text-center py-24 px-8">
        <motion.h1
          className="text-5xl md:text-7xl font-bold leading-tight transition-colors duration-300"
          style={{
            fontFamily: "var(--font-instrument-serif)",
            color: "#000000",
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
        className="max-w-6xl mx-auto py-20 px-8"
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.7, ease: "easeOut" }}
      >
        <div className="flex flex-col md:flex-row items-center gap-20">
          {/* Text */}
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
              intersection of hardware and software. I'm always looking for new
              opportunities to learn and grow — whether that's through personal
              projects, exploring new technologies, or spending time with
              friends and family.
            </p>
          </div>

          {/* Picture */}
          <div className="md:w-2/5 flex justify-center">
            <img
              src="/profile.jpeg"
              alt="Maanvik"
              className="w-72 h-72 object-cover rounded-2xl"
              style={{ border: "2px solid var(--text-primary)" }}
            />
          </div>
        </div>
      </motion.section>

      {/* Electronics Projects */}
      <section
        className="px-8 md:px-16 py-16 border-t"
        style={{ borderColor: "var(--text-secondary)" }}
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.7, ease: "easeOut" }}
      >
        <div className="flex flex-col md:flex-row gap-16">
          {/* Label */}
          <div className="md:w-1/3">
            <a
              href="/portfolio/electronics"
              className="text-4xl md:text-5xl font-bold leading-tight pb-4 underline underline-offset-4 hover:opacity-70 transition"
              style={{
                fontFamily: "var(--font-instrument-serif)",
                color: "var(--text-primary)",
              }}
            >
              Electronics
              <br />
              Projects
            </a>
          </div>

          {/* Projects */}
          <div className="md:w-2/3 flex flex-col gap-10">
            {[
              { title: "Project One", href: "#" },
              { title: "Project Two", href: "#" },
              { title: "Project Three", href: "#" },
            ].map((project, i) => (
              <motion.div
                key={project.title}
                initial={{ opacity: 0, x: 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1, ease: "easeOut" }}
                className="flex items-center gap-6"
              >
                <div
                  className="w-36 h-24 rounded-lg flex-shrink-0 bg-white/10"
                  style={{ border: "1px solid var(--text-secondary)" }}
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
                  <a
                    href={project.href}
                    className="text-sm hover:opacity-70 transition underline underline-offset-4"
                    style={{ color: "var(--text-secondary)" }}
                  >
                    Read More →
                  </a>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Software Projects */}
      <section
        className="px-8 md:px-16 py-16 border-t"
        style={{ borderColor: "var(--text-secondary)" }}
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.7, ease: "easeOut" }}
      >
        <div className="flex flex-col md:flex-row gap-16">
          {/* Label */}
          <div className="md:w-1/3">
            <a
              href="/portfolio/software"
              className="text-4xl md:text-5xl font-bold leading-tight pb-4 underline underline-offset-4 hover:opacity-70 transition"
              style={{
                fontFamily: "var(--font-instrument-serif)",
                color: "var(--text-primary)",
              }}
            >
              Software
              <br />
              Projects
            </a>
          </div>

          {/* Projects */}
          <div className="md:w-2/3 flex flex-col gap-10">
            {[
              { title: "Project One", href: "#" },
              { title: "Project Two", href: "#" },
              { title: "Project Three", href: "#" },
            ].map((project, i) => (
              <motion.div
                key={project.title}
                initial={{ opacity: 0, x: 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1, ease: "easeOut" }}
                className="flex items-center gap-6"
              >
                <div
                  className="w-36 h-24 rounded-lg flex-shrink-0 bg-white/10"
                  style={{ border: "1px solid var(--text-secondary)" }}
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
                  <a
                    href={project.href}
                    className="text-sm hover:opacity-70 transition underline underline-offset-4"
                    style={{ color: "var(--text-secondary)" }}
                  >
                    Read More →
                  </a>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Calculator Games */}
      <section
        className="px-8 md:px-16 py-16 border-t"
        style={{ borderColor: "var(--text-secondary)" }}
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.7, ease: "easeOut" }}
      >
        <div className="flex flex-col md:flex-row gap-16">
          {/* Label */}
          <div className="md:w-1/3">
            <a
              href="/portfolio/calculator-games"
              className="text-4xl md:text-5xl font-bold leading-tight pb-4 underline underline-offset-4 hover:opacity-70 transition"
              style={{
                fontFamily: "var(--font-instrument-serif)",
                color: "var(--text-primary)",
              }}
            >
              Calculator
              <br />
              Games
            </a>
          </div>

          {/* Projects */}
          <div className="md:w-2/3 flex flex-col gap-10">
            {[
              { title: "Project One", href: "#" },
              { title: "Project Two", href: "#" },
              { title: "Project Three", href: "#" },
            ].map((project, i) => (
              <motion.div
                key={project.title}
                initial={{ opacity: 0, x: 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1, ease: "easeOut" }}
                className="flex items-center gap-6"
              >
                <div
                  className="w-36 h-24 rounded-lg flex-shrink-0 bg-white/10"
                  style={{ border: "1px solid var(--text-secondary)" }}
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
                  <a
                    href={project.href}
                    className="text-sm hover:opacity-70 transition underline underline-offset-4"
                    style={{ color: "var(--text-secondary)" }}
                  >
                    Read More →
                  </a>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Resume and Experiences */}

      {/* Skills */}

      {/* Contact */}
      {<Contact />}
    </main>
  );
}