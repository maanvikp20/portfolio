"use client";
import { useState } from "react";
import { motion } from "framer-motion";

export default function Contact() {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    subject: "",
    message: "",
  });

  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState({ type: "", text: "" });

  const handleInputChange = (e, field) => {
    setFormData({ ...formData, [field]: e.target.value });
  };

  const handleFormSubmission = async (e) => {
    e.preventDefault();
    setLoading(true);
    setStatus({ type: "", text: "" });

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Email delivery failed.");

      setStatus({
        type: "success",
        text: "Your message has been delivered to Maanvik successfully!",
      });
      
      setFormData({ firstName: "", lastName: "", email: "", subject: "", message: "" });
    } catch (err) {
      setStatus({ type: "error", text: err.message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.section
      id = "contact"
      className="px-8 md:px-16 py-16"
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.7, ease: "easeOut" }}
    >
      <div className="flex flex-col lg:flex-row gap-8">
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

        <form onSubmit={handleFormSubmission} className="flex-1 space-y-4">
          
          {/* Status Message */}
          {status.text && (
            <div className={`p-4 text-sm rounded-lg border font-medium ${
              status.type === "success" 
                ? "bg-emerald-50 border-emerald-200 text-emerald-800" 
                : "bg-rose-50 border-rose-200 text-rose-800"
            }`}>
              {status.text}
            </div>
          )}

          {/* First Row - FName, LName */}
          <div className="flex gap-4">
            {/* First Name */}
            <div className="flex-1">
              <p
                className="text-lg mb-1"
                style={{ fontFamily: "var(--font-instrument-serif)" }}
              >
                First Name <span className="text-gray-400 text-sm">(required)</span>
              </p>
              <input
                type="text"
                required
                value={formData.firstName}
                onChange={(e) => handleInputChange(e, "firstName")}
                className="w-full p-4 border border-gray-300 rounded-lg text-sm bg-transparent focus:outline-none focus:border-black transition"
              />
            </div>
            {/* Last Name */}
            <div className="flex-1">
              <p
                className="text-lg mb-1"
                style={{ fontFamily: "var(--font-instrument-serif)" }}
              >
                Last Name <span className="text-gray-400 text-sm">(required)</span>
              </p>
              <input
                type="text"
                required
                value={formData.lastName}
                onChange={(e) => handleInputChange(e, "lastName")}
                className="w-full p-4 border border-gray-300 rounded-lg text-sm bg-transparent focus:outline-none focus:border-black transition"
              />
            </div>
          </div>

          {/* Email Address */}
          <div>
            <p
              className="text-lg mb-1"
              style={{ fontFamily: "var(--font-instrument-serif)" }}
            >
              Email Address <span className="text-gray-400 text-sm">(required)</span>
            </p>
            <input
              type="email"
              required
              value={formData.email}
              onChange={(e) => handleInputChange(e, "email")}
              className="w-full p-4 border border-gray-300 rounded-lg text-sm bg-transparent focus:outline-none focus:border-black transition"
            />
          </div>

          {/* Subject */}
          <div>
            <p
              className="text-lg mb-1"
              style={{ fontFamily: "var(--font-instrument-serif)" }}
            >
              Subject <span className="text-gray-400 text-sm">(required)</span>
            </p>
            <input
              type="text"
              required
              value={formData.subject}
              onChange={(e) => handleInputChange(e, "subject")}
              className="w-full p-4 border border-gray-300 rounded-lg text-sm bg-transparent focus:outline-none focus:border-black transition"
            />
          </div>

          {/* Message */}
          <div>
            <p
              className="text-lg mb-1"
              style={{ fontFamily: "var(--font-instrument-serif)" }}
            >
              Message <span className="text-gray-400 text-sm">(required)</span>
            </p>
            <textarea
              required
              value={formData.message}
              onChange={(e) => handleInputChange(e, "message")}
              className="w-full h-32 p-4 border border-gray-300 rounded-lg text-sm bg-transparent focus:outline-none focus:border-black transition resize-none"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="px-6 py-2.5 bg-black text-white rounded-lg text-sm font-medium hover:bg-neutral-800 active:scale-[0.98] transition disabled:opacity-50 disabled:pointer-events-none"
            style={{
              fontFamily: "var(--font-instrument-serif)",
            }}
          >
            {loading ? "Transmitting Specs..." : "Send Message"}
          </button>
        </form>
      </div>
    </motion.section>
  );
}