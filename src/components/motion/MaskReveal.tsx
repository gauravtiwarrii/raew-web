"use client";

import { motion, useReducedMotion, type Variants } from "framer-motion";
import { type ReactNode } from "react";
import { cn } from "@/lib/utils";

interface MaskRevealProps {
  children: ReactNode;
  className?: string;
  /** Direction the content slides in from as its clip mask opens. */
  from?: "bottom" | "left";
  delay?: number;
  duration?: number;
  once?: boolean;
}

/**
 * MaskReveal — content wiped into view behind a moving clip edge.
 *
 * The difference from `AnimatedSection`'s fade-up is the *mask*: the child sits
 * at full opacity and is revealed by an animating `clip-path`, so it appears to
 * emerge from behind a hard edge like a title card, rather than dissolving in.
 * That reads as "cinematic" instead of "generic web fade", which is exactly the
 * distinction the brief is chasing.
 *
 * Because the reveal is a clip and a small translate — never opacity from 0 —
 * the fallback under reduced-motion can safely render the child fully visible
 * and static with no risk of leaving anything hidden. `clip-path` is animated on
 * the compositor and pairs with a transform, so this stays on the GPU.
 */
const maskVariants: Record<"bottom" | "left", Variants> = {
  bottom: {
    hidden: { clipPath: "inset(100% 0 0 0)", y: "12%" },
    visible: { clipPath: "inset(0% 0 0 0)", y: "0%" },
  },
  left: {
    hidden: { clipPath: "inset(0 100% 0 0)", x: "-6%" },
    visible: { clipPath: "inset(0 0% 0 0)", x: "0%" },
  },
};

export default function MaskReveal({
  children,
  className,
  from = "bottom",
  delay = 0,
  duration = 0.9,
  once = true,
}: MaskRevealProps) {
  const prefersReducedMotion = useReducedMotion();

  if (prefersReducedMotion) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div
      className={cn(className)}
      initial="hidden"
      whileInView="visible"
      viewport={{ once, margin: "-80px" }}
      variants={maskVariants[from]}
      transition={{ duration, delay, ease: [0.22, 1, 0.36, 1] }}
      style={{ willChange: "clip-path, transform" }}
    >
      {children}
    </motion.div>
  );
}
