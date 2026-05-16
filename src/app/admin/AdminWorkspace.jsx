"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function AdminWorkspace({ initialData }) {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("blogs");
  const [loading, setLoading] = useState(false);
  const [statusMsg, setStatusMsg] = useState({ type: "", text: "" });

  const [editingId, setEditingId] = useState(null);

  // initial form states to reset for creation and editing modes
  const initialBlog = { title: "", content: "", excerpt: "", category: "software", status: "published", coverImage: "" };
  const initialProject = { title: "", description: "", category: "electronics", githubLink: "", liveLink: "", details: "" };
  const initialSkill = { name: "", percent: 80 };
  const initialCert = { title: "", issuer: "", date: "", link: "" };

  // Form states for all inputs
  const [blogForm, setBlogForm] = useState(initialBlog);
  const [projectForm, setProjectForm] = useState(initialProject);
  const [skillForm, setSkillForm] = useState(initialSkill);
  const [certForm, setCertForm] = useState(initialCert);

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/admin/login");
    router.refresh();
  };

  // Function to handle creation and editing form submissions for all content
  const executeFormSubmit = async (endpoint, payload, resetState, fallbackStructure) => {
    setLoading(true);
    setStatusMsg({ type: "", text: "" });

    const isEditing = editingId !== null;
    const url = isEditing ? `/api/${endpoint}?id=${editingId}` : `/api/${endpoint}`;
    const method = isEditing ? "PUT" : "POST";

    try {
      const res = await fetch(url, {
        method: method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Database operation rejected.");
      
      setStatusMsg({ 
        type: "success", 
        text: isEditing ? "Record modified successfully!" : "New record created successfully!" 
      });
      
      // Reset form and editing state, then refresh to show changes
      resetState(fallbackStructure);
      setEditingId(null);
      router.refresh();
    } catch (err) {
      setStatusMsg({ type: "error", text: err.message });
    } finally {
      setLoading(false);
    }
  };

  // Deletes an item after confirmation, the refreshes the view
  const executeItemDeletion = async (endpoint, id) => {
    if (!confirm("Permanently delete this record instance?")) return;
    try {
      const res = await fetch(`/api/${endpoint}?id=${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Deletion Rejected.");
      if (editingId === id) setEditingId(null);
      router.refresh();
    } catch (err) {
      alert(err.message);
    }
  };

  // Loads item into form for editing, sets editing state, and shows status
  const startEditing = (tab, item) => {
    setEditingId(item._id);
    setStatusMsg({ type: "success", text: `Loaded: "${item.title || item.name}" for modifications.` });

    if (tab === "blogs") {
      setBlogForm({
        title: item.title || "",
        content: item.content || "",
        excerpt: item.excerpt || "",
        category: item.category || "software",
        status: item.status || "published",
        coverImage: item.coverImage || ""
      });
    } else if (tab === "projects") {
      setProjectForm({
        title: item.title || "",
        description: item.description || "",
        category: item.category || "electronics",
        githubLink: item.githubLink || "",
        liveLink: item.liveLink || "",
        details: item.details || ""
      });
    } else if (tab === "skills") {
      setSkillForm({
        name: item.name || "",
        percent: item.percent || 80
      });
    } else if (tab === "certs") {
      setCertForm({
        title: item.title || "",
        issuer: item.issuer || "",
        date: item.date || "",
        link: item.link || ""
      });
    }
  };

  // cancels editing, resets form to initial data state, and clears status messages
  const cancelEditing = (resetState, fallbackStructure) => {
    setEditingId(null);
    resetState(fallbackStructure);
    setStatusMsg({ type: "", text: "" });
  };

  return (
    <div className="w-full min-h-screen flex bg-neutral-50 text-neutral-800 font-sans">
      
      {/* SIDEBAR CENTRAL NAVIGATION */}
      <aside className="w-64 bg-neutral-900 text-neutral-400 flex flex-col justify-between p-6 border-r border-neutral-800">
        <div>
          <div className="mb-10">
            <h2 className="text-white text-lg font-bold tracking-tight">Maanvik Admin Panel</h2>
            <p className="text-xs text-neutral-500 mt-0.5">Core Control Engine</p>
          </div>
          
          <nav className="flex flex-col gap-1.5">
            {[
              { id: "blogs", label: "Writings & Blog Posts" },
              { id: "projects", label: "Engineering Projects" },
              { id: "skills", label: "Technical Competencies" },
              { id: "certs", label: "Verified Credentials" }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => { setActiveTab(tab.id); setStatusMsg({ type: "", text: "" }); setEditingId(null); }}
                className={`w-full text-left px-4 py-2.5 rounded-xl text-sm font-medium transition ${
                  activeTab === tab.id ? "bg-white text-neutral-900" : "hover:bg-neutral-800 hover:text-white"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </nav>
        </div>

        <button 
          onClick={handleLogout}
          className="w-full py-2.5 rounded-xl border border-neutral-800 hover:border-neutral-700 text-xs font-bold uppercase tracking-wider text-neutral-400 hover:text-rose-400 transition"
        >
          Terminate Session ⎋
        </button>
      </aside>

      <main className="flex-1 p-10 max-w-5xl overflow-y-auto">
        
        {statusMsg.text && (
          <div className={`p-4 mb-6 text-sm rounded-xl border font-medium ${
            statusMsg.type === "success" ? "bg-emerald-50 border-emerald-200 text-emerald-800" : "bg-rose-50 border-rose-200 text-rose-800"
          }`}>
            {statusMsg.text}
          </div>
        )}

        {/* Blogs */}
        {activeTab === "blogs" && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 bg-white border border-neutral-200 p-6 rounded-2xl shadow-sm">
              <h3 className="text-xl font-bold mb-4">{editingId ? "Modify Existing Article" : "Draft New Article"}</h3>
              <form onSubmit={(e) => { e.preventDefault(); executeFormSubmit("blogs", blogForm, setBlogForm, initialBlog); }} className="space-y-4">
                <input type="text" placeholder="Article Headline Title" value={blogForm.title} onChange={(e) => setBlogForm({ ...blogForm, title: e.target.value })} required className="w-full px-4 py-2 rounded-xl border text-sm" />
                <div className="grid grid-cols-2 gap-4">
                  <select value={blogForm.category} onChange={(e) => setBlogForm({ ...blogForm, category: e.target.value })} className="px-4 py-2 rounded-xl border text-sm">
                    <option value="electronics">Electronics</option>
                    <option value="software">Software</option>
                    <option value="calculator-games">Calculator Games</option>
                  </select>
                  <input type="text" placeholder="Cover Image Path Asset URL" value={blogForm.coverImage} onChange={(e) => setBlogForm({ ...blogForm, coverImage: e.target.value })} className="w-full px-4 py-2 rounded-xl border text-sm" />
                </div>
                <input type="text" placeholder="Short Meta Excerpt Summary" value={blogForm.excerpt} onChange={(e) => setBlogForm({ ...blogForm, excerpt: e.target.value })} className="w-full px-4 py-2 rounded-xl border text-sm" />
                <textarea rows="8" placeholder="Write full text markdown blocks here..." value={blogForm.content} onChange={(e) => setBlogForm({ ...blogForm, content: e.target.value })} required className="w-full px-4 py-2 rounded-xl border text-sm" />
                
                <div className="flex gap-3">
                  <button type="submit" disabled={loading} className="px-6 py-2 bg-neutral-900 text-white rounded-xl text-sm font-medium hover:bg-neutral-800 transition disabled:opacity-50">
                    {editingId ? "Save Document Changes" : "Publish Live Article"}
                  </button>
                  {editingId && (
                    <button type="button" onClick={() => cancelEditing(setBlogForm, initialBlog)} className="px-4 py-2 border rounded-xl text-sm hover:bg-neutral-100 transition">Cancel</button>
                  )}
                </div>
              </form>
            </div>
            <div className="bg-white border border-neutral-200 p-6 rounded-2xl shadow-sm max-h-[70vh] overflow-y-auto">
              <h4 className="text-xs uppercase tracking-wider text-neutral-400 font-bold mb-4">Published Archives ({initialData.blogs.length})</h4>
              {initialData.blogs.map(b => (
                <div key={b._id} className="p-3 border-b border-neutral-100 flex justify-between items-center text-xs">
                  <span className="font-semibold line-clamp-1 flex-1 pr-2">{b.title}</span>
                  <div className="flex gap-2.5">
                    <button onClick={() => startEditing("blogs", b)} className="text-blue-600 hover:underline">Edit</button>
                    <button onClick={() => executeItemDeletion("blogs", b._id)} className="text-rose-600 font-bold hover:underline">Delete</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Projects */}
        {activeTab === "projects" && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 bg-white border border-neutral-200 p-6 rounded-2xl shadow-sm">
              <h3 className="text-xl font-bold mb-4">{editingId ? "Modify System Specification" : "Register New Engineering Portfolio Spec"}</h3>
              <form onSubmit={(e) => { e.preventDefault(); executeFormSubmit("projects", projectForm, setProjectForm, initialProject); }} className="space-y-4">
                <input type="text" placeholder="Project Workspace Title Name" value={projectForm.title} onChange={(e) => setProjectForm({ ...projectForm, title: e.target.value })} required className="w-full px-4 py-2 rounded-xl border text-sm" />
                <div className="grid grid-cols-3 gap-4">
                  <select value={projectForm.category} onChange={(e) => setProjectForm({ ...projectForm, category: e.target.value })} className="px-4 py-2 rounded-xl border text-sm col-span-1">
                    <option value="electronics">Electronics</option>
                    <option value="software">Software</option>
                    <option value="calculator-games">Calculator Games</option>
                  </select>
                  <input type="text" placeholder="GitHub Repository URL" value={projectForm.githubLink} onChange={(e) => setProjectForm({ ...projectForm, githubLink: e.target.value })} className="px-4 py-2 rounded-xl border text-sm col-span-1" />
                  <input type="text" placeholder="Live Demo Link URL" value={projectForm.liveLink} onChange={(e) => setProjectForm({ ...projectForm, liveLink: e.target.value })} className="px-4 py-2 rounded-xl border text-sm col-span-1" />
                </div>
                <input type="text" placeholder="Short card snippet description summary..." value={projectForm.description} onChange={(e) => setProjectForm({ ...projectForm, description: e.target.value })} required className="w-full px-4 py-2 rounded-xl border text-sm" />
                <textarea rows="6" placeholder="Write full extended specs here..." value={projectForm.details} onChange={(e) => setProjectForm({ ...projectForm, details: e.target.value })} className="w-full px-4 py-2 rounded-xl border text-sm" />
                
                <div className="flex gap-3">
                  <button type="submit" disabled={loading} className="px-6 py-2 bg-neutral-900 text-white rounded-xl text-sm font-medium hover:bg-neutral-800 transition disabled:opacity-50">
                    {editingId ? "Save Spec Changes" : "Append System Spec"}
                  </button>
                  {editingId && (
                    <button type="button" onClick={() => cancelEditing(setProjectForm, initialProject)} className="px-4 py-2 border rounded-xl text-sm hover:bg-neutral-100 transition">Cancel</button>
                  )}
                </div>
              </form>
            </div>
            <div className="bg-white border border-neutral-200 p-6 rounded-2xl shadow-sm max-h-[70vh] overflow-y-auto">
              <h4 className="text-xs uppercase tracking-wider text-neutral-400 font-bold mb-4">Active System Specs ({initialData.projects.length})</h4>
              {initialData.projects.map(p => (
                <div key={p._id} className="p-3 border-b border-neutral-100 flex justify-between items-center text-xs">
                  <div className="flex flex-col flex-1 pr-2">
                    <span className="font-semibold text-neutral-800">{p.title}</span>
                    <span className="text-[10px] text-neutral-400 font-mono capitalize">{p.category}</span>
                  </div>
                  <div className="flex gap-2.5">
                    <button onClick={() => startEditing("projects", p)} className="text-blue-600 hover:underline">Edit</button>
                    <button onClick={() => executeItemDeletion("projects", p._id)} className="text-rose-600 font-bold hover:underline">Delete</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Skills */}
        {activeTab === "skills" && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-white border border-neutral-200 p-6 rounded-2xl shadow-sm h-fit">
              <h3 className="text-xl font-bold mb-4">{editingId ? "Modify Competency Metric" : "Register System Skill Metric"}</h3>
              <form onSubmit={(e) => { e.preventDefault(); executeFormSubmit("skills", skillForm, setSkillForm, initialSkill); }} className="space-y-4">
                <input type="text" placeholder="e.g., Embedded C, KiCAD, RTOS" value={skillForm.name} onChange={(e) => setSkillForm({ ...skillForm, name: e.target.value })} required className="w-full px-4 py-2 rounded-xl border text-sm" />
                <div>
                  <div className="flex justify-between text-xs font-bold mb-1">
                    <span>Proficiency Matrix Level</span>
                    <span>{skillForm.percent}%</span>
                  </div>
                  <input type="range" min="0" max="100" value={skillForm.percent} onChange={(e) => setSkillForm({ ...skillForm, percent: parseInt(e.target.value) })} className="w-full accent-neutral-900" />
                </div>
                
                <div className="flex gap-3">
                  <button type="submit" disabled={loading} className="w-full py-2 bg-neutral-900 text-white rounded-xl text-sm font-medium hover:bg-neutral-800 transition disabled:opacity-50">
                    {editingId ? "Save Metric Changes" : "Append Technical Skill Bar"}
                  </button>
                  {editingId && (
                    <button type="button" onClick={() => cancelEditing(setSkillForm, initialSkill)} className="px-4 py-2 border rounded-xl text-sm hover:bg-neutral-100 transition">Cancel</button>
                  )}
                </div>
              </form>
            </div>
            <div className="bg-white border border-neutral-200 p-6 rounded-2xl shadow-sm">
              <h4 className="text-xs uppercase tracking-wider text-neutral-400 font-bold mb-4">Active Capabilities Toolbox ({initialData.skills.length})</h4>
              <div className="space-y-2 max-h-96 overflow-y-auto">
                {initialData.skills.map(s => (
                  <div key={s._id} className="p-3 bg-neutral-50 rounded-xl border text-xs flex justify-between items-center">
                    <span><strong>{s.name}</strong> <span className="text-neutral-400 ml-1">({s.percent}%)</span></span>
                    <div className="flex gap-2.5">
                      <button onClick={() => startEditing("skills", s)} className="text-blue-600 hover:underline">Edit</button>
                      <button onClick={() => executeItemDeletion("skills", s._id)} className="text-rose-600 font-medium hover:underline">Delete</button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Certifications */}
        {activeTab === "certs" && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-white border border-neutral-200 p-6 rounded-2xl shadow-sm h-fit">
              <h3 className="text-xl font-bold mb-4">{editingId ? "Modify Credential Records" : "Log Verification Certificate"}</h3>
              <form onSubmit={(e) => { e.preventDefault(); executeFormSubmit("certifications", certForm, setCertForm, initialCert); }} className="space-y-4">
                <input type="text" placeholder="Certification Title Name" value={certForm.title} onChange={(e) => setCertForm({ ...certForm, title: e.target.value })} required className="w-full px-4 py-2 rounded-xl border text-sm" />
                <div className="grid grid-cols-2 gap-4">
                  <input type="text" placeholder="Issuing Institution" value={certForm.issuer} onChange={(e) => setCertForm({ ...certForm, issuer: e.target.value })} required className="w-full px-4 py-2 rounded-xl border text-sm" />
                  <input type="text" placeholder="Date Awarded" value={certForm.date} onChange={(e) => setCertForm({ ...certForm, date: e.target.value })} className="w-full px-4 py-2 rounded-xl border text-sm" />
                </div>
                <input type="url" placeholder="Public Registry Verification URL" value={certForm.link} onChange={(e) => setCertForm({ ...certForm, link: e.target.value })} className="w-full px-4 py-2 rounded-xl border text-sm" />
                
                <div className="flex gap-3">
                  <button type="submit" disabled={loading} className="w-full py-2 bg-neutral-900 text-white rounded-xl text-sm font-medium hover:bg-neutral-800 transition disabled:opacity-50">
                    {editingId ? "Save Badge Changes" : "Publish Credential Card"}
                  </button>
                  {editingId && (
                    <button type="button" onClick={() => cancelEditing(setCertForm, initialCert)} className="px-4 py-2 border rounded-xl text-sm hover:bg-neutral-100 transition">Cancel</button>
                  )}
                </div>
              </form>
            </div>
            <div className="bg-white border border-neutral-200 p-6 rounded-2xl shadow-sm">
              <h4 className="text-xs uppercase tracking-wider text-neutral-400 font-bold mb-4">Logged Credentials ({initialData.certifications.length})</h4>
              <div className="space-y-2 max-h-96 overflow-y-auto">
                {initialData.certifications.map(c => (
                  <div key={c._id} className="p-3 bg-neutral-50 rounded-xl border text-xs flex justify-between items-center">
                    <div className="flex flex-col flex-1 pr-2"><span className="font-semibold line-clamp-1">{c.title}</span><span className="text-[10px] text-neutral-400">{c.issuer}</span></div>
                    <div className="flex gap-2.5 flex-shrink-0">
                      <button onClick={() => startEditing("certs", c)} className="text-blue-600 hover:underline">Edit</button>
                      <button onClick={() => executeItemDeletion("certifications", c._id)} className="text-rose-600 font-medium hover:underline">Delete</button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

      </main>
    </div>
  );
}