import Link from "next/link";
import type { Metadata } from "next";
import { prisma } from "@/lib/db";
import ProductCard from "@/components/products/ProductCard";
import { Search, SlidersHorizontal, PackageSearch } from "lucide-react";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://raew.in";

export const metadata: Metadata = {
  title: "Machinery Catalogue",
  description:
    "Rotavators, multi-crop threshers, laser land levelers, tipping trailers, seed drills and cultivators, built to order at our works in Mirzapur, Uttar Pradesh.",
  alternates: { canonical: `${SITE_URL}/products` },
};

export const revalidate = 30;

interface ProductsPageProps {
  searchParams: Promise<{ search?: string; category?: string; sort?: string }>;
}

interface CategoryRecord {
  id: string;
  name: string;
  slug: string;
}

interface ProductRecord {
  id: string;
  name: string;
  slug: string;
  shortDescription: string;
  image: string;
  priceDisplay: string;
  availability: string;
  featured: boolean;
  brochure: string | null;
  category: { name: string };
}

type SortKey = "newest" | "name-asc" | "name-desc";

const SORT_OPTIONS: { value: SortKey; label: string }[] = [
  { value: "newest", label: "Newest first" },
  { value: "name-asc", label: "Name (A–Z)" },
  { value: "name-desc", label: "Name (Z–A)" },
];

