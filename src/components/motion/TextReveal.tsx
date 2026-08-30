"use client";

import { motion, useReducedMotion } from "framer-motion";
import { cn } from "@/lib/utils";

interface TextRevealProps {
  /**
   * The headline, pre-split into visual lines. Deliberately an array rather than
   * a string this component splits itself: display headlines here are broken at
   * chosen points (`ENGINEERED / FOR THE / FIELD.`) for rhythm, and an automatic
   * word-splitter would re-break them at whatever width the viewport happened to
   * be — which is how "huge type" layouts end up with an orphan word on line 3.
   */
  lines: string[];
  className?: string;
  /** Forwarded to the rendered element so `aria-labelledby` can target it. */
  id?: string;
  /** Per-line stagger in seconds. */
  stagger?: number;
  delay?: number;
  /** Rendered element. A heading level should be passed explicitly. */
  as?: "h1" | "h2" | "h3" | "p" | "div";
}

/**
 * TextReveal — display lines rising from behind their own baseline.
 *
 * Each line sits in an `overflow-hidden` wrapper and translates up from 110%, so
 * the type appears to be pushed into place from below rather than fading in.
 * Staggering by line (not by letter) is the deliberate choice: per-letter
 * animation on a 5.5rem headline is the single loudest "AI template" tell, and
 * it delays legibility of the most important text on the page.
 *
 * Accessibility note: the lines are real, selectable text inside the heading, so
 * screen readers announce them as one continuous heading and search engines see
 * the full string. No `aria-label` duplication, no letter-per-span shredding
 * (which is what makes some reveal libraries read out one character at a time).
 *
 * Overflow caveat: the wrapper must be `overflow-hidden`, which clips
 * descenders on some faces. `pb-[0.12em]` on the inner line compensates —
 * without it the tail of a `g` or `y` gets sliced off at rest, not just
 * mid-animation.
 */
export default function TextReveal({
  lines,
  className,
  id,
  stagger = 0.08,
  delay = 0,
  as: Tag = "h2",
}: TextRevealProps) {
  const prefersReducedMotion = useReducedMotion();

  if (prefersReducedMotion) {
    return (
      <Tag id={id} className={cn(className)}>
        {lines.map((line, i) => (
          <span key={i} className="block">
            {line}
          </span>
        ))}
      </Tag>
    );
  }

  return (
    <Tag id={id} className={cn(className)}>
      {lines.map((line, i) => (
        <span key={i} className="block overflow-hidden">
          <motion.span
            className="block pb-[0.12em]"
            initial={{ y: "110%" }}
            whileInView={{ y: "0%" }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{
              duration: 0.9,
              delay: delay + i * stagger,
              ease: [0.22, 1, 0.36, 1],
            }}
          >
            {line}
          </motion.span>
        </span>
      ))}
    </Tag>
  );
}
