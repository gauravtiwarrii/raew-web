"use client";

import { useCallback, useRef } from "react";
import { useMotionValue, useSpring, useTransform, useReducedMotion } from "framer-motion";
import { usePointerCapability } from "./usePointerCapability";

interface TiltOptions {
  /** Maximum rotation in degrees at the corners. */
  max?: number;
  /** Optional parallax lift (px) applied to a `[data-tilt-layer]` child via CSS var. */
  glare?: boolean;
}

/**
 * useTilt — a card that tips a few degrees toward the cursor in real 3D.
 *
 * This is the product-card hover the brief asks for: "spring-based physics",
 * "no cheap bounce". The rotation is applied on the X and Y axes (so the card
 * pitches and yaws, it does not skew), and the parent must establish
 * `perspective` — the `.scene` utility, or a Tailwind `perspective-*` class — or
 * the rotation will look flat.
 *
 * The returned `rotateX`/`rotateY` are spring-smoothed motion values; `pointerX`
 * and `pointerY` are 0…1 positions handed back so a call site can drive a
 * cursor-follow lighting highlight (`--mx`/`--my` in a radial-gradient) without
 * re-reading the pointer. Everything is inert on touch and under reduced-motion.
 */
export function useTilt({ max = 8 }: TiltOptions = {}) {
  const ref = useRef<HTMLElement | null>(null);
  const prefersReducedMotion = useReducedMotion();
  const hasFinePointer = usePointerCapability();
  const enabled = hasFinePointer && !prefersReducedMotion;

  // -0.5…0.5 across each axis, spring-smoothed.
  const px = useMotionValue(0);
  const py = useMotionValue(0);
  const spring = { stiffness: 220, damping: 20, mass: 0.5 };
  const sx = useSpring(px, spring);
  const sy = useSpring(py, spring);

  // Pitch (rotateX) is inverted: cursor above centre should tip the TOP of the
  // card away from the viewer, which is a negative X rotation.
  const rotateY = useTransform(sx, [-0.5, 0.5], [-max, max]);
  const rotateX = useTransform(sy, [-0.5, 0.5], [max, -max]);

  // 0…1 for lighting; usable directly as a CSS percentage.
  const pointerX = useTransform(sx, [-0.5, 0.5], [0, 1]);
  const pointerY = useTransform(sy, [-0.5, 0.5], [0, 1]);

  const onPointerMove = useCallback(
    (event: React.PointerEvent<HTMLElement>) => {
      if (!enabled) return;
      const node = ref.current ?? (event.currentTarget as HTMLElement);
      const rect = node.getBoundingClientRect();
      px.set((event.clientX - rect.left) / rect.width - 0.5);
      py.set((event.clientY - rect.top) / rect.height - 0.5);
    },
    [enabled, px, py]
  );

  const onPointerLeave = useCallback(() => {
    px.set(0);
    py.set(0);
  }, [px, py]);

  return { ref, rotateX, rotateY, pointerX, pointerY, onPointerMove, onPointerLeave, enabled };
}
