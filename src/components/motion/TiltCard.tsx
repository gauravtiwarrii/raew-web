"use client";

import { motion, useMotionValue, useSpring, useReducedMotion } from "framer-motion";
import { useCallback, useRef, useState, type ReactNode } from "react";
import { useTilt } from "@/hooks/useTilt";
import { cn } from "@/lib/utils";

interface TiltCardProps {
  children: ReactNode;
  className?: string;
  /** Rotation ceiling in degrees. 6 is right for a catalogue tile. */
  max?: number;
}

/**
 * TiltCard — the interactive shell for a card, as a thin client boundary.
 *
 * Why this exists as a separate component rather than as `"use client"` on the
 * card itself: `ProductCard` is a server component that renders `<Image>`, reads
 * `isAuthenticImage`, and builds WhatsApp links. Making it a client component to
 * get a hover effect would ship all of that to the browser and do it once per
 * tile in a six-card grid. Instead the server-rendered card is passed in as
 * `children` — it stays on the server, and only this wrapper's springs are
 * client code.
 *
 * Three things move together on hover, which is what makes it read as a physical
 * object catching light rather than as a CSS effect:
 *   1. the card pitches and yaws a few degrees toward the cursor (real 3D — the
 *      parent establishes perspective, so nearer edges genuinely enlarge),
 *   2. it lifts toward the viewer on Z,
 *   3. a soft highlight tracks the pointer across the surface.
 *
 * The highlight is a translated circle, not an animated `background-image`
 * gradient. A `radial-gradient` whose position changes every frame forces the
 * browser to re-rasterise the element's background on each move; a `translate`
 * on a separate layer is a compositor transform and costs essentially nothing.
 *
 * Everything is inert on touch and under reduced-motion — `useTilt` gates on
 * both, and the highlight opacity is driven by hover state which touch never
 * enters. On those devices this is a plain `<div>` with the card inside it.
 */
export default function TiltCard({ children, className, max = 6 }: TiltCardProps) {
  const prefersReducedMotion = useReducedMotion();
  const { rotateX, rotateY, onPointerMove, onPointerLeave, enabled } = useTilt({ max });

  const [hovered, setHovered] = useState(false);
  const nodeRef = useRef<HTMLDivElement>(null);

  /* Highlight position in px within the card. Springs are looser than the tilt
     so the light trails the cursor slightly, which reads as a soft source. */
  const hx = useMotionValue(0);
  const hy = useMotionValue(0);
  const lightX = useSpring(hx, { stiffness: 150, damping: 20, mass: 0.5 });
  const lightY = useSpring(hy, { stiffness: 150, damping: 20, mass: 0.5 });

  const handleMove = useCallback(
    (event: React.PointerEvent<HTMLDivElement>) => {
      onPointerMove(event);
      if (!enabled) return;
      const rect = nodeRef.current?.getBoundingClientRect();
      if (!rect) return;
      hx.set(event.clientX - rect.left);
      hy.set(event.clientY - rect.top);
    },
    [onPointerMove, enabled, hx, hy]
  );

  const handleLeave = useCallback(() => {
    onPointerLeave();
    setHovered(false);
  }, [onPointerLeave]);

  if (prefersReducedMotion || !enabled) {
    return (
      <div ref={nodeRef} className={cn("h-full", className)}>
        {children}
      </div>
    );
  }

  return (
    // 900px, not the 1400px of `.scene`: a catalogue tile is a small object seen
    // close up, and a long perspective on a small element flattens the rotation
    // into what looks like a skew.
    <div
      ref={nodeRef}
      className={cn("h-full [perspective:900px]", className)}
      onPointerMove={handleMove}
      onPointerLeave={handleLeave}
      onPointerEnter={() => setHovered(true)}
    >
      <motion.div
        className="relative h-full [transform-style:preserve-3d]"
        style={{ rotateX, rotateY }}
        animate={{ z: hovered ? 26 : 0 }}
        transition={{ type: "spring", stiffness: 240, damping: 24, mass: 0.5 }}
      >
        {children}

        {/* Pointer-tracking light. Sits above the card but below nothing
            interactive — `pointer-events-none` keeps every link underneath
            clickable, and `overflow-hidden` on the parent clips the circle to
            the card's own edges. */}
        <motion.div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 overflow-hidden"
          animate={{ opacity: hovered ? 1 : 0 }}
          transition={{ duration: 0.3 }}
        >
          <motion.div
            className="absolute h-56 w-56 rounded-full"
            style={{
              x: lightX,
              y: lightY,
              translateX: "-50%",
              translateY: "-50%",
              background:
                "radial-gradient(circle, rgb(52 211 153 / 0.13) 0%, rgb(52 211 153 / 0.05) 40%, transparent 70%)",
            }}
          />
        </motion.div>
      </motion.div>
    </div>
  );
}
