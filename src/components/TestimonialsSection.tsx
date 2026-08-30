import Link from "next/link";
import { Star, MessageSquareQuote } from "lucide-react";

export interface Testimonial {
  name: string;
  location: string;
  machinePurchased: string;
  review: string;
  rating: number; // 1–5
  photoUrl?: string;
}

interface TestimonialsSectionProps {
  testimonials?: Testimonial[];
}

/**
 * Customer reviews.
 *
 * The empty state used to render three "placeholder" cards, each showing five
 * filled gold stars and an italic quote in quotation marks. Even with the words
 * "will appear here" inside it, a visitor scanning the page saw fifteen gold
 * stars and three review-shaped cards — and a screen reader announced "5 out of
 * 5 stars" three times, because the placeholder passed `rating={5}`. That is
 * fabricated social proof for a business with no published reviews yet.
 *
 * It also printed "Add real testimonials by editing
 * src/components/TestimonialsSection.tsx" on the live public page, which is an
 * internal note, not customer-facing copy.
 *
 * The empty state is now a single panel that says there are no reviews yet and
 * invites customers to send one. The real card below is unchanged in substance
 * and renders stars as soon as genuine `testimonials` are passed in.
 */
function StarRating({ rating }: { rating: number }) {
  const safe = Math.max(0, Math.min(5, Math.round(rating)));
  return (
    // role="img" is needed for the label to be announced — aria-label on a bare
    // div with no role is ignored by several screen readers.
    <div className="flex gap-0.5" role="img" aria-label={`${safe} out of 5 stars`}>
      {Array.from({ length: 5 }).map((_, i) => (
        <Star
          key={i}
          aria-hidden="true"
          className={
            i < safe
              ? "h-3.5 w-3.5 fill-[var(--accent)] text-[var(--accent)]"
              : "h-3.5 w-3.5 fill-[var(--surface-3)] text-[var(--border-strong)]"
          }
        />
      ))}
    </div>
  );
}

function TestimonialCard({ testimonial }: { testimonial: Testimonial }) {
  return (
    <div className="panel flex h-full flex-col justify-between gap-4 p-6">
      <div className="space-y-3">
        <StarRating rating={testimonial.rating} />
        <blockquote className="text-sm leading-relaxed text-[var(--text)]">
          &ldquo;{testimonial.review}&rdquo;
        </blockquote>
      </div>
      <div className="flex items-center gap-3 border-t border-[var(--border)] pt-3">
        {testimonial.photoUrl ? (
          // A plain <img>: these URLs come from wherever the owner hosts the
          // customer's photo, and next/image would need every one of those
          // hosts declared in next.config.ts first.
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={testimonial.photoUrl}
            alt=""
            width={36}
            height={36}
            loading="lazy"
            decoding="async"
            className="h-9 w-9 shrink-0 rounded-full object-cover"
          />
        ) : (
          <div
            aria-hidden="true"
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[var(--accent-quiet-bg)] text-sm font-bold text-[var(--accent-quiet-text)]"
          >
            {testimonial.name.charAt(0).toUpperCase()}
          </div>
        )}
        <div className="min-w-0">
          <p className="truncate text-xs font-bold text-[var(--text)]">{testimonial.name}</p>
          <p className="truncate text-[11px] text-[var(--text-muted)]">
            {testimonial.location} &bull; {testimonial.machinePurchased}
          </p>
        </div>
      </div>
    </div>
  );
}

export default function TestimonialsSection({
  testimonials = [],
}: TestimonialsSectionProps) {
  if (testimonials.length === 0) {
    return (
      <div className="panel flex flex-col items-start gap-6 px-6 py-8 sm:flex-row sm:items-center sm:justify-between sm:px-8">
        <div className="flex items-start gap-4">
          <MessageSquareQuote
            className="mt-0.5 h-6 w-6 shrink-0 text-[var(--text-subtle)]"
            aria-hidden="true"
          />
          <div>
            <p className="text-sm font-bold text-[var(--text)]">
              No published reviews yet
            </p>
            <p className="mt-1.5 max-w-xl text-sm leading-relaxed text-[var(--text-muted)]">
              We would rather show none than show reviews we cannot stand behind.
              If you are running one of our machines, tell us how it has held up
              and we will publish it here with your name and district.
            </p>
          </div>
        </div>
        <Link
          href="/contact"
          className="inline-flex rounded-[6px] h-11 w-full shrink-0 items-center justify-center border border-[var(--border-strong)] px-6 text-xs font-bold uppercase tracking-[0.1em] text-[var(--text)] transition-colors duration-150 hover:bg-[var(--surface-2)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--focus)] sm:w-auto"
        >
          Send a review
        </Link>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
      {testimonials.map((t, idx) => (
        <TestimonialCard key={`${t.name}-${idx}`} testimonial={t} />
      ))}
    </div>
  );
}
