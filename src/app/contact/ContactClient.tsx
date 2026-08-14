"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Phone, Mail, MapPin, Clock, MessageSquare, Send, CheckCircle2, AlertCircle } from "lucide-react";
import { SiteConfig } from "@/lib/config";
import { getWhatsAppLink } from "@/lib/whatsapp";

const contactSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  company: z.string().optional(),
  phone: z.string().min(8, "Valid phone number required"),
  email: z.string().email("Valid email required").optional().or(z.literal("")),
  location: z.string().min(2, "City / District is required"),
  message: z.string().min(10, "Please provide message details (at least 10 characters)"),
  website: z.string().optional(),
});

type ContactFormData = z.infer<typeof contactSchema>;

interface ContactClientProps {
  config: SiteConfig;
}

export default function ContactClient({ config }: ContactClientProps) {
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const cleanPhone = config.phonePrimary.split("[")[0].trim() || config.phonePrimary;
  const cleanEmail = config.emailPrimary.split("[")[0].trim() || config.emailPrimary;
  const cleanAddress = config.address.split("[")[0].trim() || config.address;
  const cleanGstin = (config.gstin || "").split("[")[0].trim();
  const waUrl = getWhatsAppLink(undefined, undefined, config.whatsappNumber);
  const hasConfiguredMap = config.googleMapsUrl.startsWith("https://") || config.googleMapsUrl.startsWith("http://");

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ContactFormData>({
    resolver: zodResolver(contactSchema),
  });

  const onSubmit = async (data: ContactFormData) => {
    setSubmitting(true);
    setErrorMessage(null);

    try {
      const res = await fetch("/api/enquiries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...data,
          source: "CONTACT_FORM",
        }),
      });

      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "Failed to send message");

      setSubmitted(true);
      reset();
    } catch (err: any) {
      setErrorMessage(err.message || "An unexpected error occurred. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-12 py-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="bg-slate-950 text-white p-8 rounded-2xl border border-slate-800 space-y-3">
        <div className="inline-flex items-center space-x-2 text-xs font-bold text-amber-400 uppercase tracking-wider bg-slate-900 px-3 py-1 rounded-md border border-slate-800">
          <Phone className="w-4 h-4 text-amber-400" />
          <span>Get in Touch</span>
        </div>
        <h1 className="text-3xl font-extrabold text-white tracking-tight">
          Contact M/s Raj Agro Engineering Works
        </h1>
        <p className="text-xs sm:text-sm text-gray-300 max-w-2xl leading-relaxed">
          Reach our sales and engineering support team directly via phone, WhatsApp, or the enquiry form below.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        {/* Left Column: Contact Cards */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-xs space-y-6">
            <h3 className="text-lg font-bold text-slate-900 border-b border-gray-100 pb-3">
              Factory & Sales Office
            </h3>

            <div className="space-y-4 text-sm text-gray-700">
              <div className="flex items-start space-x-3">
                <MapPin className="w-5 h-5 text-emerald-700 shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold block text-slate-900">Address</span>
                  <span className="text-xs text-gray-600">{cleanAddress}</span>
                </div>
              </div>

              {cleanGstin && (
                <div className="flex items-start space-x-3">
                  <span className="w-5 h-5 text-emerald-700 shrink-0 mt-0.5 font-bold text-[11px] leading-5 text-center">ID</span>
                  <div>
                    <span className="font-bold block text-slate-900">GSTIN</span>
                    <span className="text-xs text-gray-600">{cleanGstin}</span>
                  </div>
                </div>
              )}

              <div className="flex items-start space-x-3">
                <Phone className="w-5 h-5 text-emerald-700 shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold block text-slate-900">Phone Numbers</span>
                  <span className="text-xs text-gray-600">{cleanPhone}</span>
                  <span className="text-xs text-gray-500 block">{config.phoneSecondary.split("[")[0].trim()}</span>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <Mail className="w-5 h-5 text-emerald-700 shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold block text-slate-900">Email Contact</span>
                  <span className="text-xs text-gray-600">{cleanEmail}</span>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <Clock className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold block text-slate-900">Working Hours</span>
                  <span className="text-xs text-gray-600">{config.businessHours}</span>
                </div>
              </div>
            </div>

            <div className="pt-2 border-t border-gray-100">
              <a
                href={waUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full flex items-center justify-center py-3 px-4 text-xs font-bold text-white bg-emerald-700 hover:bg-emerald-800 rounded-xl transition-colors space-x-2"
              >
                <MessageSquare className="w-4 h-4 fill-white" />
                <span>Chat Instantly on WhatsApp</span>
              </a>
            </div>
          </div>

          {/* Map */}
          <div className="bg-white p-2 rounded-2xl border border-gray-200 shadow-xs h-64 overflow-hidden">
            {hasConfiguredMap ? (
              <iframe
                title="Factory Map"
                src={config.googleMapsUrl}
                className="w-full h-full rounded-xl border-0"
                loading="lazy"
              />
            ) : (
              <div className="h-full rounded-xl bg-gray-100 border border-dashed border-gray-300 flex items-center justify-center p-6 text-center">
                <p className="text-xs font-semibold text-gray-500">
                  Google Maps will appear after the factory map URL is configured in admin settings.
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Contact Form */}
        <div className="lg:col-span-7">
          <div className="bg-white p-8 rounded-2xl border border-gray-200 shadow-xs space-y-6">
            <div>
              <h3 className="text-xl font-extrabold text-slate-900">Send an Enquiry</h3>
              <p className="text-xs text-gray-500 mt-1">
                Fill out your machinery requirement and our team will get back to you promptly.
              </p>
            </div>

            {submitted ? (
              <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-6 text-center space-y-3">
                <CheckCircle2 className="w-12 h-12 text-emerald-700 mx-auto" />
                <h4 className="text-lg font-bold text-emerald-900">Enquiry Received Successfully!</h4>
                <p className="text-xs text-emerald-800 max-w-md mx-auto">
                  Thank you for contacting M/s Raj Agro Engineering Works. Our technical sales representative will respond to your query shortly.
                </p>
                <button
                  onClick={() => setSubmitted(false)}
                  className="px-4 py-2 text-xs font-bold text-emerald-900 bg-emerald-100 rounded-lg hover:bg-emerald-200"
                >
                  Send Another Message
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
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
                    <label className="block text-xs font-bold text-slate-800 mb-1">Your Full Name *</label>
                    <input
                      type="text"
                      {...register("name")}
                      placeholder="e.g. Ramesh Kumar"
                      className="w-full px-3 py-2.5 text-xs bg-gray-50 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-700 focus:outline-none"
                    />
                    {errors.name && <p className="text-[11px] text-red-600 mt-0.5">{errors.name.message}</p>}
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-800 mb-1">Company / Farm Name</label>
                    <input
                      type="text"
                      {...register("company")}
                      placeholder="e.g. Green Valley Agro"
                      className="w-full px-3 py-2.5 text-xs bg-gray-50 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-700 focus:outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-800 mb-1">Phone Number *</label>
                    <input
                      type="tel"
                      {...register("phone")}
                      placeholder="7651861335"
                      className="w-full px-3 py-2.5 text-xs bg-gray-50 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-700 focus:outline-none"
                    />
                    {errors.phone && <p className="text-[11px] text-red-600 mt-0.5">{errors.phone.message}</p>}
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-800 mb-1">City / District / State *</label>
                    <input
                      type="text"
                      {...register("location")}
                      placeholder="e.g. Ludhiana, Punjab"
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
                  <label className="block text-xs font-bold text-slate-800 mb-1">Requirement Details *</label>
                  <textarea
                    rows={4}
                    {...register("message")}
                    placeholder="Specify machinery models required, quantity, tractor HP, or custom fabrication needs..."
                    className="w-full px-3 py-2.5 text-xs bg-gray-50 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-700 focus:outline-none"
                  />
                  {errors.message && <p className="text-[11px] text-red-600 mt-0.5">{errors.message.message}</p>}
                </div>

                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full py-3 px-4 text-xs font-bold text-white bg-emerald-700 hover:bg-emerald-800 rounded-xl transition-all shadow-sm flex items-center justify-center space-x-2"
                >
                  <Send className="w-4 h-4" />
                  <span>{submitting ? "Submitting Enquiry..." : "Submit Enquiry"}</span>
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
