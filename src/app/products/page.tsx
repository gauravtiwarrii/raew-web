import Link from "next/link";
import { prisma } from "@/lib/db";
import ProductCard from "@/components/ProductCard";
import { Search, Filter, Wrench } from "lucide-react";

export const metadata = {
  title: "Agricultural Machinery Products Catalog",
  description: "Browse our complete range of rotavators, multi-crop threshers, laser land levelers, tipping trailers, seed drills, and custom farm implements.",
};

export const revalidate = 30;

interface ProductsPageProps {
  searchParams: Promise<{
    search?: string;
    category?: string;
    sort?: string;
  }>;
}

export default async function ProductsPage({ searchParams }: ProductsPageProps) {
  const params = await searchParams;
  const search = params.search || "";
  const categorySlug = params.category || "";
  const sort = params.sort || "newest";

  const categories = await prisma.category.findMany({
    where: { active: true },
    orderBy: { sortOrder: "asc" },
  });

  const whereClause: any = { active: true };

  if (categorySlug) {
    whereClause.category = { slug: categorySlug };
  }

  if (search) {
    whereClause.OR = [
      { name: { contains: search } },
      { shortDescription: { contains: search } },
      { description: { contains: search } },
    ];
  }

  let orderBy: any = { createdAt: "desc" };
  if (sort === "name-asc") orderBy = { name: "asc" };
  if (sort === "name-desc") orderBy = { name: "desc" };

  const products = await prisma.product.findMany({
    where: whereClause,
    include: { category: true },
    orderBy,
  });

  return (
    <div className="space-y-10 py-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Header Banner */}
      <div className="bg-slate-950 text-white p-8 rounded-2xl border border-slate-800 space-y-4">
        <div className="inline-flex items-center space-x-2 text-xs font-bold text-amber-400 uppercase tracking-wider bg-slate-900 px-3 py-1 rounded-md border border-slate-800">
          <Wrench className="w-4 h-4 text-amber-400" />
          <span>Industrial Equipment Catalog</span>
        </div>
        <h1 className="text-3xl font-extrabold text-white tracking-tight">
          Agricultural Machinery & Engineering Products
        </h1>
        <p className="text-xs sm:text-sm text-gray-300 max-w-2xl leading-relaxed">
          High-durability rotavators, laser land levelers, multi-crop threshers, tipping trailers, and custom farm implements. Built for heavy field endurance and peak operational output.
        </p>
      </div>

      {/* Search & Filter Bar */}
      <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-xs space-y-4">
        <form method="GET" className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
          {/* Search Bar */}
          <div className="md:col-span-5 relative">
            <Search className="w-4 h-4 text-gray-400 absolute left-3 top-3.5" />
            <input
              type="text"
              name="search"
              defaultValue={search}
              placeholder="Search rotavator, thresher, leveler..."
              className="w-full pl-9 pr-4 py-2.5 text-sm bg-gray-50 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-700"
            />
          </div>

          {/* Category Dropdown */}
          <div className="md:col-span-4">
            <select
              name="category"
              defaultValue={categorySlug}
              className="w-full px-3 py-2.5 text-sm bg-gray-50 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-700"
            >
              <option value="">All Machinery Categories</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.slug}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>

          {/* Sort Dropdown */}
          <div className="md:col-span-2">
            <select
              name="sort"
              defaultValue={sort}
              className="w-full px-3 py-2.5 text-sm bg-gray-50 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-700"
            >
              <option value="newest">Newest First</option>
              <option value="name-asc">Name (A-Z)</option>
              <option value="name-desc">Name (Z-A)</option>
            </select>
          </div>

          {/* Submit Filter Button */}
          <div className="md:col-span-1">
            <button
              type="submit"
              className="w-full py-2.5 text-sm font-bold text-white bg-emerald-700 hover:bg-emerald-800 rounded-lg transition-colors flex items-center justify-center"
            >
              <Filter className="w-4 h-4 mr-1" />
              <span>Filter</span>
            </button>
          </div>
        </form>

        {/* Category Quick Filter Chips */}
        <div className="flex flex-wrap gap-2 pt-2 border-t border-gray-100">
          <Link
            href="/products"
            className={`px-3 py-1 rounded-full text-xs font-semibold transition-colors ${
              !categorySlug
                ? "bg-emerald-800 text-white"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            All Products ({products.length})
          </Link>
          {categories.map((cat) => {
            const isActive = categorySlug === cat.slug;
            return (
              <Link
                key={cat.id}
                href={`/products?category=${cat.slug}${search ? `&search=${search}` : ""}`}
                className={`px-3 py-1 rounded-full text-xs font-semibold transition-colors ${
                  isActive
                    ? "bg-emerald-800 text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                {cat.name}
              </Link>
            );
          })}
        </div>
      </div>

      {/* Product Grid */}
      {products.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {products.map((product) => (
            <ProductCard
              key={product.id}
              id={product.id}
              name={product.name}
              slug={product.slug}
              categoryName={product.category.name}
              shortDescription={product.shortDescription}
              image={product.image}
              priceDisplay={product.priceDisplay}
              availability={product.availability}
              featured={product.featured}
            />
          ))}
        </div>
      ) : (
        <div className="bg-white p-12 rounded-xl border border-gray-200 text-center space-y-4">
          <Wrench className="w-12 h-12 text-gray-400 mx-auto" />
          <h3 className="text-lg font-bold text-slate-900">No machinery matching your filter</h3>
          <p className="text-xs text-gray-500 max-w-sm mx-auto">
            Try adjusting your search query or selected category filter to view available equipment.
          </p>
          <Link
            href="/products"
            className="inline-block px-4 py-2 text-xs font-bold text-emerald-800 bg-emerald-50 rounded-md border border-emerald-200"
          >
            Reset Filters
          </Link>
        </div>
      )}
    </div>
  );
}
