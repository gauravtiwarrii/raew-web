"use client";

import { useRef, type ReactNode } from "react";
import { motion, useScroll, useSpring, useTransform, useReducedMotion } from "framer-motion";
import { cn } from "@/lib/utils";

interface ParallaxProps {
  children: ReactNode;
  className?: string;
  /**
   * Travel distance in px across the element's full scroll pass. Positive moves
   * the layer UP as you scroll down (it appears further away); negative moves it
   * down (nearer). Keep background layers under ~80px.
   */
  distance?: number;
  /** Optional scale drift, e.g. 1.08 for a slow push-in on an image. */
  scaleTo?: number;
}

/**
 * Parallax — a layer that drifts at a different rate from the page.
 *
 * `offset: ["start end", "end start"]` measures progress across the element's
 * ENTIRE pass through the viewport, from the moment its top edge enters at the
 * bottom to the moment its bottom edge exits at the top. That matters: the
 * default offset only tracks entry, so a layer would finish moving while still
 * mid-screen and then sit frozen, which looks broken rather than parallaxed.
 *
 * The raw scroll progress is spring-smoothed. This is what stands in for Lenis:
 * we cannot add a smooth-scroll library here, but running the *derived* values
 * through a spring gives the same perceptual result — layers ease toward their
 * target instead of snapping to each discrete wheel tick — without touching the
 * browser's native scrolling, which is better for accessibility anyway
 * (hijacked scroll breaks keyboard paging and momentum on trackpads).
 *
 * Transform-only: no layout property is animated, so this never triggers reflow.
 */
export default function Parallax({
  children,
  className,
  distance = 60,
  scaleTo,
}: ParallaxProps) {
  const ref = useRef<HTMLDivElement>(null);
  const prefersReducedMotion = useReducedMotion();

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  const smooth = useSpring(scrollYProgress, {
    stiffness: 90,
    damping: 24,
    mass: 0.35,
    restDelta: 0.0005,
  });

  const y = useTransform(smooth, [0, 1], [distance, -distance]);
  const scale = useTransform(smooth, [0, 0.5, 1], [1, scaleTo ?? 1, 1]);

  if (prefersReducedMotion) {
    return (
      <div ref={ref} className={cn(className)}>
        {children}
      </div>
    );
  }

  return (
    <motion.div
      ref={ref}
      className={cn(className)}
      style={{ y, ...(scaleTo ? { scale } : {}), willChange: "transform" }}
    >
      {children}
    </motion.div>
  );
}
