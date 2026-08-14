"use client";

import { useEffect } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
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
      <motion.div
        initial={{ opacity: 0, y: 20, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.5, ease: [0.25, 0.1, 0.25, 1] }}
        className="bg-white border border-gray-200/80 rounded-3xl p-8 sm:p-12 max-w-md w-full text-center space-y-6 shadow-xl shadow-black/[0.04]"
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: "spring", stiffness: 260, damping: 20 }}
          className="w-16 h-16 rounded-2xl bg-red-50 text-red-600 flex items-center justify-center mx-auto"
        >
          <AlertCircle className="w-8 h-8" />
        </motion.div>
        <div className="space-y-2">
          <span className="text-xs font-bold uppercase tracking-widest text-red-600">System Error</span>
          <h1 className="text-2xl font-extrabold text-[var(--charcoal-900)] font-[family-name:var(--font-serif)]">
            Unexpected Error Occurred
          </h1>
          <p className="text-sm text-gray-500 leading-relaxed">
            Something went wrong while loading this section. Our technical team has been notified.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <button
            onClick={() => reset()}
            className="w-full sm:w-auto inline-flex items-center justify-center px-6 py-3 text-sm font-bold text-white bg-gradient-to-r from-[var(--forest-700)] to-[var(--forest-600)] hover:from-[var(--forest-600)] hover:to-[var(--forest-500)] rounded-xl shadow-md transition-all duration-200"
          >
            <RefreshCw className="w-4 h-4 mr-1.5" />
            <span>Try Again</span>
          </button>
          <Link
            href="/"
            className="w-full sm:w-auto inline-flex items-center justify-center px-6 py-3 text-sm font-bold text-gray-700 bg-gray-50 hover:bg-gray-100 rounded-xl border border-gray-200 transition-colors duration-200"
          >
            <Home className="w-4 h-4 mr-1.5" />
            <span>Go to Homepage</span>
          </Link>
        </div>
      </motion.div>
    </div>
  );
}
