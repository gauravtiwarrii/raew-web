"use client";

import { useState } from "react";
import { Plus, Trash2 } from "lucide-react";

interface Job {
  id: string;
  title: string;
  slug: string;
  location: string;
  type: string;
  active: boolean;
}

interface CareerManagerProps {
  initialJobs: Job[];
  initialApplications: {
    id: string;
    name: string;
    email: string;
    phone: string | null;
    jobId: string;
    status: string;
    createdAt: string;
  }[];
}

export default function CareerManager({ initialJobs, initialApplications }: CareerManagerProps) {
  const [jobs, setJobs] = useState<Job[]>(initialJobs);
  const [applications] = useState(initialApplications);
  const [modalOpen, setModalOpen] = useState(false);
  const [formData, setFormData] = useState({ title: "", slug: "", location: "Mirzapur, UP", type: "Full-time", description: "" });

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await fetch("/api/careers", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    });
    const data = await res.json();
    if (!res.ok) {
      alert(data.error || "Save failed");
      return;
    }
    setJobs([data, ...jobs]);
    setModalOpen(false);
  };

  const handleDeleteJob = async (id: string) => {
    if (!confirm("Delete this role?")) return;
    const res = await fetch(`/api/careers/${id}`, { method: "DELETE" });
    if (res.ok) setJobs(jobs.filter((j) => j.id !== id));
    else alert("Delete failed");
  };


  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-extrabold text-white">Careers</h1>
          <p className="text-xs text-gray-400">{jobs.length} open roles and {applications.length} applications</p>
        </div>
        <button type="button" onClick={() => setModalOpen(true)} className="inline-flex items-center gap-2 rounded-lg bg-[var(--accent)] px-4 py-2.5 text-xs font-bold uppercase tracking-wider text-[var(--accent-fg)] hover:bg-[var(--accent-hover)]">
          <Plus className="h-4 w-4" aria-hidden="true" /> New Role
        </button>
      </div>
      <div className="overflow-x-auto rounded-2xl border border-slate-800 bg-slate-900">
        <table className="w-full text-left text-xs text-gray-300">
          <thead className="bg-slate-950 text-[10px] uppercase tracking-wider text-gray-400">
            <tr>
              <th className="p-3">Role</th>
              <th className="p-3">Location</th>
              <th className="p-3">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800">
            {jobs.map((j) => (
              <tr key={j.id} className="hover:bg-slate-800/50">
                <td className="p-3 font-bold text-white">{j.title}</td>
                <td className="p-3 text-gray-400">{j.location}</td>
                <td className="p-3">
                  <button type="button" onClick={() => handleDeleteJob(j.id)} aria-label={`Delete ${j.title}`} className="rounded-md border border-slate-700 p-1.5 hover:border-red-500 hover:text-red-400">
                    <Trash2 className="h-3.5 w-3.5" aria-hidden="true" />
                  </button>
                </td>
              </tr>
            ))}
            {jobs.length === 0 && (
              <tr><td colSpan={3} className="p-6 text-center text-gray-500">No open roles.</td></tr>
            )}
          </tbody>
        </table>
      </div>
      <div className="overflow-x-auto rounded-2xl border border-slate-800 bg-slate-900">
        <h2 className="border-b border-slate-800 px-4 py-3 text-sm font-bold text-white">Applications</h2>
        <table className="w-full text-left text-xs text-gray-300">
          <thead className="bg-slate-950 text-[10px] uppercase tracking-wider text-gray-400">
            <tr>
              <th className="p-3">Applicant</th>
              <th className="p-3">Email</th>
              <th className="p-3">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800">
            {applications.map((a) => (
              <tr key={a.id} className="hover:bg-slate-800/50">
                <td className="p-3 font-bold text-white">{a.name}</td>
                <td className="p-3 text-gray-400">{a.email}</td>
                <td className="p-3 text-gray-400">{a.status}</td>
              </tr>
            ))}
            {applications.length === 0 && (
              <tr><td colSpan={3} className="p-6 text-center text-gray-500">No applications yet.</td></tr>
            )}
          </tbody>
        </table>
      </div>
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4" role="dialog" aria-modal="true" aria-label="New role">
          <form onSubmit={handleSave} className="w-full max-w-lg rounded-2xl border border-slate-700 bg-slate-900 p-6">
            <h2 className="text-lg font-bold text-white">New Role</h2>
            <div className="mt-4 space-y-4">
              <div>
                <label htmlFor="job-title" className="mb-1.5 block text-xs font-semibold text-gray-200">Title *</label>
                <input id="job-title" value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value, slug: e.target.value.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)+/g, "") })} required className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2.5 text-sm text-white focus:border-[var(--accent-bright)] focus:outline-none" />
              </div>
              <div>
                <label htmlFor="job-desc" className="mb-1.5 block text-xs font-semibold text-gray-200">Description *</label>
                <textarea id="job-desc" value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} rows={5} required className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2.5 text-sm text-white focus:border-[var(--accent-bright)] focus:outline-none" />
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
