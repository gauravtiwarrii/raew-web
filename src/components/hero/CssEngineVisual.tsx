"use client";

import { motion, useScroll, useSpring, useTransform, useReducedMotion } from "framer-motion";
import { useRef } from "react";
import Image from "next/image";
import { useTilt } from "@/hooks/useTilt";

/**
 * CssEngineVisual — the hero's centrepiece: an exploded technical assembly
 * rendered in real 3D from SVG + CSS transforms.
 *
 * ── What this depicts, and what it deliberately does not ──────────────────
 * There is no 3D model of a RAEW machine in this repository and not a single
 * machinery photograph (`public/` holds the logo and one badge). The brief is
 * explicit about the honest option: "If no model exists, create an elegant
 * abstract engineering 3D visualization instead of pretending a random object is
 * the company's machinery."
 *
 * So this is an ABSTRACT engineering motif — a rotary flange assembly in
 * drafting notation. It is not a drawing of any product RAEW sells, and nothing
 * on it is presented as one. Every annotation is pure drawing convention (axis
 * letters, section marks, alignment ticks) and there is NOT ONE NUMBER anywhere
 * in the graphic. That is the constraint that matters: the moment a dimension
 * line reads "1200 mm" this stops being a decorative motif and becomes a
 * fabricated specification, which the brief forbids without qualification.
 *
 * ── Why nothing spins ────────────────────────────────────────────────────
 * A slowly rotating disc is the obvious move here and it is the wrong one. The
 * previous pass through this codebase deleted an entire looping-animation layer
 * (`.animate-spin-slow`, `.animate-float`, `.animate-marquee`) precisely because
 * perpetual motion is the loudest "generated template" signal, and the brief
 * bans "spinning" outright under micro-interactions. It also costs a composite
 * every frame forever, on every device, for no information. All movement here is
 * therefore *responsive*: it comes from the pointer and from scroll position.
 * At rest, on a phone, or under reduced-motion, the assembly is completely
 * still — and still looks finished.
 *
 * ── Photo slot ───────────────────────────────────────────────────────────
 * `photoSrc` is the documented drop-in seam. When a real photograph of a RAEW
 * machine exists, pass it and it composites into the assembly's mid-plane with
 * the technical layers reading over and under it. Required framing:
 *   • aspect ratio 21:9 (e.g. 1680×720), landscape
 *   • the machine roughly centred, with headroom — the rings crop the corners
 *   • shot on, or masked to, a DARK background: it sits on #070707 and a bright
 *     studio-white cutout would punch a glowing rectangle through the scene
 * Nothing else needs to change when it arrives; the procedural layers stay as
 * the surrounding technical furniture.
 */

/* Twelve mount positions at 30°. Precomputed rather than done in the render so
   the array identity is stable and the geometry is legible as data. */
const MOUNT_ANGLES = Array.from({ length: 12 }, (_, i) => i * 30);
/* Sixty alignment ticks at 6°, every fifth one long — a measurement bezel. */
const TICKS = Array.from({ length: 60 }, (_, i) => ({ angle: i * 6, major: i % 5 === 0 }));
const HUB_BOLTS = Array.from({ length: 6 }, (_, i) => i * 60);

