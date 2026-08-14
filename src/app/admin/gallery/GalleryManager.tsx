"use client";

import { useState } from "react";
import Image from "next/image";
import { Plus, Trash2, X } from "lucide-react";

interface GalleryItem {
  id: string;
  title: string;
  category: string;
  imageUrl: string;
  description?: string | null;
  active: boolean;
}

interface GalleryManagerProps {
  initialItems: GalleryItem[];
}

export default function GalleryManager({ initialItems }: GalleryManagerProps) {
  const [items, setItems] = useState<GalleryItem[]>(initialItems);
  const [modalOpen, setModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    title: "",
    category: "Machinery",
    imageUrl: "https://images.unsplash.com/photo-1595974482597-4b8da8879bc5?auto=format&fit=crop&w=800&q=80",
    description: "",
    active: true,
  });

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch("/api/gallery", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const created = await res.json();
      if (!res.ok) throw new Error(created.error || "Failed to add image");

      setItems([created, ...items]);
      setModalOpen(false);
      setFormData({
        title: "",
        category: "Machinery",
        imageUrl: "https://images.unsplash.com/photo-1595974482597-4b8da8879bc5?auto=format&fit=crop&w=800&q=80",
        description: "",
        active: true,
      });
    } catch (err: any) {
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this gallery photo?")) return;
    try {
      const res = await fetch(`/api/gallery/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed to delete item");
      setItems(items.filter((item) => item.id !== id));
    } catch (err: any) {
      alert(err.message);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-white">Workshop & Plant Gallery</h1>
          <p className="text-xs text-gray-400">Upload plant photographs, machinery showcases, and workshop images.</p>
        </div>

        <button
          onClick={() => setModalOpen(true)}
          className="inline-flex items-center justify-center px-4 py-2.5 text-xs font-bold text-slate-950 bg-amber-400 hover:bg-amber-300 rounded-xl transition-all shadow-sm"
        >
          <Plus className="w-4 h-4 mr-1.5" />
          <span>Upload Photo</span>
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {items.map((item) => (
          <div key={item.id} className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden space-y-3 p-3">
            <div className="relative aspect-4/3 rounded-xl overflow-hidden bg-slate-950">
              <Image src={item.imageUrl} alt={item.title} fill className="object-cover" />
              <span className="absolute top-2 right-2 bg-slate-950/80 text-amber-400 font-mono text-[10px] px-2 py-0.5 rounded-md">
                {item.category}
              </span>
            </div>

            <div className="space-y-1">
              <h3 className="font-bold text-xs text-white truncate">{item.title}</h3>
              {item.description && <p className="text-[10px] text-gray-400 truncate">{item.description}</p>}
            </div>

            <div className="pt-2 border-t border-slate-800 flex justify-end">
              <button
                onClick={() => handleDelete(item.id)}
                className="p-1.5 text-red-400 hover:text-red-300 bg-red-950/40 rounded-lg text-xs flex items-center space-x-1"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Delete</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      {modalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-md w-full p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-lg font-bold text-white">Upload Gallery Image</h3>
              <button onClick={() => setModalOpen(false)} className="text-gray-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-gray-300 mb-1">Image Title *</label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="e.g. Rotavator Assembly Line"
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-white focus:outline-none focus:border-emerald-600"
                />
              </div>

              <div>
                <label className="block font-bold text-gray-300 mb-1">Category Tag *</label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-white focus:outline-none focus:border-emerald-600"
                >
                  <option value="Machinery">Machinery</option>
                  <option value="Infrastructure">Infrastructure</option>
                  <option value="Workshop">Workshop</option>
                  <option value="Products">Products</option>
                  <option value="Quality">Quality</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-gray-300 mb-1">Image URL *</label>
                <input
                  type="url"
                  required
                  value={formData.imageUrl}
                  onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-white focus:outline-none focus:border-emerald-600"
                />
              </div>

              <div>
                <label className="block font-bold text-gray-300 mb-1">Caption / Description</label>
                <input
                  type="text"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Brief image caption..."
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-white focus:outline-none focus:border-emerald-600"
                />
              </div>

              <div className="pt-4 border-t border-slate-800 flex items-center justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2 font-bold text-gray-400 hover:text-white bg-slate-800 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-5 py-2 font-bold text-slate-950 bg-amber-400 hover:bg-amber-300 rounded-lg"
                >
                  {loading ? "Uploading..." : "Save Image"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