export default async function ProductsPage({ searchParams }: ProductsPageProps) {
  const params = await searchParams;
  const search = (params.search || "").trim();
  const categorySlug = params.category || "";
  const sort: SortKey = SORT_OPTIONS.some((o) => o.value === params.sort)
    ? (params.sort as SortKey)
    : "newest";

  let categories: CategoryRecord[] = [];
  let products: ProductRecord[] = [];
  let totalCount = 0;

  try {
    const orderBy =
      sort === "name-asc"
        ? { name: "asc" as const }
        : sort === "name-desc"
          ? { name: "desc" as const }
          : { createdAt: "desc" as const };

    const whereClause = {
      active: true,
      ...(categorySlug ? { category: { slug: categorySlug } } : {}),
      ...(search
        ? {
            OR: [
              { name: { contains: search } },
              { shortDescription: { contains: search } },
              { description: { contains: search } },
            ],
          }
        : {}),
    };

    // `totalCount` is queried separately and is deliberately unfiltered. The
    // "All machinery" chip previously printed `products.length`, i.e. the
    // *filtered* count — so with a category selected it read "All machinery (2)"
    // while clicking it revealed six. It now shows the true catalogue total.
    [categories, products, totalCount] = await Promise.all([
      prisma.category.findMany({
        where: { active: true },
        orderBy: { sortOrder: "asc" },
      }) as Promise<CategoryRecord[]>,
      prisma.product.findMany({
        where: whereClause,
        include: { category: true },
        orderBy,
      }) as Promise<ProductRecord[]>,
      prisma.product.count({ where: { active: true } }),
    ]);
  } catch (error) {
    console.error("Products page data fetch error:", error);
  }

  /** Build a filter URL preserving the other active parameters. */
  const filterHref = (nextCategory: string) => {
    const qs = new URLSearchParams();
    if (nextCategory) qs.set("category", nextCategory);
    if (search) qs.set("search", search);
    if (sort !== "newest") qs.set("sort", sort);
    const q = qs.toString();
    return q ? `/products?${q}` : "/products";
  };

  const isFiltered = Boolean(search || categorySlug);
  const activeCategory = categories.find((c) => c.slug === categorySlug);

  return (
    <div className="shell py-10">
      {/* ============ HEADER ============ */}
      <header className="max-w-3xl">
        <p className="eyebrow text-[var(--accent)]">Machinery catalogue</p>
        <h1 className="mt-3 text-3xl font-bold leading-tight tracking-tight text-[var(--text)] sm:text-4xl">
          Every machine, with its specifications.
        </h1>
        <p className="mt-4 text-[15px] leading-relaxed text-[var(--text-muted)]">
          Rotavators, threshers, laser land levelers, tipping trailers, seed drills and
          cultivators. Each one is built to order at our works — tell us your tractor
          horsepower and working width and we will confirm what fits.
        </p>
      </header>

      {/* ============ FILTERS ============ */}
      <div className="mt-10 border border-[var(--border)] bg-[var(--surface-2)]">
        <form
          method="GET"
          action="/products"
          className="grid grid-cols-1 gap-4 p-5 md:grid-cols-12"
        >
          <div className="md:col-span-6">
            <label
              htmlFor="product-search"
              className="spec-label mb-2 block text-[var(--text-subtle)]"
            >
              Search
            </label>
            <div className="relative">
              <Search
                className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--text-subtle)]"
                aria-hidden="true"
              />
              <input
                id="product-search"
                type="search"
                name="search"
                defaultValue={search}
                placeholder="Rotavator, thresher, leveler…"
                className="w-full border border-[var(--border-strong)] bg-[var(--surface)] py-2.5 pl-9 pr-3 text-sm text-[var(--text)] placeholder:text-[var(--text-subtle)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--focus)]"
              />
            </div>
          </div>

          <div className="md:col-span-3">
            <label
              htmlFor="product-category"
              className="spec-label mb-2 block text-[var(--text-subtle)]"
            >
              Category
            </label>
            <select
              id="product-category"
              name="category"
              defaultValue={categorySlug}
              className="w-full border border-[var(--border-strong)] bg-[var(--surface)] px-3 py-2.5 text-sm text-[var(--text)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--focus)]"
            >
              <option value="">All categories</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.slug}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>

          <div className="md:col-span-2">
            <label
              htmlFor="product-sort"
              className="spec-label mb-2 block text-[var(--text-subtle)]"
            >
              Sort
            </label>
            <select
              id="product-sort"
              name="sort"
              defaultValue={sort}
              className="w-full border border-[var(--border-strong)] bg-[var(--surface)] px-3 py-2.5 text-sm text-[var(--text)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--focus)]"
            >
              {SORT_OPTIONS.map((o) => (
                <option key={o.value} value={o.value}>
                  {o.label}
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-end md:col-span-1">
            <button
              type="submit"
              className="inline-flex rounded-[6px] w-full items-center justify-center gap-1.5 bg-[var(--accent)] px-3 py-2.5 text-sm font-bold text-[var(--accent-fg)] transition-colors duration-200 hover:bg-[var(--accent-hover)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--focus)]"
            >
              <SlidersHorizontal className="h-4 w-4" aria-hidden="true" />
              <span className="md:sr-only">Apply filters</span>
            </button>
          </div>
        </form>

        <div className="flex flex-wrap gap-2 border-t border-[var(--border)] p-5 pt-4">
          <Link
            href={filterHref("")}
            aria-current={!categorySlug ? "true" : undefined}
            className={`px-3 py-1.5 text-xs font-bold transition-colors duration-150 ${
              !categorySlug
                ? "bg-[var(--surface-inverse)] text-white"
                : "border border-[var(--border-strong)] text-[var(--text-muted)] hover:bg-[var(--surface)]"
            }`}
          >
            All machinery ({totalCount})
          </Link>
          {categories.map((cat) => {
            const isActive = categorySlug === cat.slug;
            return (
              <Link
                key={cat.id}
                href={filterHref(cat.slug)}
                aria-current={isActive ? "true" : undefined}
                className={`px-3 py-1.5 text-xs font-bold transition-colors duration-150 ${
                  isActive
                    ? "bg-[var(--surface-inverse)] text-white"
                    : "border border-[var(--border-strong)] text-[var(--text-muted)] hover:bg-[var(--surface)]"
                }`}
              >
                {cat.name}
              </Link>
            );
          })}
        </div>
      </div>

      {/* ============ RESULTS ============ */}
      <p aria-live="polite" className="mt-6 text-xs font-semibold text-[var(--text-muted)]">
        {products.length === 0
          ? "No machines match this filter."
          : `Showing ${products.length} of ${totalCount} machines`}
        {activeCategory && ` in ${activeCategory.name}`}
        {search && ` matching “${search}”`}
      </p>

      {products.length > 0 ? (
        <div className="mt-4 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
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
              brochure={product.brochure ?? undefined}
            />
          ))}
        </div>
      ) : (
        <div className="panel mt-4 px-6 py-16 text-center">
          <PackageSearch
            className="mx-auto h-10 w-10 text-[var(--text-subtle)]"
            aria-hidden="true"
          />
          <h2 className="mt-4 text-lg font-bold tracking-tight text-[var(--text)]">
            Nothing matches that filter
          </h2>
          <p className="mx-auto mt-2 max-w-sm text-sm leading-relaxed text-[var(--text-muted)]">
            {isFiltered
              ? "Try a broader search term or a different category. If you are looking for a machine we do not list, we also build to order."
              : "The catalogue is being updated. Please contact the works directly for current machinery."}
          </p>
          <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
            {isFiltered && (
              <Link
                href="/products"
                className="inline-flex rounded-[6px] items-center border border-[var(--border-strong)] px-4 py-2.5 text-xs font-bold text-[var(--text)] transition-colors hover:bg-[var(--surface-2)]"
              >
                Clear filters
              </Link>
            )}
            <Link
              href="/quote"
              className="inline-flex rounded-[6px] items-center bg-[var(--accent)] px-4 py-2.5 text-xs font-bold text-[var(--accent-fg)] transition-colors hover:bg-[var(--accent-hover)]"
            >
              Describe what you need
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
