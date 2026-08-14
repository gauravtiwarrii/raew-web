"use client";

import { useState } from "react";
import { Save, CheckCircle2, AlertCircle, Building, Phone, Globe } from "lucide-react";

interface SettingsManagerProps {
  initialConfig: Record<string, string>;
}

export default function SettingsManager({ initialConfig }: SettingsManagerProps) {
  const [formData, setFormData] = useState<Record<string, string>>({
    BUSINESS_NAME: initialConfig.BUSINESS_NAME || initialConfig.businessName || "M/s Raj Agro Engineering Works",
    TAGLINE: initialConfig.TAGLINE || initialConfig.tagline || "Precision Agricultural Machinery Solutions",
    PHONE_PRIMARY: initialConfig.PHONE_PRIMARY || initialConfig.phonePrimary || "[REPLACE WITH ACTUAL BUSINESS PHONE]",
    PHONE_SECONDARY: initialConfig.PHONE_SECONDARY || initialConfig.phoneSecondary || "[REPLACE WITH SECONDARY PHONE]",
    WHATSAPP_NUMBER: initialConfig.WHATSAPP_NUMBER || initialConfig.whatsappNumber || "[REPLACE WITH ACTUAL WHATSAPP NUMBER]",
    EMAIL_PRIMARY: initialConfig.EMAIL_PRIMARY || initialConfig.emailPrimary || "[REPLACE WITH BUSINESS EMAIL]",
    EMAIL_SALES: initialConfig.EMAIL_SALES || initialConfig.emailSales || "[REPLACE WITH SALES EMAIL]",
    ADDRESS: initialConfig.ADDRESS || initialConfig.address || "[REPLACE WITH FACTORY ADDRESS]",
    GSTIN: initialConfig.GSTIN || initialConfig.gstin || "[REPLACE WITH GSTIN]",
    GOOGLE_MAPS_URL: initialConfig.GOOGLE_MAPS_URL || initialConfig.googleMapsUrl || "[REPLACE WITH GOOGLE MAPS EMBED URL]",
    BUSINESS_HOURS: initialConfig.BUSINESS_HOURS || initialConfig.businessHours || "[REPLACE WITH BUSINESS HOURS]",
    FACEBOOK_URL: initialConfig.FACEBOOK_URL || initialConfig.facebookUrl || "[REPLACE WITH FACEBOOK URL]",
    INSTAGRAM_URL: initialConfig.INSTAGRAM_URL || initialConfig.instagramUrl || "[REPLACE WITH INSTAGRAM URL]",
    YOUTUBE_URL: initialConfig.YOUTUBE_URL || initialConfig.youtubeUrl || "[REPLACE WITH YOUTUBE URL]",
  });

  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (key: string, value: string) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setSuccess(false);
    setError(null);

    try {
      const res = await fetch("/api/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "Failed to update settings");

      setSuccess(true);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h1 className="text-2xl font-extrabold text-white">Centralized Site Settings</h1>
        <p className="text-xs text-gray-400">Update company phone numbers, factory address, WhatsApp contact, and email placeholders dynamically.</p>
      </div>

      {success && (
        <div className="p-4 bg-emerald-950/80 border border-emerald-800 rounded-xl flex items-center space-x-3 text-xs text-emerald-300">
          <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
          <span>Site configuration settings updated successfully! All public pages will now display these values.</span>
        </div>
      )}

      {error && (
        <div className="p-4 bg-red-950/80 border border-red-800 rounded-xl flex items-center space-x-3 text-xs text-red-300">
          <AlertCircle className="w-5 h-5 text-red-500 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      <form onSubmit={handleSave} className="space-y-6">
        {/* Business Identity */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4">
          <div className="flex items-center space-x-2 text-amber-400 border-b border-slate-800 pb-3">
            <Building className="w-4 h-4" />
            <h3 className="font-bold text-sm text-white">Business Identity & Tagline</h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="block font-bold text-gray-300 mb-1">Company Name</label>
              <input
                type="text"
                value={formData.BUSINESS_NAME}
                onChange={(e) => handleChange("BUSINESS_NAME", e.target.value)}
                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-white focus:outline-none focus:border-emerald-600"
              />
            </div>

            <div>
              <label className="block font-bold text-gray-300 mb-1">Tagline</label>
              <input
                type="text"
                value={formData.TAGLINE}
                onChange={(e) => handleChange("TAGLINE", e.target.value)}
                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-white focus:outline-none focus:border-emerald-600"
              />
            </div>
          </div>
        </div>

        {/* Contact Numbers & WhatsApp */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4">
          <div className="flex items-center space-x-2 text-emerald-400 border-b border-slate-800 pb-3">
            <Phone className="w-4 h-4" />
            <h3 className="font-bold text-sm text-white">Contact & WhatsApp Integration</h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
            <div>
              <label className="block font-bold text-gray-300 mb-1">Primary Phone Number</label>
              <input
                type="text"
                value={formData.PHONE_PRIMARY}
                onChange={(e) => handleChange("PHONE_PRIMARY", e.target.value)}
                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-white focus:outline-none focus:border-emerald-600"
              />
            </div>

            <div>
              <label className="block font-bold text-gray-300 mb-1">Secondary Phone Number</label>
              <input
                type="text"
                value={formData.PHONE_SECONDARY}
                onChange={(e) => handleChange("PHONE_SECONDARY", e.target.value)}
                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-white focus:outline-none focus:border-emerald-600"
              />
            </div>

            <div>
              <label className="block font-bold text-gray-300 mb-1">WhatsApp Number (Digits with country code)</label>
              <input
                type="text"
                value={formData.WHATSAPP_NUMBER}
                onChange={(e) => handleChange("WHATSAPP_NUMBER", e.target.value)}
                placeholder="91XXXXXXXXXX"
                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-emerald-400 font-mono focus:outline-none focus:border-emerald-600"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="block font-bold text-gray-300 mb-1">Primary Email</label>
              <input
                type="text"
                value={formData.EMAIL_PRIMARY}
                onChange={(e) => handleChange("EMAIL_PRIMARY", e.target.value)}
                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-white focus:outline-none focus:border-emerald-600"
              />
            </div>

            <div>
              <label className="block font-bold text-gray-300 mb-1">GSTIN</label>
              <input
                type="text"
                value={formData.GSTIN}
                onChange={(e) => handleChange("GSTIN", e.target.value)}
                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-white focus:outline-none focus:border-emerald-600"
              />
            </div>

            <div>
              <label className="block font-bold text-gray-300 mb-1">Sales Department Email</label>
              <input
                type="text"
                value={formData.EMAIL_SALES}
                onChange={(e) => handleChange("EMAIL_SALES", e.target.value)}
                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-white focus:outline-none focus:border-emerald-600"
              />
            </div>
          </div>
        </div>

        {/* Address & Hours */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4">
          <div className="flex items-center space-x-2 text-amber-400 border-b border-slate-800 pb-3">
            <Globe className="w-4 h-4" />
            <h3 className="font-bold text-sm text-white">Factory Address & Operating Hours</h3>
          </div>

          <div className="space-y-4 text-xs">
            <div>
              <label className="block font-bold text-gray-300 mb-1">Factory Address</label>
              <input
                type="text"
                value={formData.ADDRESS}
                onChange={(e) => handleChange("ADDRESS", e.target.value)}
                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-white focus:outline-none focus:border-emerald-600"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block font-bold text-gray-300 mb-1">Operating Business Hours</label>
                <input
                  type="text"
                  value={formData.BUSINESS_HOURS}
                  onChange={(e) => handleChange("BUSINESS_HOURS", e.target.value)}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-white focus:outline-none focus:border-emerald-600"
                />
              </div>

              <div>
                <label className="block font-bold text-gray-300 mb-1">Google Maps Embed / URL</label>
                <input
                  type="text"
                  value={formData.GOOGLE_MAPS_URL}
                  onChange={(e) => handleChange("GOOGLE_MAPS_URL", e.target.value)}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-white focus:outline-none focus:border-emerald-600"
                />
              </div>
            </div>
          </div>
        </div>

        <button
          type="submit"
          disabled={saving}
          className="py-3 px-6 font-bold text-xs text-slate-950 bg-amber-400 hover:bg-amber-300 rounded-xl transition-all shadow-md flex items-center space-x-2"
        >
          <Save className="w-4 h-4" />
          <span>{saving ? "Saving Changes..." : "Save All Site Settings"}</span>
        </button>
      </form>
    </div>
  );
}
