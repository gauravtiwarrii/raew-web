import Image from "next/image";
import { isAuthenticImage } from "@/lib/images";
import { cn } from "@/lib/utils";

interface ShowcaseFrameProps {
  /** Product name — used for alt text, never drawn as decoration. */
  name: string;
  image: string;
  /** 1-based position, drawn as the oversized plate number. */
  index: number;
  className?: string;
  /** Set on the first frame only; the rest are below the fold. */
  priority?: boolean;
  sizes?: string;
}

/**
 * The presentation frame for one machine in the showcase.
 *
 * Note the absence of `"use client"`: this component has no hooks and no
 * handlers, so it renders in both trees — the client-side pinned stage imports
 * it, and so does the server-rendered mobile strip. That is the whole reason it
 * is a separate file. Duplicating it would guarantee the two treatments drift.
 *
 * PHOTO SLOT — the composition is designed around a real photograph, not
 * retrofitted for one later:
 *   - Aspect: the container decides. Frames run from roughly 1:1 (desktop stage
 *     at 1024px) to 16:10 (mobile strip), so supply **4:3 landscape at 1600×1200
 *     or larger** and let `object-cover` crop. A 4:3 source survives both ends.
 *   - Subject: machine centred with headroom; anything critical kept away from
 *     the outer 12%, which is where the wide crop and the vignette bite.
 *   - Background: **dark**, or masked to dark. These frames sit on #070707, and a
 *     bright studio-white cutout punches a glowing rectangle through the section.
 * Dropping a file into `Product.image` is then the entire change — no layout
 * edits, because the placeholder already occupies the exact same box.
 *
 * Until then the frame is a finished object rather than an apology: brushed
 * plate, drawing grid, crop marks, and the plate number in outline. The one thing
 * it does not do is imply a photograph exists. `isAuthenticImage` rejects stock
 * hosts, so a seeded Unsplash tractor cannot be presented as this machine.
 */
export default function ShowcaseFrame({
  name,
  image,
  index,
  className,
  priority = false,
  sizes = "(max-width: 1023px) 86vw, 40vw",
}: ShowcaseFrameProps) {
  const hasPhoto = isAuthenticImage(image);
  const plate = String(index).padStart(2, "0");

  return (
    <div
      /* No border in the base: the two call sites need different edges (a full
         box in the desktop stage, a bottom rule only in the mobile card), and
         emitting `border` here would force them to fight it with `border-0`,
         which resolves on stylesheet order rather than on intent. */
      className={cn(
        "cad-frame relative overflow-hidden bg-[var(--cinema-stage)]",
        className
      )}
      /* Brighter ticks than the default `--border-strong`: on a near-black
         plate the default hairline all but disappears. */
      style={{ "--cad-tick": "rgb(255 255 255 / 0.3)" } as React.CSSProperties}
    >
      {hasPhoto ? (
        <Image
          src={image}
          alt={name}
          fill
          sizes={sizes}
          priority={priority}
          className="object-cover"
        />
      ) : (
        <div
          role="img"
          aria-label={`Placeholder — photograph pending: ${name}`}
          className="absolute inset-0"
        >
          <div className="metal absolute inset-0" aria-hidden="true" />
          <div
            className="blueprint-grid-dark absolute inset-0 opacity-60"
            aria-hidden="true"
          />
          <span
            aria-hidden="true"
            className="wordmark-outline absolute inset-0 flex items-center justify-center font-display text-[clamp(4rem,11vw,8.5rem)] font-bold leading-none tracking-tight"
          >
            {plate}
          </span>
          <p className="spec-label absolute bottom-4 left-4 text-[var(--text-inverse-muted)]">
            Photograph pending
          </p>
        </div>
      )}

      {/* Lighting and dither go over both paths. On a photograph they seat it
          into the section; on the placeholder they stop the plate reading flat.
          Both are `pointer-events: none` by definition in globals.css. */}
      <div className="stage-light" aria-hidden="true" />
      <div className="grain" aria-hidden="true" />
    </div>
  );
}
