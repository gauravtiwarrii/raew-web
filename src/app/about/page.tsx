import Image from "next/image";
import Link from "next/link";
import { ShieldCheck, Award, Factory, Cpu, Wrench, ArrowRight, CheckCircle } from "lucide-react";
import { DEFAULT_SITE_CONFIG } from "@/lib/config";

export const metadata = {
  title: "About Us",
  description: "Learn about M/s Raj Agro Engineering Works - Our mission, engineering capabilities, quality standards, and agricultural machinery manufacturing plant.",
};

export default function AboutPage() {
  const cleanAddress = DEFAULT_SITE_CONFIG.address.split("[")[0].trim();

  return (
    <div className="space-y-16 py-12">
      {/* Header Banner */}
      <section className="bg-slate-950 text-white py-16 border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-4">
          <div className="inline-flex items-center space-x-2 text-xs font-bold text-amber-400 uppercase tracking-wider bg-slate-900 px-3 py-1 rounded-md border border-slate-800">
            <Factory className="w-4 h-4 text-amber-400" />
            <span>Industrial Heritage & Excellence</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white">
            About M/s Raj Agro Engineering Works
          </h1>
          <p className="text-sm sm:text-base text-gray-300 max-w-3xl leading-relaxed">
            Engineering robust agricultural machinery and specialized heavy equipment tailored for maximum productivity, fuel efficiency, and long term durability.
          </p>
        </div>
      </section>

      {/* Main Story & Infrastructure */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-6 space-y-6">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Our Journey & Manufacturing Identity
            </h2>
            <p className="text-sm sm:text-base text-gray-600 leading-relaxed">
              M/s Raj Agro Engineering Works was founded with a singular commitment: to provide Indian farmers and custom agricultural contractors with heavy-duty machinery built to withstand demanding field operations.
            </p>
            <p className="text-sm sm:text-base text-gray-600 leading-relaxed">
              From high-torque rotary tillers and multi-crop threshers to precision laser land levelers and heavy hydraulic tipping trailers, our manufacturing process prioritizes structural strength, premium alloy materials, and low operational wear.
            </p>

            <div className="p-4 bg-emerald-50 border-l-4 border-emerald-700 rounded-r-lg space-y-1">
              <h4 className="text-xs font-bold text-emerald-900 uppercase">Quality Commitment</h4>
              <p className="text-xs text-emerald-800">
                Every unit manufactured in our facility undergoes rigorous load, torque, and alignment inspections before dispatch to ensure zero field failures.
              </p>
            </div>
          </div>

          <div className="lg:col-span-6 relative aspect-4/3 rounded-2xl overflow-hidden shadow-xl border border-gray-200">
            <Image
              src="https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=1000&q=80"
              alt="Engineering Manufacturing Plant"
              fill
              className="object-cover"
            />
          </div>
        </div>

        {/* Mission, Vision & Values */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-xs space-y-3">
            <div className="w-10 h-10 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold">
              <Award className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-bold text-slate-900">Our Mission</h3>
            <p className="text-xs text-gray-600 leading-relaxed">
              To engineer and deliver durable, fuel-efficient agricultural machinery that enhances farm output while lowering maintenance expenses for operators.
            </p>
          </div>

          <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-xs space-y-3">
            <div className="w-10 h-10 rounded-lg bg-amber-100 text-amber-800 flex items-center justify-center font-bold">
              <Cpu className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-bold text-slate-900">Our Vision</h3>
            <p className="text-xs text-gray-600 leading-relaxed">
              To be the premier Indian choice for high-precision land leveling systems, rotary tillers, and heavy structural farm implements.
            </p>
          </div>

          <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-xs space-y-3">
            <div className="w-10 h-10 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-bold text-slate-900">Our Values</h3>
            <p className="text-xs text-gray-600 leading-relaxed">
              Engineering integrity, transparent customer communication, strict quality testing, and responsive after-sales spare parts support.
            </p>
          </div>
        </div>

        {/* Infrastructure & Capabilities Grid */}
        <div className="bg-slate-900 text-white rounded-2xl p-8 sm:p-12 space-y-8">
          <div className="max-w-2xl space-y-2">
            <span className="text-xs font-extrabold text-amber-400 uppercase tracking-wider">
              Factory & Technical Capabilities
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
              Manufacturing Infrastructure
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="space-y-2 bg-slate-800/80 p-5 rounded-xl border border-slate-700">
              <CheckCircle className="w-5 h-5 text-emerald-400" />
              <h4 className="font-bold text-sm text-white">CNC & Precision Machining</h4>
              <p className="text-xs text-gray-300">Precision component fitting for gearboxes and shaft splines.</p>
            </div>

            <div className="space-y-2 bg-slate-800/80 p-5 rounded-xl border border-slate-700">
              <CheckCircle className="w-5 h-5 text-emerald-400" />
              <h4 className="font-bold text-sm text-white">Boron Steel Heat Treatment</h4>
              <p className="text-xs text-gray-300">Extended blade and tyne working life in abrasive soils.</p>
            </div>

            <div className="space-y-2 bg-slate-800/80 p-5 rounded-xl border border-slate-700">
              <CheckCircle className="w-5 h-5 text-emerald-400" />
              <h4 className="font-bold text-sm text-white">Heavy Structural Welding</h4>
              <p className="text-xs text-gray-300">Reinforced ISMC channel frames for tipping trailers and plows.</p>
            </div>

            <div className="space-y-2 bg-slate-800/80 p-5 rounded-xl border border-slate-700">
              <CheckCircle className="w-5 h-5 text-emerald-400" />
              <h4 className="font-bold text-sm text-white">Automotive Paint Finishing</h4>
              <p className="text-xs text-gray-300">Anti-corrosive epoxy primer & polyurethane weather coatings.</p>
            </div>
          </div>
        </div>

        {/* Business Information Notice */}
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-6 text-xs text-amber-900 space-y-2">
          <p className="font-bold uppercase tracking-wider text-[11px]">Factory Location & Verification</p>
          <p>
            Factory Address: <span className="font-semibold">{cleanAddress}</span>
          </p>
          <p className="text-amber-800">
            * Note for buyers: Physical factory visits are welcomed during business hours (Mon-Sat, 8:30 AM - 7:00 PM). Please call ahead for custom machinery demonstrations.
          </p>
        </div>

        {/* CTA */}
        <div className="text-center space-y-4 pt-4">
          <h3 className="text-xl font-bold text-slate-900">Interested in Our Machinery Capabilities?</h3>
          <div className="flex flex-col sm:flex-row items-center justify-center space-y-3 sm:space-y-0 sm:space-x-4">
            <Link
              href="/products"
              className="px-6 py-3 text-sm font-bold text-white bg-emerald-700 hover:bg-emerald-800 rounded-lg shadow-sm"
            >
              Explore Products
            </Link>
            <Link
              href="/quote"
              className="px-6 py-3 text-sm font-bold text-slate-900 bg-amber-400 hover:bg-amber-300 rounded-lg shadow-sm"
            >
              Request a Custom Quotation
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
