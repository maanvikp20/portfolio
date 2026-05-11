"use client";
import { motion } from "framer-motion";

export default function Contact() {
  return (
    <motion.section
      className="px-8 md:px-16 py-16"
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.7, ease: "easeOut" }}
    >
      <div className="flex gap-4">
        <div className="flex-1">
          <h2
            className="text-5xl md:text-7xl font-bold leading-tight transition-colors duration-300"
            style={{
              fontFamily: "var(--font-instrument-serif)",
            }}
          >
            Want To Connect,
            <br />
            Get In Touch
          </h2>
        </div>

        <form className="flex-1">
          {/* First Row - FName, LName */}
          <div className="flex gap-4 mb-4">
            {/* First Name */}
            <div className="flex-1 ">
              <p
                className="text-lg"
                style={{ fontFamily: "var(--font-instrument-serif)" }}
              >
                First Name{" "}
                <span className="text-gray-400 text-sm">(required)</span>
              </p>
              <input
                type="text"
                className="w-full p-4 border border-gray-300 rounded-lg"
              />
            </div>
            {/* Last Name */}
            <div className="flex-1">
              <p
                className="text-lg"
                style={{ fontFamily: "var(--font-instrument-serif)" }}
              >
                Last Name{" "}
                <span className="text-gray-400 text-sm">(required)</span>
              </p>
              <input
                type="text"
                className="w-full p-4 border border-gray-300 rounded-lg"
              />
            </div>
          </div>

          {/* Email Address */}
          <div className="mb-4">
            <p
              className="text-lg"
              style={{ fontFamily: "var(--font-instrument-serif)" }}
            >
              Email Address{" "}
              <span className="text-gray-400 text-sm">(required)</span>
            </p>
            <input
              type="email"
              className="w-full p-4 border border-gray-300 rounded-lg"
            />
          </div>

          {/* Subject */}
          <div className="mb-4">
            <p
              className="text-lg"
              style={{ fontFamily: "var(--font-instrument-serif)" }}
            >
              Subject <span className="text-gray-400 text-sm">(required)</span>
            </p>
            <input
              type="text"
              className="w-full p-4 border border-gray-300 rounded-lg"
            />
          </div>

          {/* Message */}
          <div>
            <p
              className="text-lg"
              style={{ fontFamily: "var(--font-instrument-serif)" }}
            >
              Message <span className="text-gray-400 text-sm">(required)</span>
            </p>
            <textarea className="w-full h-32 p-4 border border-gray-300 rounded-lg" />
          </div>

          <button
            type="submit"
            className="mt-4 px-6 py-2 bg-black text-white rounded-lg"
            style={{
              fontFamily: "var(--font-instrument-serif)",
            }}
          >
            Send Message
          </button>
        </form>
      </div>
    </motion.section>
  );
}