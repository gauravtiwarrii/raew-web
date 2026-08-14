"use client";

import { useEffect } from "react";
import Link from "next/link";
import { AlertCircle, RefreshCw, Home } from "lucide-react";

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
    <div className="min-h-[70vh] flex items-center justify-center p-4">
      <div className="bg-white border border-gray-200 rounded-2xl p-8 sm:p-12 max-w-md w-full text-center space-y-6 shadow-xs">
        <div className="w-14 h-14 rounded-2xl bg-red-100 text-red-700 flex items-center justify-center mx-auto">
          <AlertCircle className="w-8 h-8" />
        </div>
        <div className="space-y-2">
          <span className="text-xs font-bold uppercase tracking-wider text-red-700">System Error</span>
          <h1 className="text-2xl font-extrabold text-slate-900">Unexpected Error Occurred</h1>
          <p className="text-xs text-gray-600 leading-relaxed">
            Something went wrong while loading this section. Our technical team has been notified.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <button
            onClick={() => reset()}
            className="w-full sm:w-auto inline-flex items-center justify-center px-5 py-2.5 text-xs font-bold text-white bg-emerald-700 hover:bg-emerald-800 rounded-lg shadow-sm"
          >
            <RefreshCw className="w-4 h-4 mr-1.5" />
            <span>Try Again</span>
          </button>
          <Link
            href="/"
            className="w-full sm:w-auto inline-flex items-center justify-center px-5 py-2.5 text-xs font-bold text-slate-800 bg-gray-100 hover:bg-gray-200 rounded-lg"
          >
            <Home className="w-4 h-4 mr-1.5" />
            <span>Go to Homepage</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
