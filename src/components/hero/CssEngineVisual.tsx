"use client";

import { motion, useScroll, useSpring, useTransform, useReducedMotion } from "framer-motion";
import { useRef } from "react";

/**
 * CssEngineVisual — the hero's ground when there is no photograph.
 *
 * ── WHEN THIS RENDERS ─────────────────────────────────────────────────────
 * Only when `public/images/hero/` holds no photograph. `HeroVisual` branches on
 * `resolveHeroPhoto()`, so the moment a real shot of RAEW's machinery is dropped
 * in, this file stops being downloaded at all. It is the honest empty state, not
 * the intended design — see `public/images/README.md`.
 *
 * ── WHAT THIS DEPICTS, AND WHAT IT DELIBERATELY DOES NOT ──────────────────
 * There is not a single machinery photograph in this repository (`public/` holds
 * the logo and one badge). The brief is explicit about the honest option: create
 * an elegant abstract engineering visualization rather than pretending a random
 * object is the company's machinery.
 *
 * So this is an ABSTRACT motif — a rotary flange assembly in drafting notation.
 * It is not a drawing of any product RAEW sells, and nothing on it is presented
 * as one. It is `aria-hidden`, so it makes no claim to a screen reader either.
 * There is NOT ONE NUMBER anywhere in the graphic, which is the constraint that
 * matters: the moment a dimension line reads "1200 mm" this stops being a
 * decorative motif and becomes a fabricated specification, which the brief
 * forbids without qualification.
 *
 * ── WHY IT IS SMALL, OFF-CENTRE, AND FAINT ────────────────────────────────
 * It used to be `aspect-square w-[88%]` centred on `inset-0` — a 1690px disc on
 * a 1920px screen, sitting directly behind a left-aligned headline. The
 * concentric rings and centre lines ran straight through the type, and because
 * the disc was the largest, highest-contrast thing in the frame, it read as the
 * subject of the hero. It was not the subject. It is the *backdrop* to a
 * headline, and a backdrop that outweighs its foreground is decoration, which is
 * the one thing the brief rules out at every turn.
 *
 * So: anchored to the right edge and allowed to crop, capped at 820px, and held
 * at 55% opacity. Below `lg` it does not render at all — on a phone the text
 * column *is* the viewport, so there is no "beside the type" to place it in, and
 * the earlier `w-[130%]` mobile treatment put a full-bleed disc directly under
 * the paragraph. What remains on small screens is the grid, the lighting and the
 * grain, which is a finished-looking dark ground on its own.
 *
 * ── WHY THERE IS NO LONGER ANY LETTERING ──────────────────────────────────
 * This carried drafting annotation — `X`, `Y`, a section mark `A—A` — set at
 * `11px`. That was a straightforward mistake: text inside an SVG scales with the
 * `viewBox` like every other unit, so `11px` in a 400-unit box drawn 1690px wide
 * paints at ~46px. The result was a stray capital X the height of a heading
 * floating over the hero. Annotation whose rendered size is a function of the
 * container is not annotation you can typeset, so it is gone rather than tuned;
 * the construction lines stay, because lines are geometry and scaling them is
 * exactly what should happen.
 *
 * ── WHY NOTHING SPINS ─────────────────────────────────────────────────────
 * A slowly rotating disc is the obvious move here and it is the wrong one. An
 * earlier pass deleted an entire looping-animation layer (`.animate-spin-slow`,
 * `.animate-float`, `.animate-marquee`) precisely because perpetual motion is the
 * loudest "generated template" signal, and the brief bans spinning outright. It
 * also costs a composite every frame forever, on every device, for no
 * information. Pointer-reactive tilt went the same way, with the rest of the
 * decorative interaction layer.
 *
 * The one movement that remains carries meaning: the assembly recedes and dims
 * as the hero scrolls away, so the section hands off to the next instead of
 * cutting. The grid and the lighting stay put while it goes — the sheet is not
 * moving, the part on it is. Under reduced-motion even that is dropped, and the
 * composition is completely still, and still looks finished.
 */

