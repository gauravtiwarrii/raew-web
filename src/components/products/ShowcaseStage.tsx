"use client";

import {
  AnimatePresence,
  motion,
  useMotionValueEvent,
  useReducedMotion,
  useScroll,
  useSpring,
} from "framer-motion";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { useCallback, useRef, useState } from "react";
import ShowcaseFrame from "./ShowcaseFrame";
import type { ShowcaseItem } from "./showcase-types";

/** Scroll distance allotted to each machine, in svh. */
const SLICE_SVH = 62;

const pad = (n: number) => String(n).padStart(2, "0");

/**
 * ShowcaseStage — the desktop product presentation, pinned and scroll-driven.
 *
 * The brief asked for something closer to an automotive configurator than a card
 * grid: one machine at a time, at size, changing as you scroll. That is built here
 * with a tall track and a `sticky` child, which is the same effect a
 * ScrollTrigger pin produces but with no library and no scroll hijacking — the
 * page still scrolls natively, so trackpad momentum, Page Down, Home/End and
 * find-in-page all keep working. `useScroll` on the track then maps that native
 * scroll onto an index.
 *
 * Two structural decisions worth knowing before editing:
 *
 * 1. This component is hidden below `lg` by its parent, and the mobile strip is a
 *    separate, JS-free server-rendered scroller. That is duplication in the DOM,
 *    and it is chosen over swapping layouts at runtime on purpose: a media-query
 *    hook returns `false` during SSR, so a runtime swap would render the mobile
 *    strip first and then rebuild it as a pinned stage after hydration — a
 *    visible jump and a chunk of CLS on every desktop load. `display: none` is
 *    also the one hiding mechanism that removes content from both the tab order
 *    and the accessibility tree, so neither copy leaks into the other's viewport.
 *
 * 2. Only the active machine is in the DOM. Stacking all six at `opacity: 0`
 *    would be cheaper to animate but every one of them stays in the
 *    accessibility tree — opacity is not a hiding mechanism — so a screen reader
 *    would read six descriptions over a frame showing one. Keying on the active
 *    index means what is announced is what is displayed.
 */
