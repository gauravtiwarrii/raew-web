"use client";

import { useEffect } from "react";
import Link from "next/link";
import { AlertCircle, RefreshCw, Home } from "lucide-react";

/**
 * Route error boundary.
 *
 * Two changes worth recording:
 *
 *   - The copy said "Our technical team has been notified." Nothing in this
 *     project notifies anyone: the only handler is the `console.error` below,
 *     which writes to the visitor's own browser console. Telling someone their
 *     problem has been reported when it has not is the kind of reassurance that
 *     stops them from picking up the phone — so the message now tells them how
 *     to actually reach the factory, and the error reference is shown so they
 *     can quote it. Wire up a real reporting service and the original wording
 *     becomes true again.
 *   - The framer-motion entrance was removed rather than made
 *     reduced-motion-aware. An error screen should appear instantly; animating
 *     it in delays the one thing the visitor needs to read.
 */
export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Global Error Boundary caught:", error);
  }, [error]);

  return (
    <div className="flex min-h-[70vh] items-center justify-center bg-[var(--bg)] px-4 py-16">
      <div className="panel w-full max-w-md px-8 py-10 text-center sm:px-10">
        <div className="mx-auto flex h-14 w-14 items-center justify-center bg-red-50 text-red-700">
          <AlertCircle className="h-7 w-7" aria-hidden="true" />
        </div>

        <p className="eyebrow mt-6 text-red-700">System Error</p>
        <h1 className="mt-3 text-2xl font-bold tracking-tight text-[var(--text)]">
          Unexpected Error Occurred
        </h1>
        <p className="mt-3 text-sm leading-relaxed text-[var(--text-muted)]">
          Something went wrong while loading this section. Try again — and if it keeps
          happening, please{" "}
          <Link
            href="/contact"
            className="font-semibold text-[var(--accent)] underline decoration-[var(--accent-quiet-border)] underline-offset-2 transition-colors duration-150 hover:decoration-[var(--accent)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--focus)]"
          >
            contact the factory
          </Link>{" "}
          directly so we know about it.
        </p>

        {error.digest && (
          <p className="mt-4 font-mono text-[11px] text-[var(--text-subtle)]">
            Reference: {error.digest}
          </p>
        )}

        <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <button
            type="button"
            onClick={() => reset()}
            className="inline-flex rounded-[6px] h-11 w-full items-center justify-center gap-2 bg-[var(--accent)] px-6 text-sm font-bold text-[var(--accent-fg)] transition-colors duration-150 hover:bg-[var(--accent-hover)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--focus)] sm:w-auto"
          >
            <RefreshCw className="h-4 w-4" aria-hidden="true" />
            <span>Try Again</span>
          </button>
          <Link
            href="/"
            className="inline-flex rounded-[6px] h-11 w-full items-center justify-center gap-2 border border-[var(--border-strong)] px-6 text-sm font-bold text-[var(--text)] transition-colors duration-150 hover:bg-[var(--surface-2)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--focus)] sm:w-auto"
          >
            <Home className="h-4 w-4" aria-hidden="true" />
            <span>Go to Homepage</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
