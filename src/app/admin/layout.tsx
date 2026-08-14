import Link from "next/link";
import { redirect } from "next/navigation";
import { getAuthSession } from "@/lib/auth";
import {
  Wrench,
  LayoutDashboard,
  Package,
  Layers,
  Inbox,
  Image as ImageIcon,
  Settings,
  LogOut,
  ExternalLink,
} from "lucide-react";
import AdminLogoutButton from "./AdminLogoutButton";

export const metadata = {
  title: "Admin Dashboard | M/s Raj Agro Engineering Works",
};

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await getAuthSession();

  // If in login route, return raw children without sidebar
  if (!session) {
    // Session protection
    return <div className="min-h-screen bg-slate-950">{children}</div>;
  }

  return (
    <div className="min-h-screen bg-slate-950 text-gray-100 flex flex-col md:flex-row">
      {/* Sidebar Navigation */}
      <aside className="w-full md:w-64 bg-slate-900 border-r border-slate-800 shrink-0 p-4 space-y-6 flex flex-col justify-between">
        <div className="space-y-6">
          {/* Admin Header */}
          <div className="flex items-center space-x-3 px-2">
            <div className="w-9 h-9 rounded-lg bg-emerald-800 text-amber-400 flex items-center justify-center font-bold">
              <Wrench className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-bold text-sm text-white">Raj Agro Admin</h2>
              <p className="text-[10px] text-emerald-400 font-mono">Control Center v1.0</p>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="space-y-1 text-xs font-semibold">
            <Link
              href="/admin/dashboard"
              className="flex items-center space-x-3 px-3 py-2.5 rounded-lg text-gray-300 hover:text-white hover:bg-slate-800 transition-colors"
            >
              <LayoutDashboard className="w-4 h-4 text-emerald-500" />
              <span>Overview Metrics</span>
            </Link>

            <Link
              href="/admin/products"
              className="flex items-center space-x-3 px-3 py-2.5 rounded-lg text-gray-300 hover:text-white hover:bg-slate-800 transition-colors"
            >
              <Package className="w-4 h-4 text-amber-400" />
              <span>Products & Machinery</span>
            </Link>

            <Link
              href="/admin/categories"
              className="flex items-center space-x-3 px-3 py-2.5 rounded-lg text-gray-300 hover:text-white hover:bg-slate-800 transition-colors"
            >
              <Layers className="w-4 h-4 text-emerald-500" />
              <span>Categories</span>
            </Link>

            <Link
              href="/admin/enquiries"
              className="flex items-center space-x-3 px-3 py-2.5 rounded-lg text-gray-300 hover:text-white hover:bg-slate-800 transition-colors"
            >
              <Inbox className="w-4 h-4 text-amber-400" />
              <span>Customer Enquiries</span>
            </Link>

            <Link
              href="/admin/gallery"
              className="flex items-center space-x-3 px-3 py-2.5 rounded-lg text-gray-300 hover:text-white hover:bg-slate-800 transition-colors"
            >
              <ImageIcon className="w-4 h-4 text-emerald-500" />
              <span>Gallery Management</span>
            </Link>

            <Link
              href="/admin/settings"
              className="flex items-center space-x-3 px-3 py-2.5 rounded-lg text-gray-300 hover:text-white hover:bg-slate-800 transition-colors"
            >
              <Settings className="w-4 h-4 text-amber-400" />
              <span>Site Settings</span>
            </Link>
          </nav>
        </div>

        {/* Footer Actions */}
        <div className="pt-4 border-t border-slate-800 space-y-2">
          <Link
            href="/"
            target="_blank"
            className="flex items-center space-x-2 px-3 py-2 text-xs font-semibold text-gray-400 hover:text-white transition-colors"
          >
            <ExternalLink className="w-4 h-4 text-gray-500" />
            <span>View Public Website</span>
          </Link>

          <AdminLogoutButton />
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 p-6 md:p-8 bg-slate-950 overflow-y-auto">
        {children}
      </main>
    </div>
  );
}
