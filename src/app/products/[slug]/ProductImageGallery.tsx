"use client";

import { useState } from "react";
import Image from "next/image";
import { Expand } from "lucide-react";
import Lightbox, { type LightboxImage } from "@/components/ui/Lightbox";
import ImagePlaceholder from "@/components/ui/ImagePlaceholder";
import { authenticImages } from "@/lib/images";

interface ProductImageGalleryProps {
  productImage: string;
  galleryImages: string[];
  /** Real product name — used for alt text and the viewer's accessible name. */
  productName: string;
}

/**
 * Product image gallery for the detail page.
 *
 * The previous implementation had its own inline overlay with a number of
 * defects, all fixed here by delegating to <Lightbox />:
 *
 *   - Its image sat on a zero-height div, so the overlay showed the controls
 *     over an empty screen and never displayed the photograph.
 *   - The zoom buttons only ran `console.log(...)`, and a "Click & drag to pan"
 *     hint was printed even though no drag handler existed.
 *   - Previous and Next both used the same non-directional `ArrowLeftRight`.
 *   - Thumbnails were `onClick` handlers on bare `<div>`s: not focusable, not
 *     keyboard-operable, and invisible to assistive technology.
 *   - Alt text was "Product", "Thumbnail main", "Thumbnail 1" — the real
 *     product name was never passed down. It now is.
 *   - The "active" thumbnail ring was hardcoded to the first item instead of
 *     tracking the selected index.
 */
export default function ProductImageGallery({
  productImage,
  galleryImages,
  productName,
}: ProductImageGalleryProps) {
  const [open, setOpen] = useState(false);
  const [startIndex, setStartIndex] = useState(0);
  const [activeIndex, setActiveIndex] = useState(0);

  const images: LightboxImage[] = authenticImages([productImage, ...galleryImages]).map(
    (src, i, arr) => ({
      src,
      alt:
        i === 0
          ? productName
          : `${productName} — additional view ${i} of ${arr.length - 1}`,
    }),
  );

  // Every seeded image was Unsplash stock, so this branch is currently the
  // common case rather than an edge case. Returning `null` would leave the
  // detail page with an empty column where the photograph belongs, which reads
  // as a broken layout; a titled placeholder reads as "photo pending".
  if (images.length === 0) {
    return (
      <ImagePlaceholder
        label={productName}
        hint="Add a photograph at /public/images/products/"
        className="aspect-16/11 w-full"
      />
    );
  }

  const active = images[activeIndex] ?? images[0];

  const openAt = (i: number) => {
    setStartIndex(i);
    setOpen(true);
  };

  return (
    <>
      <button
        type="button"
        onClick={() => openAt(activeIndex)}
        className="group relative block aspect-16/11 w-full overflow-hidden border border-[var(--border)] bg-[var(--surface-2)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--focus)]"
      >
        <Image
          src={active.src}
          alt={active.alt}
          fill
          priority
          sizes="(max-width: 1024px) 100vw, 50vw"
          className="object-cover"
        />
        <span className="absolute bottom-3 right-3 inline-flex items-center gap-1.5 bg-[rgb(8_9_11_/_0.78)] px-2.5 py-1.5 text-[11px] font-bold text-white transition-colors duration-150 group-hover:bg-[rgb(8_9_11_/_0.92)]">
          <Expand className="h-3.5 w-3.5" aria-hidden="true" />
          Enlarge
        </span>
      </button>

      {images.length > 1 && (
        <ul className="mt-3 grid grid-cols-4 gap-3">
          {images.map((img, idx) => (
            <li key={img.src + idx}>
              <button
                type="button"
                onClick={() => {
                  setActiveIndex(idx);
                  openAt(idx);
                }}
                aria-current={idx === activeIndex ? "true" : undefined}
                className={`relative block aspect-square w-full overflow-hidden border-2 transition-colors duration-150 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--focus)] ${
                  idx === activeIndex
                    ? "border-[var(--accent)]"
                    : "border-[var(--border)] hover:border-[var(--border-strong)]"
                }`}
              >
                <Image
                  src={img.src}
                  alt=""
                  fill
                  sizes="120px"
                  className="object-cover"
                />
                <span className="sr-only">
                  {idx === 0
                    ? `View main image of ${productName}`
                    : `View image ${idx + 1} of ${productName}`}
                </span>
              </button>
            </li>
          ))}
        </ul>
      )}

      <Lightbox
        images={images}
        startIndex={startIndex}
        open={open}
        onClose={() => setOpen(false)}
        label={productName}
      />
    </>
  );
}
