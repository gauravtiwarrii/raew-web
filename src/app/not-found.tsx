import Link from "next/link";
import { Wrench, Home, ArrowLeft } from "lucide-react";

export const metadata = {
  title: "Page Not Found",
};

export default function NotFound() {
  return (
    <div className="flex min-h-[70vh] items-center justify-center bg-[var(--bg)] px-4 py-16">
      {/* The animate-float / animate-bounce-in pair was removed: a 404 screen
          does not need an entrance flourish, and animate-float never stops. */}
      <div className="panel w-full max-w-md px-8 py-10 text-center sm:px-10">
        <div className="mx-auto flex h-14 w-14 items-center justify-center bg-[var(--accent-quiet-bg)] text-[var(--accent)]">
          <Wrench className="h-7 w-7" aria-hidden="true" />
        </div>

        <p className="eyebrow mt-6 text-[var(--text-subtle)]">404 Page Not Found</p>
        <h1 className="mt-3 text-2xl font-bold tracking-tight text-[var(--text)]">
          Requested Page Unavailable
        </h1>
        <p className="mt-3 text-sm leading-relaxed text-[var(--text-muted)]">
          The page or machinery slug you are searching for does not exist or has been moved.
        </p>

        <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <Link
            href="/"
            className="inline-flex rounded-[6px] h-11 w-full items-center justify-center gap-2 bg-[var(--accent)] px-6 text-sm font-bold text-[var(--accent-fg)] transition-colors duration-150 hover:bg-[var(--accent-hover)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--focus)] sm:w-auto"
          >
            <Home className="h-4 w-4" aria-hidden="true" />
            <span>Back to Home</span>
          </Link>
          <Link
            href="/products"
            className="inline-flex rounded-[6px] h-11 w-full items-center justify-center gap-2 border border-[var(--border-strong)] px-6 text-sm font-bold text-[var(--text)] transition-colors duration-150 hover:bg-[var(--surface-2)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--focus)] sm:w-auto"
          >
            <ArrowLeft className="h-4 w-4" aria-hidden="true" />
            <span>Browse Products</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
