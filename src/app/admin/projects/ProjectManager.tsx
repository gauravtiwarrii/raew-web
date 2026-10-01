"use client";

import { useState } from "react";
import { Plus, Pencil, Trash2 } from "lucide-react";

interface Project {
  id: string;
  title: string;
  slug: string;
  application: string | null;
  imageUrl?: string | null;
  imageType?: string | null;
  active: boolean;
}

interface ProjectManagerProps {
  initialProjects: Project[];
}

export default function ProjectManager({ initialProjects }: ProjectManagerProps) {
  const [projects, setProjects] = useState<Project[]>(initialProjects);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Project | null>(null);
  const [formData, setFormData] = useState({ title: "", slug: "", application: "Agriculture", description: "", imageUrl: "", imageType: "REAL_COMPANY_PHOTO", active: true });

  const openAdd = () => {
    setEditing(null);
    setFormData({ title: "", slug: "", application: "Agriculture", description: "", imageUrl: "", imageType: "REAL_COMPANY_PHOTO", active: true });
    setModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    const url = editing ? `/api/projects/${editing.id}` : "/api/projects";
    const res = await fetch(url, {
      method: editing ? "PUT" : "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    });
    const data = await res.json();
    if (!res.ok) {
      alert(data.error || "Save failed");
      return;
    }
    if (editing) setProjects(projects.map((p) => (p.id === data.id ? data : p)));
    else setProjects([data, ...projects]);
    setModalOpen(false);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this project?")) return;
    const res = await fetch(`/api/projects/${id}`, { method: "DELETE" });
    if (res.ok) setProjects(projects.filter((p) => p.id !== id));
    else alert("Delete failed");
  };


  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-extrabold text-white">Projects</h1>
          <p className="text-xs text-gray-400">{projects.length} project records</p>
        </div>
        <button type="button" onClick={openAdd} className="inline-flex items-center gap-2 rounded-lg bg-[var(--accent)] px-4 py-2.5 text-xs font-bold uppercase tracking-wider text-[var(--accent-fg)] hover:bg-[var(--accent-hover)]">
          <Plus className="h-4 w-4" aria-hidden="true" /> New Project
        </button>
      </div>
      <div className="overflow-x-auto rounded-2xl border border-slate-800 bg-slate-900">
        <table className="w-full text-left text-xs text-gray-300">
          <thead className="bg-slate-950 text-[10px] uppercase tracking-wider text-gray-400">
            <tr>
              <th className="p-3">Title</th>
              <th className="p-3">Application</th>
              <th className="p-3">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800">
            {projects.map((p) => (
              <tr key={p.id} className="hover:bg-slate-800/50">
                <td className="p-3 font-bold text-white">{p.title}</td>
                <td className="p-3 text-gray-400">{p.application || "—"}</td>
                <td className="p-3">
                  <div className="flex items-center gap-2">
                    <button type="button" onClick={() => { setEditing(p); setFormData({ title: p.title, slug: p.slug, application: p.application || "Agriculture", description: "", imageUrl: p.imageUrl || "", imageType: p.imageType || "REAL_COMPANY_PHOTO", active: p.active }); setModalOpen(true); }} aria-label={`Edit ${p.title}`} className="rounded-md border border-slate-700 p-1.5 hover:border-[var(--accent-bright)] hover:text-white">
                      <Pencil className="h-3.5 w-3.5" aria-hidden="true" />
                    </button>
                    <button type="button" onClick={() => handleDelete(p.id)} aria-label={`Delete ${p.title}`} className="rounded-md border border-slate-700 p-1.5 hover:border-red-500 hover:text-red-400">
                      <Trash2 className="h-3.5 w-3.5" aria-hidden="true" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {projects.length === 0 && (
              <tr><td colSpan={3} className="p-6 text-center text-gray-500">No projects yet.</td></tr>
            )}
          </tbody>
        </table>
      </div>
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4" role="dialog" aria-modal="true" aria-label="Project form">
          <form onSubmit={handleSave} className="w-full max-w-lg rounded-2xl border border-slate-700 bg-slate-900 p-6">
            <h2 className="text-lg font-bold text-white">{editing ? "Edit Project" : "New Project"}</h2>
            <div className="mt-4 space-y-4">
              <div>
                <label htmlFor="proj-title" className="mb-1.5 block text-xs font-semibold text-gray-200">Title *</label>
                <input id="proj-title" value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value, slug: editing ? formData.slug : e.target.value.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)+/g, "") })} required className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2.5 text-sm text-white focus:border-[var(--accent-bright)] focus:outline-none" />
              </div>
              <div>
                <label htmlFor="proj-app" className="mb-1.5 block text-xs font-semibold text-gray-200">Application</label>
                <input id="proj-app" value={formData.application} onChange={(e) => setFormData({ ...formData, application: e.target.value })} className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2.5 text-sm text-white focus:border-[var(--accent-bright)] focus:outline-none" />
              </div>
              <div>
                <label htmlFor="proj-desc" className="mb-1.5 block text-xs font-semibold text-gray-200">Description</label>
                <textarea id="proj-desc" value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} rows={4} className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2.5 text-sm text-white focus:border-[var(--accent-bright)] focus:outline-none" />
              </div>
              <div>
                <label htmlFor="proj-image" className="mb-1.5 block text-xs font-semibold text-gray-200">Image URL</label>
                <input id="proj-image" value={formData.imageUrl} onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })} className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2.5 text-sm text-white focus:border-[var(--accent-bright)] focus:outline-none" />
              </div>
              <div>
                <label htmlFor="proj-image-type" className="mb-1.5 block text-xs font-semibold text-gray-200">Image provenance</label>
                <select id="proj-image-type" value={formData.imageType} onChange={(e) => setFormData({ ...formData, imageType: e.target.value })} className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2.5 text-sm text-white focus:border-[var(--accent-bright)] focus:outline-none"><option value="REAL_COMPANY_PHOTO">Real company photo</option><option value="AI_GENERATED_CONCEPT">AI generated concept</option><option value="STOCK_LICENSED">Licensed stock</option><option value="USER_UPLOADED">User uploaded</option></select>
              </div>
            </div>
            <div className="mt-6 flex justify-end gap-3">
              <button type="button" onClick={() => setModalOpen(false)} className="rounded-lg border border-slate-700 px-4 py-2.5 text-xs font-bold uppercase tracking-wider text-gray-300 hover:text-white">Cancel</button>
              <button type="submit" className="rounded-lg bg-[var(--accent)] px-4 py-2.5 text-xs font-bold uppercase tracking-wider text-[var(--accent-fg)] hover:bg-[var(--accent-hover)]">Save</button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
