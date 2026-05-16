"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function AdminLoginPage() {
  const router = useRouter();
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError("");

    // network request to login route
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Login execution failed.");
      }

      // redirects to admin dash on success, triggering a fresh server-side token verification
      router.push("/admin");
      router.refresh();
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <main className="w-full min-h-screen flex items-center justify-center bg-neutral-50 px-6 font-sans">
      <div className="w-full max-w-md bg-white border border-neutral-200 p-8 rounded-2xl shadow-sm">
        <div className="mb-6">
          <h1 className="text-2xl font-bold tracking-tight text-neutral-900">Admin Gateway</h1>
          <p className="text-sm text-neutral-500 mt-1">Sign in to update your blog, projects, skills, and certs.</p>
        </div>

        {error && (
          <div className="p-3.5 mb-5 text-xs font-medium border border-rose-200 bg-rose-50 text-rose-800 rounded-xl">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-neutral-400 mb-2">Secure Email Address</label>
            <input
              type="email"
              required
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              className="w-full px-4 py-2.5 rounded-xl border border-neutral-200 text-sm focus:outline-none focus:ring-2 focus:ring-neutral-900 transition"
              placeholder="maanvik@uiuc.edu"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-neutral-400 mb-2">Password</label>
            <input
              type="password"
              required
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              className="w-full px-4 py-2.5 rounded-xl border border-neutral-200 text-sm focus:outline-none focus:ring-2 focus:ring-neutral-900 transition"
              placeholder="••••••••••••"
            />
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-full py-2.5 rounded-xl bg-neutral-900 hover:bg-neutral-800 text-white font-medium text-sm transition disabled:opacity-50 mt-2"
          >
            {submitting ? "Verifying Credentials..." : "Authenticate Session"}
          </button>
        </form>
      </div>
    </main>
  );
}