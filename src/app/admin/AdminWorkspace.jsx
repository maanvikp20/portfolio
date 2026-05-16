"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import DarkModeToggle from "@/src/components/ui/DarkModeToggle";

// function to get list from possible structures with fallback to empty array
const extractList = (source, keyName) => {
  if (!source) return [];
  if (Array.isArray(source)) return source;
  if (source[keyName] && Array.isArray(source[keyName])) return source[keyName];
  if (source.data && Array.isArray(source.data)) return source.data;
  if (source.items && Array.isArray(source.items)) return source.items;
  return [];
};

export default function AdminWorkspace({ initialData }) {
  const router = useRouter();

  // Management states
  const [activeTab, setActiveTab] = useState("blogs");
  const [loading, setLoading] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [statusMsg, setStatusMsg] = useState({ type: "", text: "" });
  const [editingId, setEditingId] = useState(null);

  // Local data state to reflect changes
  const [localData, setLocalData] = useState(initialData);
  const [fileInputKey, setFileInputKey] = useState(Date.now());

  // Initial form states for reset and edit loading
  const initialBlog = { title: "", content: "", excerpt: "", category: "software", status: "published", coverImage: "" };
  const initialProject = { title: "", description: "", content: "", category: "software", repoLink: "", liveLink: "", coverImage: "", tagsString: "" };
  const initialSkill = { name: "", percent: 80 };
  const initialCert = { title: "", issuer: "", date: "", link: "", image: "" };

  // Form states for inputs
  const [blogForm, setBlogForm] = useState(initialBlog);
  const [projectForm, setProjectForm] = useState(initialProject);
  const [skillForm, setSkillForm] = useState(initialSkill);
  const [certForm, setCertForm] = useState(initialCert);

  // Guranteed safe lists for rendering
  const safeBlogs = extractList(localData?.blogs, "blogs");
  const safeProjects = extractList(localData?.projects, "projects");
  const safeSkills = extractList(localData?.skills, "skills");
  const safeCerts = extractList(localData?.certifications, "certifications");

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/admin/login");
    router.refresh();
  };

  const handleCloudinaryUpload = async (e, formType) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploadingImage(true);
    setStatusMsg({ type: "", text: "" });

    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch("/api/upload", { method: "POST", body: formData });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "File asset upload execution failure.");

      if (formType === "blogs") setBlogForm((prev) => ({ ...prev, coverImage: data.url }));
      else if (formType === "projects") setProjectForm((prev) => ({ ...prev, coverImage: data.url }));
      else if (formType === "certs") setCertForm((prev) => ({ ...prev, image: data.url }));

      setStatusMsg({ type: "success", text: "Image uploaded and locked into state payload!" });
    } catch (err) {
      setStatusMsg({ type: "error", text: err.message });
    } finally {
      setUploadingImage(false);
    }
  };

  // Function to handle create and update ops for all endpoints
  const executeFormSubmit = async (endpoint, payload, resetState, fallbackStructure, dataKey) => {
    setLoading(true);
    setStatusMsg({ type: "", text: "" });

    const isEditing = editingId !== null;
    const url = isEditing ? `/api/${endpoint}?id=${editingId}` : `/api/${endpoint}`;
    const method = isEditing ? "PUT" : "POST";

    // Create payload copy to manipulate for specific endpoint needs
    let sanitizedPayload = { ...payload };

    if (endpoint === "projects" && sanitizedPayload.tagsString !== undefined) {
      sanitizedPayload.tags = sanitizedPayload.tagsString.split(",").map(tag => tag.trim()).filter(tag => tag.length > 0);
      delete sanitizedPayload.tagsString;
    }

    try {
      const res = await fetch(url, {
        method: method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(sanitizedPayload),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Database operation rejected.");
      
      setLocalData(prev => {
        let list = extractList(prev[dataKey], dataKey);
        if (isEditing) {
          list = list.map(item => item._id === editingId ? data.data : item);
        } else {
          list = [...list, data.data];
        }
        return { ...prev, [dataKey]: list };
      });

      setStatusMsg({ type: "success", text: isEditing ? "Record modified successfully!" : "New record created successfully!" });
      resetState(fallbackStructure);
      setEditingId(null);
      setFileInputKey(Date.now()); 
      router.refresh();
    } catch (err) {
      setStatusMsg({ type: "error", text: err.message });
    } finally {
      setLoading(false);
    }
  };

  // Item delete
  const executeItemDeletion = async (endpoint, id, dataKey) => {
    if (!confirm("Permanently delete this record instance?")) return;
    try {
      const res = await fetch(`/api/${endpoint}?id=${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Deletion Rejected.");
      
      setLocalData(prev => {
        let list = extractList(prev[dataKey], dataKey);
        return { ...prev, [dataKey]: list.filter(item => item._id !== id) };
      });

      if (editingId === id) setEditingId(null);
      router.refresh();
    } catch (err) {
      alert(err.message);
    }
  };


  // edit item
  const startEditing = (tab, item) => {
    setEditingId(item._id);
    setStatusMsg({ type: "success", text: `Loaded: "${item.title || item.name}" for modifications.` });
    setFileInputKey(Date.now()); 

    if (tab === "blogs") {
      setBlogForm({
        title: item.title || "", content: item.content || "", excerpt: item.excerpt || "",
        category: item.category || "software", status: item.status || "published", coverImage: item.coverImage || ""
      });
    } else if (tab === "projects") {
      setProjectForm({
        title: item.title || "", description: item.description || "", content: item.content || "", 
        category: item.category || "software", repoLink: item.repoLink || "", liveLink: item.liveLink || "",
        coverImage: item.coverImage || "", tagsString: item.tags ? item.tags.join(", ") : "" 
      });
    } else if (tab === "skills") {
      setSkillForm({ name: item.name || "", percent: item.percent || 80 });
    } else if (tab === "certs") {
      setCertForm({ title: item.title || "", issuer: item.issuer || "", date: item.date || "", link: item.link || "", image: item.image || "" });
    }
  };

  // cancel editing and reset form
  const cancelEditing = (resetState, fallbackStructure) => {
    setEditingId(null);
    resetState(fallbackStructure);
    setStatusMsg({ type: "", text: "" });
    setFileInputKey(Date.now()); 
  };

  return (
    <div className="flex w-full min-h-screen bg-neutral-50 dark:bg-neutral-950 text-neutral-800 dark:text-neutral-200 transition-colors duration-300 font-sans">
      
      <aside className="w-64 bg-neutral-900 text-neutral-400 flex flex-col justify-between p-6 border-r border-neutral-800">
        <div>
          <div className="mb-10 flex justify-between items-start">
            <div>
              <h2 className="text-white text-lg font-bold tracking-tight">Maanvik Admin</h2>
              <p className="text-xs text-neutral-500 mt-0.5">Core Control Engine</p>
            </div>
            <div className="flex-shrink-0">
              <DarkModeToggle />
            </div>
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
                onClick={() => { setActiveTab(tab.id); setStatusMsg({ type: "", text: "" }); setEditingId(null); setFileInputKey(Date.now()); }}
                className={`w-full text-left px-4 py-2.5 rounded-xl text-sm font-medium transition ${
                  activeTab === tab.id ? "bg-white text-neutral-900 dark:bg-neutral-800 dark:text-white" : "hover:bg-neutral-800 hover:text-white"
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
            statusMsg.type === "success" 
              ? "bg-emerald-50 border-emerald-200 text-emerald-800 dark:bg-emerald-900/30 dark:border-emerald-800 dark:text-emerald-300" 
              : "bg-rose-50 border-rose-200 text-rose-800 dark:bg-rose-900/30 dark:border-rose-800 dark:text-rose-300"
          }`}>
            {statusMsg.text}
          </div>
        )}

        {/* Blogs Layer */}
        {activeTab === "blogs" && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 p-6 rounded-2xl shadow-sm">
              <h3 className="text-xl font-bold mb-4">{editingId ? "Modify Existing Article" : "Draft New Article"}</h3>
              <form onSubmit={(e) => { e.preventDefault(); executeFormSubmit("blogs", blogForm, setBlogForm, initialBlog, "blogs"); }} className="space-y-4">
                <input type="text" placeholder="Article Headline Title" value={blogForm.title} onChange={(e) => setBlogForm({ ...blogForm, title: e.target.value })} required className="w-full px-4 py-2 rounded-xl border dark:border-neutral-700 dark:bg-neutral-950 text-sm" />
                
                <div className="grid grid-cols-2 gap-4">
                  <select value={blogForm.category} onChange={(e) => setBlogForm({ ...blogForm, category: e.target.value })} className="px-4 py-2 rounded-xl border dark:border-neutral-700 dark:bg-neutral-950 text-sm">
                    <option value="software">Software</option>
                    <option value="electronics">Electronics</option>
                    <option value="calculator-games">Calculator Games</option>
                  </select>
                  <select value={blogForm.status} onChange={(e) => setBlogForm({ ...blogForm, status: e.target.value })} className="px-4 py-2 rounded-xl border dark:border-neutral-700 dark:bg-neutral-950 text-sm">
                    <option value="published">Published</option>
                    <option value="draft">Draft Workspace</option>
                  </select>
                </div>

                <div className="p-4 bg-neutral-50 dark:bg-neutral-950/50 rounded-xl border border-dashed border-neutral-200 dark:border-neutral-700 text-xs">
                  <span className="block font-bold text-neutral-400 uppercase tracking-wide mb-2">Article Cover Asset</span>
                  <input key={fileInputKey} type="file" accept="image/*" onChange={(e) => handleCloudinaryUpload(e, "blogs")} disabled={uploadingImage} className="block text-xs" />
                  {uploadingImage && <p className="mt-2 text-amber-600 animate-pulse font-medium">Streaming file directly to Cloudinary...</p>}
                  {blogForm.coverImage && (
                    <input type="text" readOnly value={blogForm.coverImage} className="w-full mt-2 p-2 bg-neutral-100 dark:bg-neutral-900 rounded border dark:border-neutral-800 text-neutral-500 font-mono text-[10px]" />
                  )}
                </div>

                <input type="text" placeholder="Short Meta Excerpt Summary" value={blogForm.excerpt} onChange={(e) => setBlogForm({ ...blogForm, excerpt: e.target.value })} className="w-full px-4 py-2 rounded-xl border dark:border-neutral-700 dark:bg-neutral-950 text-sm" />
                <textarea rows="8" placeholder="Write full text markdown blocks here..." value={blogForm.content} onChange={(e) => setBlogForm({ ...blogForm, content: e.target.value })} required className="w-full px-4 py-2 rounded-xl border dark:border-neutral-700 dark:bg-neutral-950 text-sm font-mono" />
                
                <div className="flex gap-3">
                  <button type="submit" disabled={loading || uploadingImage} className="px-6 py-2 bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 rounded-xl text-sm font-bold hover:opacity-80 transition disabled:opacity-50">
                    {editingId ? "Save Document Changes" : "Publish Live Article"}
                  </button>
                  {editingId && (
                    <button type="button" onClick={() => cancelEditing(setBlogForm, initialBlog)} className="px-4 py-2 border dark:border-neutral-700 rounded-xl text-sm hover:bg-neutral-100 dark:hover:bg-neutral-800 transition">Cancel</button>
                  )}
                </div>
              </form>
            </div>
            
            <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 p-6 rounded-2xl shadow-sm max-h-[70vh] overflow-y-auto">
              <h4 className="text-xs uppercase tracking-wider text-neutral-400 font-bold mb-4">Database Archives ({safeBlogs.length})</h4>
              {safeBlogs.map(b => (
                <div key={b._id} className="p-3 border-b border-neutral-100 dark:border-neutral-800 flex justify-between items-center text-xs">
                  <span className="font-semibold line-clamp-1 flex-1 pr-2">{b.title}</span>
                  <div className="flex gap-2.5">
                    <button onClick={() => startEditing("blogs", b)} className="text-blue-600 dark:text-blue-400 hover:underline">Edit</button>
                    <button onClick={() => executeItemDeletion("blogs", b._id, "blogs")} className="text-rose-600 dark:text-rose-400 font-bold hover:underline">Delete</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Projects Layer */}
        {activeTab === "projects" && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 p-6 rounded-2xl shadow-sm">
              <h3 className="text-xl font-bold mb-4">{editingId ? "Modify System Specification" : "Register New Engineering Portfolio Spec"}</h3>
              <form onSubmit={(e) => { e.preventDefault(); executeFormSubmit("projects", projectForm, setProjectForm, initialProject, "projects"); }} className="space-y-4">
                <input type="text" placeholder="Project Workspace Title Name" value={projectForm.title} onChange={(e) => setProjectForm({ ...projectForm, title: e.target.value })} required className="w-full px-4 py-2 rounded-xl border dark:border-neutral-700 dark:bg-neutral-950 text-sm" />
                
                <div className="grid grid-cols-3 gap-4">
                  <select value={projectForm.category} onChange={(e) => setProjectForm({ ...projectForm, category: e.target.value })} className="px-4 py-2 rounded-xl border dark:border-neutral-700 dark:bg-neutral-950 text-sm col-span-1">
                    <option value="software">Software</option>
                    <option value="electronics">Electronics</option>
                    <option value="calculator-games">Calculator Games</option>
                  </select>
                  <input type="url" placeholder="Repository Link (repoLink)" value={projectForm.repoLink} onChange={(e) => setProjectForm({ ...projectForm, repoLink: e.target.value })} className="px-4 py-2 rounded-xl border dark:border-neutral-700 dark:bg-neutral-950 text-sm col-span-1" />
                  <input type="url" placeholder="Live Demo Link URL" value={projectForm.liveLink} onChange={(e) => setProjectForm({ ...projectForm, liveLink: e.target.value })} className="px-4 py-2 rounded-xl border dark:border-neutral-700 dark:bg-neutral-950 text-sm col-span-1" />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <input type="text" placeholder="Technology stack tags (e.g. React, C++, Verilog)" value={projectForm.tagsString} onChange={(e) => setProjectForm({ ...projectForm, tagsString: e.target.value })} className="w-full px-4 py-2 rounded-xl border dark:border-neutral-700 dark:bg-neutral-950 text-sm" />
                  
                  <div className="p-3 bg-neutral-50 dark:bg-neutral-950/50 border border-dashed dark:border-neutral-700 rounded-xl text-xs flex flex-col justify-center">
                    <input key={fileInputKey} type="file" accept="image/*" onChange={(e) => handleCloudinaryUpload(e, "projects")} disabled={uploadingImage} />
                    {uploadingImage && <p className="text-[10px] text-amber-600 animate-pulse mt-1 font-medium">Uploading asset image...</p>}
                  </div>
                </div>

                <input type="text" placeholder="Short card snippet description summary..." value={projectForm.description} onChange={(e) => setProjectForm({ ...projectForm, description: e.target.value })} required className="w-full px-4 py-2 rounded-xl border dark:border-neutral-700 dark:bg-neutral-950 text-sm" />
                <textarea rows="6" placeholder="Write full extended specs markdown here... (content)" value={projectForm.content} onChange={(e) => setProjectForm({ ...projectForm, content: e.target.value })} className="w-full px-4 py-2 rounded-xl border dark:border-neutral-700 dark:bg-neutral-950 text-sm font-mono" />
                
                <div className="flex gap-3">
                  <button type="submit" disabled={loading || uploadingImage} className="px-6 py-2 bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 rounded-xl text-sm font-bold hover:opacity-80 transition disabled:opacity-50">
                    {editingId ? "Save Spec Changes" : "Append System Spec"}
                  </button>
                  {editingId && (
                    <button type="button" onClick={() => cancelEditing(setProjectForm, initialProject)} className="px-4 py-2 border dark:border-neutral-700 rounded-xl text-sm hover:bg-neutral-100 dark:hover:bg-neutral-800 transition">Cancel</button>
                  )}
                </div>
              </form>
            </div>
            
            <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 p-6 rounded-2xl shadow-sm max-h-[70vh] overflow-y-auto">
              <h4 className="text-xs uppercase tracking-wider text-neutral-400 font-bold mb-4">Active System Specs ({safeProjects.length})</h4>
              {safeProjects.map(p => (
                <div key={p._id} className="p-3 border-b border-neutral-100 dark:border-neutral-800 flex justify-between items-center text-xs">
                  <div className="flex flex-col flex-1 pr-2">
                    <span className="font-semibold text-neutral-800 dark:text-neutral-200">{p.title}</span>
                    <span className="text-[10px] text-neutral-400 font-mono capitalize">{p.category}</span>
                  </div>
                  <div className="flex gap-2.5">
                    <button onClick={() => startEditing("projects", p)} className="text-blue-600 dark:text-blue-400 hover:underline">Edit</button>
                    <button onClick={() => executeItemDeletion("projects", p._id, "projects")} className="text-rose-600 dark:text-rose-400 font-bold hover:underline">Delete</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Skills Layer */}
        {activeTab === "skills" && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 p-6 rounded-2xl shadow-sm h-fit">
              <h3 className="text-xl font-bold mb-4">{editingId ? "Modify Competency Metric" : "Register System Skill Metric"}</h3>
              <form onSubmit={(e) => { e.preventDefault(); executeFormSubmit("skills", skillForm, setSkillForm, initialSkill, "skills"); }} className="space-y-4">
                <input type="text" placeholder="e.g., Embedded C, KiCAD, RTOS" value={skillForm.name} onChange={(e) => setSkillForm({ ...skillForm, name: e.target.value })} required className="w-full px-4 py-2 rounded-xl border dark:border-neutral-700 dark:bg-neutral-950 text-sm" />
                <div>
                  <div className="flex justify-between text-xs font-bold mb-1">
                    <span>Proficiency Matrix Level</span>
                    <span>{skillForm.percent}%</span>
                  </div>
                  <input type="range" min="0" max="100" value={skillForm.percent} onChange={(e) => setSkillForm({ ...skillForm, percent: parseInt(e.target.value) })} className="w-full accent-neutral-900 dark:accent-neutral-100" />
                </div>
                
                <div className="flex gap-3">
                  <button type="submit" disabled={loading} className="w-full py-2 bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 rounded-xl text-sm font-bold hover:opacity-80 transition disabled:opacity-50">
                    {editingId ? "Save Metric Changes" : "Append Technical Skill Bar"}
                  </button>
                  {editingId && (
                    <button type="button" onClick={() => cancelEditing(setSkillForm, initialSkill)} className="px-4 py-2 border dark:border-neutral-700 rounded-xl text-sm hover:bg-neutral-100 dark:hover:bg-neutral-800 transition">Cancel</button>
                  )}
                </div>
              </form>
            </div>
            
            <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 p-6 rounded-2xl shadow-sm">
              <h4 className="text-xs uppercase tracking-wider text-neutral-400 font-bold mb-4">Active Capabilities Toolbox ({safeSkills.length})</h4>
              <div className="space-y-2 max-h-96 overflow-y-auto">
                {safeSkills.map(s => (
                  <div key={s._id} className="p-3 bg-neutral-50 dark:bg-neutral-950/50 rounded-xl border dark:border-neutral-800 text-xs flex justify-between items-center">
                    <span><strong>{s.name}</strong> <span className="text-neutral-400 ml-1">({s.percent}%)</span></span>
                    <div className="flex gap-2.5">
                      <button onClick={() => startEditing("skills", s)} className="text-blue-600 dark:text-blue-400 hover:underline">Edit</button>
                      <button onClick={() => executeItemDeletion("skills", s._id, "skills")} className="text-rose-600 dark:text-rose-400 font-medium hover:underline">Delete</button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Certifications Layer */}
        {activeTab === "certs" && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 p-6 rounded-2xl shadow-sm h-fit">
              <h3 className="text-xl font-bold mb-4">{editingId ? "Modify Credential Records" : "Log Verification Certificate"}</h3>
              <form onSubmit={(e) => { e.preventDefault(); executeFormSubmit("certifications", certForm, setCertForm, initialCert, "certifications"); }} className="space-y-4">
                <input type="text" placeholder="Certification Title Name" value={certForm.title} onChange={(e) => setCertForm({ ...certForm, title: e.target.value })} required className="w-full px-4 py-2 rounded-xl border dark:border-neutral-700 dark:bg-neutral-950 text-sm" />
                
                <div className="grid grid-cols-2 gap-4">
                  <input type="text" placeholder="Issuing Institution" value={certForm.issuer} onChange={(e) => setCertForm({ ...certForm, issuer: e.target.value })} required className="w-full px-4 py-2 rounded-xl border dark:border-neutral-700 dark:bg-neutral-950 text-sm" />
                  <input type="text" placeholder="Date Awarded" value={certForm.date} onChange={(e) => setCertForm({ ...certForm, date: e.target.value })} className="w-full px-4 py-2 rounded-xl border dark:border-neutral-700 dark:bg-neutral-950 text-sm" />
                </div>
                
                <input type="url" placeholder="Public Registry Verification URL" value={certForm.link} onChange={(e) => setCertForm({ ...certForm, link: e.target.value })} className="w-full px-4 py-2 rounded-xl border dark:border-neutral-700 dark:bg-neutral-950 text-sm" />
                
                <div className="p-4 bg-neutral-50 dark:bg-neutral-950/50 rounded-xl border border-dashed border-neutral-200 dark:border-neutral-700 text-xs">
                  <span className="block font-bold text-neutral-400 uppercase tracking-wide mb-2">Badge / Certificate Image</span>
                  <input key={fileInputKey} type="file" accept="image/*" onChange={(e) => handleCloudinaryUpload(e, "certs")} disabled={uploadingImage} className="block text-xs" />
                  {uploadingImage && <p className="mt-2 text-amber-600 animate-pulse font-medium">Streaming file directly to Cloudinary...</p>}
                  {certForm.image && (
                     <input type="text" readOnly value={certForm.image} className="w-full mt-2 p-2 bg-neutral-100 dark:bg-neutral-900 rounded border dark:border-neutral-800 text-neutral-500 font-mono text-[10px]" />
                  )}
                </div>

                <div className="flex gap-3">
                  <button type="submit" disabled={loading || uploadingImage} className="w-full py-2 bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 rounded-xl text-sm font-bold hover:opacity-80 transition disabled:opacity-50">
                    {editingId ? "Save Badge Changes" : "Publish Credential Card"}
                  </button>
                  {editingId && (
                    <button type="button" onClick={() => cancelEditing(setCertForm, initialCert)} className="px-4 py-2 border dark:border-neutral-700 rounded-xl text-sm hover:bg-neutral-100 dark:hover:bg-neutral-800 transition">Cancel</button>
                  )}
                </div>
              </form>
            </div>
            
            <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 p-6 rounded-2xl shadow-sm">
              <h4 className="text-xs uppercase tracking-wider text-neutral-400 font-bold mb-4">Logged Credentials ({safeCerts.length})</h4>
              <div className="space-y-2 max-h-96 overflow-y-auto">
                {safeCerts.map(c => (
                  <div key={c._id} className="p-3 bg-neutral-50 dark:bg-neutral-950/50 rounded-xl border dark:border-neutral-800 text-xs flex justify-between items-center">
                    <div className="flex flex-col flex-1 pr-2"><span className="font-semibold line-clamp-1">{c.title}</span><span className="text-[10px] text-neutral-400">{c.issuer}</span></div>
                    <div className="flex gap-2.5 flex-shrink-0">
                      <button onClick={() => startEditing("certs", c)} className="text-blue-600 dark:text-blue-400 hover:underline">Edit</button>
                      <button onClick={() => executeItemDeletion("certifications", c._id, "certifications")} className="text-rose-600 dark:text-rose-400 font-medium hover:underline">Delete</button>
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