"use client";

import dynamic from "next/dynamic";
import Image from "next/image";

/**
 * HeroVisual — the isolation boundary around the hero's visual, and the place
 * where the photograph-vs-motif decision is made.
 *
 * ── THE DECISION ──────────────────────────────────────────────────────────
 *   photoSrc supplied  → HeroPhoto        (full-bleed photograph under a scrim)
 *   photoSrc absent    → CssEngineVisual  (abstract drafting motif, SVG + CSS)
 *
 * It is a real branch on real content, resolved on the server by
 * `resolveHeroPhoto()`, so the motif chunk is never even downloaded once a
 * photograph exists. Photography is the intended state; the motif is the honest
 * stand-in for not having any yet.
 *
 * A WebGL branch used to live here, rendering an abstract 3D engine through
 * react-three-fiber. It was removed along with `three`, `@react-three/fiber`,
 * `@react-three/drei` and `@types/three`: it depicted a machine RAEW does not
 * make, it had never been visually verified, and it cost four dependencies and a
 * continuously-rendering PBR canvas to say less than a photograph says instantly.
 * Do not reinstate it. If the hero needs to be more impressive, the answer is a
 * photograph.
 *
 * ── WHY THE VISUAL IS DYNAMIC AND THE TEXT IS NOT ─────────────────────────
 * Everything legible in the hero — headline, copy, both CTAs — is server-rendered
 * markup outside this boundary, readable and clickable before any JavaScript
 * runs. Only the decorative layer waits. The brief asks the page to be impressive
 * within five seconds and nothing is less impressive than a hero that is blank
 * until a chunk resolves, which is also why the `loading` state below is a
 * finished composition rather than a skeleton shimmer.
 *
 * `aria-hidden` throughout: every layer here is decorative. The hero's meaning is
 * carried entirely by its text.
 */

const CssEngineVisual = dynamic(() => import("./CssEngineVisual"), {
  ssr: false,
  loading: () => <HeroVisualFallback />,
});

/**
 * The pre-hydration state for the motif branch. Built only from the same tokens
 * and utilities the motif itself uses, so it reads as the same design rather than
 * as a placeholder for it.
 *
 * The grid opacity here must track `CssEngineVisual`'s own full-bleed grid — they
 * are the same layer either side of a chunk boundary, and a mismatch shows up as
 * the background stepping brighter or darker the moment the motif hydrates.
 */
function HeroVisualFallback() {
  return (
    <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden">
      <div className="blueprint-grid-dark absolute inset-0 opacity-40" />
      <div className="stage-light" />
      <div className="grain" />
    </div>
  );
}

/**
 * HeroPhoto — a full-bleed photograph treated as a dark cinematic ground for
 * type, not as a picture with words on top.
 *
 * ── THE SCRIM IS CONTRAST ENGINEERING, NOT STYLING ────────────────────────
 * Hero text is `--text-inverse` and `--text-inverse-muted`. Both need to clear
 * WCAG AA against *whatever photograph the owner supplies*, including an
 * overexposed one — and no amount of art direction in the README can guarantee
 * that. So the legibility floor is enforced in three deterministic stages rather
 * than assumed:
 *
 *   1. `brightness-[0.55]` on the image itself caps the source. Pure white in the
 *      photograph lands at sRGB 0.55, relative luminance ≈ 0.26. Every number
 *      below is computed against that worst case, so the maths holds for a blown
 *      sky as well as for a dim workshop.
 *   2. A flat 55% scrim over the whole frame. Worst-case composite luminance
 *      ≈ 0.45 × 0.26 ≈ 0.12 → white text ≈ 6.3:1. AA for body, AAA for large.
 *   3. A leftward ramp reaching 90% where the type column actually sits. Combined
 *      with the flat layer that is ≈ 0.96 opaque over the headline and CTAs, and
 *      ≈ 0.80 out at the 62% mark where the `max-w-xl` paragraph ends — enough
 *      for the muted token to clear 4.5:1 even against white.
 *
 * The ramp is also the composition: it pushes the photograph's visible weight to
 * the right and lower frame, opposite the text, which is what stops this reading
 * as a caption slapped over a stock image.
 *
 * `#070707` is `--cinema-void`, the hero section's own background. Written as
 * `rgb(7 7 7 / …)` because these layers need alpha and the token does not carry
 * any; if `--cinema-void` ever changes, change these with it.
 */
function HeroPhoto({ src }: { src: string }) {
  return (
    <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden">
      <Image
        src={src}
        alt=""
        fill
        priority
        /* Full-bleed at every breakpoint, so there is no narrower candidate to
           offer. `sizes` is still required or next/image assumes 100vw at the
           largest device width and over-fetches. */
        sizes="100vw"
        /* `object-center` rather than `object-top`: the README asks for the
           machine centred with headroom, and centre-cropping a landscape frame
           into a tall mobile viewport keeps the subject rather than the sky. */
        className="object-cover object-center brightness-[0.55]"
      />

      {/* Stage 2 — flat floor. */}
      <div className="absolute inset-0 bg-[rgb(7_7_7_/_0.55)]" />

      {/* Stage 3 — the type-column ramp, plus a bottom ramp so the scroll cue and
          the section edge sit on solid ground instead of on picture detail. */}
      <div
        className="absolute inset-0"
        style={{
          backgroundImage: [
            "linear-gradient(90deg, rgb(7 7 7 / 0.90) 0%, rgb(7 7 7 / 0.78) 30%, rgb(7 7 7 / 0.30) 62%, rgb(7 7 7 / 0) 88%)",
            "linear-gradient(to top, rgb(7 7 7 / 0.85) 0%, rgb(7 7 7 / 0) 32%)",
          ].join(", "),
        }}
      />

      {/* Grain last. These are wide, low-contrast gradients — exactly the case
          where 8-bit panels show visible banding — and the grain breaks it up. */}
      <div className="grain" />
    </div>
  );
}

export default function HeroVisual({ photoSrc }: { photoSrc?: string }) {
  if (photoSrc) return <HeroPhoto src={photoSrc} />;
  return <CssEngineVisual />;
}
