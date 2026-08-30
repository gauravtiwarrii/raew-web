"use client";

/**
 * GSAP + ScrollTrigger registration — the single place either is imported.
 *
 * ── WHY A CENTRAL MODULE ──────────────────────────────────────────────────
 * `gsap.registerPlugin(ScrollTrigger)` is idempotent but importing the plugin
 * from six components means six modules that must each remember to register it,
 * and one that forgets fails at runtime with a confusing "ScrollTrigger is not
 * defined" from inside a tween. Importing from here makes registration
 * structurally impossible to skip.
 *
 * ── THE DIVISION OF LABOUR WITH FRAMER MOTION ─────────────────────────────
 * This codebase now has two animation libraries, which is a real cost and needs
 * a rule, or the two will be used interchangeably and fight over the same
 * properties. The rule:
 *
 *   • GSAP + ScrollTrigger owns SCROLL-DRIVEN TIMELINES — anything that pins a
 *     section, translates a track horizontally as you scroll, draws a line
 *     progressively, or scrubs a camera. ScrollTrigger's pinning and `scrub`
 *     have no real equivalent in Framer Motion, and hand-rolling them is how
 *     you end up with the janky version.
 *   • Framer Motion owns COMPONENT-LEVEL STATE ANIMATION — entrances, exits
 *     (`AnimatePresence`), hover and tap springs, layout transitions. It is
 *     already wired through `MotionConfig reducedMotion="user"` and every
 *     existing component depends on it.
 *
 * Never animate the same property on the same element from both.
 *
 * ── WHAT `useGsap` IS FOR ─────────────────────────────────────────────────
 * GSAP's own `useGSAP` hook lives in `@gsap/react`, a separate package that is
 * deliberately NOT a dependency here — one more package to install for what is
 * a fifteen-line effect. `useGsap` below is that effect: it runs the callback
 * inside a `gsap.context()` so every tween and ScrollTrigger created within is
 * reverted on unmount. Without that, a ScrollTrigger outlives its component and
 * keeps a pin-spacer in the layout after a client-side route change — which
 * looks like a mysterious block of empty space on the next page.
 */

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

/* Registration must not run during SSR. `gsap` itself imports safely on the
   server, but ScrollTrigger touches `document` when it registers. */
if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export { gsap, ScrollTrigger };

/**
 * Run GSAP setup scoped to a container, with automatic cleanup.
 *
 * @param setup   Receives the container element. Create tweens/ScrollTriggers
 *                here; anything created inside is tracked by the context.
 * @param deps    Re-runs setup when these change. Defaults to `[]` — note that
 *                an inline arrow passed as `setup` is a new function on every
 *                render, so the deps array is what actually controls re-runs.
 *
 * Returns the ref to attach to the container element.
 */
export function useGsap<T extends HTMLElement = HTMLDivElement>(
  setup: (el: T) => void,
  deps: unknown[] = []
) {
  const ref = useRef<T>(null);
  /* `setup` is held in a ref so a fresh inline closure each render does not
     retrigger the effect. The effect intentionally depends only on `deps`. */
  const setupRef = useRef(setup);
  setupRef.current = setup;

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    /* `gsap.context` scopes selector strings to `el` AND records every
       animation created inside for `ctx.revert()`. */
    const ctx = gsap.context(() => setupRef.current(el), el);
    return () => ctx.revert();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);

  return ref;
}
