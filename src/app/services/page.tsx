import Link from "next/link";
import { Wrench, Shield, Cog, RefreshCw, Truck, ChevronRight } from "lucide-react";
import { DEFAULT_SITE_CONFIG } from "@/lib/config";
import { getWhatsAppLink } from "@/lib/whatsapp";

export const metadata = {
  title: "Engineering Services & Support",
  description: "Machinery repair, custom fabrication, maintenance, boron steel replacement parts, and agricultural equipment engineering support.",
};

export default function ServicesPage() {
  const waUrl = getWhatsAppLink(undefined, "Hello, I am interested in your machinery repair / custom fabrication services.");

  return (
    <div className="space-y-16 py-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Header Banner */}
      <div className="bg-slate-950 text-white p-8 rounded-2xl border border-slate-800 space-y-3">
        <div className="inline-flex items-center space-x-2 text-xs font-bold text-amber-400 uppercase tracking-wider bg-slate-900 px-3 py-1 rounded-md border border-slate-800">
          <Wrench className="w-4 h-4 text-amber-400" />
          <span>Industrial Capabilities</span>
        </div>
        <h1 className="text-3xl font-extrabold text-white tracking-tight">
          Services & Technical Support
        </h1>
        <p className="text-xs sm:text-sm text-gray-300 max-w-2xl leading-relaxed">
          From custom heavy structural fabrication to gearbox overhauls, boron blade replacement, and field maintenance, we provide end-to-end engineering support for agricultural machinery.
        </p>
      </div>

      {/* Services Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-xs space-y-4">
          <div className="w-10 h-10 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold">
            <Cog className="w-5 h-5" />
          </div>
          <h3 className="text-lg font-bold text-slate-900">Custom Equipment Manufacturing</h3>
          <p className="text-xs text-gray-600 leading-relaxed">
            Tailor-made manufacturing of agricultural implements designed around specific soil types, tractor horsepower ratings, and field row dimensions.
          </p>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-xs space-y-4">
          <div className="w-10 h-10 rounded-lg bg-amber-100 text-amber-800 flex items-center justify-center font-bold">
            <Wrench className="w-5 h-5" />
          </div>
          <h3 className="text-lg font-bold text-slate-900">Custom Metal Fabrication</h3>
          <p className="text-xs text-gray-600 leading-relaxed">
            Heavy structural welding, channel chassis construction for tipping trailers, boom sprayer mounts, and specialized industrial frames.
          </p>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-xs space-y-4">
          <div className="w-10 h-10 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold">
            <RefreshCw className="w-5 h-5" />
          </div>
          <h3 className="text-lg font-bold text-slate-900">Machinery Repair & Overhaul</h3>
          <p className="text-xs text-gray-600 leading-relaxed">
            Complete refurbishment of rotary tillers, multi-speed gearboxes, thresher drums, laser leveler hydraulic valves, and tractor trailer axles.
          </p>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-xs space-y-4">
          <div className="w-10 h-10 rounded-lg bg-amber-100 text-amber-800 flex items-center justify-center font-bold">
            <Shield className="w-5 h-5" />
          </div>
          <h3 className="text-lg font-bold text-slate-900">Genuine Spare Parts</h3>
          <p className="text-xs text-gray-600 leading-relaxed">
            Supply of high-carbon boron steel rotavator blades, heavy bevel gears, stubble cutter discs, laser leveler receivers, and hydraulic rams.
          </p>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-xs space-y-4">
          <div className="w-10 h-10 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold">
            <Truck className="w-5 h-5" />
          </div>
          <h3 className="text-lg font-bold text-slate-900">Preventative Maintenance</h3>
          <p className="text-xs text-gray-600 leading-relaxed">
            Seasonal machinery tune-up services prior to sowing and harvest seasons to prevent field breakdown during peak operating windows.
          </p>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-xs space-y-4">
          <div className="w-10 h-10 rounded-lg bg-amber-100 text-amber-800 flex items-center justify-center font-bold">
            <Wrench className="w-5 h-5" />
          </div>
          <h3 className="text-lg font-bold text-slate-900">On-Field Support</h3>
          <p className="text-xs text-gray-600 leading-relaxed">
            Field setup, laser leveler transmitter calibration, and technical operator training provided for contracting teams.
          </p>
        </div>
      </div>

      {/* CTA Box */}
      <div className="bg-emerald-950 text-white rounded-2xl p-8 sm:p-12 border border-emerald-900 flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="space-y-2 text-center md:text-left">
          <h2 className="text-2xl font-extrabold text-white">Need Repairs or Custom Engineering?</h2>
          <p className="text-xs sm:text-sm text-emerald-200">
            Contact our factory technical team directly or drop a message on WhatsApp.
          </p>
        </div>
        <div className="flex items-center space-x-4">
          <a
            href={waUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="px-6 py-3 text-xs font-bold text-slate-950 bg-amber-400 hover:bg-amber-300 rounded-lg shadow-md transition-all inline-flex items-center"
          >
            <span>Consult Engineer</span>
            <ChevronRight className="w-4 h-4 ml-1" />
          </a>
        </div>
      </div>
    </div>
  );
}
