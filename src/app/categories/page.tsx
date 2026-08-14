import Link from "next/link";
import Image from "next/image";
import { prisma } from "@/lib/db";
import { ArrowRight, Layers } from "lucide-react";

export const metadata = {
  title: "Machinery Categories",
  description: "Explore agricultural machinery categories including rotavators, threshers, land levelers, tipping trailers, and custom fabrication.",
};

export const revalidate = 60;

export default async function CategoriesPage() {
  const categories = await prisma.category.findMany({
    where: { active: true },
    include: {
      _count: {
        select: { products: true },
      },
    },
    orderBy: { sortOrder: "asc" },
  });

  return (
    <div className="space-y-10 py-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Header Banner */}
      <div className="bg-slate-950 text-white p-8 rounded-2xl border border-slate-800 space-y-3">
        <div className="inline-flex items-center space-x-2 text-xs font-bold text-amber-400 uppercase tracking-wider bg-slate-900 px-3 py-1 rounded-md border border-slate-800">
          <Layers className="w-4 h-4 text-amber-400" />
          <span>Product Range Classification</span>
        </div>
        <h1 className="text-3xl font-extrabold text-white tracking-tight">
          Machinery Categories
        </h1>
        <p className="text-xs sm:text-sm text-gray-300 max-w-2xl leading-relaxed">
          Select a category below to explore specific agricultural machinery models, technical specifications, and available field attachments.
        </p>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {categories.map((cat) => (
          <Link
            key={cat.id}
            href={`/products?category=${cat.slug}`}
            className="group bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-xs hover:shadow-md transition-all flex flex-col justify-between"
          >
            <div className="relative aspect-16/9 bg-gray-100 overflow-hidden">
              {cat.image ? (
                <Image
                  src={cat.image}
                  alt={cat.name}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-emerald-950 text-emerald-400">
                  <Layers className="w-10 h-10" />
                </div>
              )}
              <span className="absolute top-3 right-3 bg-slate-950/80 text-amber-400 font-extrabold text-xs px-2.5 py-1 rounded-md">
                {cat._count.products} Models Available
              </span>
            </div>

            <div className="p-6 space-y-3 flex-1 flex flex-col justify-between">
              <div className="space-y-2">
                <h3 className="font-extrabold text-xl text-slate-900 group-hover:text-emerald-800 transition-colors">
                  {cat.name}
                </h3>
                <p className="text-xs text-gray-600 leading-relaxed">
                  {cat.description || "High-performance equipment built for agricultural efficiency."}
                </p>
              </div>

              <div className="pt-4 border-t border-gray-100 flex items-center justify-between text-xs font-bold text-emerald-800">
                <span>Browse Machinery</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
