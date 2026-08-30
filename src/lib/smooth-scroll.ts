/**
 * Smooth-scroll access layer — the seam between Lenis and everything that needs
 * to move the page.
 *
 * ── WHY A MODULE SINGLETON AND NOT REACT CONTEXT ──────────────────────────
 * Three call sites need to drive or suspend scrolling, and only one of them is
 * a component tree consumer:
 *   • `useFocusTrap` locks scroll when a modal opens. It is a low-level hook
 *     used by the mobile drawer and the lightbox; threading a context through it
 *     would push a provider requirement onto every future consumer.
 *   • `ShowcaseStage`'s index rail jumps to a machine.
 *   • The provider itself, which owns the instance.
 * A module-level singleton with no-op fallbacks means every one of those works
 * whether or not Lenis is running — under reduced motion, on touch, on a first
 * paint before the dynamic import resolves, and in unit tests. Nothing has to
 * branch on "is smooth scroll available".
 *
 * ── WHY `LenisLike` IS SPELLED OUT ────────────────────────────────────────
 * In the environment this was written in, `lenis` could not be installed, so its
 * import resolves to `any` via `sandbox-shims.d.ts`. Declaring the exact surface
 * used here buys back real typechecking for these functions AND — more usefully
 * — collapses "unverified Lenis API calls scattered across four files" into one
 * short interface a reviewer can diff against the real types in a single pass.
 *
 * If any member below turns out to be wrong after `npm install`, the compile
 * error lands in `SmoothScrollProvider.tsx` where the instance is cast, not
 * mysteriously at runtime. That is the whole point of writing it down.
 */

/** The subset of the Lenis instance API this codebase actually calls. */
export type LenisLike = {
  /** Advance the interpolation. Expects milliseconds. */
  raf(time: number): void;
  scrollTo(
    target: number | string | HTMLElement,
    /* Lenis accepts more options than this (offset, duration, lock, force,
       onComplete). Only what is actually called is declared, so this stays a
       truthful record of the surface to verify rather than a half-remembered
       copy of the docs. Add members here as call sites need them. */
    options?: { immediate?: boolean }
  ): void;
  /** Suspend scrolling without losing the current position. */
  stop(): void;
  start(): void;
  /** Re-measure content height after the DOM changes. */
  resize(): void;
  destroy(): void;
  on(event: "scroll", handler: () => void): void;
  off(event: "scroll", handler: () => void): void;
};

let instance: LenisLike | null = null;

/**
 * Lock nesting depth. The mobile drawer can be open when a lightbox opens on
 * top of it; a naive boolean would let closing the inner one release the outer
 * one's lock, and the page would scroll behind a still-open modal.
 */
let lockDepth = 0;

/** Called only by `SmoothScrollProvider`. Pass `null` on teardown. */
export function registerLenis(next: LenisLike | null) {
  instance = next;
  /* If a modal was already open when Lenis mounted (possible: the provider's
     import is async), carry the lock over to the new instance. */
  if (next && lockDepth > 0) next.stop();
}

function prefersReducedMotion(): boolean {
  if (typeof window === "undefined") return false;
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

/**
 * Scroll to an absolute Y offset.
 *
 * Falls back to `window.scrollTo`. The fallback's `behavior` is deliberately
 * derived from the media query rather than hardcoded to "smooth": when Lenis is
 * absent it is usually absent *because* the user asked for reduced motion, and
 * animating the jump anyway would defeat that.
 *
 * ── IF YOU ARE SCROLLING TO AN ELEMENT ──
 * Subtract 96px (the `scroll-padding-top: 6rem` set in globals.css) from the
 * target, or it will land underneath the sticky header. The browser applies
 * `scroll-padding-top` to native anchor navigation and to `scrollIntoView`, but
 * NOT to a scripted scroll to a computed offset — that is a genuinely easy thing
 * to lose an afternoon to. With Lenis, `lenis.scrollTo(el, { offset: -96 })`
 * does the same job directly.
 */
export function scrollToY(y: number, options?: { immediate?: boolean }) {
  const lenis = instance;
  if (lenis) {
    lenis.scrollTo(y, { immediate: options?.immediate ?? false });
    return;
  }
  if (typeof window === "undefined") return;
  window.scrollTo({
    top: y,
    behavior:
      options?.immediate || prefersReducedMotion() ? "auto" : "smooth",
  });
}

/**
 * Suspend page scrolling for a modal.
 *
 * `useFocusTrap` already sets `body.style.overflow = "hidden"`, which is the
 * correct native lock and must stay — it is what holds when Lenis is not
 * running. But it is not sufficient with Lenis: Lenis reads wheel and touch
 * events itself and keeps integrating a target scroll position even while the
 * document cannot move, so on close the page would snap to wherever that phantom
 * target had drifted. `lenis.stop()` is what actually stops the integration.
 */
export function lockScroll() {
  lockDepth += 1;
  if (lockDepth === 1) instance?.stop();
}

export function unlockScroll() {
  lockDepth = Math.max(0, lockDepth - 1);
  if (lockDepth === 0) instance?.start();
}
