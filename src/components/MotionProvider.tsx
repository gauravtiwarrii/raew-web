"use client";

import { MotionConfig } from "framer-motion";

/**
 * Global Framer Motion configuration.
 *
 * `reducedMotion="user"` makes every `motion.*` component in the tree honour the
 * OS "reduce motion" setting, disabling transform and layout animations while
 * leaving opacity and colour alone. Without it each component had to remember to
 * call `useReducedMotion()` itself, and two had not: the floating WhatsApp button
 * slid up on every page load, and the active-nav underline sprang between items.
 * Framer writes its animations as inline styles, so the
 * `@media (prefers-reduced-motion)` block in globals.css cannot reach them —
 * this has to be handled inside Framer.
 *
 * `AnimatedSection` keeps its own explicit `useReducedMotion()` check because it
 * animates *from* `opacity: 0`. There the animation gates whether content is
 * visible at all, which is more than MotionConfig alone would switch off.
 */
export default function MotionProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  return <MotionConfig reducedMotion="user">{children}</MotionConfig>;
}
