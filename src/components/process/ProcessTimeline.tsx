"use client";

import { motion, useMotionValueEvent, useReducedMotion, useScroll, useSpring } from "framer-motion";
import { useRef, useState } from "react";

interface Step {
  n: string;
  t: string;
  d: string;
}

/**
 * The five steps an order actually goes through. Copy is unchanged from the
 * previous grid — these are process facts, not claims, and nothing here was
 * rewritten to sound better.
 */
const STEPS: Step[] = [
  {
    n: "01",
    t: "Understand",
    d: "You tell us the operation, your tractor horsepower, working width, soil and field condition.",
  },
  {
    n: "02",
    t: "Engineer",
    d: "We work out what actually fits and confirm the specification and terms in writing.",
  },
  {
    n: "03",
    t: "Manufacture",
    d: "The machine is fabricated at our Mirzapur works on structural steel, to that specification.",
  },
  {
    n: "04",
    t: "Test",
    d: "Assembly and fitment are checked at the works before the machine is cleared to leave.",
  },
  {
    n: "05",
    t: "Deliver",
    d: "Dispatched to your location, with operating guidance from the people who built it.",
  },
];

/**
 * ProcessTimeline — the order process as a drawn line rather than five cards.
 *
 * The previous version was a five-column grid of bordered boxes. It contained the
 * right information and communicated none of the sequence: five equal cards side
 * by side read as five options, not as five stages in order. A line with nodes on
 * it reads as a sequence before a single word has been processed, which is the
 * whole point of drawing it.
 *
 * ── One DOM, two orientations ──
 * The steps are a single tree that flows `flex-col` → `md:flex-row`. Only the
 * *rule* is duplicated, as two 1px divs (one horizontal, one vertical), because a
 * line cannot change axis with flex direction. That is 2 extra elements rather
 * than a duplicated content block, and it keeps the mobile treatment a genuine
 * vertical timeline instead of a stack of the desktop's cards.
 *
 * Each step's node sits at its own top-left corner in both orientations — mobile
 * pads left and hangs the node in the gutter, desktop pads top and hangs it above
 * — so both rules pass through every node at a fixed 5px offset without either
 * layout needing its own markup.
 *
 * ── The fill is animated; the state is not derived per frame ──
 * `scaleX`/`scaleY` on the fill is driven straight from a spring on scroll
 * progress, so it costs a compositor transform and never touches React. The node
 * states come from `reachedCount`, an integer 0–5, so scrolling the whole section
 * causes at most five re-renders instead of one per frame.
 *
 * Under reduced motion the line is simply drawn complete on mount. The fill here
 * is decoration — it illustrates a sequence that the numbers already state — so
 * unlike a scroll-progress indicator, removing its movement removes nothing.
 */
export default function ProcessTimeline() {
  const ref = useRef<HTMLOListElement>(null);
  const prefersReducedMotion = useReducedMotion();
  const [reachedCount, setReachedCount] = useState(0);

  const { scrollYProgress } = useScroll({
    target: ref,
    /* Draw while the block crosses the middle of the screen: start when its top
       reaches 85% of viewport height, finish when its bottom reaches 55%. The
       default entry-only offset would complete the line before the last two
       steps were on screen. */
    offset: ["start 85%", "end 55%"],
  });

  const fill = useSpring(scrollYProgress, {
    stiffness: 110,
    damping: 28,
    restDelta: 0.001,
  });

  useMotionValueEvent(scrollYProgress, "change", (value) => {
    setReachedCount(Math.round(value * STEPS.length));
  });

  const complete = prefersReducedMotion;
  const fillStyle = complete ? { scaleX: 1, scaleY: 1 } : { scaleX: fill, scaleY: fill };

  return (
    <ol ref={ref} className="relative mt-14 flex flex-col gap-10 md:flex-row md:gap-8">
      {/* ── The rule, vertical (mobile) ──
          It runs to the section edge and dissolves with `mask-fade-b` rather
          than stopping dead below the final node. Ending it exactly on that node
          would mean measuring the last item's height at runtime; dissolving is
          both cheaper and a better read — the process ends at "Deliver", and a
          hard stub of leftover line below it looks like a rendering bug. */}
      <div
        aria-hidden="true"
        className="mask-fade-b absolute bottom-0 left-[5px] top-2 w-px bg-[var(--cinema-edge)] md:hidden"
      >
        <motion.div
          className="h-full w-full origin-top bg-[var(--accent-bright)]"
          style={{ scaleY: fillStyle.scaleY }}
        />
      </div>

      {/* ── The rule, horizontal (md and up) ──
          The right inset is `(100% - 8rem) / 5`, which is exactly one column:
          five `flex-1` items separated by four `gap-8` (2rem) gaps. That lands
          the end of the line on the last node instead of running past it into
          the gutter. If the gap or the step count changes, this changes with it. */}
      <div
        aria-hidden="true"
        className="absolute left-0 top-[5px] hidden h-px bg-[var(--cinema-edge)] md:right-[calc((100%-8rem)/5)] md:block"
      >
        <motion.div
          className="h-full w-full origin-left bg-[var(--accent-bright)]"
          style={{ scaleX: fillStyle.scaleX }}
        />
      </div>

      {STEPS.map((step, index) => {
        const reached = complete || index < reachedCount;
        return (
          <li
            key={step.n}
            className="relative flex-1 pl-8 md:pl-0 md:pt-9"
          >
            {/* Node. A square, not a dot: on a drawing, a square marks a
                station on a path and a circle marks a hole. */}
            <span
              aria-hidden="true"
              className={`absolute left-0 top-0.5 h-2.5 w-2.5 border transition-colors duration-500 md:top-0 ${
                reached
                  ? "border-[var(--accent-bright)] bg-[var(--accent-bright)]"
                  : "border-[rgb(255_255_255/0.3)] bg-[var(--cinema-void)]"
              }`}
            />

            <span
              className={`font-mono text-xs font-semibold tracking-[0.18em] transition-colors duration-500 ${
                reached ? "text-[var(--accent-on-dark)]" : "text-[var(--text-subtle)]"
              }`}
            >
              {step.n}
            </span>

            <h3 className="mt-2 text-sm font-bold uppercase tracking-[0.08em] text-[var(--text-inverse)]">
              {step.t}
            </h3>

            <p className="mt-2.5 max-w-xs text-[13px] leading-relaxed text-[var(--text-inverse-muted)] md:max-w-none">
              {step.d}
            </p>
          </li>
        );
      })}
    </ol>
  );
}
