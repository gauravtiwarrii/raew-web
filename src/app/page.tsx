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
import AnimatedSection, { StaggerContainer, StaggerItem } from "@/components/AnimatedSection";
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
    <div className="pb-12">
      {/* ═══════════════════════════════════════════════════
          1. HERO SECTION — Premium with decorative elements
         ═══════════════════════════════════════════════════ */}
      <section className="relative bg-[var(--charcoal-950)] text-white overflow-hidden py-20 md:py-32 border-b border-[var(--charcoal-700)]">
        {/* Background image */}
        <div className="absolute inset-0 z-0 opacity-30">
          <Image
            src="https://images.unsplash.com/photo-1595974482597-4b8da8879bc5?auto=format&fit=crop&w=1920&q=80"
            alt="Agricultural Engineering Machinery background"
            fill
            priority
            className="object-cover object-center"
          />
        </div>
        {/* Multi-layered gradient overlay */}
        <div className="absolute inset-0 z-[1] bg-gradient-to-br from-[var(--charcoal-950)] via-[var(--charcoal-950)]/90 to-[var(--forest-900)]/60" />
        {/* Decorative dot pattern */}
        <div className="absolute inset-0 z-[2] dot-pattern opacity-30" />
        {/* Decorative floating gear shape */}
        <div className="absolute top-20 right-[10%] z-[2] w-64 h-64 rounded-full border border-[var(--gold-500)]/10 animate-spin-slow hidden lg:block" />
        <div className="absolute bottom-10 right-[15%] z-[2] w-40 h-40 rounded-full border border-[var(--forest-600)]/10 animate-spin-slow hidden lg:block" style={{ animationDirection: "reverse" }} />

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl space-y-8">
            <AnimatedSection variant="fadeUp" delay={0.1}>
              <div className="inline-flex items-center space-x-2 glass rounded-full px-5 py-2 text-xs font-bold text-[var(--gold-300)]">
                <Factory className="w-4 h-4 text-[var(--gold-400)]" />
                <span className="tracking-wider uppercase">Indian Industrial Machinery Manufacturer</span>
              </div>
            </AnimatedSection>

            <AnimatedSection variant="fadeUp" delay={0.25}>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-[1.1] font-[family-name:var(--font-serif)]">
                Engineering Solutions for{" "}
                <span className="text-gradient-gold">
                  Modern Agriculture
                </span>
              </h1>
            </AnimatedSection>

            <AnimatedSection variant="fadeUp" delay={0.4}>
              <p className="text-base sm:text-lg text-gray-300 leading-relaxed font-medium max-w-2xl">
                Reliable agricultural machinery and custom engineering solutions built around performance, field endurance, and customer requirements. Designed and manufactured for rugged Indian farming conditions.
              </p>
            </AnimatedSection>

            <AnimatedSection variant="fadeUp" delay={0.55}>
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center space-y-3 sm:space-y-0 sm:space-x-4 pt-2">
                <Link
                  href="/products"
                  className="inline-flex items-center justify-center px-7 py-4 text-sm font-bold text-[var(--charcoal-900)] bg-gradient-to-r from-[var(--gold-400)] to-[var(--gold-500)] hover:from-[var(--gold-300)] hover:to-[var(--gold-400)] rounded-xl shadow-lg shadow-[var(--gold-500)]/20 transition-all duration-200 transform hover:-translate-y-0.5"
                >
                  <span>Explore Machinery Catalog</span>
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Link>

                <Link
                  href="/quote"
                  className="inline-flex items-center justify-center px-7 py-4 text-sm font-bold text-[var(--gold-300)] glass rounded-xl hover:bg-white/[0.12] transition-all duration-200"
                >
                  <span>Request a Quotation</span>
                </Link>
              </div>
            </AnimatedSection>

            {/* Quick Metrics */}
            <AnimatedSection variant="fadeUp" delay={0.7}>
              <div className="pt-8 grid grid-cols-2 sm:grid-cols-3 gap-4 border-t border-white/10 text-xs">
                <div className="flex items-center space-x-2">
                  <CheckCircle2 className="w-4 h-4 text-[var(--gold-400)]" />
                  <span className="text-gray-300">Boron Steel Blades</span>
                </div>
                <div className="flex items-center space-x-2">
                  <CheckCircle2 className="w-4 h-4 text-[var(--gold-400)]" />
                  <span className="text-gray-300">Heavy Duty Gearboxes</span>
                </div>
                <div className="flex items-center space-x-2 col-span-2 sm:col-span-1">
                  <CheckCircle2 className="w-4 h-4 text-[var(--forest-400)]" />
                  <span className="text-gray-300">Custom Engineering</span>
                </div>
              </div>
            </AnimatedSection>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════
          2. COMPANY INTRODUCTION
         ═══════════════════════════════════════════════════ */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-28">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          <AnimatedSection variant="slideLeft" className="lg:col-span-6 space-y-6">
            <div className="inline-flex items-center space-x-2 text-xs font-extrabold text-[var(--gold-700)] uppercase tracking-wider bg-[var(--gold-50)] px-4 py-2 rounded-lg border border-[var(--gold-200)]">
              <Award className="w-4 h-4 text-[var(--gold-600)]" />
              <span>About M/s Raj Agro Engineering Works</span>
            </div>

            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-[var(--charcoal-900)] tracking-tight leading-tight font-[family-name:var(--font-serif)]">
              Dedicated to Practical Machinery & Built-to-Last Craftsmanship
            </h2>

            <p className="text-gray-500 leading-relaxed text-sm sm:text-base">
              M/s Raj Agro Engineering Works is a recognized manufacturing name dedicated to producing high-end farm machinery and heavy engineering equipment. Our equipment is engineered with heavy-duty structural steel channel chassis, heat-treated components, and precision gear transmissions.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 text-sm font-semibold text-[var(--charcoal-800)]">
              {[
                { icon: ShieldCheck, text: "Heavy Duty Structural Steel Construction" },
                { icon: Wrench, text: "Custom Machine Fabrication Capabilities" },
                { icon: Cpu, text: "Precision Laser Guided Leveling Systems" },
                { icon: Users, text: "Customer-First After-Sales Support" },
              ].map((item) => (
                <div key={item.text} className="flex items-start space-x-3 group">
                  <div className="w-8 h-8 rounded-lg bg-[var(--gold-50)] flex items-center justify-center shrink-0 group-hover:bg-[var(--gold-100)] transition-colors duration-200">
                    <item.icon className="w-4 h-4 text-[var(--gold-600)]" />
                  </div>
                  <span className="pt-1">{item.text}</span>
                </div>
              ))}
            </div>

            <div className="pt-2">
              <Link
                href="/about"
                className="inline-flex items-center text-sm font-bold text-[var(--gold-700)] hover:text-[var(--gold-600)] transition-colors duration-200 group"
              >
                <span className="underline underline-offset-4 decoration-[var(--gold-300)] group-hover:decoration-[var(--gold-500)] transition-colors duration-200">Read Full Company Story & Capabilities</span>
                <ChevronRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform duration-200" />
              </Link>
            </div>
          </AnimatedSection>

          <AnimatedSection variant="slideRight" className="lg:col-span-6 relative">
            <div className="relative aspect-[4/3] rounded-2xl overflow-hidden shadow-2xl shadow-black/[0.1] border border-gray-200/80">
              <Image
                src="https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=1000&q=80"
                alt="Engineering Plant Fabrication Workshop"
                fill
                className="object-cover"
              />
              <div className="absolute bottom-0 left-0 right-0 p-5 bg-gradient-to-t from-[var(--charcoal-950)] via-[var(--charcoal-950)]/80 to-transparent">
                <p className="text-[10px] font-bold text-[var(--gold-400)] uppercase tracking-widest">Manufacturing Standards</p>
                <p className="text-sm font-medium text-gray-200 mt-1 leading-relaxed">
                  Rigorous multi-point quality inspections conducted on every piece of equipment prior to delivery.
                </p>
              </div>
            </div>
            {/* Decorative accent */}
            <div className="absolute -bottom-4 -right-4 w-24 h-24 rounded-2xl bg-[var(--gold-400)] opacity-10 -z-10" />
            <div className="absolute -top-4 -left-4 w-16 h-16 rounded-xl bg-[var(--forest-600)] opacity-10 -z-10" />
          </AnimatedSection>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════
          3. PRODUCT CATEGORIES
         ═══════════════════════════════════════════════════ */}
      <section className="bg-[var(--charcoal-900)] text-white py-20 md:py-28 relative overflow-hidden">
        <div className="absolute inset-0 dot-pattern opacity-20" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <AnimatedSection variant="fadeUp">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
              <div>
                <span className="text-xs font-extrabold text-[var(--gold-400)] uppercase tracking-widest">
                  Machinery Spectrum
                </span>
                <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-white tracking-tight mt-2 font-[family-name:var(--font-serif)]">
                  Product Categories
                </h2>
              </div>
              <Link
                href="/categories"
                className="inline-flex items-center text-xs font-bold text-[var(--gold-400)] hover:text-[var(--gold-300)] uppercase tracking-wider transition-colors duration-200 group"
              >
                <span>View All Categories</span>
                <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform duration-200" />
              </Link>
            </div>
          </AnimatedSection>

          <StaggerContainer className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6" staggerDelay={0.1}>
            {categories.map((cat) => (
              <StaggerItem key={cat.id}>
                <Link
                  href={`/products?category=${cat.slug}`}
                  className="group relative rounded-2xl overflow-hidden bg-[var(--charcoal-800)] border border-[var(--charcoal-600)] h-72 flex flex-col justify-end p-6 hover:border-[var(--gold-500)]/50 transition-all duration-300 shadow-lg hover:shadow-xl hover:shadow-[var(--gold-900)]/20"
                >
                  {cat.image && (
                    <Image
                      src={cat.image}
                      alt={cat.name}
                      fill
                      className="object-cover group-hover:scale-110 transition-transform duration-500 opacity-35 group-hover:opacity-45"
                    />
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-[var(--charcoal-950)] via-[var(--charcoal-950)]/60 to-transparent" />

                  <div className="relative z-10 space-y-2">
                    <h3 className="font-extrabold text-lg text-white group-hover:text-[var(--gold-400)] transition-colors duration-200">
                      {cat.name}
                    </h3>
                    <p className="text-xs text-gray-400 line-clamp-2 leading-relaxed">
                      {cat.description}
                    </p>
                    <div className="pt-2 inline-flex items-center text-xs font-bold text-[var(--gold-400)] group-hover:text-[var(--gold-300)]">
                      <span>Browse Equipment</span>
                      <ArrowRight className="w-3.5 h-3.5 ml-1 group-hover:translate-x-1 transition-transform duration-200" />
                    </div>
                  </div>
                </Link>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════
          4. FEATURED PRODUCTS SHOWCASE
         ═══════════════════════════════════════════════════ */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-28 space-y-12">
        <AnimatedSection variant="fadeUp">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <span className="text-xs font-extrabold text-[var(--gold-700)] uppercase tracking-widest">
                Flagship Equipment
              </span>
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-[var(--charcoal-900)] tracking-tight mt-2 font-[family-name:var(--font-serif)]">
                Featured Agricultural Machinery
              </h2>
            </div>
            <Link
              href="/products"
              className="inline-flex items-center justify-center px-5 py-2.5 text-xs font-bold text-[var(--gold-800)] bg-[var(--gold-50)] hover:bg-[var(--gold-100)] rounded-xl transition-colors duration-200 border border-[var(--gold-200)]"
            >
              <span>View Complete Catalog ({featuredProducts.length}+)</span>
              <ArrowRight className="w-4 h-4 ml-1.5" />
            </Link>
          </div>
        </AnimatedSection>

        <StaggerContainer className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8" staggerDelay={0.12}>
          {featuredProducts.map((product) => (
            <StaggerItem key={product.id}>
              <ProductCard
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
            </StaggerItem>
          ))}
        </StaggerContainer>
      </section>

      {/* ═══════════════════════════════════════════════════
          5. ENGINEERING CAPABILITIES & WHY CHOOSE US
         ═══════════════════════════════════════════════════ */}
      <section className="bg-gradient-to-br from-[var(--forest-900)] via-[var(--charcoal-950)] to-[var(--forest-900)] text-white py-20 md:py-28 relative overflow-hidden">
        <div className="absolute inset-0 dot-pattern opacity-15" />
        {/* Decorative glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[var(--gold-500)] opacity-[0.03] blur-[120px] rounded-full" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-14">
          <AnimatedSection variant="fadeUp">
            <div className="text-center max-w-2xl mx-auto space-y-4">
              <span className="text-xs font-extrabold text-[var(--gold-400)] uppercase tracking-widest">
                Engineering Excellence
              </span>
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-white font-[family-name:var(--font-serif)]">
                Why Choose Raj Agro Engineering Works?
              </h2>
              <p className="text-sm text-gray-400 leading-relaxed">
                We design and construct machinery with emphasis on durability, low field downtime, and long term ROI for farmers and contracting businesses.
              </p>
            </div>
          </AnimatedSection>

          <StaggerContainer className="grid grid-cols-1 md:grid-cols-3 gap-8" staggerDelay={0.15}>
            {[
              {
                icon: Wrench,
                title: "Heavy Duty Boron Steel Builds",
                desc: "Critical wear parts like rotary tiller blades, disc harrow plates, and land leveler edges are crafted from heat-treated boron steel for maximum resistance against abrasion.",
              },
              {
                icon: Zap,
                title: "High Efficiency Power Transfer",
                desc: "Multi-speed gearboxes and gear transmissions minimize power loss from tractor PTO, saving up to 15-20% fuel consumption during heavy tilling operations.",
              },
              {
                icon: Tractor,
                title: "Custom Machine Modification",
                desc: "Ability to fabricate custom implements, chassis dimensions, tipping trailer tonnage capacities, and specialized agricultural attachments according to client specifications.",
              },
            ].map((card) => (
              <StaggerItem key={card.title}>
                <div className="glass rounded-2xl p-7 space-y-4 hover:bg-white/[0.1] transition-all duration-300 group h-full">
                  <div className="w-12 h-12 rounded-xl bg-[var(--gold-500)]/15 text-[var(--gold-400)] flex items-center justify-center group-hover:bg-[var(--gold-500)]/25 transition-colors duration-300">
                    <card.icon className="w-6 h-6" />
                  </div>
                  <h3 className="font-bold text-lg text-white">{card.title}</h3>
                  <p className="text-sm text-gray-400 leading-relaxed">
                    {card.desc}
                  </p>
                </div>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════
          6. INDUSTRIES & APPLICATIONS SERVED
         ═══════════════════════════════════════════════════ */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-28 space-y-10">
        <AnimatedSection variant="fadeUp">
          <div className="text-center max-w-2xl mx-auto space-y-3">
            <span className="text-xs font-extrabold text-[var(--gold-700)] uppercase tracking-widest">
              Field Applications
            </span>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-[var(--charcoal-900)] font-[family-name:var(--font-serif)]">
              Industries & Applications Served
            </h2>
          </div>
        </AnimatedSection>

        <StaggerContainer className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 text-center" staggerDelay={0.08}>
          {[
            { title: "Paddy & Wheat", desc: "Seedbed & Threshing" },
            { title: "Sugarcane", desc: "Heavy Stubble Tillage" },
            { title: "Land Leveling", desc: "Laser Grade Systems" },
            { title: "Commercial Haulage", desc: "Hydraulic Tipping" },
            { title: "Custom Fabrication", desc: "Industrial Chassis" },
            { title: "Custom Contracting", desc: "High Output Machines" },
          ].map((app) => (
            <StaggerItem key={app.title}>
              <div className="bg-white p-5 rounded-2xl border border-gray-200/80 shadow-sm space-y-1.5 hover:border-[var(--gold-400)] hover:shadow-md hover:shadow-[var(--gold-500)]/10 transition-all duration-300 group card-premium">
                <h3 className="font-bold text-sm text-[var(--charcoal-900)] group-hover:text-[var(--gold-700)] transition-colors duration-200">{app.title}</h3>
                <p className="text-[11px] text-gray-400">{app.desc}</p>
              </div>
            </StaggerItem>
          ))}
        </StaggerContainer>
      </section>

      {/* ═══════════════════════════════════════════════════
          7. CUSTOMER ENQUIRY & CTA BANNER
         ═══════════════════════════════════════════════════ */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <AnimatedSection variant="scaleUp">
          <div className="bg-gradient-to-br from-[var(--charcoal-900)] via-[var(--charcoal-950)] to-[var(--forest-900)] text-white rounded-3xl p-8 sm:p-12 shadow-2xl border border-[var(--charcoal-700)] flex flex-col md:flex-row items-center justify-between gap-8 relative overflow-hidden">
            <div className="absolute inset-0 dot-pattern opacity-10" />
            {/* Glow accent */}
            <div className="absolute top-0 right-0 w-80 h-80 bg-[var(--gold-500)] opacity-[0.06] blur-[100px] rounded-full" />

            <div className="relative space-y-3 text-center md:text-left">
              <span className="inline-block shimmer-badge text-[var(--charcoal-900)] font-extrabold text-[10px] uppercase px-4 py-1.5 rounded-full">
                Direct Manufacturer Pricing
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-white font-[family-name:var(--font-serif)]">
                Need a Custom Machine or Formal Quotation?
              </h2>
              <p className="text-sm text-gray-400 max-w-xl">
                Get in touch with our engineering team for machine specifications, pricing details, and custom order timelines.
              </p>
            </div>

            <div className="relative flex flex-col sm:flex-row items-center space-y-3 sm:space-y-0 sm:space-x-4 w-full md:w-auto">
              <Link
                href="/quote"
                className="w-full sm:w-auto text-center px-7 py-4 text-sm font-bold text-[var(--charcoal-900)] bg-gradient-to-r from-[var(--gold-400)] to-[var(--gold-500)] hover:from-[var(--gold-300)] hover:to-[var(--gold-400)] rounded-xl shadow-lg shadow-[var(--gold-500)]/20 transition-all duration-200"
              >
                Request Quote
              </Link>
              <a
                href={waUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto text-center px-7 py-4 text-sm font-bold text-white glass rounded-xl hover:bg-white/[0.12] transition-all duration-200 flex items-center justify-center space-x-2"
              >
                <MessageSquare className="w-4 h-4 fill-white" />
                <span>WhatsApp Chat</span>
              </a>
            </div>
          </div>
        </AnimatedSection>
      </section>

      {/* ═══════════════════════════════════════════════════
          8. LOCATION & CONTACT PREVIEW
         ═══════════════════════════════════════════════════ */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <AnimatedSection variant="fadeUp">
          <div className="bg-white rounded-3xl border border-gray-200/80 p-8 shadow-lg shadow-black/[0.03] grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="space-y-5">
              <span className="text-xs font-extrabold text-[var(--gold-700)] uppercase tracking-widest">
                Visit Our Factory
              </span>
              <h2 className="text-xl font-extrabold text-[var(--charcoal-900)] font-[family-name:var(--font-serif)]">
                M/s Raj Agro Engineering Works
              </h2>
              <div className="space-y-3 text-xs text-gray-500">
                <div className="flex items-start space-x-3">
                  <div className="w-7 h-7 rounded-lg bg-[var(--gold-50)] flex items-center justify-center shrink-0">
                    <MapPin className="w-3.5 h-3.5 text-[var(--gold-600)]" />
                  </div>
                  <span className="pt-1">{cleanAddress}</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-7 h-7 rounded-lg bg-[var(--gold-50)] flex items-center justify-center shrink-0">
                    <Phone className="w-3.5 h-3.5 text-[var(--gold-600)]" />
                  </div>
                  <span>{cleanPhone}</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-7 h-7 rounded-lg bg-[var(--gold-50)] flex items-center justify-center shrink-0">
                    <Mail className="w-3.5 h-3.5 text-[var(--gold-600)]" />
                  </div>
                  <span>{cleanEmail}</span>
                </div>
              </div>
              <div className="pt-2">
                <Link
                  href="/contact"
                  className="inline-flex items-center text-xs font-bold text-[var(--gold-700)] hover:text-[var(--gold-600)] transition-colors duration-200 group"
                >
                  <span>View Complete Contact Page & Map</span>
                  <ChevronRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform duration-200" />
                </Link>
              </div>
            </div>

            <div className="lg:col-span-2 relative min-h-[220px] rounded-2xl overflow-hidden bg-gray-50 border border-gray-200">
              <iframe
                title="Factory Location Map"
                src="https://www.google.com/maps?q=Madawa+Newada%2C+Post-Rehi%2C+Mirzapur%2C+Uttar+Pradesh%2C+India+231211&output=embed"
                className="w-full h-full min-h-[260px] border-0"
                loading="lazy"
              />
            </div>
          </div>
        </AnimatedSection>
      </section>
    </div>
  );
}
