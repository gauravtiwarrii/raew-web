"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { X, ChevronLeft, ChevronRight } from "lucide-react";
import { useFocusTrap, useOnEscape, useScrollLock } from "@/hooks/useFocusTrap";

export interface LightboxImage {
  src: string;
  alt: string;
  /** Optional heading shown beneath the photograph. */
  title?: string;
  /** Optional short line above the title, e.g. a category. */
  eyebrow?: string;
  /** Optional descriptive sentence shown beneath the title. */
  caption?: string;
}

interface LightboxProps {
  images: LightboxImage[];
  startIndex?: number;
  open: boolean;
  onClose: () => void;
  /** Shown in the dialog's accessible name, e.g. the product name. */
  label: string;
}

/**
 * Accessible image lightbox.
 *
 * Replaces three earlier hand-rolled overlays (in ProductCard,
 * ProductImageGallery and the gallery page) that shared most of the same set of
 * defects:
 *
 *   - The image was painted as a CSS `background-image` on a
 *     `w-full h-full` div whose parent had only `max-height`. With no height
 *     source the div collapsed to 0px, so the overlay rendered the controls
 *     over an empty black screen — the photograph never appeared.
 *   - Interpolating an admin-editable string into `url(...)` is a CSS
 *     injection vector and skips Next.js image optimisation entirely.
 *   - Zoom in / zoom out buttons whose handlers were `console.log(...)`.
 *   - A "Click & drag to pan" hint with no drag handler behind it.
 *   - No Escape key, no focus trap, no scroll lock, no focus restore,
 *     no `role="dialog"`, and both arrows used the same non-directional icon.
 *
 * This version drops zoom and pan rather than faking them: `next/image` with
 * `object-contain` already renders the full frame, which is what the zoom was
 * pretending to achieve. Keyboard: Escape closes, Left/Right change image.
 *
 * The gallery page's overlay was the least broken of the three — its image did
 * render, and it handled Escape and the arrow keys. It still had no focus trap,
 * no scroll lock, no focus restore and no `role="dialog"`, and it carried a
 * duplicate copy of the keyboard logic, so it was folded in here too. The
 * optional `eyebrow` / `title` / `caption` fields exist to preserve the caption
 * panel that overlay had beneath the photograph.
 */
export default function Lightbox({
  images,
  startIndex = 0,
  open,
  onClose,
  label,
}: LightboxProps) {
  const [index, setIndex] = useState(startIndex);
  const dialogRef = useRef<HTMLDivElement>(null);
  const hasMultiple = images.length > 1;

  useFocusTrap(dialogRef, open);
  useScrollLock(open);
  useOnEscape(open, onClose);

  // Re-sync when the caller opens on a different thumbnail.
  useEffect(() => {
    if (open) setIndex(startIndex);
  }, [open, startIndex]);

  useEffect(() => {
    if (!open || !hasMultiple) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") {
        setIndex((i) => (i - 1 + images.length) % images.length);
      } else if (e.key === "ArrowRight") {
        setIndex((i) => (i + 1) % images.length);
      }
    };
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [open, hasMultiple, images.length]);

  if (!open || images.length === 0) return null;

  const current = images[Math.min(index, images.length - 1)];

  return (
    <div
      className="fixed inset-0 z-[60] flex flex-col bg-[rgb(8_9_11_/_0.94)] p-4 sm:p-6"
      // Clicking the backdrop closes. The inner figure stops propagation so
      // clicks on the photograph itself do not dismiss it.
      onClick={onClose}
    >
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-label={`${label} — image viewer`}
        tabIndex={-1}
        className="flex h-full w-full flex-col outline-none"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex shrink-0 items-center justify-between gap-4 pb-3">
          <p className="min-w-0 truncate text-xs font-bold uppercase tracking-[0.14em] text-white/70">
            {label}
            {hasMultiple && (
              <span className="ml-2 font-mono tracking-normal text-white/50">
                {index + 1}/{images.length}
              </span>
            )}
          </p>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close image viewer"
            className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-md border border-white/20 text-white transition-colors duration-150 hover:bg-white/10 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
          >
            <X className="h-5 w-5" aria-hidden="true" />
          </button>
        </div>

        {/* min-h-0 is what lets this flex child actually take up the remaining
            height — the bug in the previous implementation. */}
        <div className="relative flex min-h-0 flex-1 items-center justify-center">
          <Image
            key={current.src}
            src={current.src}
            alt={current.alt}
            fill
            sizes="100vw"
            className="object-contain"
            priority
          />
        </div>

        {(current.eyebrow || current.title || current.caption) && (
          <div className="shrink-0 space-y-1.5 pt-4 text-center">
            {current.eyebrow && (
              <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-[var(--accent-on-dark)]">
                {current.eyebrow}
              </p>
            )}
            {current.title && (
              <h2 className="text-base font-bold text-white sm:text-lg">{current.title}</h2>
            )}
            {current.caption && (
              <p className="mx-auto max-w-2xl text-xs leading-relaxed text-white/70">
                {current.caption}
              </p>
            )}
          </div>
        )}

        {hasMultiple && (
          <div className="flex shrink-0 items-center justify-center gap-3 pt-4">
            <button
              type="button"
              onClick={() => setIndex((i) => (i - 1 + images.length) % images.length)}
              aria-label="Previous image"
              className="inline-flex h-10 w-10 items-center justify-center rounded-md border border-white/20 text-white transition-colors duration-150 hover:bg-white/10 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
            >
              <ChevronLeft className="h-5 w-5" aria-hidden="true" />
            </button>
            <button
              type="button"
              onClick={() => setIndex((i) => (i + 1) % images.length)}
              aria-label="Next image"
              className="inline-flex h-10 w-10 items-center justify-center rounded-md border border-white/20 text-white transition-colors duration-150 hover:bg-white/10 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
            >
              <ChevronRight className="h-5 w-5" aria-hidden="true" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
