"use client";

import { useEffect, useState } from "react";
import { Plus, Pencil, Trash2, Search, X } from "lucide-react";

interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  content: string;
  category: string | null;
  published: boolean;
  author: string | null;
  createdAt: string;
}

interface BlogManagerProps {
  initialPosts: BlogPost[];
}

const EMPTY_FORM = {
  title: "",
  slug: "",
  excerpt: "",
  content: "",
  category: "Agriculture",
  published: false,
  author: "",
};

export default function BlogManager({ initialPosts }: BlogManagerProps) {
  const [posts, setPosts] = useState<BlogPost[]>(initialPosts);
  const [search, setSearch] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<BlogPost | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState(EMPTY_FORM);

  const filtered = posts.filter(
    (p) =>
      p.title.toLowerCase().includes(search.toLowerCase()) ||
      p.slug.toLowerCase().includes(search.toLowerCase())
  );

  const openAdd = () => {
    setEditing(null);
    setFormData(EMPTY_FORM);
    setError(null);
    setModalOpen(true);
  };

  const openEdit = (post: BlogPost) => {
    setEditing(post);
    setFormData({
      title: post.title,
      slug: post.slug,
      excerpt: post.excerpt || "",
      content: post.content,
      category: post.category || "Agriculture",
      published: post.published,
      author: post.author || "",
    });
    setError(null);
    setModalOpen(true);
  };


  const handleTitleChange = (title: string) => {
    const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)+/g, "");
    setFormData((f) => ({ ...f, title, slug: editing ? f.slug : slug }));
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const url = editing ? `/api/blog/${editing.id}` : "/api/blog";
      const res = await fetch(url, {
        method: editing ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Save failed");
      if (editing) setPosts(posts.map((p) => (p.id === data.id ? data : p)));
      else setPosts([data, ...posts]);
      setModalOpen(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Save failed");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this post? This cannot be undone.")) return;
    try {
      const res = await fetch(`/api/blog/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Delete failed");
      setPosts(posts.filter((p) => p.id !== id));
    } catch {
      alert("Failed to delete post");
    }
  };

  useEffect(() => {
    if (!modalOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setModalOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [modalOpen]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-extrabold text-white">Blog and News</h1>
          <p className="text-xs text-gray-400">{posts.length} articles</p>
        </div>
        <button
          type="button"
          onClick={openAdd}
          className="inline-flex items-center gap-2 rounded-lg bg-[var(--accent)] px-4 py-2.5 text-xs font-bold uppercase tracking-wider text-[var(--accent-fg)] hover:bg-[var(--accent-hover)]"
        >
          <Plus className="h-4 w-4" aria-hidden="true" /> New Article
        </button>
      </div>

      <div className="relative max-w-sm">
        <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" aria-hidden="true" />
        <input
          type="search"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search articles"
          aria-label="Search articles"
          className="w-full rounded-lg border border-slate-800 bg-slate-900 py-2.5 pl-9 pr-8 text-sm text-white placeholder:text-gray-500 focus:border-[var(--accent-bright)] focus:outline-none"
        />
        {search && (
          <button type="button" onClick={() => setSearch("")} aria-label="Clear search" className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white">
            <X className="h-4 w-4" aria-hidden="true" />
          </button>
        )}
      </div>

      <div className="overflow-x-auto rounded-2xl border border-slate-800 bg-slate-900">
        <table className="w-full text-left text-xs text-gray-300">
          <thead className="bg-slate-950 text-[10px] uppercase tracking-wider text-gray-400">
            <tr>
              <th className="p-3">Title</th>
              <th className="p-3">Category</th>
              <th className="p-3">Status</th>
              <th className="p-3">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800">
            {filtered.map((post) => (
              <tr key={post.id} className="hover:bg-slate-800/50">
                <td className="p-3">
                  <span className="block font-bold text-white">{post.title}</span>
                  <span className="font-mono text-[11px] text-gray-500">/blog/{post.slug}</span>
                </td>
                <td className="p-3 text-gray-400">{post.category || "—"}</td>
                <td className="p-3">
                  <span className={`rounded-full border px-2 py-0.5 text-[10px] font-bold ${post.published ? "border-[var(--accent-bright)]/60 bg-[var(--accent)]/20 text-[var(--accent-on-dark-strong)]" : "border-slate-700 bg-slate-800 text-gray-400"}`}>
                    {post.published ? "PUBLISHED" : "DRAFT"}
                  </span>
                </td>
                <td className="p-3">
                  <div className="flex items-center gap-2">
                    <button type="button" onClick={() => openEdit(post)} aria-label={`Edit ${post.title}`} className="rounded-md border border-slate-700 p-1.5 text-gray-300 hover:border-[var(--accent-bright)] hover:text-white">
                      <Pencil className="h-3.5 w-3.5" aria-hidden="true" />
                    </button>
                    <button type="button" onClick={() => handleDelete(post.id)} aria-label={`Delete ${post.title}`} className="rounded-md border border-slate-700 p-1.5 text-gray-300 hover:border-red-500 hover:text-red-400">
                      <Trash2 className="h-3.5 w-3.5" aria-hidden="true" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr>
                <td colSpan={4} className="p-6 text-center text-gray-500">No articles found.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>


      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4" role="dialog" aria-modal="true" aria-label={editing ? "Edit article" : "New article"}>
          <form onSubmit={handleSave} className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl border border-slate-700 bg-slate-900 p-6">
            <h2 className="text-lg font-bold text-white">{editing ? "Edit Article" : "New Article"}</h2>
            {error && <p role="alert" className="mt-3 rounded-lg border border-red-800 bg-red-950 px-3 py-2 text-xs text-red-300">{error}</p>}
            <div className="mt-4 space-y-4">
              <div>
                <label htmlFor="blog-title" className="mb-1.5 block text-xs font-semibold text-gray-200">Title *</label>
                <input id="blog-title" value={formData.title} onChange={(e) => handleTitleChange(e.target.value)} required className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2.5 text-sm text-white focus:border-[var(--accent-bright)] focus:outline-none" />
              </div>
              <div>
                <label htmlFor="blog-slug" className="mb-1.5 block text-xs font-semibold text-gray-200">Slug *</label>
                <input id="blog-slug" value={formData.slug} onChange={(e) => setFormData({ ...formData, slug: e.target.value })} required pattern="[a-z0-9]+(?:-[a-z0-9]+)*" className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2.5 font-mono text-sm text-white focus:border-[var(--accent-bright)] focus:outline-none" />
              </div>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label htmlFor="blog-category" className="mb-1.5 block text-xs font-semibold text-gray-200">Category</label>
                  <input id="blog-category" value={formData.category} onChange={(e) => setFormData({ ...formData, category: e.target.value })} className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2.5 text-sm text-white focus:border-[var(--accent-bright)] focus:outline-none" />
                </div>
                <div>
                  <label htmlFor="blog-author" className="mb-1.5 block text-xs font-semibold text-gray-200">Author</label>
                  <input id="blog-author" value={formData.author} onChange={(e) => setFormData({ ...formData, author: e.target.value })} className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2.5 text-sm text-white focus:border-[var(--accent-bright)] focus:outline-none" />
                </div>
              </div>
              <div>
                <label htmlFor="blog-excerpt" className="mb-1.5 block text-xs font-semibold text-gray-200">Excerpt</label>
                <textarea id="blog-excerpt" value={formData.excerpt} onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })} rows={2} className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2.5 text-sm text-white focus:border-[var(--accent-bright)] focus:outline-none" />
              </div>
              <div>
                <label htmlFor="blog-content" className="mb-1.5 block text-xs font-semibold text-gray-200">Content (HTML allowed) *</label>
                <textarea id="blog-content" value={formData.content} onChange={(e) => setFormData({ ...formData, content: e.target.value })} rows={10} required className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2.5 font-mono text-xs text-white focus:border-[var(--accent-bright)] focus:outline-none" />
              </div>
              <label className="flex items-center gap-2 text-xs text-gray-200">
                <input type="checkbox" checked={formData.published} onChange={(e) => setFormData({ ...formData, published: e.target.checked })} className="h-4 w-4 accent-green-600" />
                Published (visible on the public blog)
              </label>
            </div>
            <div className="mt-6 flex justify-end gap-3">
              <button type="button" onClick={() => setModalOpen(false)} className="rounded-lg border border-slate-700 px-4 py-2.5 text-xs font-bold uppercase tracking-wider text-gray-300 hover:text-white">Cancel</button>
              <button type="submit" disabled={loading} className="rounded-lg bg-[var(--accent)] px-4 py-2.5 text-xs font-bold uppercase tracking-wider text-[var(--accent-fg)] hover:bg-[var(--accent-hover)] disabled:opacity-60">
                {loading ? "Saving" : editing ? "Save Changes" : "Publish Article"}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
