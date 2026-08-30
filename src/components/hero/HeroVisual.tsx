"use client";

import dynamic from "next/dynamic";
import { useWebGLSupport } from "@/components/three/useWebGLSupport";

/**
 * HeroVisual — the isolation boundary around the hero's decorative visual, and the
 * place where the WebGL-vs-CSS decision is made.
 *
 * This file exists to be a seam, and it is worth being explicit about why, since a
 * `dynamic()` wrapper otherwise looks like indirection for its own sake.
 *
 * 1. **It keeps the visual out of the initial payload.** `ssr: false` means the
 *    geometry and the springs that drive it are fetched after hydration rather
 *    than blocking it. The hero's *text* — headline, copy, CTAs — is plain
 *    server-rendered markup and is never inside this boundary. So first paint
 *    shows the real content and the graphic arrives a beat later. That ordering is
 *    the point: the brief demands the page be impressive within five seconds, and
 *    nothing is less impressive than a hero that is blank until a canvas resolves.
 *
 * 2. **It is where the two fidelities meet.** `three` / R3F / drei are now declared
 *    dependencies, so the WebGL path is real — but it is not unconditional. See the
 *    decision table below.
 *
 * 3. **The fallback is a finished composition, not a spinner.** Because
 *    `ssr: false`, `HeroVisualFallback` renders during SSR, before either chunk
 *    lands, and for anyone with JS disabled entirely. A skeleton shimmer there
 *    would be worse than the static gradient and grid below, which simply looks
 *    like the intended dark hero — quiet, and complete. `aria-hidden` throughout:
 *    every layer is decorative and the information is carried by the hero's text.
 *
 * ── THE DECISION, AND WHY IT IS MADE ONCE ─────────────────────────────────
 *   useWebGLSupport() === null   → static fallback  (undecided: SSR + first frame)
 *   useWebGLSupport() === true   → EngineScene      (R3F, real geometry and PBR)
 *   useWebGLSupport() === false  → CssEngineVisual  (Framer + CSS 3D + SVG)
 *
 * The `null` state renders the static composition rather than optimistically
 * mounting `CssEngineVisual` and swapping it for WebGL a moment later. Two
 * different visuals appearing in sequence is a visible pop, and it would also
 * download both bundles on every capable machine. One decision, one mount.
 *
 * `false` is not an edge case worth neglecting — it is every reduced-motion user,
 * every machine on a software rasteriser, and every low-memory phone. See
 * `useWebGLSupport` for why each of those is excluded. The CSS visual is a
 * finished design in its own right, not a degraded one, and the 3D assembly was
 * modelled to match its silhouette so the two read as one object.
 */

const CssEngineVisual = dynamic(() => import("./CssEngineVisual"), {
  ssr: false,
  loading: () => <HeroVisualFallback />,
});

const EngineScene = dynamic(() => import("@/components/three/EngineScene"), {
  ssr: false,
  loading: () => <HeroVisualFallback />,
});

/**
 * The no-JS / undecided state. Deliberately built only from the same tokens and
 * utilities the live visuals use, so it reads as the same design rather than as a
 * placeholder for it.
 */
function HeroVisualFallback() {
  return (
    <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden">
      <div className="blueprint-grid-dark absolute inset-0 opacity-50" />
      <div className="stage-light" />
      <div className="grain" />
    </div>
  );
}

export default function HeroVisual({
  photoSrc,
  revealRef,
}: {
  photoSrc?: string;
  /** Blueprint → material, 0..1. Only the WebGL path consumes this. */
  revealRef?: React.RefObject<number>;
}) {
  const webgl = useWebGLSupport();

  if (webgl === null) return <HeroVisualFallback />;
  if (webgl) return <EngineScene revealRef={revealRef} />;
  return <CssEngineVisual photoSrc={photoSrc} />;
}
