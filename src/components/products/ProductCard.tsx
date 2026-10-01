import Link from "next/link";
import Image from "next/image";
import { ArrowRight, MessageSquare, FileText } from "lucide-react";
import { getWhatsAppLink } from "@/lib/whatsapp";
import { isAuthenticImage } from "@/lib/images";

export interface ProductCardProps {
  id: string;
  name: string;
  slug: string;
  categoryName?: string;
  shortDescription: string;
  image: string;
  priceDisplay?: string;
  availability?: string;
  featured?: boolean;
  brochure?: string;
}

/**
 * Product card — the catalogue's primary unit.
 *
 * Changes from the previous version, all deliberate:
 *
 *   - The card no longer carries its own image lightbox. That lightbox had two
 *     zoom buttons whose handlers were `console.log('Zoom in clicked')`, and its
 *     image container collapsed to zero height so nothing was ever displayed.
 *     Full imagery belongs on the detail page, which has a real gallery; a
 *     catalogue tile only needs to get you there. Removing it also means this is
 *     no longer a client component.
 *   - The whole tile is now the link to the detail page, so the entire card is a
 *     click target instead of just a small "View Specs" button. The Enquire and
 *     Brochure actions sit in a sibling row, outside the link — nesting an
 *     anchor inside an anchor is invalid HTML and breaks keyboard navigation.
 *   - `line-clamp-1` on the product name is gone: real names here run to
 *     "Automatic Seed cum Fertilizer Drill", which it silently truncated.
 *
 * ── THE HOVER TREATMENT, AND WHAT WAS TAKEN OUT OF IT ─────────────────────
 * This tile used to be wrapped in `TiltCard`, which tipped it toward the cursor
 * on a spring and lifted it on Z. That is gone with the rest of the decorative
 * interaction layer. Two reasons it does not survive on a catalogue grid
 * specifically: perspective-tilting a tile skews its own text, which is
 * measurably worse to read while the spring settles, and in a six-up grid the
 * tiles visibly jostle each other as the pointer crosses between them. It also
 * did nothing whatsoever on touch, which is most of this audience.
 *
 * What remains are four cues that fire together, each of which means something:
 * the border strengthens and a raised shadow appears (the tile is the target),
 * the image pushes in 3% (there is more of this to see), the title takes the
 * accent colour (this is a link), and the "Specifications" arrow slides 4px
 * (this is where it goes). All four are `transition`s on a hover state — no
 * springs, no per-frame work, and every one of them respects `motion-safe`.
 *
 * Deliberately absent is any scale on the card itself: scaling the tile blurs its
 * text on the way through. The tile is also no longer wrapped in client code at
 * all, so this file is a plain SERVER component and `<Image>`, `isAuthenticImage`
 * and the WhatsApp link builder never reach the browser.
 */
export default function ProductCard({
  name,
  slug,
  categoryName,
  shortDescription,
  image,
  priceDisplay = "Price on Request",
  availability = "In Stock",
  featured = false,
  brochure,
}: ProductCardProps) {
  const waUrl = getWhatsAppLink(name);
  const href = `/products/${slug}`;

  return (
    <article className="group relative flex h-full flex-col overflow-hidden border border-[var(--border)] bg-[var(--surface)] transition-colors duration-200 hover:border-[var(--border-strong)] hover:shadow-[var(--shadow-raised)]">
      <Link
        href={href}
        className="flex flex-1 flex-col focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--focus)]"
      >
        <div className="relative aspect-16/10 overflow-hidden bg-[var(--surface-2)]">
          {/*
            Stock imagery is not rendered as though it were a photograph of
            this machine — see lib/images.ts. Four Unsplash photos were seeded
            across six products, so several cards showed the same generic
            tractor for different machinery.
          */}
          <Image
            src={isAuthenticImage(image) ? image : "/visuals/machine.jpg"}
            alt={name}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            className="object-cover transition-transform duration-500 ease-out motion-safe:group-hover:scale-[1.03]"
          />

          {featured && (
            <span className="absolute left-0 top-4 bg-[var(--accent)] px-3 py-1.5 text-[10px] font-extrabold uppercase tracking-[0.12em] text-[var(--accent-fg)]">
              Featured
            </span>
          )}
        </div>

        <div className="flex flex-1 flex-col gap-3 p-5">
          {categoryName && (
            <p className="spec-label text-[var(--text-subtle)]">{categoryName}</p>
          )}

          <h3 className="text-base font-bold leading-snug tracking-tight text-[var(--text)] transition-colors duration-200 group-hover:text-[var(--accent)]">
            {name}
          </h3>

          <p className="line-clamp-3 text-[13px] leading-relaxed text-[var(--text-muted)]">
            {shortDescription}
          </p>

          <dl className="mt-auto flex flex-wrap items-baseline gap-x-4 gap-y-1 pt-3 text-xs">
            <div className="flex items-baseline gap-1.5">
              <dt className="sr-only">Price</dt>
              <dd className="font-bold text-[var(--text)]">{priceDisplay}</dd>
            </div>
            <div className="flex items-baseline gap-1.5">
              <dt className="text-[var(--text-subtle)]">Availability</dt>
              <dd className="font-semibold text-[var(--text-muted)]">{availability}</dd>
            </div>
          </dl>
        </div>
      </Link>

      {/* Secondary actions sit outside the card link — an <a> cannot legally
          contain another <a>, and screen readers announce nested links as one. */}
      <div className="relative flex items-stretch border-t border-[var(--border)]">
        <Link
          href={href}
          className="inline-flex flex-1 items-center justify-center gap-1.5 px-3 py-3 text-xs font-bold text-[var(--text)] transition-colors duration-150 hover:bg-[var(--surface-2)] focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-[var(--focus)]"
        >
          Specifications
          <ArrowRight
            className="h-3.5 w-3.5 transition-transform duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] motion-safe:group-hover:translate-x-1"
            aria-hidden="true"
          />
        </Link>

        <a
          href={waUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex flex-1 items-center justify-center gap-1.5 border-l border-[var(--border)] px-3 py-3 text-xs font-bold text-[var(--accent)] transition-colors duration-150 hover:bg-[var(--accent-quiet-bg)] focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-[var(--focus)]"
        >
          <MessageSquare className="h-3.5 w-3.5" aria-hidden="true" />
          Enquire
          <span className="sr-only"> about {name} on WhatsApp</span>
        </a>

        {brochure && (
          <a
            href={brochure}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-1.5 border-l border-[var(--border)] px-3 py-3 text-xs font-bold text-[var(--text-muted)] transition-colors duration-150 hover:bg-[var(--surface-2)] focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-[var(--focus)]"
          >
            <FileText className="h-3.5 w-3.5" aria-hidden="true" />
            <span className="sr-only">Download </span>Brochure
            <span className="sr-only"> for {name} (PDF)</span>
          </a>
        )}
      </div>
    </article>
  );
}
