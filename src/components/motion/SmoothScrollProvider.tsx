"use client";

/**
 * SmoothScrollProvider — installs Lenis and wires it to GSAP's ticker.
 *
 * ╔══════════════════════════════════════════════════════════════════════════╗
 * ║ THIS FILE HAS NEVER EXECUTED. READ IT FIRST IN REVIEW.                   ║
 * ║                                                                          ║
 * ║ `lenis` and `gsap` could not be installed where this was written (npm     ║
 * ║ registry returns 403), so both resolve to `any` and `tsc` cannot check a  ║
 * ║ single call below. The integration recipe is written from knowledge, and  ║
 * ║ the two documentation sources that would confirm it were unreachable:     ║
 * ║ web search is unavailable to this model, and network egress is            ║
 * ║ allowlisted to a single unrelated host. So: the *shape* of this is the    ║
 * ║ well-established Lenis↔GSAP pattern, but treat every option name as       ║
 * ║ unverified until it runs in a browser.                                    ║
 * ║                                                                          ║
 * ║ The three things most likely to be wrong, in order:                      ║
 * ║   1. `autoRaf: false` — the option that stops Lenis running its own rAF   ║
 * ║      loop. Added partway through Lenis 1.x. If the installed version      ║
 * ║      predates it the option is ignored and you get TWO loops driving the  ║
 * ║      same interpolation, which looks like scroll running at double speed  ║
 * ║      or stuttering. Check this first if scrolling feels wrong.            ║
 * ║   2. The easing signature. Lenis takes `easing: (t: number) => number`.   ║
 * ║   3. `lenis.scrollTo(y, { immediate })`, used by `scrollToY` in            ║
 * ║      `@/lib/smooth-scroll` and reached from the ShowcaseStage index rail.  ║
 * ╚══════════════════════════════════════════════════════════════════════════╝
 *
 * ── WHY GSAP'S TICKER DRIVES LENIS, RATHER THAN TWO LOOPS ─────────────────
 * Lenis can run its own `requestAnimationFrame` loop, and ScrollTrigger runs
 * inside GSAP's ticker. If both loop independently, the frame in which Lenis
 * writes a new scroll position is not guaranteed to be the frame in which
 * ScrollTrigger reads it, so pinned sections trail the scroll by one frame.
 * At 60fps that is a 16ms lag, and on a pinned element it is visible as a
 * shimmer along the pin edge. Driving `lenis.raf` from `gsap.ticker` forces both
 * into one loop with a known order: Lenis writes, then ScrollTrigger reads.
 *
 * `gsap.ticker` measures time in SECONDS; `lenis.raf` expects MILLISECONDS.
 * Hence the `* 1000`. Getting this wrong does not throw — it just makes
 * scrolling either instant or frozen, so it is worth stating.
 *
 * `lagSmoothing(0)` disables GSAP's protection against long frames. That
 * protection works by pretending no time passed during a stall, which is right
 * for a self-driving animation and wrong for scroll: it would make Lenis jump
 * after any dropped frame instead of catching up smoothly.
 *
 * ── WHY `ScrollTrigger.normalizeScroll` IS NOT USED ───────────────────────
 * It was in the plan for this file and it is a mistake. `normalizeScroll` works
 * by having ScrollTrigger intercept wheel and touch events and drive scrolling
 * itself, to dodge mobile address-bar resize jitter. Lenis intercepts the same
 * events for the same purpose. Enabling both means two libraries fighting over
 * one gesture stream. Lenis is the choice here, so this stays off.
 *
 * ── WHY FRAMER MOTION'S `useScroll` STILL WORKS ───────────────────────────
 * `ScrollProgressRail`, `ShowcaseStage` and `ProcessTimeline` all read scroll
 * through Framer Motion, which listens for native `scroll` events. This keeps
 * working because Lenis in its default configuration scrolls the real window —
 * it interpolates toward a target and writes actual scroll position each frame,
 * rather than transforming a wrapper element. Real position changes mean real
 * `scroll` events. That is also why no `ScrollTrigger.scrollerProxy` is needed.
 *
 * This is the single most important assumption in the file. If those three
 * components go dead or jittery once Lenis is live, this is why, and the fix is
 * a `scrollerProxy` — not a rewrite of the components.
 *
 * ── WHY IT IS ALL BEHIND A DYNAMIC IMPORT ─────────────────────────────────
 * This component sits in the root layout, so a static import would put Lenis and
 * GSAP core into the shared chunk every route downloads, including routes with
 * no scroll animation at all. Importing inside the effect keeps both out of the
 * critical path, and means users on reduced motion or a phone never download
 * them at all. Nothing renders, so there is no layout or paint cost either way.
 */

import { useEffect } from "react";
import { useReducedMotion } from "framer-motion";
import { registerLenis, type LenisLike } from "@/lib/smooth-scroll";

/**
 * Marks the document while Lenis is live, so CSS can switch off native smooth
 * scrolling. Deliberately our own class rather than Lenis's built-in `lenis`
 * class: the internal class names are an implementation detail that could not be
 * verified here, and this one cannot drift.
 */
