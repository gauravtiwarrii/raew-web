"use client";

/**
 * useWebGLSupport — decides whether the 3D layer is allowed to mount.
 *
 * Returns `null` while undecided (SSR and the first client render), then `true`
 * or `false`. Callers must treat `null` as "not yet" and render the 2D fallback,
 * which is also the correct no-JS output.
 *
 * ── WHY THIS IS MORE THAN A `!!canvas.getContext("webgl2")` CHECK ──────────
 * A context can be obtainable and still be the wrong thing to use:
 *
 *  • **Software rendering.** On a machine with no usable GPU driver, browsers
 *    fall back to SwiftShader/ANGLE-on-CPU. WebGL "works", reports a context,
 *    and then renders a PBR scene at about 4fps while pinning a core. This is
 *    common on office desktops, remote desktop sessions and VMs — exactly the
 *    kind of machine a customer might open a supplier's site on. The renderer
 *    string is the only practical way to see it.
 *
 *  • **Reduced motion.** A continuously rendering canvas with a scrubbing camera
 *    is precisely what the preference exists to switch off. Checked here rather
 *    than inside the scene so the whole `three` bundle is never downloaded.
 *
 *  • **Device memory.** A 2GB Android device can create a context and then be
 *    killed by the tab's memory ceiling mid-scroll. `deviceMemory` is
 *    Chromium-only and coarse, so it is used only to *exclude* the clearly
 *    incapable, never to gate on its absence.
 *
 * ── WHY THE PROBE CANVAS IS DISPOSED EXPLICITLY ───────────────────────────
 * Creating a WebGL context to test for it consumes one of a small per-page pool
 * (browsers cap concurrent contexts, historically around 16). Dropping the
 * reference is not enough — the context is held by the GPU process until GC,
 * which can be much later. `WEBGL_lose_context` releases it immediately, so the
 * probe cannot starve the real `<Canvas>` that follows it.
 *
 * ── NOT VERIFIED IN A BROWSER ─────────────────────────────────────────────
 * The DOM APIs here are stable and long-standing, unlike the three.js code this
 * gates — but the software-renderer substring list is a heuristic, and the
 * `WEBGL_debug_renderer_info` extension is unavailable in some privacy
 * configurations (Firefox with `privacy.resistFingerprinting`, Safari in some
 * versions). When it is unavailable the renderer check is skipped rather than
 * failed, so those users get the 3D scene — which is the right default, since
 * the extension being hidden says nothing about the GPU.
 */

import { useEffect, useState } from "react";

/**
 * Substrings that indicate a CPU rasteriser rather than a GPU.
 * Lowercased before comparison.
 */
const SOFTWARE_RENDERERS = [
  "swiftshader", // Chrome's CPU fallback
  "software",
  "basic render", // "Microsoft Basic Render Driver"
  "llvmpipe", // Mesa CPU rasteriser, common in Linux VMs
  "softpipe",
];

function detect(): boolean {
  /* Reduced motion is the cheapest check and the most decisive. */
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    return false;
  }

  /* Chromium-only, in GB, rounded down to a power of two. Absent elsewhere, so
     only an explicit low value disqualifies. */
  const memory = (navigator as Navigator & { deviceMemory?: number })
    .deviceMemory;
  if (typeof memory === "number" && memory < 2) return false;

  const canvas = document.createElement("canvas");
  let gl: WebGL2RenderingContext | WebGLRenderingContext | null = null;

  try {
    /* `failIfMajorPerformanceCaveat` asks the browser itself to refuse when it
       would have to fall back to software. Support is inconsistent, which is why
       the renderer-string check below still exists — but when it does work it is
       more authoritative than any substring list. */
    gl =
      (canvas.getContext("webgl2", {
        failIfMajorPerformanceCaveat: true,
      }) as WebGL2RenderingContext | null) ??
      (canvas.getContext("webgl", {
        failIfMajorPerformanceCaveat: true,
      }) as WebGLRenderingContext | null);

    if (!gl) return false;

    const debugInfo = gl.getExtension("WEBGL_debug_renderer_info");
    if (debugInfo) {
      const renderer = String(
        gl.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL) ?? ""
      ).toLowerCase();
      /* An empty string means the extension exists but the value is masked;
         that is not evidence of software rendering, so it passes. */
      if (renderer && SOFTWARE_RENDERERS.some((s) => renderer.includes(s))) {
        return false;
      }
    }

    return true;
  } catch {
    /* Any throw here — blocked context, hardened browser — means "no". */
    return false;
  } finally {
    /* Release the probe context immediately; see the header note. */
    gl?.getExtension("WEBGL_lose_context")?.loseContext();
  }
}

export function useWebGLSupport(): boolean | null {
  const [supported, setSupported] = useState<boolean | null>(null);

  useEffect(() => {
    let cancelled = false;

    /* Deferred past first paint. Context creation can block for tens of
       milliseconds on a cold GPU process, and the hero's text must not wait on
       a decision about its background. */
    const id = window.requestAnimationFrame(() => {
      if (cancelled) return;
      let result = false;
      try {
        result = detect();
      } catch {
        result = false;
      }
      if (!cancelled) setSupported(result);
    });

    return () => {
      cancelled = true;
      window.cancelAnimationFrame(id);
    };
  }, []);

  return supported;
}
