"use client";

import { useEffect, useState } from "react";
import { motion, useMotionValue, useSpring, useReducedMotion, AnimatePresence } from "framer-motion";
import { usePointerCapability } from "@/hooks/usePointerCapability";

/**
 * CustomCursor — a small tracking disc that grows into a labelled hint over
 * elements that opt in with `data-cursor="VIEW"` (or `→`, `EXPLORE`, …).
 *
 * Two decisions here are about not breaking things, and both are load-bearing:
 *
 * 1. The native cursor is NOT hidden globally. `* { cursor: none }` is the usual
 *    implementation and it is genuinely hostile — it removes the affordance that
 *    tells a user what is clickable, an I-beam over text, and the resize arrows
 *    on form controls, across the entire document. Here the OS cursor stays
 *    exactly as it is, and only elements that explicitly declare `data-cursor`
 *    suppress it, because on those the label IS the replacement pointer.
 *
 * 2. That suppression is gated on a class this component adds to `<html>` on
 *    mount (`.has-custom-cursor`). If the JS never runs — hydration failure,
 *    script blocked, bot — the rule never applies and the native cursor is
 *    untouched. A bare `[data-cursor] { cursor: none }` in the stylesheet would
 *    leave those users with no visible pointer at all over the most important
 *    interactive elements on the page.
 *
 * Off entirely on touch (nothing to track) and under reduced-motion (the spring
 * lag that gives the disc its weight is itself the motion being objected to, and
 * a cursor that trails behind the real one can induce discomfort).
 */
export default function CustomCursor() {
  const prefersReducedMotion = useReducedMotion();
  const hasFinePointer = usePointerCapability();
  const enabled = hasFinePointer && !prefersReducedMotion;

  const [label, setLabel] = useState<string | null>(null);
  const [visible, setVisible] = useState(false);

  const rawX = useMotionValue(0);
  const rawY = useMotionValue(0);
  /* Light spring: enough lag to feel physical, not enough to feel disconnected
     from the hardware pointer sitting right next to it. */
  const x = useSpring(rawX, { stiffness: 700, damping: 38, mass: 0.28 });
  const y = useSpring(rawY, { stiffness: 700, damping: 38, mass: 0.28 });

  useEffect(() => {
    if (!enabled) return;

    const root = document.documentElement;
    root.classList.add("has-custom-cursor");

    const onMove = (event: PointerEvent) => {
      rawX.set(event.clientX);
      rawY.set(event.clientY);
      // Called unconditionally rather than guarded on the current `visible`
      // value: React bails out when the next state is identical, so this costs
      // nothing, and reading `visible` here would put it in the dependency
      // array — which would tear down and re-attach these listeners (and
      // remove/re-add the <html> class) on every show/hide.
      setVisible(true);

      const target = event.target as Element | null;
      const hit = target?.closest?.("[data-cursor]") as HTMLElement | null;
      const next = hit?.dataset.cursor ?? null;
      // Guarded so a state update does not fire on every single pointermove.
      setLabel((current) => (current === next ? current : next));
    };

    const onLeave = () => setVisible(false);
    const onEnter = () => setVisible(true);

    window.addEventListener("pointermove", onMove, { passive: true });
    document.addEventListener("pointerleave", onLeave);
    document.addEventListener("pointerenter", onEnter);

    return () => {
      root.classList.remove("has-custom-cursor");
      window.removeEventListener("pointermove", onMove);
      document.removeEventListener("pointerleave", onLeave);
      document.removeEventListener("pointerenter", onEnter);
    };
  }, [enabled, rawX, rawY]);

  // Renders nothing on the server, on touch, or under reduced-motion.
  if (!enabled) return null;

  return (
    <motion.div
      aria-hidden="true"
      className="pointer-events-none fixed left-0 top-0 z-[70] hidden md:block"
      style={{ x, y }}
      animate={{ opacity: visible ? 1 : 0 }}
      transition={{ duration: 0.2 }}
    >
      <div className="-translate-x-1/2 -translate-y-1/2">
        <AnimatePresence mode="wait" initial={false}>
          {label ? (
            <motion.div
              key="label"
              initial={{ scale: 0.6, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.6, opacity: 0 }}
              transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
              className="flex h-16 w-16 items-center justify-center rounded-full bg-[var(--accent)] font-[family-name:var(--font-mono)] text-[10px] font-semibold uppercase tracking-[0.12em] text-[var(--accent-fg)]"
            >
              {label}
            </motion.div>
          ) : (
            <motion.div
              key="dot"
              initial={{ scale: 0.4, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.4, opacity: 0 }}
              transition={{ duration: 0.18 }}
              className="h-2 w-2 rounded-full bg-[var(--accent-bright)]"
            />
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}
