"use client";

import { useEffect, useState } from "react";

/**
 * useMediaQuery — subscribe to a CSS media query from JS.
 *
 * Returns `false` on the server and on the first client render, then the real
 * value after mount. That initial `false` is not a limitation to work around, it
 * is the contract: there is no viewport to measure during SSR, and reading
 * `matchMedia` during render would produce markup that disagrees with the
 * server's and trip a hydration mismatch.
 *
 * The practical consequence for callers: **`false` must be the safe, complete
 * state.** Use this to *add* an enhancement for capable viewports, never to
 * decide whether essential content exists. A component that renders its content
 * only when this returns `true` would ship an empty first paint and hide that
 * content from anything that does not run JS.
 */
export function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined" || !window.matchMedia) return;

    const list = window.matchMedia(query);
    const update = () => setMatches(list.matches);
    update();

    // `addEventListener` is the modern API; the fallback covers Safari < 14,
    // which only exposes the deprecated `addListener`.
    if (list.addEventListener) {
      list.addEventListener("change", update);
      return () => list.removeEventListener("change", update);
    }
    list.addListener(update);
    return () => list.removeListener(update);
  }, [query]);

  return matches;
}
