"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { FileText, Send, CheckCircle2, AlertCircle, MessageSquare } from "lucide-react";
import { getWhatsAppLink } from "@/lib/whatsapp";

const quoteSchema = z.object({
  name: z.string().min(2, "Full name is required"),
  company: z.string().optional(),
  phone: z.string().min(8, "Valid phone number required"),
  email: z.string().email("Valid email required").optional().or(z.literal("")),
  productTitle: z.string().min(1, "Please select or type target product"),
  quantity: z.number().int().min(1, "Quantity must be at least 1"),
  location: z.string().min(2, "Delivery City / State is required"),
  message: z.string().min(10, "Please describe your machinery requirement"),
  website: z.string().optional(),
});

type QuoteFormData = z.infer<typeof quoteSchema>;

interface QuoteClientProps {
  products: { id: string; name: string }[];
  initialProductTitle?: string;
  whatsappNumber?: string;
}

export default function QuoteClient({ products, initialProductTitle = "", whatsappNumber }: QuoteClientProps) {
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [lastProductTitle, setLastProductTitle] = useState(initialProductTitle);

  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors },
  } = useForm<QuoteFormData>({
    resolver: zodResolver(quoteSchema),
    defaultValues: {
      productTitle: initialProductTitle || (products[0]?.name ?? ""),
      quantity: 1,
    },
  });

  const selectedProductTitle = watch("productTitle");

  const onSubmit = async (data: QuoteFormData) => {
    setSubmitting(true);
    setErrorMessage(null);
    setLastProductTitle(data.productTitle);

    try {
      const res = await fetch("/api/enquiries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...data,
          source: "QUOTE_FORM",
        }),
      });

      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "Failed to submit quotation request");

      setSubmitted(true);
      reset();
    } catch (err: any) {
      setErrorMessage(err.message || "An unexpected error occurred. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const waUrl = getWhatsAppLink(lastProductTitle || selectedProductTitle, undefined, whatsappNumber);

  return (
    <div className="space-y-10 py-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Header Banner */}
      <div className="bg-slate-950 text-white p-8 rounded-2xl border border-slate-800 space-y-3 text-center">
        <div className="inline-flex items-center space-x-2 text-xs font-bold text-amber-400 uppercase tracking-wider bg-slate-900 px-3 py-1 rounded-md border border-slate-800">
          <FileText className="w-4 h-4 text-amber-400" />
          <span>Formal Price Proposal</span>
        </div>
        <h1 className="text-3xl font-extrabold text-white tracking-tight">
          Request a Machinery Quotation
        </h1>
        <p className="text-xs sm:text-sm text-gray-300 max-w-xl mx-auto leading-relaxed">
          Submit your machinery parameters, required quantities, and farm location below for direct factory pricing.
        </p>
      </div>

      <div className="bg-white p-8 rounded-2xl border border-gray-200 shadow-xs space-y-6">
        {submitted ? (
          <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-8 text-center space-y-4">
            <CheckCircle2 className="w-16 h-16 text-emerald-700 mx-auto" />
            <h3 className="text-2xl font-extrabold text-emerald-950">Quotation Request Submitted!</h3>
            <p className="text-xs sm:text-sm text-emerald-800 max-w-md mx-auto leading-relaxed">
              Your quotation request for <span className="font-bold">{lastProductTitle}</span> has been saved in our system. Our engineering sales lead will contact you with formal pricing details.
            </p>

            <div className="pt-4 flex flex-col sm:flex-row items-center justify-center space-y-3 sm:space-y-0 sm:space-x-4">
              <a
                href={waUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto px-6 py-3 text-xs font-bold text-white bg-emerald-700 hover:bg-emerald-800 rounded-xl transition-colors inline-flex items-center justify-center space-x-2"
              >
                <MessageSquare className="w-4 h-4 fill-white" />
                <span>Follow Up via WhatsApp</span>
              </a>

              <button
                onClick={() => setSubmitted(false)}
                className="w-full sm:w-auto px-6 py-3 text-xs font-bold text-slate-800 bg-gray-100 hover:bg-gray-200 rounded-xl transition-colors"
              >
                Request Another Quote
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <input
              type="text"
              tabIndex={-1}
              autoComplete="off"
              {...register("website")}
              className="hidden"
              aria-hidden="true"
            />

            {errorMessage && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-lg flex items-center space-x-2 text-xs text-red-700">
                <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
                <span>{errorMessage}</span>
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-800 mb-1">Target Product / Equipment *</label>
                <select
                  {...register("productTitle")}
                  className="w-full px-3 py-2.5 text-xs bg-gray-50 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-700 focus:outline-none"
                >
                  <option value="">Select Equipment</option>
                  {products.map((p) => (
                    <option key={p.id} value={p.name}>
                      {p.name}
                    </option>
                  ))}
                  <option value="Custom Agricultural Machine">Custom Agricultural Machine</option>
                  <option value="Custom Engineering Equipment">Custom Engineering Equipment</option>
                </select>
                {errors.productTitle && <p className="text-[11px] text-red-600 mt-0.5">{errors.productTitle.message}</p>}
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-800 mb-1">Required Quantity *</label>
                <input
                  type="number"
                  min={1}
                  {...register("quantity", { valueAsNumber: true })}
                  className="w-full px-3 py-2.5 text-xs bg-gray-50 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-700 focus:outline-none"
                />
                {errors.quantity && <p className="text-[11px] text-red-600 mt-0.5">{errors.quantity.message}</p>}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-800 mb-1">Full Name *</label>
                <input
                  type="text"
                  {...register("name")}
                  placeholder="e.g. Gurpreet Singh"
                  className="w-full px-3 py-2.5 text-xs bg-gray-50 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-700 focus:outline-none"
                />
                {errors.name && <p className="text-[11px] text-red-600 mt-0.5">{errors.name.message}</p>}
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-800 mb-1">Company / Farm / Agency</label>
                <input
                  type="text"
                  {...register("company")}
                  placeholder="e.g. Raj Agro Farms"
                  className="w-full px-3 py-2.5 text-xs bg-gray-50 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-700 focus:outline-none"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-800 mb-1">Mobile / Phone Number *</label>
                <input
                  type="tel"
                  {...register("phone")}
                  placeholder="+91 98765 43210"
                  className="w-full px-3 py-2.5 text-xs bg-gray-50 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-700 focus:outline-none"
                />
                {errors.phone && <p className="text-[11px] text-red-600 mt-0.5">{errors.phone.message}</p>}
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-800 mb-1">Delivery City / State *</label>
                <input
                  type="text"
                  {...register("location")}
                  placeholder="e.g. Moga, Punjab"
                  className="w-full px-3 py-2.5 text-xs bg-gray-50 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-700 focus:outline-none"
                />
                {errors.location && <p className="text-[11px] text-red-600 mt-0.5">{errors.location.message}</p>}
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-800 mb-1">Email Address</label>
              <input
                type="email"
                {...register("email")}
                placeholder="name@example.com"
                className="w-full px-3 py-2.5 text-xs bg-gray-50 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-700 focus:outline-none"
              />
              {errors.email && <p className="text-[11px] text-red-600 mt-0.5">{errors.email.message}</p>}
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-800 mb-1">Specific Requirements / Tractor HP *</label>
              <textarea
                rows={4}
                {...register("message")}
                placeholder="Please state tractor horsepower (e.g., 50 HP), preferred working width, or customized specs..."
                className="w-full px-3 py-2.5 text-xs bg-gray-50 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-700 focus:outline-none"
              />
              {errors.message && <p className="text-[11px] text-red-600 mt-0.5">{errors.message.message}</p>}
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full py-3.5 px-4 text-xs font-bold text-slate-950 bg-amber-400 hover:bg-amber-300 rounded-xl transition-all shadow-md flex items-center justify-center space-x-2"
            >
              <Send className="w-4 h-4" />
              <span>{submitting ? "Submitting Quotation Request..." : "Request Official Quotation"}</span>
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
