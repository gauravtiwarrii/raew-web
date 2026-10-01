"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Camera, Maximize2 } from "lucide-react";
import { cn } from "@/lib/utils";
import AnimatedSection, { StaggerContainer, StaggerItem } from "@/components/AnimatedSection";
import Lightbox, { type LightboxImage } from "@/components/ui/Lightbox";
import { isAuthenticImage } from "@/lib/images";

interface GalleryItem {
  id: string;
  title: string;
  category: string;
  imageUrl: string;
  description?: string | null;
}

interface GalleryClientProps {
  initialItems: GalleryItem[];
}

const ALL = "ALL";

/**
 * Gallery page.
 *
 * Two presentation modes were removed here, and the reasoning is worth keeping:
 *
 *   - A "Showcase (3D)" mode fanned the photographs out with
 *     `perspective(5000px) rotateY(-35deg)` and `-space-x-64`. Every photograph
 *     was permanently skewed and roughly two thirds of each one was covered by
 *     the next. On a page whose entire purpose is showing photographs of the
 *     machines, distorting and occluding them is not a feature. Each card's
 *     title, category and caption were revealed on hover only, so on a touch
 *     screen they were unreachable, and the cards were `<div onClick>` — no
 *     keyboard access, invisible to assistive technology. The hint text read
 *     "Hover over cards to inspect".
 *   - Its mobile counterpart was an `animate-marquee` that scrolled for ever
 *     with no pause control, ignored `prefers-reduced-motion`, and rendered
 *     every item three times to fake the loop — triple the image requests.
 *
 * The capability those modes provided (browse, filter by subject, enlarge) is
 * all still here, in a grid that keeps the photographs rectangular, unobscured
 * and keyboard-operable. That also removed the view-mode toggle, which was two
 * controls that only changed decoration.
 *
 * The lightbox now delegates to the shared `ui/Lightbox`. The version that used
 * to live in this file did display its image correctly, but it had no focus
 * trap, no scroll lock, no focus restore and no `role="dialog"`, and it was a
 * second copy of keyboard handling the shared component already implements.
 */
