"use client";

import { useState } from "react";

export default function PostForm({ type = "blog", onSaveSuccess }) {
  // single object holding values for every single input field
  const [form, setForm] = useState({
    title: "",
    slug: "",
    content: "",
    excerpt: "",
    description: "",
    category: "software",
    status: "published",
    repoLink: "",
    liveLink: "",
    coverImage: "",
    tagsString: "",
  });

  // tracking loading states for the ui spinners and buttons
  const [uploadingImage, setUploadingImage] = useState(false);
  const [submittingForm, setSubmittingForm] = useState(false);

  // stores success or error messages to show the user
  const [statusMessage, setStatusMessage] = useState({
    text: "",
    isError: false,
  });

  // handler that matches input name attributes with state keys
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  // handles sending files to cloudinary right when selected
  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploadingImage(true);
    setStatusMessage({ text: "", isError: false });

    // bundle the file into raw form data format for backends
    const formData = new FormData();
    formData.append("file", file);

    try {
      // post file data to our local upload api router
      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "failed uploading image");

      // save the returned cloudinary secure url into our state
      setForm((prev) => ({ ...prev, coverImage: data.url }));
      setStatusMessage({
        text: "Image uploaded and bound successfully!",
        isError: false,
      });
    } catch (err) {
      setStatusMessage({ text: err.message, isError: true });
    } finally {
      setUploadingImage(false);
    }
  };

  // sends the finished data payload to mongo
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmittingForm(true);
    setStatusMessage({ text: "", isError: false });

    // choose backend route based on whether this is a blog or a project
    const endpoint = type === "blog" ? "/api/blogs" : "/api/projects";

    // duplicate form state so we can safely mutate it before sending
    const payload = { ...form };

    // if it is a project turn the tag string into a clean array of items
    if (type === "project") {
      payload.tags = form.tagsString
        .split(",")
        .map((tag) => tag.trim())
        .filter((tag) => tag.length > 0);
    }

    try {
      // commit payload data to database via api route
      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "database commit failed");

      setStatusMessage({
        text: `Successfully published new ${type}!`,
        isError: false,
      });

      // trigger dashboard refresh if parent provided a callback function
      if (onSaveSuccess) onSaveSuccess(data.data);

      // wipe all inputs back to empty defaults upon success
      setForm({
        title: "",
        slug: "",
        content: "",
        excerpt: "",
        description: "",
        category: "software",
        status: "published",
        repoLink: "",
        liveLink: "",
        coverImage: "",
        tagsString: "",
      });
    } catch (err) {
      setStatusMessage({ text: err.message, isError: true });
    } finally {
      setSubmittingForm(false);
    }
  };

  return (
    <div className="w-full max-w-3xl bg-white border border-neutral-200 rounded-2xl p-6 shadow-sm font-sans text-neutral-900">
      <div className="mb-6">
        <h2 className="text-xl font-bold capitalize">Create New {type}</h2>
        <p className="text-xs text-neutral-500 mt-1">
          Populate details and attach assets to update public runtime layers.
        </p>
      </div>

      {/* conditionally render banner alert if a status message exists */}
      {statusMessage.text && (
        <div
          className={`p-4 mb-6 rounded-xl text-xs font-semibold border ${
            statusMessage.isError
              ? "bg-rose-50 border-rose-200 text-rose-800"
              : "bg-emerald-50 border-emerald-200 text-emerald-800"
          }`}
        >
          {statusMessage.text}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* main text fields mapping value and onchange directly to form state */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-neutral-400 mb-2">
              Document Title
            </label>
            <input
              type="text"
              name="title"
              required
              value={form.title}
              onChange={handleChange}
              className="w-full px-4 py-2.5 rounded-xl border border-neutral-200 text-sm focus:outline-none focus:ring-2 focus:ring-neutral-900 transition"
              placeholder={
                type === "blog"
                  ? "Analyzing Embedded Architectures"
                  : "Custom OS Engine Core"
              }
            />
          </div>
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-neutral-400 mb-2">
              Custom URL Slug (Optional)
            </label>
            <input
              type="text"
              name="slug"
              value={form.slug}
              onChange={handleChange}
              className="w-full px-4 py-2.5 rounded-xl border border-neutral-200 text-sm focus:outline-none focus:ring-2 focus:ring-neutral-900 transition"
              placeholder="auto-generated-if-left-blank"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-neutral-400 mb-2">
              Primary Category Target
            </label>
            <select
              name="category"
              value={form.category}
              onChange={handleChange}
              className="w-full px-4 py-2.5 rounded-xl border border-neutral-200 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-neutral-900 transition"
            >
              <option value="software">Software Engineering</option>
              <option value="electronics">Electrical & Electronics</option>
              <option value="calculator-games">Calculator Games</option>
            </select>
          </div>

          {/* dynamic conditional rendering: shows publication state for blogs, tags input for projects */}
          {type === "blog" ? (
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-neutral-400 mb-2">
                Publication Visibility Status
              </label>
              <select
                name="status"
                value={form.status}
                onChange={handleChange}
                className="w-full px-4 py-2.5 rounded-xl border border-neutral-200 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-neutral-900 transition"
              >
                <option value="published">Immediate Release (Published)</option>
                <option value="draft">Save to Workspace (Draft)</option>
              </select>
            </div>
          ) : (
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-neutral-400 mb-2">
                Technology Tags (Comma-Separated)
              </label>
              <input
                type="text"
                name="tagsString"
                value={form.tagsString}
                onChange={handleChange}
                className="w-full px-4 py-2.5 rounded-xl border border-neutral-200 text-sm focus:outline-none focus:ring-2 focus:ring-neutral-900 transition"
                placeholder="React, C++, WebGL, Verilog"
              />
            </div>
          )}
        </div>

        {/* extra links fields that only show up if creating a project portfolio piece */}
        {type === "project" && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-neutral-400 mb-2">
                Repository Link
              </label>
              <input
                type="url"
                name="repoLink"
                value={form.repoLink}
                onChange={handleChange}
                className="w-full px-4 py-2.5 rounded-xl border border-neutral-200 text-sm focus:outline-none focus:ring-2 focus:ring-neutral-900 transition"
                placeholder="https://github.com/..."
              />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-neutral-400 mb-2">
                Live URL Deployment
              </label>
              <input
                type="url"
                name="liveLink"
                value={form.liveLink}
                onChange={handleChange}
                className="w-full px-4 py-2.5 rounded-xl border border-neutral-200 text-sm focus:outline-none focus:ring-2 focus:ring-neutral-900 transition"
                placeholder="https://my-app.vercel.app"
              />
            </div>
          </div>
        )}

        {/* matches layout descriptors using alternate name conditions */}
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-neutral-400 mb-2">
            {type === "blog"
              ? "Brief Article Excerpt"
              : "Project Summary Card Description"}
          </label>
          <input
            type="text"
            name={type === "blog" ? "excerpt" : "description"}
            required
            value={type === "blog" ? form.excerpt : form.description}
            onChange={handleChange}
            className="w-full px-4 py-2.5 rounded-xl border border-neutral-200 text-sm focus:outline-none focus:ring-2 focus:ring-neutral-900 transition"
            placeholder="Provide a concise 1-sentence descriptor used for grid card indexing cards."
          />
        </div>

        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-neutral-400 mb-2">
            Deep Body Content (Markdown/HTML Support)
          </label>
          <textarea
            name="content"
            required={type === "blog"}
            rows={8}
            value={form.content}
            onChange={handleChange}
            className="w-full px-4 py-2.5 rounded-xl border border-neutral-200 text-sm focus:outline-none focus:ring-2 focus:ring-neutral-900 transition font-mono"
            placeholder="Write deep descriptions or full article entries here..."
          />
        </div>

        {/* asset upload zone that triggers file reader stream logic */}
        <div className="p-5 border border-dashed border-neutral-200 bg-neutral-50 rounded-2xl">
          <label className="block text-xs font-bold uppercase tracking-wider text-neutral-400 mb-2">
            Cover Display Graphic Asset
          </label>
          <input
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
            disabled={uploadingImage || submittingForm}
            className="block w-full text-xs text-neutral-500 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-bold file:bg-neutral-900 file:text-white hover:file:bg-neutral-800 file:cursor-pointer transition file:disabled:opacity-40"
          />

          {uploadingImage && (
            <p className="text-xs text-amber-600 font-semibold mt-2 animate-pulse">
              Streaming binary stream chunks to Cloudinary secure vault CDN...
            </p>
          )}

          {/* shows image card preview only after state has acquired the url link string */}
          {form.coverImage && (
            <div className="mt-4 border border-neutral-200 rounded-xl overflow-hidden aspect-video max-w-md bg-white">
              <img
                src={form.coverImage}
                alt="Cloudinary Asset Rendering Preview"
                className="w-full h-full object-cover"
              />
            </div>
          )}
        </div>

        {/* primary button block that locks validation states while active loading is happening */}
        <button
          type="submit"
          disabled={submittingForm || uploadingImage}
          className="w-full py-3 rounded-xl bg-neutral-900 hover:bg-neutral-800 text-white font-bold text-sm transition disabled:opacity-50 mt-4 shadow-sm"
        >
          {submittingForm
            ? "Committing Database Registry Records..."
            : `Publish New Document Artifact`}
        </button>
      </form>
    </div>
  );
}