/* Twelve mount positions at 30°. Precomputed rather than done in the render so
   the array identity is stable and the geometry is legible as data. */
const MOUNT_ANGLES = Array.from({ length: 12 }, (_, i) => i * 30);
/* Sixty alignment ticks at 6°, every fifth one long — a measurement bezel. */
const TICKS = Array.from({ length: 60 }, (_, i) => ({ angle: i * 6, major: i % 5 === 0 }));
const HUB_BOLTS = Array.from({ length: 6 }, (_, i) => i * 60);

export default function CssEngineVisual() {
  const prefersReducedMotion = useReducedMotion();
  const scrollRef = useRef<HTMLDivElement>(null);

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

  const strokeFaint = "rgb(148 163 184 / 0.28)";

  return (
    <div
      ref={scrollRef}
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 overflow-hidden"
    >
      {/* Nothing here is interactive: `pointer-events-none` on the wrapper above
          means the hero's CTAs keep every click, which is the whole reason the
          graphic can be full-bleed behind them. */}

      {/* ── The sheet ──
          Full-bleed and static. This is the layer doing most of the work now:
          a 56px measurement grid is what makes the ground read as drawing paper
          rather than as an empty dark box, and it needs no help from a motif. */}
      <div className="blueprint-grid-dark absolute inset-0 opacity-40" />

      {/* ── The part ──
          Right-anchored, cropped by the viewport edge, and capped in absolute
          px so it does not keep growing on a 27" display. `right-[-6%]` is the
          crop: a drawing running off the edge of the sheet reads as a detail
          view, where the same drawing centred and complete reads as a logo. */}
      <div className="absolute inset-y-0 right-[-6%] hidden w-[46%] max-w-[820px] items-center lg:flex">
        <motion.div
          className="scene aspect-square w-full"
          style={
            prefersReducedMotion
              ? undefined
              : { y: driftY, scale: driftScale, opacity: driftFade }
          }
        >
          {/* `.scene-layer` carries `transform-style: preserve-3d`, which is what
              makes the `translateZ` offsets below resolve as depth rather than
              being flattened. It is a plain div now that nothing tilts it. */}
          <div className="scene-layer relative h-full w-full opacity-[0.55]">
            {/* ── Plane −1: outer dashed alignment circle + tick bezel ── */}
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

            {/* ── Plane 0: the flange assembly ──
                A photo slot used to sit in this plane, compositing a machine shot
                into the middle of the assembly. It moved to `HeroVisual`: a real
                photograph deserves the full frame, not a 62%-wide window with
                drafting rings cropping its corners. When one exists, this whole
                file is bypassed. */}
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

            {/* ── Plane +1: construction lines ──
                Broken at the hub so they read as centre lines rather than as a
                crosshair drawn over the part. Geometry only — the axis letters
                that used to sit at the ends of these are gone. */}
            <svg
              viewBox="0 0 400 400"
              className="absolute inset-0 h-full w-full"
              style={{ transform: "translateZ(70px)" }}
            >
              <g stroke={strokeFaint} strokeWidth="0.75" opacity="0.85">
                <line x1="8" y1="200" x2="130" y2="200" strokeDasharray="14 4 3 4" />
                <line x1="270" y1="200" x2="392" y2="200" strokeDasharray="14 4 3 4" />
                <line x1="200" y1="8" x2="200" y2="130" strokeDasharray="14 4 3 4" />
                <line x1="200" y1="270" x2="200" y2="392" strokeDasharray="14 4 3 4" />
              </g>
            </svg>
          </div>
        </motion.div>
      </div>

      {/* ── The light ──
          Full-bleed and static, over everything. `.stage-light` supplies the
          key/fill/vignette that pulls the eye to the type; `.grain` breaks the
          banding those wide low-contrast gradients would otherwise show on 8-bit
          panels. These light the whole frame, not the part, which is why they sit
          out here rather than on a plane inside the assembly. */}
      <div className="stage-light" />
      <div className="grain" />
    </div>
  );
}