export default function ShowcaseStage({ items }: { items: ShowcaseItem[] }) {
  const trackRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);
  const prefersReducedMotion = useReducedMotion();

  const { scrollYProgress } = useScroll({
    target: trackRef,
    /* "start start" → "end end" measures the pin itself: 0 when the track's top
       reaches the top of the viewport (the moment the stage sticks) and 1 when
       its bottom arrives (the moment it releases). The default offset would
       track the element entering the viewport instead, which for a track this
       tall would finish long before the stage started moving. */
    offset: ["start start", "end end"],
  });

  const railScale = useSpring(scrollYProgress, {
    stiffness: 120,
    damping: 26,
    restDelta: 0.001,
  });

  useMotionValueEvent(scrollYProgress, "change", (value) => {
    const next = Math.min(items.length - 1, Math.max(0, Math.floor(value * items.length)));
    /* React bails out on an identical value, so this fires ~60×/s during a
       scroll but re-renders only on the ~6 frames where the index changes. */
    setActive(next);
  });

  /* The index rail is not decoration — it is the keyboard route through the
     showcase. Each button scrolls to the middle of that machine's slice, which
     is a real navigation the browser can also restore on back/forward, unlike
     setting index state directly (which would then be overwritten by the very
     next scroll event).

     This used to go through a `scrollToY` helper that handed off to
     `lenis.scrollTo`, because a native smooth scroll and Lenis's interpolation
     would both be writing scroll position on the same frames and the two fought
     — the jump either stuttered or snapped instantly. Lenis is gone, so the
     native call is now unambiguous and the helper with it.

     `behavior` is switched rather than the whole call, because a reduced-motion
     user still needs the navigation to happen; they just need it to happen
     without the animated traversal. Note this is a scroll to a *computed offset*,
     not to an element, so `scroll-padding-top` does not apply and none needs
     subtracting — the sticky pane is already positioned to clear the header. */
  const goTo = useCallback(
    (index: number) => {
      const track = trackRef.current;
      if (!track) return;
      const trackTop = track.getBoundingClientRect().top + window.scrollY;
      const travel = track.offsetHeight - window.innerHeight;
      if (travel <= 0) return;
      window.scrollTo({
        top: trackTop + travel * ((index + 0.5) / items.length),
        behavior: prefersReducedMotion ? "auto" : "smooth",
      });
    },
    [items.length, prefersReducedMotion]
  );

  if (items.length === 0) return null;

  const current = items[active];

  return (
    <div
      ref={trackRef}
      className="relative hidden lg:block"
      style={{ height: `calc(100svh + ${items.length * SLICE_SVH}svh)` }}
    >
      {/* `pt-24` is measured, not chosen. On the homepage the header collapses
          to `h-0` and its bar is an absolutely positioned child, so it occupies
          no flow height — but it is still `sticky top-0 z-50`, so it still
          *paints* over this stage, and by the time you reach here it is well
          past its scroll threshold and therefore opaque (72% black + blur).
          Scrolled, the bar stacks a 2px accent rule, the md+ utility bar and
          the condensed nav to roughly 86px. 96px of padding clears that with a
          little air; less and the title block sits underneath the navigation.

          Do not "simplify" this to `pt-0` on the reasoning that the header no
          longer takes up layout space. Zero flow height is exactly why the
          padding has to be here instead. */}
      <div className="sticky top-0 flex h-svh items-center overflow-hidden pt-24 pb-8">
        <div className="shell relative w-full">
          {/* Title block — drawing-sheet convention: what this is, on the left;
              where you are in the set, on the right. */}
          <div className="flex items-baseline justify-between gap-6 border-b border-[var(--cinema-edge)] pb-4">
            <p className="eyebrow text-[var(--accent-on-dark)]">Machinery / Detail view</p>
            <p className="font-mono text-xs tabular-nums text-[var(--text-inverse-muted)]">
              <span className="text-[var(--text-inverse)]">{pad(active + 1)}</span>
              <span className="px-1.5 text-[var(--text-subtle)]">/</span>
              {pad(items.length)}
            </p>
          </div>

          {/* Fixed-height stage: children are absolutely positioned so the
              outgoing and incoming machines can overlap during the cross-fade
              without the section changing height and dragging the scroll
              position with it.

              The height floor of 340px is a measured worst case, not a guess.
              The tallest left column — 80px numeral, two-line name at the
              2.75rem ceiling, three lines of description, and the button — comes
              to roughly 357px at a wide viewport and 327px at 1024px, where the
              6vw numeral is smaller. Below the floor the column would overflow
              into the index rail. If you enlarge the numeral or drop the
              `line-clamp`, re-derive this number. */}
          <div className="relative mt-7 h-[clamp(340px,50svh,540px)]">
            <AnimatePresence initial={false}>
              <motion.div
                key={current.id}
                className="absolute inset-0 grid grid-cols-12 gap-8"
                initial={{ opacity: 0, y: 26 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -26 }}
                transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
              >
                {/* ── Left: identity ── */}
                <div className="col-span-5 flex min-w-0 flex-col justify-center">
                  <span
                    aria-hidden="true"
                    className="font-display text-numeral font-bold text-[var(--text-subtle)]"
                  >
                    {pad(active + 1)}
                  </span>

                  <p className="spec-label mt-3">{current.categoryName}</p>

                  <h3 className="mt-2 text-display-2 font-bold text-[var(--text-inverse)]">
                    {current.name}
                  </h3>

                  {/* Clamped to three lines because the stage height is fixed:
                      one unusually long `shortDescription` would otherwise push
                      the button down into the index rail. The full text is on the
                      product page, which is one click away. */}
                  <p className="mt-4 line-clamp-3 max-w-md text-sm leading-relaxed text-[var(--text-inverse-muted)]">
                    {current.shortDescription}
                  </p>

                  <div className="mt-7">
                    <Link
                      href={`/products/${current.slug}`}
                      className="group inline-flex items-center gap-2 border border-[rgb(255_255_255/0.22)] px-6 py-3 text-xs font-bold uppercase tracking-[0.1em] text-[var(--text-inverse)] transition-colors duration-200 hover:border-[var(--accent-on-dark)] hover:text-[var(--accent-on-dark)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--focus-inverse)]"
                    >
                      Full specifications
                      <ArrowRight
                        className="h-3.5 w-3.5 transition-transform duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] motion-safe:group-hover:translate-x-1"
                        aria-hidden="true"
                      />
                    </Link>
                  </div>
                </div>

                {/* ── Right: the object, plus its callouts ── */}
                <div className="col-span-7 flex items-stretch gap-6">
                  <ShowcaseFrame
                    name={current.name}
                    image={current.image}
                    index={active + 1}
                    priority={active === 0}
                    sizes="40vw"
                    className="h-full flex-1 border border-[var(--cinema-edge)]"
                  />

                  {/* CAD-style callouts. Every value here is read from
                      `Product.specifications` in the database — nothing is
                      generated, and a machine with fewer recorded specs simply
                      draws fewer leaders. See `toSpecPairs`.

                      The caller caps this at four pairs. That is a height
                      constraint: the longest real values in the catalogue
                      ("Wheat, Paddy, Mustard, Soybean, Bengal Gram, Maize") wrap
                      to three lines in a 176px column, so four rows is what fits
                      the 340px stage floor. `line-clamp-3` is the backstop for a
                      value longer than any currently in the database. */}
                  {current.specs.length > 0 && (
                    <dl className="flex w-44 shrink-0 flex-col justify-center gap-5 border-l border-[rgb(255_255_255/0.16)] xl:w-52">
                      {current.specs.map((spec) => (
                        <div key={spec.key} className="flex items-start gap-2.5">
                          <span
                            aria-hidden="true"
                            className="mt-2 h-px w-5 shrink-0 bg-[rgb(255_255_255/0.22)]"
                          />
                          <div className="min-w-0">
                            <dt className="spec-label">{spec.key}</dt>
                            <dd className="mt-1 line-clamp-3 text-[12px] leading-snug text-[var(--text-inverse)]">
                              {spec.value}
                            </dd>
                          </div>
                        </div>
                      ))}
                    </dl>
                  )}
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* ── Index rail ── */}
          <div className="mt-7 border-t border-[var(--cinema-edge)] pt-5">
            {/* Progress is drawn with scaleX rather than width: width is a layout
                property and would force a reflow on every scroll frame. */}
            <div className="relative h-px w-full bg-[var(--cinema-edge)]">
              <motion.div
                aria-hidden="true"
                style={{ scaleX: railScale }}
                className="absolute inset-0 origin-left bg-[var(--accent-bright)]"
              />
            </div>

            <div className="mt-4 flex items-stretch gap-1">
              {items.map((item, index) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => goTo(index)}
                  aria-label={`Show ${item.name}`}
                  aria-current={index === active ? "true" : "false"}
                  className={`group flex min-w-0 flex-1 items-baseline gap-2 py-1.5 text-left transition-colors duration-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--focus-inverse)] ${
                    index === active
                      ? "text-[var(--text-inverse)]"
                      : "text-[var(--text-subtle)] hover:text-[var(--text-inverse-muted)]"
                  }`}
                >
                  <span className="font-mono text-[11px] tabular-nums">{pad(index + 1)}</span>
                  <span className="hidden truncate text-[11px] font-semibold uppercase tracking-[0.06em] xl:inline">
                    {item.name}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
