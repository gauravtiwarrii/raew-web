"use client";

import { useState } from "react";
import Image from "next/image";
import { Plus, Edit2, Trash2, CheckCircle2, XCircle, Star, Search, X } from "lucide-react";

interface Category {
  id: string;
  name: string;
}

interface Product {
  id: string;
  name: string;
  slug: string;
  categoryId: string;
  category: Category;
  shortDescription: string;
  description: string;
  specifications: string;
  features: string;
  applications: string;
  image: string;
  galleryImages: string;
  priceDisplay: string;
  availability: string;
  featured: boolean;
  active: boolean;
}

interface ProductManagerProps {
  initialProducts: any[];
  categories: Category[];
}

export default function ProductManager({ initialProducts, categories }: ProductManagerProps) {
  const [products, setProducts] = useState<any[]>(initialProducts);
  const [search, setSearch] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<any | null>(null);
  const [loading, setLoading] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    name: "",
    slug: "",
    categoryId: categories[0]?.id || "",
    shortDescription: "",
    description: "",
    specifications: "{\n  \"Working Width\": \"6 ft\",\n  \"Tractor Power\": \"45 HP\",\n  \"Blades\": \" boron steel\"\n}",
    features: "[\"Heavy duty boron steel blades\", \"Multi-speed gearbox\"]",
    applications: "[\"Seedbed preparation\", \"Stubble mulching\"]",
    image: "https://images.unsplash.com/photo-1592982537447-7440770cbfc9?auto=format&fit=crop&w=800&q=80",
    priceDisplay: "Price on Request",
    availability: "In Stock",
    featured: false,
    active: true,
  });

  const filteredProducts = products.filter((p) =>
    p.name.toLowerCase().includes(search.toLowerCase()) ||
    p.category.name.toLowerCase().includes(search.toLowerCase())
  );

  const openAddModal = () => {
    setEditingProduct(null);
    setFormData({
      name: "",
      slug: "",
      categoryId: categories[0]?.id || "",
      shortDescription: "",
      description: "",
      specifications: "{\n  \"Working Width\": \"6 ft\",\n  \"Tractor Power\": \"45 HP\",\n  \"Blades\": \" boron steel\"\n}",
      features: "[\"Heavy duty boron steel blades\", \"Multi-speed gearbox\"]",
      applications: "[\"Seedbed preparation\", \"Stubble mulching\"]",
      image: "https://images.unsplash.com/photo-1592982537447-7440770cbfc9?auto=format&fit=crop&w=800&q=80",
      priceDisplay: "Price on Request",
      availability: "In Stock",
      featured: false,
      active: true,
    });
    setModalOpen(true);
  };

  const openEditModal = (product: any) => {
    setEditingProduct(product);
    setFormData({
      name: product.name,
      slug: product.slug,
      categoryId: product.categoryId,
      shortDescription: product.shortDescription,
      description: product.description,
      specifications: product.specifications,
      features: product.features,
      applications: product.applications,
      image: product.image,
      priceDisplay: product.priceDisplay,
      availability: product.availability,
      featured: product.featured,
      active: product.active,
    });
    setModalOpen(true);
  };

  const handleNameChange = (nameVal: string) => {
    const slugVal = nameVal
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)+/g, "");
    setFormData({ ...formData, name: nameVal, slug: editingProduct ? formData.slug : slugVal });
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (editingProduct) {
        // PUT update
        const res = await fetch(`/api/products/${editingProduct.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        });
        const updated = await res.json();
        if (!res.ok) throw new Error(updated.error || "Update failed");

        setProducts(products.map((p) => (p.id === updated.id ? updated : p)));
      } else {
        // POST create
        const res = await fetch("/api/products", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        });
        const created = await res.json();
        if (!res.ok) throw new Error(created.error || "Create failed");

        setProducts([created, ...products]);
      }
      setModalOpen(false);
    } catch (err: any) {
      alert(err.message || "Failed to save product");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this machinery product?")) return;
    try {
      const res = await fetch(`/api/products/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed to delete product");
      setProducts(products.filter((p) => p.id !== id));
    } catch (err: any) {
      alert(err.message);
    }
  };

  const toggleFeatured = async (product: any) => {
    try {
      const updatedVal = !product.featured;
      const res = await fetch(`/api/products/${product.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ featured: updatedVal }),
      });
      const updated = await res.json();
      if (!res.ok) throw new Error("Failed to update");
      setProducts(products.map((p) => (p.id === product.id ? updated : p)));
    } catch (err: any) {
      alert(err.message);
    }
  };

  const toggleActive = async (product: any) => {
    try {
      const updatedVal = !product.active;
      const res = await fetch(`/api/products/${product.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ active: updatedVal }),
      });
      const updated = await res.json();
      if (!res.ok) throw new Error("Failed to update");
      setProducts(products.map((p) => (p.id === product.id ? updated : p)));
    } catch (err: any) {
      alert(err.message);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-white">Machinery & Products</h1>
          <p className="text-xs text-gray-400">Manage agricultural machinery listings, specs, and visibility.</p>
        </div>

        <button
          onClick={openAddModal}
          className="inline-flex items-center justify-center px-4 py-2.5 text-xs font-bold text-slate-950 bg-amber-400 hover:bg-amber-300 rounded-xl transition-all shadow-sm"
        >
          <Plus className="w-4 h-4 mr-1.5" />
          <span>Add New Product</span>
        </button>
      </div>

      {/* Search Bar */}
      <div className="relative max-w-md">
        <Search className="w-4 h-4 text-gray-500 absolute left-3 top-3" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Filter products..."
          className="w-full pl-9 pr-3 py-2 text-xs bg-slate-900 border border-slate-800 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-emerald-600"
        />
      </div>

      {/* Products Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-gray-300">
            <thead className="bg-slate-950 text-gray-400 uppercase text-[10px] tracking-wider border-b border-slate-800">
              <tr>
                <th className="p-3.5">Image & Name</th>
                <th className="p-3.5">Category</th>
                <th className="p-3.5">Price Display</th>
                <th className="p-3.5 text-center">Featured</th>
                <th className="p-3.5 text-center">Active</th>
                <th className="p-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {filteredProducts.map((product) => (
                <tr key={product.id} className="hover:bg-slate-800/40">
                  <td className="p-3.5">
                    <div className="flex items-center space-x-3">
                      <div className="relative w-12 h-10 rounded-lg overflow-hidden bg-slate-950 border border-slate-800 shrink-0">
                        <Image src={product.image} alt={product.name} fill className="object-cover" />
                      </div>
                      <div>
                        <span className="font-bold text-white block">{product.name}</span>
                        <span className="text-[10px] text-gray-500 font-mono">/products/{product.slug}</span>
                      </div>
                    </div>
                  </td>
                  <td className="p-3.5 font-semibold text-emerald-400">{product.category.name}</td>
                  <td className="p-3.5 font-semibold text-amber-300">{product.priceDisplay}</td>
                  <td className="p-3.5 text-center">
                    <button
                      onClick={() => toggleFeatured(product)}
                      className={`p-1.5 rounded-lg transition-colors ${
                        product.featured ? "text-amber-400 bg-amber-950/50" : "text-gray-600 hover:text-gray-400"
                      }`}
                    >
                      <Star className="w-4 h-4 fill-current" />
                    </button>
                  </td>
                  <td className="p-3.5 text-center">
                    <button
                      onClick={() => toggleActive(product)}
                      className={`p-1.5 rounded-lg transition-colors ${
                        product.active ? "text-emerald-400" : "text-red-500"
                      }`}
                    >
                      {product.active ? <CheckCircle2 className="w-4 h-4" /> : <XCircle className="w-4 h-4" />}
                    </button>
                  </td>
                  <td className="p-3.5 text-right">
                    <div className="flex items-center justify-end space-x-2">
                      <button
                        onClick={() => openEditModal(product)}
                        className="p-1.5 text-gray-300 hover:text-white bg-slate-800 rounded-lg"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleDelete(product.id)}
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
      </div>

      {/* Add / Edit Product Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-2xl w-full p-6 space-y-4 my-8">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-lg font-bold text-white">
                {editingProduct ? "Edit Product" : "Add New Machinery Product"}
              </h3>
              <button onClick={() => setModalOpen(false)} className="text-gray-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-gray-300 mb-1">Product Name *</label>
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
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block font-bold text-gray-300 mb-1">Category *</label>
                  <select
                    value={formData.categoryId}
                    onChange={(e) => setFormData({ ...formData, categoryId: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-white focus:outline-none focus:border-emerald-600"
                  >
                    {categories.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-gray-300 mb-1">Price Display</label>
                  <input
                    type="text"
                    value={formData.priceDisplay}
                    onChange={(e) => setFormData({ ...formData, priceDisplay: e.target.value })}
                    placeholder="Price on Request"
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-white focus:outline-none focus:border-emerald-600"
                  />
                </div>

                <div>
                  <label className="block font-bold text-gray-300 mb-1">Availability</label>
                  <input
                    type="text"
                    value={formData.availability}
                    onChange={(e) => setFormData({ ...formData, availability: e.target.value })}
                    placeholder="In Stock"
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-white focus:outline-none focus:border-emerald-600"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-gray-300 mb-1">Main Image URL *</label>
                <input
                  type="url"
                  required
                  value={formData.image}
                  onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-white focus:outline-none focus:border-emerald-600"
                />
              </div>

              <div>
                <label className="block font-bold text-gray-300 mb-1">Short Description *</label>
                <input
                  type="text"
                  required
                  value={formData.shortDescription}
                  onChange={(e) => setFormData({ ...formData, shortDescription: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-white focus:outline-none focus:border-emerald-600"
                />
              </div>

              <div>
                <label className="block font-bold text-gray-300 mb-1">Full Description *</label>
                <textarea
                  rows={3}
                  required
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-white focus:outline-none focus:border-emerald-600"
                />
              </div>

              <div>
                <label className="block font-bold text-gray-300 mb-1">Technical Specifications (JSON format)</label>
                <textarea
                  rows={3}
                  value={formData.specifications}
                  onChange={(e) => setFormData({ ...formData, specifications: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-amber-300 font-mono focus:outline-none focus:border-emerald-600"
                />
              </div>

              <div className="flex items-center space-x-6 pt-2">
                <label className="flex items-center space-x-2 text-gray-300 font-bold">
                  <input
                    type="checkbox"
                    checked={formData.featured}
                    onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                    className="rounded text-emerald-600"
                  />
                  <span>Mark Featured</span>
                </label>

                <label className="flex items-center space-x-2 text-gray-300 font-bold">
                  <input
                    type="checkbox"
                    checked={formData.active}
                    onChange={(e) => setFormData({ ...formData, active: e.target.checked })}
                    className="rounded text-emerald-600"
                  />
                  <span>Active in Catalog</span>
                </label>
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
                  {loading ? "Saving..." : "Save Product"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
