"use client";

import { useState } from "react";
import { Search, Phone, Mail, MapPin, MessageSquare, Trash2, Eye, X } from "lucide-react";
import { formatDate } from "@/lib/utils";
import { getWhatsAppLink } from "@/lib/whatsapp";

interface Enquiry {
  id: string;
  name: string;
  company?: string | null;
  phone: string;
  email?: string | null;
  productId?: string | null;
  productTitle?: string | null;
  quantity: number;
  location: string;
  message: string;
  status: string;
  source: string;
  createdAt: string;
  product?: { name: string } | null;
}

interface EnquiryManagerProps {
  initialEnquiries: any[];
}

export default function EnquiryManager({ initialEnquiries }: EnquiryManagerProps) {
  const [enquiries, setEnquiries] = useState<any[]>(initialEnquiries);
  const [activeStatusFilter, setActiveStatusFilter] = useState("ALL");
  const [search, setSearch] = useState("");
  const [selectedEnquiry, setSelectedEnquiry] = useState<any | null>(null);

  const statusOptions = ["ALL", "NEW", "CONTACTED", "QUOTED", "CONVERTED", "CLOSED", "SPAM"];

  const filtered = enquiries.filter((enq) => {
    const matchesStatus = activeStatusFilter === "ALL" || enq.status === activeStatusFilter;
    const matchesSearch =
      enq.name.toLowerCase().includes(search.toLowerCase()) ||
      enq.phone.includes(search) ||
      enq.location.toLowerCase().includes(search.toLowerCase()) ||
      (enq.company && enq.company.toLowerCase().includes(search.toLowerCase()));
    return matchesStatus && matchesSearch;
  });

  const handleStatusChange = async (id: string, newStatus: string) => {
    try {
      const res = await fetch(`/api/enquiries/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });
      const updated = await res.json();
      if (!res.ok) throw new Error("Failed to update status");

      setEnquiries(enquiries.map((e) => (e.id === id ? updated : e)));
      if (selectedEnquiry && selectedEnquiry.id === id) {
        setSelectedEnquiry(updated);
      }
    } catch (err: any) {
      alert(err.message);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this enquiry?")) return;
    try {
      const res = await fetch(`/api/enquiries/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed to delete enquiry");
      setEnquiries(enquiries.filter((e) => e.id !== id));
      if (selectedEnquiry && selectedEnquiry.id === id) {
        setSelectedEnquiry(null);
      }
    } catch (err: any) {
      alert(err.message);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold text-white">Customer Enquiries & Quotation Leads</h1>
        <p className="text-xs text-gray-400">Review customer machine inquiries, quote requests, and update deal statuses.</p>
      </div>

      {/* Filter Chips & Search Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex flex-wrap gap-1.5">
          {statusOptions.map((status) => {
            const isActive = activeStatusFilter === status;
            const count =
              status === "ALL"
                ? enquiries.length
                : enquiries.filter((e) => e.status === status).length;
            return (
              <button
                key={status}
                onClick={() => setActiveStatusFilter(status)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${
                  isActive
                    ? "bg-amber-400 text-slate-950"
                    : "bg-slate-900 text-gray-400 hover:text-white border border-slate-800"
                }`}
              >
                {status} ({count})
              </button>
            );
          })}
        </div>

        <div className="relative max-w-xs">
          <Search className="w-4 h-4 text-gray-500 absolute left-3 top-3" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search name, phone, city..."
            className="w-full pl-9 pr-3 py-2 text-xs bg-slate-900 border border-slate-800 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-emerald-600"
          />
        </div>
      </div>

      {/* Enquiries Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-gray-300">
            <thead className="bg-slate-950 text-gray-400 uppercase text-[10px] tracking-wider border-b border-slate-800">
              <tr>
                <th className="p-3.5">Customer & Company</th>
                <th className="p-3.5">Phone & City</th>
                <th className="p-3.5">Product Required</th>
                <th className="p-3.5">Source</th>
                <th className="p-3.5">Status</th>
                <th className="p-3.5">Date</th>
                <th className="p-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {filtered.map((enq) => {
                const targetTitle = enq.productTitle || enq.product?.name || "General Enquiry";
                const waUrl = getWhatsAppLink(targetTitle, undefined, enq.phone);

                return (
                  <tr key={enq.id} className="hover:bg-slate-800/40">
                    <td className="p-3.5">
                      <span className="font-bold text-white block">{enq.name}</span>
                      <span className="text-[11px] text-gray-400">{enq.company || "Individual Farmer / Contractor"}</span>
                    </td>
                    <td className="p-3.5">
                      <span className="flex items-center space-x-1 text-gray-200">
                        <Phone className="w-3 h-3 text-emerald-400" />
                        <span>{enq.phone}</span>
                      </span>
                      <span className="flex items-center space-x-1 text-gray-400 text-[11px]">
                        <MapPin className="w-3 h-3 text-gray-500" />
                        <span>{enq.location}</span>
                      </span>
                    </td>
                    <td className="p-3.5">
                      <span className="font-semibold text-amber-300">{targetTitle}</span>
                      <span className="block text-[10px] text-gray-500">Qty: {enq.quantity} unit(s)</span>
                    </td>
                    <td className="p-3.5">
                      <span className="px-2 py-0.5 rounded-md text-[10px] font-mono bg-slate-950 text-gray-400">
                        {enq.source}
                      </span>
                    </td>
                    <td className="p-3.5">
                      <select
                        value={enq.status}
                        onChange={(e) => handleStatusChange(enq.id, e.target.value)}
                        className={`px-2.5 py-1 rounded-lg text-xs font-bold focus:outline-none ${
                          enq.status === "NEW"
                            ? "bg-amber-950 text-amber-300 border border-amber-800"
                            : enq.status === "QUOTED"
                            ? "bg-emerald-950 text-emerald-300 border border-emerald-800"
                            : enq.status === "CONVERTED"
                            ? "bg-emerald-800 text-white"
                            : "bg-slate-800 text-gray-300"
                        }`}
                      >
                        {statusOptions.filter((s) => s !== "ALL").map((st) => (
                          <option key={st} value={st}>
                            {st}
                          </option>
                        ))}
                      </select>
                    </td>
                    <td className="p-3.5 text-gray-400 text-[11px]">{formatDate(enq.createdAt)}</td>
                    <td className="p-3.5 text-right">
                      <div className="flex items-center justify-end space-x-2">
                        <a
                          href={waUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-1.5 text-emerald-400 hover:text-emerald-300 bg-emerald-950/60 rounded-lg"
                          title="Contact via WhatsApp"
                        >
                          <MessageSquare className="w-3.5 h-3.5" />
                        </a>
                        <button
                          onClick={() => setSelectedEnquiry(enq)}
                          className="p-1.5 text-gray-300 hover:text-white bg-slate-800 rounded-lg"
                          title="View Lead Details"
                        >
                          <Eye className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleDelete(enq.id)}
                          className="p-1.5 text-red-400 hover:text-red-300 bg-red-950/40 rounded-lg"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Customer Lead Detail Modal */}
      {selectedEnquiry && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-lg w-full p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-lg font-bold text-white">Lead Details</h3>
              <button onClick={() => setSelectedEnquiry(null)} className="text-gray-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs text-gray-300">
              <div>
                <span className="text-gray-500 font-bold block">Customer Name:</span>
                <span className="text-sm font-bold text-white">{selectedEnquiry.name}</span>
                {selectedEnquiry.company && <span className="block text-gray-400">{selectedEnquiry.company}</span>}
              </div>

              <div className="grid grid-cols-2 gap-3 pt-2 border-t border-slate-800">
                <div>
                  <span className="text-gray-500 font-bold block">Phone Number:</span>
                  <span className="font-semibold text-emerald-400">{selectedEnquiry.phone}</span>
                </div>
                <div>
                  <span className="text-gray-500 font-bold block">Delivery Location:</span>
                  <span className="font-semibold text-white">{selectedEnquiry.location}</span>
                </div>
              </div>

              <div className="pt-2 border-t border-slate-800">
                <span className="text-gray-500 font-bold block">Equipment Title & Quantity:</span>
                <span className="font-bold text-amber-400">
                  {selectedEnquiry.productTitle || selectedEnquiry.product?.name || "General Machinery Enquiry"}
                </span>
                <span className="block text-gray-400">Quantity Required: {selectedEnquiry.quantity} unit(s)</span>
              </div>

              <div className="pt-2 border-t border-slate-800">
                <span className="text-gray-500 font-bold block">Customer Requirement Details:</span>
                <p className="bg-slate-950 p-3 rounded-lg border border-slate-800 text-gray-200 mt-1 whitespace-pre-line">
                  {selectedEnquiry.message}
                </p>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-800 flex items-center justify-between">
              <span className="text-[11px] text-gray-500">Submitted: {formatDate(selectedEnquiry.createdAt)}</span>
              <button
                onClick={() => setSelectedEnquiry(null)}
                className="px-4 py-2 font-bold text-slate-950 bg-amber-400 hover:bg-amber-300 rounded-lg text-xs"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
