import Link from "next/link";
import { prisma } from "@/lib/db";
import { Package, Inbox, FileText, CheckCircle, Clock, ArrowRight, Phone, MapPin } from "lucide-react";
import { formatDate } from "@/lib/utils";

export const revalidate = 0; // Dynamic

export default async function AdminDashboardPage() {
  const [
    totalProducts,
    activeProducts,
    totalEnquiries,
    newEnquiries,
    quoteRequests,
    totalPosts,
    publishedPosts,
    totalProjects,
    openJobs,
    jobApplications,
    recentEnquiries,
  ] = await Promise.all([
    prisma.product.count(),
    prisma.product.count({ where: { active: true } }),
    prisma.enquiry.count(),
    prisma.enquiry.count({ where: { status: "NEW" } }),
    prisma.enquiry.count({ where: { source: "QUOTE_FORM" } }),
    prisma.blogPost.count(),
    prisma.blogPost.count({ where: { published: true } }),
    prisma.project.count({ where: { active: true } }),
    prisma.jobPost.count({ where: { active: true } }),
    prisma.jobApplication.count(),
    prisma.enquiry.findMany({
      take: 6,
      orderBy: { createdAt: "desc" },
      include: { product: true },
    }),
  ]);

  return (
    <div className="space-y-8">
      {/* Top Header */}
      <div>
        <h1 className="text-2xl font-extrabold text-white">Dashboard Overview</h1>
        <p className="text-xs text-gray-400">Welcome to M/s Raj Agro Engineering Works administration portal.</p>
      </div>

      {/* Metrics Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl space-y-2">
          <div className="flex items-center justify-between text-gray-400">
            <span className="text-xs font-bold uppercase tracking-wider">Total Products</span>
            <Package className="w-4 h-4 text-amber-400" />
          </div>
          <p className="text-2xl font-extrabold text-white">{totalProducts}</p>
        </div>

        <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl space-y-2">
          <div className="flex items-center justify-between text-gray-400">
            <span className="text-xs font-bold uppercase tracking-wider">Active Catalog</span>
            <CheckCircle className="w-4 h-4 text-[var(--accent-on-dark)]" />
          </div>
          <p className="text-2xl font-extrabold text-[var(--accent-on-dark)]">{activeProducts}</p>
        </div>

        <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl space-y-2">
          <div className="flex items-center justify-between text-gray-400">
            <span className="text-xs font-bold uppercase tracking-wider">Total Leads</span>
            <Inbox className="w-4 h-4 text-[var(--accent-on-dark)]" />
          </div>
          <p className="text-2xl font-extrabold text-white">{totalEnquiries}</p>
        </div>

        <div className="bg-slate-900 border border-amber-500/40 p-5 rounded-2xl space-y-2">
          <div className="flex items-center justify-between text-amber-400">
            <span className="text-xs font-bold uppercase tracking-wider">New Enquiries</span>
            <Clock className="w-4 h-4" />
          </div>
          <p className="text-2xl font-extrabold text-amber-400">{newEnquiries}</p>
        </div>

        <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl space-y-2">
          <div className="flex items-center justify-between text-gray-400">
            <span className="text-xs font-bold uppercase tracking-wider">Quote Requests</span>
            <FileText className="w-4 h-4 text-amber-400" />
          </div>
          <p className="text-2xl font-extrabold text-white">{quoteRequests}</p>
        </div>
      </div>

      {/* Content Management Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Published Articles", value: `${publishedPosts} / ${totalPosts}`, href: "/admin/blog" },
          { label: "Active Projects", value: String(totalProjects), href: "/admin/projects" },
          { label: "Open Roles", value: String(openJobs), href: "/admin/careers" },
          { label: "Job Applications", value: String(jobApplications), href: "/admin/careers" },
        ].map((card) => (
          <Link
            key={card.label}
            href={card.href}
            className="bg-slate-900 border border-slate-800 p-5 rounded-2xl space-y-2 transition-colors hover:border-slate-600"
          >
            <span className="text-xs font-bold uppercase tracking-wider text-gray-400">{card.label}</span>
            <p className="flex items-center justify-between text-2xl font-extrabold text-white">
              {card.value}
              <ArrowRight className="h-4 w-4 text-gray-500" aria-hidden="true" />
            </p>
          </Link>
        ))}
      </div>

      {/* Recent Customer Enquiries Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-white">Recent Customer Leads</h2>
          <Link
            href="/admin/enquiries"
            className="text-xs font-bold text-[var(--accent-on-dark)] hover:text-[var(--accent-on-dark-strong)] flex items-center space-x-1"
          >
            <span>View All Leads</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {recentEnquiries.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-gray-300">
              <thead className="bg-slate-950 text-gray-400 uppercase text-[10px] tracking-wider">
                <tr>
                  <th className="p-3">Customer</th>
                  <th className="p-3">Phone & Location</th>
                  <th className="p-3">Product Required</th>
                  <th className="p-3">Status</th>
                  <th className="p-3">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800">
                {recentEnquiries.map((enq) => (
                  <tr key={enq.id} className="hover:bg-slate-800/50">
                    <td className="p-3">
                      <span className="font-bold text-white block">{enq.name}</span>
                      <span className="text-[11px] text-gray-400">{enq.company || "Individual"}</span>
                    </td>
                    <td className="p-3">
                      <span className="flex items-center space-x-1 text-gray-300">
                        <Phone className="w-3 h-3 text-[var(--accent-on-dark)]" />
                        <span>{enq.phone}</span>
                      </span>
                      <span className="flex items-center space-x-1 text-gray-400 text-[11px]">
                        <MapPin className="w-3 h-3 text-gray-500" />
                        <span>{enq.location}</span>
                      </span>
                    </td>
                    <td className="p-3">
                      <span className="font-semibold text-amber-300">
                        {enq.productTitle || enq.product?.name || "General Enquiry"}
                      </span>
                      <span className="block text-[10px] text-gray-400">Qty: {enq.quantity}</span>
                    </td>
                    <td className="p-3">
                      <span
                        className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          enq.status === "NEW"
                            ? "bg-amber-950 text-amber-300 border border-amber-800"
                            : enq.status === "QUOTED"
                            ? "bg-[var(--accent)]/20 text-[var(--accent-on-dark-strong)] border border-[var(--accent-bright)]/60"
                            : "bg-slate-800 text-gray-300"
                        }`}
                      >
                        {enq.status}
                      </span>
                    </td>
                    <td className="p-3 text-[11px] text-gray-400">{formatDate(enq.createdAt)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-xs text-gray-500 py-4 text-center">No customer enquiries received yet.</p>
        )}
      </div>
    </div>
  );
}
