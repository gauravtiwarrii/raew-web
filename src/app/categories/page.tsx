import Link from "next/link";
import Image from "next/image";
import { prisma } from "@/lib/db";
import { ArrowRight, Layers } from "lucide-react";
import { isAuthenticImage } from "@/lib/images";

export const metadata = {
  title: "Machinery Categories",
  description: "Explore agricultural machinery categories including rotavators, threshers, land levelers, tipping trailers, and custom fabrication.",
  alternates: { canonical: "/categories" },
};

export const revalidate = 60;

export default async function CategoriesPage() {
  let categories: any[] = [];
  try {
    categories = await prisma.category.findMany({
      where: { active: true },
      include: {
        _count: {
          // Counted `active: true` products only. Without the filter this
          // reported every product row in the category, including ones the
          // owner had deactivated in the admin panel — so a category could
          // advertise "4 Models Available" and then show two on /products.
          select: { products: { where: { active: true } } },
        },
      },
      orderBy: { sortOrder: "asc" },
    });
  } catch (error) {
    console.error("Categories page data fetch error:", error);
  }

  return (
    <div className="bg-[var(--bg)]">
      {/* ── 1. HEADER ───────────────────────────────────────────────── */}
      <section className="steel-plate on-dark relative overflow-hidden border-b border-[var(--border-inverse)]">
        <div className="blueprint-grid-dark absolute inset-0" aria-hidden="true" />
        <div className="shell relative py-16 sm:py-20">
          <p className="eyebrow text-[var(--accent-on-dark)]">
            <Layers className="mr-2 inline h-3.5 w-3.5" aria-hidden="true" />
            Product Range Classification
          </p>
          <h1 className="mt-4 max-w-3xl text-3xl font-bold tracking-tight text-white sm:text-4xl lg:text-5xl">
            Machinery Categories
          </h1>
          <p className="mt-5 max-w-2xl text-sm leading-relaxed text-[var(--text-inverse-muted)] sm:text-base">
            Select a category below to explore specific agricultural machinery models, technical specifications, and available field attachments.
          </p>
        </div>
      </section>

      {/* ── 2. GRID ─────────────────────────────────────────────────── */}
      <section className="shell py-16 sm:py-20">
        {categories.length === 0 ? (
          // The page used to render an empty grid if the query threw, leaving a
          // header floating above nothing at all.
          <div className="panel px-6 py-14 text-center">
            <Layers
              className="mx-auto h-9 w-9 text-[var(--text-subtle)]"
              aria-hidden="true"
            />
            <h2 className="mt-5 text-lg font-bold text-[var(--text)]">
              Categories unavailable
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-[var(--text-muted)]">
              We could not load the category list just now. The full machinery
              catalogue is still available.
            </p>
            <Link
              href="/products"
              className="mt-7 inline-flex rounded-[6px] h-11 items-center justify-center bg-[var(--accent)] px-6 text-sm font-bold text-[var(--accent-fg)] transition-colors duration-150 hover:bg-[var(--accent-hover)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--focus)]"
            >
              View all machines
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-px bg-[var(--border)] md:grid-cols-2 lg:grid-cols-3">
            {categories.map((cat) => {
              const count = cat._count.products as number;
              return (
                <Link
                  key={cat.id}
                  href={`/products?category=${cat.slug}`}
                  className="group flex flex-col justify-between bg-[var(--surface)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--focus)]"
                >
                  <div className="relative aspect-16/9 overflow-hidden bg-[var(--surface-2)]">
                    {isAuthenticImage(cat.image) ? (
                      <Image
                        src={cat.image as string}
                        alt=""
                        fill
                        sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                        className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                      />
                    ) : (
                      <div
                        className="blueprint-grid-dark absolute inset-0 flex items-center justify-center bg-[var(--surface-inverse)]"
                        aria-hidden="true"
                      >
                        <Layers className="h-9 w-9 text-[var(--accent-on-dark)]" />
                      </div>
                    )}
                    <span className="chip-dark absolute left-3 top-3">
                      {/* "1 Models Available" was the old output. */}
                      {count === 0
                        ? "No models listed"
                        : `${count} ${count === 1 ? "model" : "models"} available`}
                    </span>
                  </div>

                  <div className="flex flex-1 flex-col justify-between px-6 py-6">
                    <div>
                      <h2 className="text-xl font-bold text-[var(--text)] transition-colors duration-150 group-hover:text-[var(--accent-active)]">
                        {cat.name}
                      </h2>
                      {/* The generic fallback line ("High-performance equipment
                          built for agricultural efficiency.") was removed —
                          asserting the same marketing claim over any category
                          with no description written for it is not a
                          description, it is filler. */}
                      {cat.description && (
                        <p className="mt-2 text-sm leading-relaxed text-[var(--text-muted)]">
                          {cat.description}
                        </p>
                      )}
                    </div>

                    <div className="mt-6 flex items-center justify-between border-t border-[var(--border)] pt-4 text-xs font-bold uppercase tracking-[0.1em] text-[var(--accent)]">
                      <span>Browse Machinery</span>
                      <ArrowRight
                        className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1"
                        aria-hidden="true"
                      />
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </section>
    </div>
  );
}
