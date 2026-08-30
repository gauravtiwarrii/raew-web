"use client";

import { motion, useScroll, useSpring } from "framer-motion";

/**
 * ScrollProgressRail — a hairline bar across the top of the viewport tracking
 * read position.
 *
 * Included because it is the one piece of "scroll furniture" that earns its
 * place on a long page: it answers "how much is left" without occupying layout.
 * Kept to 2px and the accent green so it reads as instrumentation rather than
 * decoration.
 *
 * `scaleX` with `transform-origin: left` is the cheap way to do this — animating
 * `width` would force a layout pass on every frame of every scroll. The spring
 * smooths the discrete wheel deltas into continuous travel.
 *
 * No reduced-motion branch, deliberately: this element's movement IS its
 * information (it is a progress indicator, not an entrance flourish), and it
 * moves in direct response to the user's own scrolling rather than animating on
 * its own. Removing it under reduced-motion would delete the affordance instead
 * of calming it. `aria-hidden` because the same information is already conveyed
 * by the scrollbar to assistive tech.
 */
export default function ScrollProgressRail() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 120,
    damping: 28,
    restDelta: 0.001,
  });

  return (
    <motion.div
      aria-hidden="true"
      className="pointer-events-none fixed inset-x-0 top-0 z-[60] h-[2px] origin-left bg-[var(--accent-bright)]"
      style={{ scaleX }}
    />
  );
}
