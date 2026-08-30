"use client";

import { useId, useState } from "react";
import Link from "next/link";
import { ArrowRight, ChevronRight, RotateCcw } from "lucide-react";

export interface FinderMachine {
  name: string;
  slug: string;
}

export interface MachineFinderProps {
  /** Real products, passed down from the server component that queries them. */
  machines: FinderMachine[];
}

/**
 * "Find the right machine" — maps a field operation to machines we actually make.
 *
 * IMPORTANT — why this takes a prop instead of a hardcoded list:
 *
 * The previous version hardcoded eight product links. Every one of them was
 * wrong. It pointed at /products/rotavator, /products/thresher,
 * /products/cultivator, /products/laser-land-leveler and
 * /products/tipping-trailer, while the real slugs are
 * "multi-speed-heavy-duty-rotavator", "high-capacity-multi-crop-thresher",
 * "heavy-duty-spring-loaded-cultivator", "precision-laser-land-leveler" and
 * "hydraulic-tipping-tractor-trailer". All eight links were 404s. It also
 * offered a "Disc Harrow", which is not a product this company lists at all.
 *
 * The component was imported into the homepage but never rendered, which is the
 * only reason those broken links were never seen by a visitor. Rather than
 * re-hardcode corrected slugs — which would silently rot again the next time a
 * product is renamed in the admin panel — it now receives the live product list
 * and matches on keywords, so a link can only ever point at a product that
 * exists in the database.
 */
interface Operation {
  label: string;
  description: string;
  /** Lowercase substrings matched against real product names. */
  match: string[];
}

const OPERATIONS: Operation[] = [
  {
    label: "Soil preparation & tilling",
    description: "Breaking and loosening soil before sowing",
    match: ["rotavator", "cultivator"],
  },
  {
    label: "Land levelling",
    description: "Levelling fields for even irrigation",
    match: ["leveler", "leveller", "level"],
  },
  {
    label: "Threshing after harvest",
    description: "Separating grain from the stalk",
    match: ["thresher"],
  },
  {
    label: "Sowing & fertilising",
    description: "Placing seed and fertiliser in one pass",
    match: ["drill", "seed", "planter"],
  },
  {
    label: "Haulage & material transport",
    description: "Moving crop, soil, sand or building material",
    match: ["trailer", "tipping", "haul"],
  },
  {
    label: "Something else",
    description: "A non-standard or custom requirement",
    match: [],
  },
];

export default function MachineFinder({ machines }: MachineFinderProps) {
  const [selected, setSelected] = useState<Operation | null>(null);
  const panelId = useId();

  const matchesFor = (op: Operation) =>
    machines.filter((m) => {
      const name = m.name.toLowerCase();
      return op.match.some((needle) => name.includes(needle));
    });

  const results = selected ? matchesFor(selected) : [];

  return (
    <div className="border border-[var(--border-inverse)] bg-[var(--surface-inverse)] p-6 sm:p-7">
      <h3 className="text-lg font-bold tracking-tight text-white">
        Find the right machine
      </h3>
      <p className="mt-1.5 text-xs leading-relaxed text-[var(--text-inverse-muted)]">
        Tell us the operation and we will point you at the machinery built for it.
      </p>

      <div id={panelId} className="mt-6">
        {!selected ? (
          <ul className="grid grid-cols-1 gap-2 sm:grid-cols-2">
            {OPERATIONS.map((op) => (
              <li key={op.label}>
                <button
                  type="button"
                  onClick={() => setSelected(op)}
                  aria-expanded={false}
                  aria-controls={panelId}
                  className="h-full w-full border border-[var(--border-inverse)] bg-white/[0.03] p-4 text-left transition-colors duration-150 hover:border-[var(--accent-on-dark)] hover:bg-white/[0.06] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--focus-inverse)]"
                >
                  <span className="block text-sm font-bold text-white">{op.label}</span>
                  <span className="mt-0.5 block text-xs leading-relaxed text-[var(--text-inverse-muted)]">
                    {op.description}
                  </span>
                </button>
              </li>
            ))}
          </ul>
        ) : (
          <div>
            <p className="spec-label text-[var(--accent-on-dark-strong)]">
              {selected.label}
            </p>

            {results.length > 0 ? (
              <ul className="mt-3 divide-y divide-[var(--border-inverse)] border-y border-[var(--border-inverse)]">
                {results.map((m) => (
                  <li key={m.slug}>
                    <Link
                      href={`/products/${m.slug}`}
                      className="group flex items-center justify-between gap-3 py-3.5 transition-colors duration-150 hover:text-[var(--accent-on-dark-strong)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--focus-inverse)]"
                    >
                      <span className="text-sm font-bold text-white group-hover:text-[var(--accent-on-dark-strong)]">
                        {m.name}
                      </span>
                      <ChevronRight
                        className="h-4 w-4 shrink-0 text-[var(--accent-on-dark)] transition-transform duration-150 motion-safe:group-hover:translate-x-0.5"
                        aria-hidden="true"
                      />
                    </Link>
                  </li>
                ))}
              </ul>
            ) : (
              <div className="mt-3 border-y border-[var(--border-inverse)] py-4">
                <p className="text-xs leading-relaxed text-[var(--text-inverse-muted)]">
                  That sounds like a build-to-order job. Describe the operation, your
                  tractor horsepower and the working width you need, and we will tell you
                  what we can fabricate.
                </p>
                <Link
                  href="/quote"
                  className="mt-3 inline-flex items-center gap-1.5 text-xs font-bold text-[var(--accent-on-dark-strong)] underline underline-offset-4 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--focus-inverse)]"
                >
                  Request a custom quotation
                  <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
                </Link>
              </div>
            )}

            <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
              <button
                type="button"
                onClick={() => setSelected(null)}
                className="inline-flex items-center gap-1.5 text-xs font-bold text-[var(--text-inverse-muted)] transition-colors hover:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--focus-inverse)]"
              >
                <RotateCcw className="h-3.5 w-3.5" aria-hidden="true" />
                Start over
              </button>
              <Link
                href="/products"
                className="inline-flex items-center gap-1.5 text-xs font-bold text-white underline underline-offset-4 transition-colors hover:text-[var(--accent-on-dark-strong)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--focus-inverse)]"
              >
                View all machinery
                <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
