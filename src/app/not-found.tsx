import Link from "next/link";
import { Wrench, Home, ArrowLeft } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-[70vh] flex items-center justify-center p-4">
      <div className="bg-white border border-gray-200/80 rounded-3xl p-8 sm:p-12 max-w-md w-full text-center space-y-6 shadow-xl shadow-black/[0.04] animate-bounce-in">
        <div className="w-16 h-16 rounded-2xl bg-[var(--gold-50)] text-[var(--gold-600)] flex items-center justify-center mx-auto animate-float">
          <Wrench className="w-8 h-8" />
        </div>
        <div className="space-y-2">
          <span className="text-xs font-bold uppercase tracking-widest text-[var(--gold-700)]">404 Page Not Found</span>
          <h1 className="text-2xl font-extrabold text-[var(--charcoal-900)] font-[family-name:var(--font-serif)]">
            Requested Page Unavailable
          </h1>
          <p className="text-sm text-gray-500 leading-relaxed">
            The page or machinery slug you are searching for does not exist or has been moved.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link
            href="/"
            className="w-full sm:w-auto inline-flex items-center justify-center px-6 py-3 text-sm font-bold text-white bg-gradient-to-r from-[var(--forest-700)] to-[var(--forest-600)] hover:from-[var(--forest-600)] hover:to-[var(--forest-500)] rounded-xl shadow-md transition-all duration-200"
          >
            <Home className="w-4 h-4 mr-1.5" />
            <span>Back to Home</span>
          </Link>
          <Link
            href="/products"
            className="w-full sm:w-auto inline-flex items-center justify-center px-6 py-3 text-sm font-bold text-gray-700 bg-gray-50 hover:bg-gray-100 rounded-xl border border-gray-200 transition-colors duration-200"
          >
            <ArrowLeft className="w-4 h-4 mr-1.5" />
            <span>Browse Products</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