export default function GalleryClient({ initialItems }: GalleryClientProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>(ALL);
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  // A gallery entry is a photograph plus a caption, so an entry whose
  // photograph is missing or is stock imagery has nothing left to show. Those
  // are dropped here rather than rendered as empty frames, and the empty state
  // below explains what to do about it. See lib/images.ts.
  const items = useMemo(
    () => initialItems.filter((item) => isAuthenticImage(item.imageUrl)),
    [initialItems],
  );

  const categories = useMemo(
    () => [ALL, ...Array.from(new Set(items.map((item) => item.category)))],
    [items],
  );

  const filteredItems = useMemo(
    () =>
      selectedCategory === ALL
        ? items
        : items.filter((item) => item.category === selectedCategory),
    [items, selectedCategory],
  );

  const lightboxImages: LightboxImage[] = filteredItems.map((item) => ({
    src: item.imageUrl,
    alt: item.title,
    eyebrow: item.category,
    title: item.title,
    caption: item.description ?? undefined,
  }));

  // Everything was filtered out, or there was never anything to show. Either
  // way the honest thing is to say so and point at where photographs are added,
  // instead of leaving a blank page.
  const hasNoPhotographs = items.length === 0;

  return (
    <div className="bg-[var(--bg)] pb-20">
      {/* ── 1. HEADER ───────────────────────────────────────────────── */}
      <section className="steel-plate on-dark relative overflow-hidden border-b border-[var(--border-inverse)]">
        <div className="blueprint-grid-dark absolute inset-0" aria-hidden="true" />
        <div className="shell relative py-16 sm:py-20">
          <AnimatedSection variant="fadeUp">
            <p className="eyebrow text-[var(--accent-on-dark)]">
              <Camera className="mr-2 inline h-3.5 w-3.5" aria-hidden="true" />
              Gallery
            </p>
            <h1 className="mt-4 max-w-3xl text-3xl font-bold tracking-tight text-white sm:text-4xl lg:text-5xl">
              The works, and the machines that leave it.
            </h1>
            <p className="mt-5 max-w-2xl text-sm leading-relaxed text-[var(--text-inverse-muted)] sm:text-base">
              Photographs of our fabrication shop and the machinery built in it.
              Filter by subject, or select any photograph to view it full size.
            </p>
          </AnimatedSection>
        </div>
      </section>

      {hasNoPhotographs ? (
        /* ── 2a. NOTHING TO SHOW ───────────────────────────────────── */
        <section className="shell py-20">
          <div className="panel mx-auto max-w-xl px-6 py-14 text-center sm:px-10">
            <Camera
              className="mx-auto h-9 w-9 text-[var(--text-subtle)]"
              aria-hidden="true"
            />
            <h2 className="mt-5 text-lg font-bold text-[var(--text)]">
              No photographs yet
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-[var(--text-muted)]">
              This gallery is waiting on photographs of the works. Until they are
              added, the rest of the site is the better place to start.
            </p>
            <div className="mt-7 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <Link
                href="/products"
                className="inline-flex rounded-[6px] h-11 w-full items-center justify-center border border-[var(--border-strong)] px-6 text-sm font-bold text-[var(--text)] transition-colors duration-150 hover:bg-[var(--surface-2)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--focus)] sm:w-auto"
              >
                Browse machines
              </Link>
              <Link
                href="/quote"
                className="inline-flex rounded-[6px] h-11 w-full items-center justify-center bg-[var(--accent)] px-6 text-sm font-bold text-[var(--accent-fg)] transition-colors duration-150 hover:bg-[var(--accent-hover)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--focus)] sm:w-auto"
              >
                Get a quote
              </Link>
            </div>
          </div>
        </section>
      ) : (
        <>
          {/* ── 2b. FILTERS ─────────────────────────────────────────── */}
          <section className="border-b border-[var(--border)] bg-[var(--surface)]">
            <div className="shell flex flex-col gap-4 py-5 sm:flex-row sm:items-center sm:justify-between">
              {/* A group of toggles, not a tablist — each button reflects its
                  own pressed state so a screen reader announces which subject
                  is currently applied. */}
              <div
                role="group"
                aria-label="Filter photographs by subject"
                className="flex flex-wrap gap-2"
              >
                {categories.map((cat) => {
                  const isActive = selectedCategory === cat;
                  return (
                    <button
                      key={cat}
                      type="button"
                      aria-pressed={isActive}
                      onClick={() => {
                        setSelectedCategory(cat);
                        setLightboxIndex(null);
                      }}
                      className={cn(
                        "inline-flex h-9 items-center border px-4 text-xs font-bold uppercase tracking-[0.1em] transition-colors duration-150 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--focus)]",
                        isActive
                          ? "border-[var(--accent)] bg-[var(--accent)] text-[var(--accent-fg)]"
                          : "border-[var(--border-strong)] text-[var(--text-muted)] hover:bg-[var(--surface-2)] hover:text-[var(--text)]",
                      )}
                    >
                      {cat === ALL ? "All" : cat}
                    </button>
                  );
                })}
              </div>

              <p
                aria-live="polite"
                className="spec-label shrink-0 text-[var(--text-subtle)]"
              >
                {filteredItems.length}{" "}
                {filteredItems.length === 1 ? "photograph" : "photographs"}
              </p>
            </div>
          </section>

          {/* ── 3. GRID ─────────────────────────────────────────────── */}
          <section className="shell py-12 sm:py-16">
            {filteredItems.length === 0 ? (
              <div className="panel px-6 py-14 text-center">
                <h2 className="text-base font-bold text-[var(--text)]">
                  Nothing under “{selectedCategory}”
                </h2>
                <p className="mt-2 text-sm text-[var(--text-muted)]">
                  Choose another subject, or view all photographs.
                </p>
                <button
                  type="button"
                  onClick={() => setSelectedCategory(ALL)}
                  className="mt-6 inline-flex rounded-[6px] h-10 items-center border border-[var(--border-strong)] px-5 text-xs font-bold uppercase tracking-[0.1em] text-[var(--text)] transition-colors duration-150 hover:bg-[var(--surface-2)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--focus)]"
                >
                  Show all
                </button>
              </div>
            ) : (
              <StaggerContainer
                className="grid grid-cols-1 gap-px bg-[var(--border)] sm:grid-cols-2 lg:grid-cols-3"
                staggerDelay={0.05}
              >
                {filteredItems.map((item, idx) => (
                  <StaggerItem key={item.id} className="bg-[var(--surface)]">
                    {/* A real button: focusable, Enter/Space operable, and
                        announced as a control. This was a bare <div onClick>. */}
                    <button
                      type="button"
                      onClick={() => setLightboxIndex(idx)}
                      className="group block h-full w-full text-left focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--focus)]"
                    >
                      <span className="relative block aspect-4/3 overflow-hidden bg-[var(--surface-2)]">
                        <Image
                          src={item.imageUrl}
                          alt={item.title}
                          fill
                          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                          className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                        />
                        <span className="chip-dark absolute left-3 top-3">
                          {item.category}
                        </span>
                        <span
                          className="absolute inset-0 flex items-center justify-center bg-[rgb(8_9_11_/_0.45)] opacity-0 transition-opacity duration-200 group-hover:opacity-100 group-focus-visible:opacity-100"
                          aria-hidden="true"
                        >
                          {/* A bordered plate, not a frosted one. This carried
                              `backdrop-blur-sm`, which was doing no visible work:
                              it sits on top of a 45%-black scrim, so there is
                              almost no contrast left in the backdrop for a blur
                              to soften — while still forcing a separate
                              compositing layer on every tile in the grid. The
                              fill is raised from white/10 to white/14 so the
                              plate reads on its own, and the square edge matches
                              the drafting frames used elsewhere on the site. */}
                          <span className="inline-flex h-11 w-11 items-center justify-center border border-white/40 bg-white/[0.14]">
                            <Maximize2 className="h-4 w-4 text-white" />
                          </span>
                        </span>
                      </span>

                      <span className="block px-5 py-5">
                        <span className="block text-sm font-bold leading-snug text-[var(--text)] transition-colors duration-150 group-hover:text-[var(--accent-active)]">
                          {item.title}
                        </span>
                        {item.description && (
                          <span className="mt-1.5 block text-xs leading-relaxed text-[var(--text-muted)]">
                            {item.description}
                          </span>
                        )}
                        <span className="spec-label mt-3 block text-[var(--text-subtle)]">
                          View full size
                        </span>
                      </span>
                    </button>
                  </StaggerItem>
                ))}
              </StaggerContainer>
            )}
          </section>
        </>
      )}

      <Lightbox
        images={lightboxImages}
        startIndex={lightboxIndex ?? 0}
        open={lightboxIndex !== null}
        onClose={() => setLightboxIndex(null)}
        label="Gallery"
      />
    </div>
  );
}
