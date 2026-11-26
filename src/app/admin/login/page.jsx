"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import DarkModeToggle from "@/src/components/ui/DarkModeToggle";

// colours come from the site theme, so this page follows light/dark like the rest
const inputStyle = {
  backgroundColor: "transparent",
  color: "var(--text-primary)",
  border: "1px solid rgba(var(--overlay-color), 0.3)",
};

export default function AdminLoginPage() {
  const router = useRouter();
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError("");

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        throw new Error(data.error || "Login failed. Please try again.");
      }

      router.push("/admin");
      router.refresh();
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <main
      className="relative w-full min-h-screen flex items-center justify-center px-6 font-sans"
      style={{
        backgroundColor: "var(--bg-primary)",
        color: "var(--text-primary)",
      }}
    >
      <Link
        href="/"
        className="absolute top-6 left-6 flex items-center gap-2 text-xs font-medium hover:opacity-70 transition group"
        style={{ color: "var(--text-secondary)" }}
      >
        <span className="transform group-hover:-translate-x-0.5 transition-transform">
          ←
        </span>
        Back to Portfolio
      </Link>

      <div className="absolute top-4 right-6">
        <DarkModeToggle />
      </div>

      <div
        className="w-full max-w-md p-8 rounded-2xl shadow-sm"
        style={{
          backgroundColor: "var(--bg-secondary)",
          border: "1px solid rgba(var(--overlay-color), 0.15)",
        }}
      >
        <div className="mb-6">
          <h1 className="text-2xl font-bold tracking-tight">Admin login</h1>
          <p
            className="text-sm mt-1"
            style={{ color: "var(--text-secondary)" }}
          >
            Sign in to update your blog, projects, skills, and certifications.
          </p>
        </div>

        {/* announced to screen readers when it appears */}
        <div aria-live="polite">
          {error && (
            <div
              role="alert"
              className="p-3.5 mb-5 text-sm font-medium rounded-xl"
              style={{
                border: "1px solid #b91c1c",
                color: "var(--text-primary)",
                backgroundColor: "rgba(185, 28, 28, 0.12)",
              }}
            >
              {error}
            </div>
          )}
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label
              htmlFor="admin-email"
              className="block text-xs font-bold uppercase tracking-wider mb-2"
              style={{ color: "var(--text-secondary)" }}
            >
              Email
            </label>
            <input
              id="admin-email"
              name="email"
              type="email"
              required
              autoComplete="username"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              className="w-full px-4 py-2.5 rounded-xl text-sm focus:outline-2 focus:outline-offset-2 focus:outline-[var(--text-primary)]"
              style={inputStyle}
              placeholder="you@example.com"
            />
          </div>

          <div>
            <label
              htmlFor="admin-password"
              className="block text-xs font-bold uppercase tracking-wider mb-2"
              style={{ color: "var(--text-secondary)" }}
            >
              Password
            </label>
            <input
              id="admin-password"
              name="password"
              type="password"
              required
              autoComplete="current-password"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              className="w-full px-4 py-2.5 rounded-xl text-sm focus:outline-2 focus:outline-offset-2 focus:outline-[var(--text-primary)]"
              style={inputStyle}
            />
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-full py-2.5 rounded-xl font-medium text-sm transition hover:opacity-85 disabled:opacity-60 mt-2"
            style={{
              backgroundColor: "var(--text-primary)",
              color: "var(--bg-primary)",
            }}
          >
            {submitting ? "Signing in…" : "Sign in"}
          </button>
        </form>
      </div>
    </main>
  );
}