const ACTIVE_CLASS = "smooth-scroll-active";

export default function SmoothScrollProvider() {
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    /* Reduced motion is a hard no. Interpolated scrolling is exactly the kind of
       decoupling of input from response that triggers vestibular symptoms, and
       it is not decorative — it changes how the whole page responds. */
    if (reducedMotion) return;

    /* Real touch devices keep native scrolling. Not a performance hedge: native
       touch scroll runs on the compositor with momentum and rubber-banding tuned
       per platform, and Lenis cannot improve on it — `syncTouch` exists but
       reliably feels worse than the OS. `(hover: none)` alongside
       `(pointer: coarse)` is what distinguishes a phone from a touchscreen
       laptop, which has a mouse as its primary input and should get Lenis. */
    if (window.matchMedia("(hover: none) and (pointer: coarse)").matches) return;

    let lenis: LenisLike | null = null;
    let tick: ((time: number) => void) | null = null;
    let onScroll: (() => void) | null = null;
    let refreshTimer: number | null = null;
    let cancelled = false;
    let cleanupGsap: (() => void) | null = null;

    (async () => {
      /* Parallel, because they are independent and this is on the client's
         critical interaction path even if not the render path. */
      const [{ default: Lenis }, gsapModule] = await Promise.all([
        import("lenis"),
        import("@/lib/gsap"),
      ]);

      /* The effect can be torn down mid-import — fast route change, or React
         Strict Mode's double-invoke in dev. Without this guard the second
         invocation leaves an orphaned Lenis instance and a ticker callback that
         nothing can remove, and scroll speed doubles. */
      if (cancelled) return;

      const { gsap, ScrollTrigger } = gsapModule;

      lenis = new Lenis({
        /* 1.1s with an exponential-out curve: enough weight to read as mass
           rather than lag. Lenis defaults to 1.2, which on a page this tall
           starts to feel like the scroll is arguing with you. */
        duration: 1.1,
        easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        orientation: "vertical",
        gestureOrientation: "vertical",
        smoothWheel: true,
        /* Native touch scrolling — see the coarse-pointer bail above. Set
           explicitly rather than relying on the default, because the default
           for this option has moved between Lenis versions. */
        syncTouch: false,
        wheelMultiplier: 1,
        touchMultiplier: 1,
        /* We drive the loop from gsap.ticker. See the header note — this is the
           option most likely to be missing on an older Lenis. */
        autoRaf: false,
      }) as LenisLike;

      registerLenis(lenis);
      document.documentElement.classList.add(ACTIVE_CLASS);

      onScroll = () => ScrollTrigger.update();
      lenis.on("scroll", onScroll);

      tick = (time: number) => {
        /* seconds → milliseconds */
        lenis?.raf(time * 1000);
      };
      gsap.ticker.add(tick);
      gsap.ticker.lagSmoothing(0);

      /* Trigger positions are measured from laid-out geometry. Two things change
         that geometry *after* first measurement:
           • Fonts. All three families load with `display: swap`, so headings are
             rendered in a fallback face first and resize on swap. On a page with
             `clamp(2.25rem, 11vw, 13rem)` display type, that moves section
             boundaries by hundreds of pixels.
           • Images. Next/Image reserves space via aspect ratio, so these are
             mostly safe, but the map iframes are not.
         Without a refresh, every ScrollTrigger start/end is computed against the
         pre-swap layout and fires at the wrong scroll offset. */
      const refresh = () => {
        if (!cancelled) {
          lenis?.resize();
          ScrollTrigger.refresh();
        }
      };

      if (document.fonts?.status === "loaded") {
        refresh();
      } else {
        document.fonts?.ready.then(refresh);
      }
      /* Backstop for anything that settles after fonts — late-loading iframes,
         a slow hydration. One extra measurement pass is far cheaper than a
         section that scrubs against stale coordinates. */
      refreshTimer = window.setTimeout(refresh, 1200);

      cleanupGsap = () => {
        if (tick) gsap.ticker.remove(tick);
        /* Restore GSAP's default. Leaving lag smoothing off site-wide would
           affect any non-scroll tween that outlives this provider. */
        gsap.ticker.lagSmoothing(500, 33);
      };
    })().catch((err) => {
      /* A failed chunk load must not take the page down — the site scrolls
         natively without any of this. Reported rather than swallowed, because
         silently losing smooth scroll is the kind of thing that gets diagnosed
         as "feels different on my machine" for a week. */
      console.error("[SmoothScrollProvider] initialisation failed", err);
    });

    return () => {
      cancelled = true;
      if (refreshTimer !== null) window.clearTimeout(refreshTimer);
      cleanupGsap?.();
      if (lenis && onScroll) lenis.off("scroll", onScroll);
      registerLenis(null);
      document.documentElement.classList.remove(ACTIVE_CLASS);
      lenis?.destroy();
      lenis = null;
    };
  }, [reducedMotion]);

  return null;
}
