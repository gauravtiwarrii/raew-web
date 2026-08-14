import Link from "next/link";
import { Wrench, Home, ArrowLeft } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-[70vh] flex items-center justify-center p-4">
      <div className="bg-white border border-gray-200 rounded-2xl p-8 sm:p-12 max-w-md w-full text-center space-y-6 shadow-xs">
        <div className="w-14 h-14 rounded-2xl bg-amber-100 text-amber-800 flex items-center justify-center mx-auto">
          <Wrench className="w-8 h-8" />
        </div>
        <div className="space-y-2">
          <span className="text-xs font-bold uppercase tracking-wider text-emerald-800">404 Page Not Found</span>
          <h1 className="text-2xl font-extrabold text-slate-900">Requested Page Unavailable</h1>
          <p className="text-xs text-gray-600 leading-relaxed">
            The page or machinery slug you are searching for does not exist or has been moved.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link
            href="/"
            className="w-full sm:w-auto inline-flex items-center justify-center px-5 py-2.5 text-xs font-bold text-white bg-emerald-700 hover:bg-emerald-800 rounded-lg shadow-sm"
          >
            <Home className="w-4 h-4 mr-1.5" />
            <span>Back to Home</span>
          </Link>
          <Link
            href="/products"
            className="w-full sm:w-auto inline-flex items-center justify-center px-5 py-2.5 text-xs font-bold text-slate-800 bg-gray-100 hover:bg-gray-200 rounded-lg"
          >
            <ArrowLeft className="w-4 h-4 mr-1.5" />
            <span>Browse Products</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
