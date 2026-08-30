"use client";

import { useCallback, useRef } from "react";
import { useMotionValue, useSpring, useReducedMotion } from "framer-motion";
import { usePointerCapability } from "./usePointerCapability";

interface MagneticOptions {
  /** Peak displacement in px at the edge of the element. Keep this small. */
  strength?: number;
  /** How far outside the element the pull begins, as a fraction of its size. */
  radius?: number;
}

/**
 * useMagnetic — a button that leans very slightly toward the cursor.
 *
 * The whole effect lives or dies on restraint. A magnetic button that moves 20px
 * stops being a button and becomes a toy that dodges the click; the brief asks
 * for "subtle" and "no cheap bounce", so the default peak is 6px and the spring
 * is critically damped enough that it settles without overshoot.
 *
 * Returns motion values rather than writing to the DOM itself, so the caller
 * binds them to a `motion.*` element and keeps ownership of its own markup.
 *
 * Disabled entirely on touch and under reduced-motion, in which case the motion
 * values simply stay at 0 and the handlers are no-ops — the element renders and
 * behaves as an ordinary button with no branching needed at the call site.
 */
export function useMagnetic({ strength = 6, radius = 1.6 }: MagneticOptions = {}) {
  const ref = useRef<HTMLElement | null>(null);
  const prefersReducedMotion = useReducedMotion();
  const hasFinePointer = usePointerCapability();
  const enabled = hasFinePointer && !prefersReducedMotion;

  const rawX = useMotionValue(0);
  const rawY = useMotionValue(0);

  /* stiffness/damping chosen so the element tracks the cursor without lag but
     lands without a visible wobble. damping 22 against stiffness 260 is just
     inside the overdamped side of critical. */
  const x = useSpring(rawX, { stiffness: 260, damping: 22, mass: 0.4 });
  const y = useSpring(rawY, { stiffness: 260, damping: 22, mass: 0.4 });

  const onPointerMove = useCallback(
    (event: React.PointerEvent<HTMLElement>) => {
      if (!enabled) return;
      const node = ref.current ?? (event.currentTarget as HTMLElement);
      const rect = node.getBoundingClientRect();

      // Offset from the element's centre, normalised to -1…1 across the
      // magnetic field (the element's own half-size scaled by `radius`).
      const dx = (event.clientX - (rect.left + rect.width / 2)) / ((rect.width / 2) * radius);
      const dy = (event.clientY - (rect.top + rect.height / 2)) / ((rect.height / 2) * radius);

      // Clamp before scaling. Without this, a pointer entering fast from a
      // corner can report >1 and throw the button well past `strength`.
      rawX.set(Math.max(-1, Math.min(1, dx)) * strength);
      rawY.set(Math.max(-1, Math.min(1, dy)) * strength);
    },
    [enabled, radius, strength, rawX, rawY]
  );

  const onPointerLeave = useCallback(() => {
    rawX.set(0);
    rawY.set(0);
  }, [rawX, rawY]);

  return { ref, x, y, onPointerMove, onPointerLeave, enabled };
}
