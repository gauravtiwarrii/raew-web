"use client";

import { motion, useReducedMotion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import HeroVisual from "./HeroVisual";
import TextReveal from "@/components/motion/TextReveal";
import MagneticLink from "@/components/motion/MagneticLink";

/**
 * Hero — the first five seconds.
 *
 * ── What was wrong with the section this replaces ─────────────────────────
 * The previous hero was `py-20 md:py-32` with everything inside a `max-w-3xl`
 * column on the left and empty steel plate on the right. It shared its exact
 * vertical rhythm with all nine sections below it, and its `text-4xl → lg:text-6xl`
 * headline was the same size as every `<h2>` on the page. The result was a page
 * where nothing announced itself as the beginning, which is the "section,
 * whitespace, card grid" pattern the brief names as the thing to escape.
 *
 * Three changes address that:
 *   • **Full viewport height.** `min-h-svh` (not `vh`) so mobile browser chrome
 *     does not push the CTAs below the fold — `100vh` on iOS Safari is the
 *     *expanded* viewport, which is exactly the bug that hides a hero's buttons
 *     behind the URL bar on first load.
 *   • **A real scale break.** The headline is `text-mega` (clamp 2rem → 5.5rem);
 *     every section heading below is `text-display-2` (max 2.75rem). Hierarchy
 *     now comes from size, not from weight — Space Grotesk stops at 700, so
 *     `font-extrabold` would only smear a synthetic bold.
 *   • **Depth.** Type sits on a lit 3D assembly with a vignette, rather than on
 *     a flat fill with one blurred circle.
 *
 * ── Why the text is not inside the dynamic boundary ───────────────────────
 * `HeroVisual` is `ssr: false`; everything legible here is not. The headline,
 * copy and both CTAs are in the server-rendered HTML and are readable and
 * clickable before any JavaScript executes. Only the decorative assembly waits
 * for hydration.
 */

/* Pre-split so the line breaks are a design decision rather than a function of
   viewport width. `ENGINEERED` is the longest line at 10 characters, which is
   what sets the `--text-mega` 2rem floor: ~211px inside the 288px content box
   available at 320px. See the arithmetic in globals.css before changing either. */
const HEADLINE = ["ENGINEERED", "FOR THE", "FIELD."] as const;

export default function Hero() {
  const prefersReducedMotion = useReducedMotion();

  return (
    <section
      aria-labelledby="hero-heading"
      className="cinema relative flex min-h-svh flex-col justify-center overflow-hidden border-b border-[var(--cinema-edge)] pt-28 pb-16 md:pt-32 md:pb-20"
    >
      <HeroVisual />

      <div className="shell relative z-10">
        {/* max-w-4xl, not 3xl: at the 5.5rem ceiling `ENGINEERED` needs the extra
            room to stay on one line without hyphenating. */}
        <div className="max-w-4xl">
          {/* Eyebrow. The two halves are separated by a drawn rule rather than a
              slash character, so it reads as a drawing-sheet title block. */}
          <motion.div
            className="flex items-center gap-3"
            initial={prefersReducedMotion ? undefined : { opacity: 0 }}
            animate={prefersReducedMotion ? undefined : { opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            <span className="eyebrow text-[var(--accent-on-dark)]">RAEW</span>
            <span aria-hidden="true" className="h-px w-8 bg-[var(--accent-on-dark)] opacity-50" />
            <span className="eyebrow text-[var(--text-inverse-muted)]">
              Agricultural Engineering
            </span>
          </motion.div>

          <TextReveal
            as="h1"
            id="hero-heading"
            lines={[...HEADLINE]}
            delay={0.2}
            stagger={0.09}
            className="mt-7 text-mega font-bold text-[var(--text-inverse)]"
          />

          <motion.p
            className="mt-8 max-w-xl text-base leading-relaxed text-[var(--text-inverse-muted)] sm:text-lg"
            initial={prefersReducedMotion ? undefined : { opacity: 0, y: 16 }}
            animate={prefersReducedMotion ? undefined : { opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.55, ease: [0.22, 1, 0.36, 1] }}
          >
            Rotary tillers, threshers, levellers and custom-fabricated implements —
            built to order at our works in Mirzapur, Uttar Pradesh, and specified
            around your tractor, your field and your crop.
          </motion.p>

          <motion.div
            className="mt-10 flex flex-col gap-3 sm:flex-row sm:items-center"
            initial={prefersReducedMotion ? undefined : { opacity: 0, y: 16 }}
            animate={prefersReducedMotion ? undefined : { opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.68, ease: [0.22, 1, 0.36, 1] }}
          >
            <MagneticLink
              href="/products"
              cursorLabel="Explore"
              className="group inline-flex items-center justify-center gap-2.5 rounded-md bg-[var(--accent)] px-8 py-4 font-[family-name:var(--font-mono)] text-xs font-semibold uppercase tracking-[0.12em] text-[var(--accent-fg)] transition-colors duration-200 hover:bg-[var(--accent-hover)]"
            >
              Explore machinery
              {/* Arrow slides on hover — a 3px cue, no bounce. */}
              <ArrowRight
                className="h-4 w-4 transition-transform duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:translate-x-1"
                aria-hidden="true"
              />
            </MagneticLink>

            <MagneticLink
              href="/quote"
              cursorLabel="Quote"
              className="inline-flex items-center justify-center rounded-md border border-white/15 bg-white/[0.04] px-8 py-4 font-[family-name:var(--font-mono)] text-xs font-semibold uppercase tracking-[0.12em] text-[var(--text-inverse)] backdrop-blur-sm transition-colors duration-200 hover:border-white/25 hover:bg-white/[0.09]"
            >
              Request a quote
            </MagneticLink>
          </motion.div>
        </div>
      </div>

      <ScrollCue />
    </section>
  );
}

/**
 * ScrollCue — a hairline that fills downward on a loop.
 *
 * The one looping animation in the redesign, and it is justified on the same
 * grounds as a progress bar: its movement is its meaning. A static "scroll"
 * label is ignored; the travelling line is what communicates the direction. It
 * is a 1px `scaleY` on a 40px element — one composited property on a tiny
 * surface — and it disappears completely under reduced-motion, where the static
 * rule and label still read correctly.
 */
function ScrollCue() {
  const prefersReducedMotion = useReducedMotion();

  return (
    <div className="shell relative z-10 mt-16 md:mt-20">
      <div className="flex items-center gap-3" aria-hidden="true">
        <span className="relative block h-10 w-px overflow-hidden bg-white/12">
          {!prefersReducedMotion && (
            <motion.span
              className="absolute inset-x-0 top-0 block h-full origin-top bg-[var(--accent-on-dark)]"
              animate={{ scaleY: [0, 1, 1], y: ["0%", "0%", "100%"] }}
              transition={{ duration: 2.1, times: [0, 0.45, 1], repeat: Infinity, ease: "easeInOut" }}
            />
          )}
        </span>
        <span className="eyebrow text-[var(--text-subtle)]">Scroll</span>
      </div>
    </div>
  );
}
