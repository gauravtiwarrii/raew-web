import Link from "next/link";
import { ArrowRight } from "lucide-react";
import ShowcaseStage from "./ShowcaseStage";
import ShowcaseFrame from "./ShowcaseFrame";
import type { ShowcaseItem } from "./showcase-types";

interface ProductShowcaseProps {
  items: ShowcaseItem[];
  /** Real count of active products, not the length of `items`. */
  totalProductCount: number;
}

const pad = (n: number) => String(n).padStart(2, "0");

/**
 * The machinery section: a cinematic presentation rather than a card grid.
 *
 * This is a server component. It owns the section chrome and the two viewport
 * treatments, and only `ShowcaseStage` crosses into client code — so the mobile
 * experience below `lg` ships **zero JavaScript for this section**. The strip is
 * a CSS scroll-snap scroller; scroll-snap is a browser feature, and re-creating
 * it with a carousel library would be slower and worse.
 *
 * Why two treatments instead of one responsive layout: the brief's "do NOT simply
 * stack desktop sections" is a real constraint here. A pinned full-viewport stage
 * on a phone would be six screens of vertical scroll to see six machines, with
 * the frame, the copy and the callouts all fighting for 380px of width. A
 * horizontal snap strip is the native mobile idiom for a set of things — it reads
 * as deliberate, keeps each machine at a legible size, and costs one swipe per
 * machine instead of one screen-height of scroll.
 *
 * Content honesty: every field rendered here comes from the database — name,
 * category, `shortDescription`, and spec pairs read out of `Product.specifications`.
 * No spec is derived, rounded, unit-converted or filled in. The "View all N
 * machines" link uses the true active-product count, not `items.length`, because
 * this section is capped at the featured six.
 */
export default function ProductShowcase({ items, totalProductCount }: ProductShowcaseProps) {
  return (
    <section
      aria-labelledby="machinery-heading"
      /* `overflow-x-clip`, emphatically NOT `overflow-hidden`. `overflow: hidden`
         on any ancestor turns that ancestor into the scrollport for descendants,
         and because it can never itself scroll, every `position: sticky` inside it
         silently stops working — which would flatten the entire pinned stage into
         a static block. `clip` does the same visual job without establishing a
         scroll container. */
      className="cinema relative overflow-x-clip border-y border-[var(--cinema-edge)]"
    >
      {/* Softens the seam with the light section above. The travel is only
          #0b0d0c → #070707, which is why it reads as the section receding
          rather than as a gradient someone applied. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-[var(--cinema-stage)] to-transparent"
      />
      <div
        aria-hidden="true"
        className="blueprint-grid-dark pointer-events-none absolute inset-0 opacity-40"
      />

      <div className="relative">
        <div className="shell pt-20 md:pt-28">
          <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
            <div className="max-w-2xl">
              <p className="eyebrow text-[var(--accent-on-dark)]">Machinery</p>
              <h2
                id="machinery-heading"
                className="mt-4 text-display-2 font-bold text-[var(--text-inverse)]"
              >
                Built for the work, not the brochure.
              </h2>
              <p className="mt-5 max-w-xl text-[15px] leading-relaxed text-[var(--text-inverse-muted)]">
                Each machine below is fabricated to order. Specifications are set against
                your tractor and your field, then confirmed in writing on the quotation.
              </p>
            </div>

            <Link
              href="/products"
              className="inline-flex shrink-0 items-center gap-1.5 border border-[rgb(255_255_255/0.22)] px-5 py-3 text-xs font-bold uppercase tracking-[0.1em] text-[var(--text-inverse)] transition-colors duration-200 hover:border-[var(--accent-on-dark)] hover:text-[var(--accent-on-dark)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--focus-inverse)]"
            >
              View all {totalProductCount} machines
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Link>
          </div>
        </div>

        {/* ── Desktop: pinned, scroll-driven stage ── */}
        <ShowcaseStage items={items} />

        {/* ── Mobile / tablet: horizontal snap strip, no JavaScript ──
            `tabIndex={0}` is required, not optional: the scrollbar is hidden, so
            without it a keyboard user has no way to reach the off-screen cards
            (WCAG 2.1.1). `role="region"` with a name makes that stop being a
            mystery focus target and gives screen-reader users the scroll hint. */}
        <div
          tabIndex={0}
          role="region"
          aria-label={`Featured machinery — ${items.length} machines, scroll sideways`}
          className="no-scrollbar mt-10 flex snap-x snap-mandatory gap-4 overflow-x-auto scroll-pl-[var(--gutter)] px-[var(--gutter)] pb-20 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--focus-inverse)] lg:hidden"
        >
          {items.map((item, index) => (
            <article
              key={item.id}
              className="flex w-[85vw] max-w-[420px] shrink-0 snap-start flex-col border border-[var(--cinema-edge)] bg-[var(--cinema-riser)]"
            >
              <ShowcaseFrame
                name={item.name}
                image={item.image}
                index={index + 1}
                priority={index === 0}
                sizes="(max-width: 500px) 85vw, 420px"
                className="aspect-16/10 w-full border-b border-[var(--cinema-edge)]"
              />

              <div className="flex flex-1 flex-col p-5">
                <div className="flex items-baseline justify-between gap-3">
                  <p className="spec-label">{item.categoryName}</p>
                  <span
                    aria-hidden="true"
                    className="font-mono text-[11px] tabular-nums text-[var(--text-subtle)]"
                  >
                    {pad(index + 1)} / {pad(items.length)}
                  </span>
                </div>

                <h3 className="mt-2 text-lg font-bold leading-snug tracking-tight text-[var(--text-inverse)]">
                  {item.name}
                </h3>

                <p className="mt-2.5 text-[13px] leading-relaxed text-[var(--text-inverse-muted)]">
                  {item.shortDescription}
                </p>

                {/* Three callouts here against the desktop stage's four — the
                    phone has the width for three key/value pairs before they
                    wrap into each other. Sliced, never padded. */}
                {item.specs.length > 0 && (
                  <dl className="mt-5 space-y-3 border-t border-[var(--cinema-edge)] pt-4">
                    {item.specs.slice(0, 3).map((spec) => (
                      /* Stacked, not two-column. At 85vw on a 360px phone the
                         card's content box is ~266px; a label/value split leaves
                         both sides too narrow, and real values like
                         "36 / 42 / 48 / 54 L & C Type Blades" wrap to four lines.
                         Full width per value keeps them to one or two. */
                      <div key={spec.key}>
                        <dt className="spec-label">{spec.key}</dt>
                        <dd className="mt-1 text-[12px] leading-snug text-[var(--text-inverse)]">
                          {spec.value}
                        </dd>
                      </div>
                    ))}
                  </dl>
                )}

                <Link
                  href={`/products/${item.slug}`}
                  className="group mt-6 inline-flex items-center gap-2 self-start border-b border-[rgb(255_255_255/0.28)] pb-1 text-xs font-bold uppercase tracking-[0.1em] text-[var(--text-inverse)] transition-colors duration-200 hover:border-[var(--accent-on-dark)] hover:text-[var(--accent-on-dark)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--focus-inverse)]"
                >
                  Full specifications
                  <ArrowRight
                    className="h-3.5 w-3.5 transition-transform duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] motion-safe:group-hover:translate-x-1"
                    aria-hidden="true"
                  />
                </Link>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
