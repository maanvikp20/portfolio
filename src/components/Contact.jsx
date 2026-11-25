"use client";
import { useId, useState } from "react";
import { motion } from "framer-motion";

// limits mirror the server's (src/app/api/contact/route.js)
const FIELDS = [
  {
    name: "firstName",
    label: "First Name",
    type: "text",
    autoComplete: "given-name",
    maxLength: 100,
  },
  {
    name: "lastName",
    label: "Last Name",
    type: "text",
    autoComplete: "family-name",
    maxLength: 100,
  },
  {
    name: "email",
    label: "Email Address",
    type: "email",
    autoComplete: "email",
    maxLength: 254,
  },
  {
    name: "subject",
    label: "Subject",
    type: "text",
    autoComplete: "off",
    maxLength: 150,
  },
  {
    name: "message",
    label: "Message",
    type: "textarea",
    autoComplete: "off",
    maxLength: 5000,
  },
];

const EMPTY_FORM = {
  firstName: "",
  lastName: "",
  email: "",
  subject: "",
  message: "",
};

// uses the site's theme variables, so the border and focus ring show in light and dark mode
const inputClass =
  "w-full p-4 rounded-lg text-sm bg-transparent border border-[rgba(var(--overlay-color),0.3)] " +
  "focus:border-[var(--text-primary)] focus:outline-2 focus:outline-offset-2 focus:outline-[var(--text-primary)] transition";

export default function Contact() {
  const uid = useId();
  const [formData, setFormData] = useState(EMPTY_FORM);
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

      // an error page (not JSON) shouldn't show the visitor a parse error
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        throw new Error(
          data.error || "Message could not be sent. Please try again.",
        );
      }

      setStatus({
        type: "success",
        text: "Thanks! Your message has been sent.",
      });
      setFormData(EMPTY_FORM);
    } catch (err) {
      setStatus({
        type: "error",
        // fetch() itself failing (offline, blocked) throws a TypeError
        text:
          err instanceof TypeError
            ? "Couldn't reach the server. Check your connection and try again."
            : err.message,
      });
    } finally {
      setLoading(false);
    }
  };

  const renderField = ({ name, label, type, autoComplete, maxLength }) => {
    const id = `${uid}-${name}`;
    const common = {
      id,
      name,
      required: true,
      maxLength,
      autoComplete,
      value: formData[name],
      onChange: (e) => handleInputChange(e, name),
      className: inputClass,
    };

    return (
      <div
        key={name}
        className={
          name === "firstName" || name === "lastName" ? "flex-1" : undefined
        }
      >
        <label
          htmlFor={id}
          className="block text-lg mb-1"
          style={{ fontFamily: "var(--font-instrument-serif)" }}
        >
          {label}{" "}
          {/* the input is already marked required for screen readers, so hide this from them */}
          <span className="text-sm opacity-60" aria-hidden="true">
            (required)
          </span>
        </label>
        {type === "textarea" ? (
          <textarea {...common} className={`${inputClass} h-32 resize-none`} />
        ) : (
          <input {...common} type={type} />
        )}
      </div>
    );
  };

  return (
    <motion.section
      id="contact"
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
          {/* Always in the page so screen readers announce the message when it appears */}
          <div aria-live="polite" aria-atomic="true">
            {status.text && (
              <div
                role={status.type === "error" ? "alert" : undefined}
                className={`p-4 text-sm rounded-lg border font-medium ${
                  status.type === "success"
                    ? "bg-emerald-50 border-emerald-200 text-emerald-800"
                    : "bg-rose-50 border-rose-200 text-rose-800"
                }`}
              >
                {status.text}
              </div>
            )}
          </div>

          {/* First row: first and last name (stacked on small screens) */}
          <div className="flex flex-col sm:flex-row gap-4">
            {renderField(FIELDS[0])}
            {renderField(FIELDS[1])}
          </div>

          {FIELDS.slice(2).map(renderField)}

          <button
            type="submit"
            disabled={loading}
            className="px-6 py-2.5 rounded-lg text-sm font-medium hover:opacity-80 active:scale-[0.98] transition disabled:opacity-50 disabled:pointer-events-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--text-primary)]"
            style={{
              fontFamily: "var(--font-instrument-serif)",
              // inverted theme colors: visible in both light and dark mode
              backgroundColor: "var(--text-primary)",
              color: "var(--bg-primary)",
            }}
          >
            {loading ? "Sending…" : "Send Message"}
          </button>
        </form>
      </div>
    </motion.section>
  );
}
