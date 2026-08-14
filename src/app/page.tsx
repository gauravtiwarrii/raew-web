import Link from "next/link";
import Image from "next/image";
import {
  Wrench,
  ShieldCheck,
  Award,
  Users,
  ArrowRight,
  CheckCircle2,
  Cpu,
  Zap,
  MapPin,
  Phone,
  Mail,
  MessageSquare,
  ChevronRight,
  Factory,
  Tractor,
} from "lucide-react";
import { prisma } from "@/lib/db";
import ProductCard from "@/components/ProductCard";
import { DEFAULT_SITE_CONFIG } from "@/lib/config";
import { getWhatsAppLink } from "@/lib/whatsapp";

export const revalidate = 60; // ISR 60s

async function getHomePageData() {
  try {
    const featuredProducts = await prisma.product.findMany({
      where: { active: true, featured: true },
      include: { category: true },
      take: 6,
    });

    const categories = await prisma.category.findMany({
      where: { active: true },
      orderBy: { sortOrder: "asc" },
      take: 4,
    });

    return { featuredProducts, categories };
  } catch (error) {
    console.error("Home page data fetch error:", error);
    return { featuredProducts: [], categories: [] };
  }
}

export default async function HomePage() {
  const { featuredProducts, categories } = await getHomePageData();
  const waUrl = getWhatsAppLink();

  const cleanPhone = DEFAULT_SITE_CONFIG.phonePrimary.split("[")[0].trim();
  const cleanEmail = DEFAULT_SITE_CONFIG.emailPrimary.split("[")[0].trim();
  const cleanAddress = DEFAULT_SITE_CONFIG.address.split("[")[0].trim();

  return (
    <div className="space-y-16 md:space-y-24 pb-12">
      {/* 1. HERO SECTION */}
      <section className="relative bg-slate-950 text-white overflow-hidden py-16 md:py-24 border-b border-slate-800">
        <div className="absolute inset-0 z-0 opacity-35">
          <Image
            src="https://images.unsplash.com/photo-1595974482597-4b8da8879bc5?auto=format&fit=crop&w=1920&q=80"
            alt="Agricultural Engineering Machinery background"
            fill
            priority
            className="object-cover object-center filter brightness-75"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-950/90 to-emerald-950/70" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl space-y-6">
            <div className="inline-flex items-center space-x-2 bg-emerald-950/80 border border-emerald-700/60 rounded-full px-4 py-1.5 text-xs font-bold text-emerald-300">
              <Factory className="w-4 h-4 text-amber-400" />
              <span>INDIAN INDUSTRIAL MACHINERY MANUFACTURER</span>
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-white leading-tight">
              Engineering Solutions for <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-amber-400">
                Modern Agriculture
              </span>
            </h1>

            <p className="text-base sm:text-lg text-gray-300 leading-relaxed font-medium">
              Reliable agricultural machinery and custom engineering solutions built around performance, field endurance, and customer requirements. Designed and manufactured for rugged Indian farming conditions.
            </p>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center space-y-3 sm:space-y-0 sm:space-x-4 pt-4">
              <Link
                href="/products"
                className="inline-flex items-center justify-center px-6 py-3.5 text-sm font-bold text-white bg-emerald-700 hover:bg-emerald-600 rounded-lg shadow-lg hover:shadow-emerald-900/30 transition-all transform hover:-translate-y-0.5"
              >
                <span>Explore Machinery Catalog</span>
                <ArrowRight className="w-4 h-4 ml-2" />
              </Link>

              <Link
                href="/quote"
                className="inline-flex items-center justify-center px-6 py-3.5 text-sm font-bold text-amber-300 bg-slate-900 border border-amber-500/50 hover:bg-amber-500/10 rounded-lg transition-all"
              >
                <span>Request a Quotation</span>
              </Link>
            </div>

            {/* Quick Metrics */}
            <div className="pt-8 grid grid-cols-2 sm:grid-cols-3 gap-4 border-t border-slate-800 text-xs">
              <div className="flex items-center space-x-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span className="text-gray-300">Boron Steel Blades</span>
              </div>
              <div className="flex items-center space-x-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span className="text-gray-300">Heavy Duty Gearboxes</span>
              </div>
              <div className="flex items-center space-x-2 col-span-2 sm:col-span-1">
                <CheckCircle2 className="w-4 h-4 text-amber-400" />
                <span className="text-gray-300">Custom Engineering</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. COMPANY INTRODUCTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-6 space-y-6">
            <div className="inline-flex items-center space-x-2 text-xs font-extrabold text-emerald-800 uppercase tracking-wider bg-emerald-50 px-3 py-1 rounded-md border border-emerald-200">
              <Award className="w-4 h-4 text-emerald-700" />
              <span>About M/s Raj Agro Engineering Works</span>
            </div>

            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Dedicated to Practical Machinery & Built-to-Last Craftsmanship
            </h2>

            <p className="text-gray-600 leading-relaxed text-sm sm:text-base">
              M/s Raj Agro Engineering Works is a recognized manufacturing name dedicated to producing high-end farm machinery and heavy engineering equipment. Our equipment is engineered with heavy-duty structural steel channel chassis, heat-treated components, and precision gear transmissions.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 text-sm font-semibold text-slate-800">
              <div className="flex items-start space-x-3">
                <ShieldCheck className="w-5 h-5 text-emerald-700 mt-0.5 shrink-0" />
                <span>Heavy Duty Structural Steel Construction</span>
              </div>
              <div className="flex items-start space-x-3">
                <Wrench className="w-5 h-5 text-emerald-700 mt-0.5 shrink-0" />
                <span>Custom Machine Fabrication Capabilities</span>
              </div>
              <div className="flex items-start space-x-3">
                <Cpu className="w-5 h-5 text-emerald-700 mt-0.5 shrink-0" />
                <span>Precision Laser Guided Leveling Systems</span>
              </div>
              <div className="flex items-start space-x-3">
                <Users className="w-5 h-5 text-emerald-700 mt-0.5 shrink-0" />
                <span>Customer-First After-Sales Support</span>
              </div>
            </div>

            <div className="pt-2">
              <Link
                href="/about"
                className="inline-flex items-center text-sm font-bold text-emerald-800 hover:text-emerald-900 underline underline-offset-4"
              >
                <span>Read Full Company Story & Capabilities</span>
                <ChevronRight className="w-4 h-4 ml-1" />
              </Link>
            </div>
          </div>

          <div className="lg:col-span-6 relative aspect-4/3 rounded-2xl overflow-hidden shadow-xl border border-gray-200">
            <Image
              src="https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=1000&q=80"
              alt="Engineering Plant Fabrication Workshop"
              fill
              className="object-cover"
            />
            <div className="absolute bottom-4 left-4 right-4 bg-slate-950/90 text-white p-4 rounded-xl backdrop-blur-md border border-slate-800">
              <p className="text-xs font-bold text-amber-400 uppercase tracking-wider">Manufacturing Standards</p>
              <p className="text-sm font-medium text-gray-200 mt-1">
                Rigorous multi-point quality inspections conducted on every piece of equipment prior to delivery.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 3. PRODUCT CATEGORIES */}
      <section className="bg-slate-900 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <span className="text-xs font-extrabold text-amber-400 uppercase tracking-wider">
                Machinery Spectrum
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight mt-1">
                Product Categories
              </h2>
            </div>
            <Link
              href="/categories"
              className="inline-flex items-center text-xs font-bold text-emerald-400 hover:text-emerald-300 uppercase tracking-wider"
            >
              <span>View All Categories</span>
              <ArrowRight className="w-4 h-4 ml-1" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {categories.map((cat) => (
              <Link
                key={cat.id}
                href={`/products?category=${cat.slug}`}
                className="group relative rounded-xl overflow-hidden bg-slate-800 border border-slate-700 h-64 flex flex-col justify-end p-6 hover:border-emerald-500 transition-all shadow-md"
              >
                {cat.image && (
                  <Image
                    src={cat.image}
                    alt={cat.name}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300 opacity-40"
                  />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/60 to-transparent" />

                <div className="relative z-10 space-y-2">
                  <h3 className="font-extrabold text-lg text-white group-hover:text-amber-400 transition-colors">
                    {cat.name}
                  </h3>
                  <p className="text-xs text-gray-300 line-clamp-2 leading-relaxed">
                    {cat.description}
                  </p>
                  <div className="pt-2 inline-flex items-center text-xs font-bold text-emerald-400">
                    <span>Browse Equipment</span>
                    <ArrowRight className="w-3.5 h-3.5 ml-1" />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* 4. FEATURED PRODUCTS SHOWCASE */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <span className="text-xs font-extrabold text-emerald-800 uppercase tracking-wider">
              Flagship Equipment
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight mt-1">
              Featured Agricultural Machinery
            </h2>
          </div>
          <Link
            href="/products"
            className="inline-flex items-center justify-center px-4 py-2 text-xs font-bold text-emerald-900 bg-emerald-100 hover:bg-emerald-200 rounded-lg transition-colors"
          >
            <span>View Complete Catalog ({featuredProducts.length}+)</span>
            <ArrowRight className="w-4 h-4 ml-1.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {featuredProducts.map((product) => (
            <ProductCard
              key={product.id}
              id={product.id}
              name={product.name}
              slug={product.slug}
              categoryName={product.category.name}
              shortDescription={product.shortDescription}
              image={product.image}
              priceDisplay={product.priceDisplay}
              availability={product.availability}
              featured={product.featured}
            />
          ))}
        </div>
      </section>

      {/* 5. ENGINEERING CAPABILITIES & WHY CHOOSE US */}
      <section className="bg-emerald-950 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="text-center max-w-2xl mx-auto space-y-3">
            <span className="text-xs font-extrabold text-amber-400 uppercase tracking-wider">
              Engineering Excellence
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
              Why Choose Raj Agro Engineering Works?
            </h2>
            <p className="text-xs sm:text-sm text-emerald-200 leading-relaxed">
              We design and construct machinery with emphasis on durability, low field downtime, and long term ROI for farmers and contracting businesses.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-slate-900/80 p-6 rounded-xl border border-emerald-800/50 space-y-3">
              <div className="w-10 h-10 rounded-lg bg-emerald-900 text-amber-400 flex items-center justify-center font-bold">
                <Wrench className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-lg text-white">Heavy Duty Boron Steel Builds</h3>
              <p className="text-xs text-gray-300 leading-relaxed">
                Critical wear parts like rotary tiller blades, disc harrow plates, and land leveler edges are crafted from heat-treated boron steel for maximum resistance against abrasion.
              </p>
            </div>

            <div className="bg-slate-900/80 p-6 rounded-xl border border-emerald-800/50 space-y-3">
              <div className="w-10 h-10 rounded-lg bg-emerald-900 text-amber-400 flex items-center justify-center font-bold">
                <Zap className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-lg text-white">High Efficiency Power Transfer</h3>
              <p className="text-xs text-gray-300 leading-relaxed">
                Multi-speed gearboxes and gear transmissions minimize power loss from tractor PTO, saving up to 15-20% fuel consumption during heavy tilling operations.
              </p>
            </div>

            <div className="bg-slate-900/80 p-6 rounded-xl border border-emerald-800/50 space-y-3">
              <div className="w-10 h-10 rounded-lg bg-emerald-900 text-amber-400 flex items-center justify-center font-bold">
                <Tractor className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-lg text-white">Custom Machine Modification</h3>
              <p className="text-xs text-gray-300 leading-relaxed">
                Ability to fabricate custom implements, chassis dimensions, tipping trailer tonnage capacities, and specialized agricultural attachments according to client specifications.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 6. INDUSTRIES & APPLICATIONS SERVED */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <span className="text-xs font-extrabold text-emerald-800 uppercase tracking-wider">
            Field Applications
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
            Industries & Applications Served
          </h2>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 text-center">
          {[
            { title: "Paddy & Wheat", desc: "Seedbed & Threshing" },
            { title: "Sugarcane", desc: "Heavy Stubble Tillage" },
            { title: "Land Leveling", desc: "Laser Grade Systems" },
            { title: "Commercial Haulage", desc: "Hydraulic Tipping" },
            { title: "Custom Fabrication", desc: "Industrial Chassis" },
            { title: "Custom Contracting", desc: "High Output Machines" },
          ].map((app, idx) => (
            <div
              key={idx}
              className="bg-white p-4 rounded-xl border border-gray-200 shadow-xs space-y-1 hover:border-emerald-500 transition-colors"
            >
              <h3 className="font-bold text-sm text-slate-900">{app.title}</h3>
              <p className="text-[11px] text-gray-500">{app.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* 7. CUSTOMER ENQUIRY & WHATSAPP CTA BANNER */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-r from-slate-900 to-emerald-950 text-white rounded-2xl p-8 sm:p-12 shadow-xl border border-slate-800 flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="space-y-3 text-center md:text-left">
            <span className="inline-block bg-amber-500 text-slate-950 font-extrabold text-[10px] uppercase px-3 py-1 rounded-full">
              Direct Manufacturer Pricing
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
              Need a Custom Machine or Formal Quotation?
            </h2>
            <p className="text-xs sm:text-sm text-gray-300 max-w-xl">
              Get in touch with our engineering team for machine specifications, pricing details, and custom order timelines.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center space-y-3 sm:space-y-0 sm:space-x-4 w-full md:w-auto">
            <Link
              href="/quote"
              className="w-full sm:w-auto text-center px-6 py-3.5 text-sm font-bold text-slate-950 bg-amber-400 hover:bg-amber-300 rounded-lg shadow-md transition-all"
            >
              Request Quote
            </Link>
            <a
              href={waUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto text-center px-6 py-3.5 text-sm font-bold text-white bg-emerald-700 hover:bg-emerald-600 rounded-lg border border-emerald-500/50 transition-all flex items-center justify-center space-x-2"
            >
              <MessageSquare className="w-4 h-4 fill-white" />
              <span>WhatsApp Chat</span>
            </a>
          </div>
        </div>
      </section>

      {/* 8. LOCATION & CONTACT PREVIEW */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-2xl border border-gray-200 p-8 shadow-xs grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="space-y-4">
            <span className="text-xs font-extrabold text-emerald-800 uppercase tracking-wider">
              Visit Our Factory
            </span>
            <h2 className="text-xl font-extrabold text-slate-900">
              M/s Raj Agro Engineering Works
            </h2>
            <div className="space-y-3 text-xs text-gray-600">
              <div className="flex items-start space-x-3">
                <MapPin className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
                <span>{cleanAddress}</span>
              </div>
              <div className="flex items-center space-x-3">
                <Phone className="w-4 h-4 text-emerald-700 shrink-0" />
                <span>{cleanPhone}</span>
              </div>
              <div className="flex items-center space-x-3">
                <Mail className="w-4 h-4 text-emerald-700 shrink-0" />
                <span>{cleanEmail}</span>
              </div>
            </div>
            <div className="pt-2">
              <Link
                href="/contact"
                className="inline-flex items-center text-xs font-bold text-emerald-800 hover:underline"
              >
                <span>View Complete Contact Page & Map</span>
                <ChevronRight className="w-4 h-4 ml-1" />
              </Link>
            </div>
          </div>

          <div className="lg:col-span-2 relative min-h-[220px] rounded-xl overflow-hidden bg-gray-100 border border-gray-200 flex items-center justify-center text-gray-500 text-xs">
            <iframe
              title="Factory Location Map"
              src="https://www.google.com/maps?q=Madawa+Newada%2C+Post-Rehi%2C+Mirzapur%2C+Uttar+Pradesh%2C+India+231211&output=embed"
              className="w-full h-full min-h-[240px] border-0"
              loading="lazy"
            />
          </div>
        </div>
      </section>
    </div>
  );
}
