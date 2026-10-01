import Image from "next/image";
import Link from "next/link";
import { getAuthSession } from "@/lib/auth";
import {
  LayoutDashboard,
  Package,
  Layers,
  Inbox,
  Image as ImageIcon,
  Settings,
  ExternalLink,
  Newspaper,
  FolderKanban,
  Briefcase,
} from "lucide-react";
import AdminLogoutButton from "./AdminLogoutButton";

export const metadata = {
  title: "Admin Dashboard | M/s Raj Agro Engineering Works",
};

/* ── The admin's accent, re-anchored on the brand ──
   This dashboard keeps its own palette — slate panels, amber iconography —
   and that is untouched here. What was wrong is that its *green* was
   Tailwind's stock emerald, which after the brand re-pitch became a green
   appearing nowhere else on the site: the logo's ink is #0a5728 and every
   public accent is a member of that family. The accent roles below were
   re-pointed at the real tiers by role, not by swapping one hex for another:

     focus:border-[var(--accent-bright)]   #199055 — a focus ring is non-text
                                           UI, so it wants the graphics tier.
                                           Clears 3:1 on these dark panels
                                           (4.95:1 on #070707).
     text-[var(--accent-on-dark)]          #70db99 — numerals and status
                                           icons, 11.78:1 on the stage black.
     text-[var(--accent-on-dark-strong)]   #a7ecc4 — the loudest tint, for the
                                           one link or badge that must lead.
     bg-[var(--accent)]                    #0a5728 — filled buttons and the
                                           badge behind the amber login icon,
                                           carrying white at 8.73:1. This is
                                           literally the public CTA's recipe.
     bg-[var(--accent)]/20 …               brand ink at low alpha for status
     border-[var(--accent-bright)]/60      chips, so a chip reads as a chip
                                           rather than as another slate panel.

   Amber stays amber: it is this dashboard's own signal colour, it never
   appears in the public site, and re-pitching it was not part of the change. */
export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await getAuthSession();

  // No session means we are on /admin/login — every other /admin/* path is
  // redirected there by `middleware.ts` before this layout renders. So this
  // branch is the login screen: chrome-less by design, not an unguarded route.
  // (`redirect` was imported here but never called; the gate is the middleware.)
  if (!session) {
    return <div className="min-h-screen bg-slate-950">{children}</div>;
  }

  return (
    <div className="min-h-screen bg-slate-950 text-gray-100 flex flex-col md:flex-row">
      {/* Sidebar Navigation */}
      <aside className="w-full md:w-64 bg-slate-900 border-r border-slate-800 shrink-0 p-4 space-y-6 flex flex-col justify-between">
        <div className="space-y-6">
          {/* Admin Header */}
          <div className="flex items-center space-x-3 px-2">
            {/* The inverse MARK, not the lockup, and not the light-ground file.

                Two separate mistakes are being avoided here. First, the ground:
                this sidebar is `bg-slate-900`, and `raew-logo.png` is pitched for
                light grounds — its wordmark is the charcoal #333333, which on
                slate is effectively invisible. `raew-mark-inverse.png` is the
                same artwork re-pitched to near-white plus the light brand tint,
                generated from the same master as the header's copy.

                Second, the crop: at a 40px row the stacked lockup renders its
                own name at about one pixel, so the mark is paired with live text
                instead — the same decision the site header made. */}
            <Image
              src="/branding/raew-mark-inverse.png"
              alt=""
              width={275}
              height={242}
              className="h-10 w-auto shrink-0"
            />
            <div>
              <h2 className="font-bold text-sm text-white">Raj Agro Admin</h2>
              <p className="text-[10px] text-amber-300 font-mono">Control Center v1.0</p>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="space-y-1 text-xs font-semibold">
            <Link
              href="/admin/dashboard"
              className="flex items-center space-x-3 px-3 py-2.5 rounded-lg text-gray-300 hover:text-white hover:bg-slate-800 transition-colors"
            >
              <LayoutDashboard className="w-4 h-4 text-amber-400" />
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
              <Layers className="w-4 h-4 text-amber-400" />
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
              <ImageIcon className="w-4 h-4 text-amber-400" />
              <span>Gallery Management</span>
            </Link>

            <Link
              href="/admin/blog"
              className="flex items-center space-x-3 px-3 py-2.5 rounded-lg text-gray-300 hover:text-white hover:bg-slate-800 transition-colors"
            >
              <Newspaper className="w-4 h-4 text-amber-400" />
              <span>Blog &amp; News</span>
            </Link>

            <Link
              href="/admin/projects"
              className="flex items-center space-x-3 px-3 py-2.5 rounded-lg text-gray-300 hover:text-white hover:bg-slate-800 transition-colors"
            >
              <FolderKanban className="w-4 h-4 text-amber-400" />
              <span>Projects</span>
            </Link>

            <Link
              href="/admin/careers"
              className="flex items-center space-x-3 px-3 py-2.5 rounded-lg text-gray-300 hover:text-white hover:bg-slate-800 transition-colors"
            >
              <Briefcase className="w-4 h-4 text-amber-400" />
              <span>Careers</span>
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
