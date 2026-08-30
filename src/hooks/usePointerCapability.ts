"use client";

import { useMediaQuery } from "./useMediaQuery";

/**
 * usePointerCapability — reports whether the device has a *fine, hovering*
 * pointer (a mouse/trackpad) as opposed to touch.
 *
 * Every pointer-driven flourish in this redesign — magnetic buttons, the tilt
 * on cards, the custom cursor, hero mouse-parallax — must switch OFF on touch.
 * On a phone there is no cursor to be magnetic toward, and a "hover" state that
 * only clears on the next tap actively gets in the way. The brief calls this out
 * twice ("disabled on touch", "lightweight on mobile"), so the check lives in
 * one place rather than being re-derived per component.
 *
 * This is now a named query over the generic `useMediaQuery`, which owns the
 * listener plumbing and the SSR contract (see that file). What stays here is the
 * one decision specific to pointers: requiring BOTH capabilities. A stylus
 * reports `pointer: fine` but `hover: none`; treating it like a mouse would leave
 * a magnetic offset stuck on screen after the pen lifts.
 *
 * SSR-safe by construction: `false` on the server and on the first client render,
 * then the real value after mount. Because every consumer treats `false` as "no
 * enhancement", pre-hydration markup is always the plain, correct baseline —
 * enhancements only ever get *added* after mount, never hydrated away.
 */
export function usePointerCapability(): boolean {
  return useMediaQuery("(pointer: fine) and (hover: hover)");
}