export default function CssEngineVisual({ photoSrc }: { photoSrc?: string }) {
  const prefersReducedMotion = useReducedMotion();
  const scrollRef = useRef<HTMLDivElement>(null);

  /* Pointer-driven pitch/yaw. `useTilt` already gates itself on a fine hovering
     pointer and on reduced-motion, so on touch these values stay pinned at 0 and
     the handlers return immediately — no separate mobile branch needed. */
  const { rotateX, rotateY, onPointerMove, onPointerLeave } = useTilt({ max: 7 });

  /* Scroll recession: the assembly drifts back and dims as the hero leaves,
     so the section hands off instead of cutting. */
  const { scrollYProgress } = useScroll({
    target: scrollRef,
    offset: ["start start", "end start"],
  });
  const smooth = useSpring(scrollYProgress, { stiffness: 80, damping: 26, mass: 0.4 });
  const driftY = useTransform(smooth, [0, 1], ["0%", "14%"]);
  const driftScale = useTransform(smooth, [0, 1], [1, 0.92]);
  const driftFade = useTransform(smooth, [0, 0.75], [1, 0.15]);

  const stroke = "rgb(148 163 184 / 0.55)";
  const strokeFaint = "rgb(148 163 184 / 0.28)";

  return (
    <div
      ref={scrollRef}
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 overflow-hidden"
    >
      {/* Pointer target is a separate, pointer-events-enabled plane so the
          assembly reacts to the cursor without stealing clicks from the CTAs
          layered above it. */}
      <div
        className="absolute inset-0 hidden md:block"
        style={{ pointerEvents: "auto" }}
        onPointerMove={onPointerMove}
        onPointerLeave={onPointerLeave}
      />

      <motion.div
        className="scene absolute inset-0 flex items-center justify-center"
        style={
          prefersReducedMotion
            ? undefined
            : { y: driftY, scale: driftScale, opacity: driftFade }
        }
      >
        <motion.div
          className="scene-layer relative aspect-square w-[130%] max-w-none sm:w-[100%] lg:w-[88%]"
          style={{ rotateX, rotateY }}
        >
          {/* ── Plane −1: blueprint backdrop ──
              Pushed back and scaled up so its grid pitch reads finer than the
              foreground, which is what sells the depth. */}
          <div
            className="blueprint-grid-dark absolute inset-[-18%] opacity-[0.5]"
            style={{ transform: "translateZ(-190px) scale(1.05)" }}
          />

          {/* ── Plane −2: outer dashed alignment circle + tick bezel ── */}
          <svg
            viewBox="0 0 400 400"
            className="absolute inset-0 h-full w-full"
            style={{ transform: "translateZ(-90px)" }}
          >
            <circle
              cx="200" cy="200" r="186"
              fill="none" stroke={strokeFaint} strokeWidth="1"
              strokeDasharray="2 7"
            />
            <g stroke={strokeFaint} strokeWidth="1">
              {TICKS.map(({ angle, major }) => (
                <line
                  key={angle}
                  x1="200" y1={major ? 24 : 30} x2="200" y2="36"
                  transform={`rotate(${angle} 200 200)`}
                  opacity={major ? 0.9 : 0.45}
                />
              ))}
            </g>
          </svg>

          {/* ── Plane 0: the photo slot ──
              Sits behind the technical layers and in front of the backdrop, so
              when a real photograph lands the rings and callouts frame it. */}
          {photoSrc ? (
            <div
              className="absolute left-1/2 top-1/2 w-[62%] -translate-x-1/2 -translate-y-1/2 overflow-hidden rounded-[2px]"
              style={{ transform: "translate(-50%, -50%) translateZ(-30px)", aspectRatio: "21 / 9" }}
            >
              <Image
                src={photoSrc}
                alt=""
                fill
                priority
                sizes="(max-width: 768px) 90vw, 50vw"
                className="object-cover"
              />
              {/* Keeps a bright photo from flaring against the stage black. */}
              <div className="absolute inset-0 bg-gradient-to-t from-[var(--cinema-void)] via-transparent to-transparent" />
            </div>
          ) : null}

          {/* ── Plane +1: the main flange assembly ── */}
          <svg
            viewBox="0 0 400 400"
            className="absolute inset-0 h-full w-full"
            style={{ transform: "translateZ(0px)" }}
          >
            <defs>
              {/* Machined face: bright at upper-left, falling to a dark lower
                  lip — one broad light source, consistent with `.stage-light`. */}
              <linearGradient id="rv-plate" x1="0" y1="0" x2="0.35" y2="1">
                <stop offset="0%" stopColor="#2b3135" />
                <stop offset="42%" stopColor="#1d2226" />
                <stop offset="100%" stopColor="#0e1114" />
              </linearGradient>
              <radialGradient id="rv-hub" cx="0.38" cy="0.3" r="0.8">
                <stop offset="0%" stopColor="#343b40" />
                <stop offset="70%" stopColor="#1a1e22" />
                <stop offset="100%" stopColor="#101316" />
              </radialGradient>
              {/* Specular arc across the top edge of the disc. */}
              <linearGradient id="rv-spec" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="rgb(255 255 255 / 0.4)" />
                <stop offset="100%" stopColor="rgb(255 255 255 / 0)" />
              </linearGradient>
            </defs>

            {/* Disc body */}
            <circle cx="200" cy="200" r="128" fill="url(#rv-plate)" />
            {/* Rim: a light upper edge and a dark lower one is what makes a flat
                circle read as a solid object rather than a filled shape. */}
            <circle
              cx="200" cy="200" r="128"
              fill="none" stroke="rgb(255 255 255 / 0.14)" strokeWidth="1"
            />
            <path
              d="M 72 200 A 128 128 0 0 1 328 200"
              fill="none" stroke="url(#rv-spec)" strokeWidth="2"
            />

            {/* Mount slots — the feature that reads as rotary machinery. */}
            <g>
              {MOUNT_ANGLES.map((angle) => (
                <g key={angle} transform={`rotate(${angle} 200 200)`}>
                  <rect
                    x="194" y="84" width="12" height="26" rx="6"
                    fill="#0a0c0e" stroke="rgb(255 255 255 / 0.1)" strokeWidth="0.75"
                  />
                </g>
              ))}
            </g>

            {/* Concentric machining passes */}
            <circle cx="200" cy="200" r="104" fill="none" stroke={strokeFaint} strokeWidth="0.75" />
            <circle cx="200" cy="200" r="70" fill="none" stroke={strokeFaint} strokeWidth="0.75" />

            {/* Hub + bolt circle + centre bore */}
            <circle cx="200" cy="200" r="52" fill="url(#rv-hub)" stroke="rgb(255 255 255 / 0.12)" strokeWidth="1" />
            {HUB_BOLTS.map((angle) => (
              <circle
                key={angle}
                cx="200" cy="168" r="5.5"
                fill="#080a0c" stroke="rgb(255 255 255 / 0.14)" strokeWidth="0.75"
                transform={`rotate(${angle} 200 200)`}
              />
            ))}
            <circle cx="200" cy="200" r="17" fill="#050607" stroke="rgb(255 255 255 / 0.16)" strokeWidth="1" />
            {/* The single highlight-green mark in the entire composition. Used
                once, on a 1px arc, because "extremely sparingly" means once. */}
            <path
              d="M 183 200 A 17 17 0 0 1 217 200"
              fill="none" stroke="var(--accent-highlight)" strokeWidth="1.25" opacity="0.85"
            />
          </svg>

          {/* ── Plane +2: drafting annotation ──
              Axis letters and a section mark: real drawing notation, zero
              numeric claims. */}
          <svg
            viewBox="0 0 400 400"
            className="absolute inset-0 h-full w-full"
            style={{ transform: "translateZ(70px)" }}
          >
            <g stroke={stroke} strokeWidth="0.75" opacity="0.85">
              {/* Centre axes, broken at the hub so they read as construction
                  lines rather than a crosshair drawn over the part. */}
              <line x1="8" y1="200" x2="130" y2="200" strokeDasharray="14 4 3 4" />
              <line x1="270" y1="200" x2="392" y2="200" strokeDasharray="14 4 3 4" />
              <line x1="200" y1="8" x2="200" y2="130" strokeDasharray="14 4 3 4" />
              <line x1="200" y1="270" x2="200" y2="392" strokeDasharray="14 4 3 4" />
            </g>
            <g
              fill="rgb(203 213 225 / 0.75)"
              style={{ font: "500 11px var(--font-mono, monospace)", letterSpacing: "0.18em" }}
            >
              <text x="14" y="192">X</text>
              <text x="206" y="24">Y</text>
              <text x="330" y="330">A—A</text>
            </g>
            {/* Leader line to the section mark. */}
            <line x1="266" y1="266" x2="326" y2="322" stroke={strokeFaint} strokeWidth="0.75" />
          </svg>

          {/* ── Plane +3: light and grain ──
              `.stage-light` supplies the key/fill/vignette; `.grain` breaks the
              banding those wide low-contrast gradients would otherwise show on
              8-bit panels. Both are static. */}
          <div className="stage-light" style={{ transform: "translateZ(120px)" }} />
          <div className="grain" style={{ transform: "translateZ(130px)" }} />
        </motion.div>
      </motion.div>
    </div>
  );
}
