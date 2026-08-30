"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { type ReactNode } from "react";
import { useMagnetic } from "@/hooks/useMagnetic";
import { cn } from "@/lib/utils";

interface MagneticLinkProps {
  href: string;
  children: ReactNode;
  className?: string;
  /** Label shown by the custom cursor while hovering this control. */
  cursorLabel?: string;
  strength?: number;
}

/**
 * MagneticLink — a link that leans a few pixels toward the cursor.
 *
 * The transform is applied to an outer wrapper rather than to the anchor itself.
 * That is not incidental: moving the anchor moves its own hit box, so a pointer
 * approaching the edge pushes the target away from itself and can oscillate at
 * the boundary. With the wrapper carrying the motion, the pointer-tracking
 * geometry is measured against a box that never moves, and the click target
 * stays exactly where the user aimed.
 *
 * The anchor keeps its own `:focus-visible` ring and is a real `<Link>`, so
 * keyboard and screen-reader behaviour is untouched — the magnet is a
 * pointer-only embellishment that is inert on touch and under reduced-motion.
 */
export default function MagneticLink({
  href,
  children,
  className,
  cursorLabel,
  strength = 6,
}: MagneticLinkProps) {
  const { x, y, onPointerMove, onPointerLeave } = useMagnetic({ strength });

  return (
    <motion.span
      className="inline-flex"
      style={{ x, y }}
      onPointerMove={onPointerMove}
      onPointerLeave={onPointerLeave}
    >
      <Link href={href} className={cn(className)} data-cursor={cursorLabel}>
        {children}
      </Link>
    </motion.span>
  );
}
