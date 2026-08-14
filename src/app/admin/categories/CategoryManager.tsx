"use client";

import { useState } from "react";
import { Plus, Edit2, Trash2, CheckCircle2, XCircle, X } from "lucide-react";

interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string | null;
  image?: string | null;
  sortOrder: number;
  active: boolean;
  _count?: { products: number };
}

interface CategoryManagerProps {
  initialCategories: Category[];
}

export default function CategoryManager({ initialCategories }: CategoryManagerProps) {
  const [categories, setCategories] = useState<Category[]>(initialCategories);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    slug: "",
    description: "",
    image: "",
    sortOrder: 0,
    active: true,
  });

  const openAddModal = () => {
    setEditingCategory(null);
    setFormData({
      name: "",
      slug: "",
      description: "",
      image: "",
      sortOrder: categories.length + 1,
      active: true,
    });
    setModalOpen(true);
  };

  const openEditModal = (cat: Category) => {
    setEditingCategory(cat);
    setFormData({
      name: cat.name,
      slug: cat.slug,
      description: cat.description || "",
      image: cat.image || "",
      sortOrder: cat.sortOrder,
      active: cat.active,
    });
    setModalOpen(true);
  };

  const handleNameChange = (nameVal: string) => {
    const slugVal = nameVal
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)+/g, "");
    setFormData({ ...formData, name: nameVal, slug: editingCategory ? formData.slug : slugVal });
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (editingCategory) {
        const res = await fetch(`/api/categories/${editingCategory.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        });
        const updated = await res.json();
        if (!res.ok) throw new Error(updated.error || "Update failed");

        setCategories(categories.map((c) => (c.id === updated.id ? { ...c, ...updated } : c)));
      } else {
        const res = await fetch("/api/categories", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        });
        const created = await res.json();
        if (!res.ok) throw new Error(created.error || "Create failed");

        setCategories([...categories, created]);
      }
      setModalOpen(false);
    } catch (err: any) {
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this category?")) return;
    try {
      const res = await fetch(`/api/categories/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed to delete category");
      setCategories(categories.filter((c) => c.id !== id));
    } catch (err: any) {
      alert(err.message);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-white">Machinery Categories</h1>
          <p className="text-xs text-gray-400">Configure equipment category classifications and display order.</p>
        </div>

        <button
          onClick={openAddModal}
          className="inline-flex items-center justify-center px-4 py-2.5 text-xs font-bold text-slate-950 bg-amber-400 hover:bg-amber-300 rounded-xl transition-all shadow-sm"
        >
          <Plus className="w-4 h-4 mr-1.5" />
          <span>Add New Category</span>
        </button>
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
        <table className="w-full text-left text-xs text-gray-300">
          <thead className="bg-slate-950 text-gray-400 uppercase text-[10px] tracking-wider border-b border-slate-800">
            <tr>
              <th className="p-3.5">Category Name & Slug</th>
              <th className="p-3.5">Description</th>
              <th className="p-3.5 text-center">Order</th>
              <th className="p-3.5 text-center">Active</th>
              <th className="p-3.5 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800">
            {categories.map((cat) => (
              <tr key={cat.id} className="hover:bg-slate-800/40">
                <td className="p-3.5">
                  <span className="font-bold text-white block">{cat.name}</span>
                  <span className="text-[10px] text-gray-500 font-mono">/categories/{cat.slug}</span>
                </td>
                <td className="p-3.5 text-gray-400 max-w-xs truncate">{cat.description || "N/A"}</td>
                <td className="p-3.5 text-center font-bold text-amber-400">{cat.sortOrder}</td>
                <td className="p-3.5 text-center">
                  {cat.active ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 mx-auto" />
                  ) : (
                    <XCircle className="w-4 h-4 text-red-500 mx-auto" />
                  )}
                </td>
                <td className="p-3.5 text-right">
                  <div className="flex items-center justify-end space-x-2">
                    <button
                      onClick={() => openEditModal(cat)}
                      className="p-1.5 text-gray-300 hover:text-white bg-slate-800 rounded-lg"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => handleDelete(cat.id)}
                      className="p-1.5 text-red-400 hover:text-red-300 bg-red-950/40 rounded-lg"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {modalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-md w-full p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-lg font-bold text-white">
                {editingCategory ? "Edit Category" : "Add New Category"}
              </h3>
              <button onClick={() => setModalOpen(false)} className="text-gray-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-gray-300 mb-1">Category Name *</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => handleNameChange(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-white focus:outline-none focus:border-emerald-600"
                />
              </div>

              <div>
                <label className="block font-bold text-gray-300 mb-1">URL Slug *</label>
                <input
                  type="text"
                  required
                  value={formData.slug}
                  onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-white font-mono focus:outline-none focus:border-emerald-600"
                />
              </div>

              <div>
                <label className="block font-bold text-gray-300 mb-1">Description</label>
                <textarea
                  rows={2}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-white focus:outline-none focus:border-emerald-600"
                />
              </div>

              <div>
                <label className="block font-bold text-gray-300 mb-1">Category Banner Image URL</label>
                <input
                  type="url"
                  value={formData.image}
                  onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-white focus:outline-none focus:border-emerald-600"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-gray-300 mb-1">Sort Order Number</label>
                  <input
                    type="number"
                    value={formData.sortOrder}
                    onChange={(e) => setFormData({ ...formData, sortOrder: Number(e.target.value) })}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-white focus:outline-none focus:border-emerald-600"
                  />
                </div>

                <div className="flex items-center pt-5">
                  <label className="flex items-center space-x-2 text-gray-300 font-bold">
                    <input
                      type="checkbox"
                      checked={formData.active}
                      onChange={(e) => setFormData({ ...formData, active: e.target.checked })}
                      className="rounded text-emerald-600"
                    />
                    <span>Active Category</span>
                  </label>
                </div>
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
                  {loading ? "Saving..." : "Save Category"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
