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
  /**
   * When the reveal runs.
   *
   * `"in-view"` (default) waits for an IntersectionObserver — correct for
   * headings further down the page, which should animate as you reach them.
   *
   * `"mount"` animates immediately. **Anything above the fold must use this.**
   * The resting state of this component is `y: 110%` inside an `overflow-hidden`
   * clip — that is, invisible — so if the trigger never fires, the text is not
   * merely un-animated, it is *gone*. That is an acceptable risk for a heading
   * the reader has to scroll to, and an unacceptable one for an `<h1>` that is
   * the first thing on the page: it turns the single most important string on
   * the site into a blank gap. This is not hypothetical — it is exactly what
   * happened to the homepage `<h1>`, while the eyebrow, paragraph and both CTAs
   * beside it rendered correctly because they animate on mount.
   */
  trigger?: "mount" | "in-view";
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
 * The separator below is load-bearing for that last claim. Each line is a
 * `display: block` span, which a browser renders as three separate rows — but
 * `textContent` has no idea about layout, so the DOM string came out as
 * "ENGINEEREDFOR THEFIELD." and that is exactly what a crawler or a copy-paste
 * of the hero headline produced. A collapsed trailing space inside each block
 * span changes nothing on screen and restores the word boundaries in the DOM,
 * which also means a crawler sees `ENGINEERED FOR THE FIELD.` rather than a
 * concatenation no one would ever search for.
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
  trigger = "in-view",
}: TextRevealProps) {
  const prefersReducedMotion = useReducedMotion();

  if (prefersReducedMotion) {
    return (
      <Tag id={id} className={cn(className)}>
        {lines.map((line, i) => (
          <span key={i} className="block">
            {line}
            {i < lines.length - 1 ? " " : null}
          </span>
        ))}
      </Tag>
    );
  }

  /* `animate` runs unconditionally once the component mounts; `whileInView`
     runs only if an observer callback fires. Since the un-run state here is
     invisible rather than merely static, that difference decides whether the
     text exists. */
  const reveal =
    trigger === "mount"
      ? ({ animate: { y: "0%" } } as const)
      : ({
          whileInView: { y: "0%" },
          viewport: { once: true, margin: "-60px" },
        } as const);

  return (
    <Tag id={id} className={cn(className)}>
      {lines.map((line, i) => (
        <span key={i} className="block overflow-hidden">
          <motion.span
            className="block pb-[0.12em]"
            initial={{ y: "110%" }}
            {...reveal}
            transition={{
              duration: 0.9,
              delay: delay + i * stagger,
              ease: [0.22, 1, 0.36, 1],
            }}
          >
            {line}
          </motion.span>
          {/* Collapsed by layout, preserved in the DOM string. See the note on
              the heading's accessibility contract above. */}
          {i < lines.length - 1 ? " " : null}
        </span>
      ))}
    </Tag>
  );
}
