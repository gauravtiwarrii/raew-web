import Image from "next/image";
import Link from "next/link";
import { ShieldCheck, Award, Factory, Cpu, Wrench, CheckCircle } from "lucide-react";
import AnimatedSection, { StaggerContainer, StaggerItem } from "@/components/AnimatedSection";
import { DEFAULT_SITE_CONFIG } from "@/lib/config";

export const metadata = {
  title: "About Us",
  description: "Learn about M/s Raj Agro Engineering Works - Our mission, engineering capabilities, quality standards, and agricultural machinery manufacturing plant.",
};

export default function AboutPage() {
  const cleanAddress = DEFAULT_SITE_CONFIG.address.split("[")[0].trim();

  return (
    <div className="pb-12">
      {/* Header Banner */}
      <section className="bg-[var(--charcoal-950)] text-white py-20 border-b border-[var(--charcoal-700)] relative overflow-hidden">
        <div className="absolute inset-0 dot-pattern opacity-20" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-4">
          <AnimatedSection variant="fadeUp" delay={0.1}>
            <div className="inline-flex items-center space-x-2 text-xs font-bold text-[var(--gold-400)] uppercase tracking-widest glass rounded-full px-5 py-2">
              <Factory className="w-4 h-4 text-[var(--gold-400)]" />
              <span>Industrial Heritage & Excellence</span>
            </div>
          </AnimatedSection>
          <AnimatedSection variant="fadeUp" delay={0.2}>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-white font-[family-name:var(--font-serif)]">
              About M/s Raj Agro Engineering Works
            </h1>
          </AnimatedSection>
          <AnimatedSection variant="fadeUp" delay={0.3}>
            <p className="text-sm sm:text-base text-gray-400 max-w-3xl leading-relaxed">
              Engineering robust agricultural machinery and specialized heavy equipment tailored for maximum productivity, fuel efficiency, and long term durability.
            </p>
          </AnimatedSection>
        </div>
      </section>

      {/* Main Story & Infrastructure */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 space-y-20">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          <AnimatedSection variant="slideLeft" className="lg:col-span-6 space-y-6">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-[var(--charcoal-900)] tracking-tight font-[family-name:var(--font-serif)]">
              Our Journey & Manufacturing Identity
            </h2>
            <p className="text-sm sm:text-base text-gray-500 leading-relaxed">
              M/s Raj Agro Engineering Works was founded with a singular commitment: to provide Indian farmers and custom agricultural contractors with heavy-duty machinery built to withstand demanding field operations.
            </p>
            <p className="text-sm sm:text-base text-gray-500 leading-relaxed">
              From high-torque rotary tillers and multi-crop threshers to precision laser land levelers and heavy hydraulic tipping trailers, our manufacturing process prioritizes structural strength, premium alloy materials, and low operational wear.
            </p>

            <div className="p-5 bg-[var(--gold-50)] border-l-4 border-[var(--gold-500)] rounded-r-xl space-y-1.5">
              <h4 className="text-xs font-bold text-[var(--gold-800)] uppercase tracking-wider">Quality Commitment</h4>
              <p className="text-xs text-[var(--gold-700)]">
                Every unit manufactured in our facility undergoes rigorous load, torque, and alignment inspections before dispatch to ensure zero field failures.
              </p>
            </div>
          </AnimatedSection>

          <AnimatedSection variant="slideRight" className="lg:col-span-6 relative">
            <div className="relative aspect-[4/3] rounded-2xl overflow-hidden shadow-2xl shadow-black/[0.1] border border-gray-200/80">
              <Image
                src="https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=1000&q=80"
                alt="Engineering Manufacturing Plant"
                fill
                className="object-cover"
              />
            </div>
            <div className="absolute -bottom-4 -right-4 w-24 h-24 rounded-2xl bg-[var(--gold-400)] opacity-10 -z-10" />
          </AnimatedSection>
        </div>

        {/* Mission, Vision & Values */}
        <StaggerContainer className="grid grid-cols-1 md:grid-cols-3 gap-8" staggerDelay={0.12}>
          {[
            { icon: Award, color: "gold", title: "Our Mission", desc: "To engineer and deliver durable, fuel-efficient agricultural machinery that enhances farm output while lowering maintenance expenses for operators." },
            { icon: Cpu, color: "forest", title: "Our Vision", desc: "To be the premier Indian choice for high-precision land leveling systems, rotary tillers, and heavy structural farm implements." },
            { icon: ShieldCheck, color: "gold", title: "Our Values", desc: "Engineering integrity, transparent customer communication, strict quality testing, and responsive after-sales spare parts support." },
          ].map((card) => (
            <StaggerItem key={card.title}>
              <div className="bg-white p-7 rounded-2xl border border-gray-200/80 shadow-sm hover:shadow-lg hover:shadow-black/[0.06] transition-all duration-300 space-y-4 card-premium h-full">
                <div className={`w-11 h-11 rounded-xl flex items-center justify-center ${
                  card.color === "gold"
                    ? "bg-[var(--gold-50)] text-[var(--gold-600)]"
                    : "bg-[var(--forest-50)] text-[var(--forest-700)]"
                }`}>
                  <card.icon className="w-5 h-5" />
                </div>
                <h3 className="text-lg font-bold text-[var(--charcoal-900)]">{card.title}</h3>
                <p className="text-sm text-gray-500 leading-relaxed">{card.desc}</p>
              </div>
            </StaggerItem>
          ))}
        </StaggerContainer>

        {/* Infrastructure & Capabilities Grid */}
        <AnimatedSection variant="fadeUp">
          <div className="bg-[var(--charcoal-900)] text-white rounded-3xl p-8 sm:p-12 space-y-10 relative overflow-hidden">
            <div className="absolute inset-0 dot-pattern opacity-15" />
            <div className="relative max-w-2xl space-y-3">
              <span className="text-xs font-extrabold text-[var(--gold-400)] uppercase tracking-widest">
                Factory & Technical Capabilities
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-white font-[family-name:var(--font-serif)]">
                Manufacturing Infrastructure
              </h2>
            </div>

            <StaggerContainer className="relative grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6" staggerDelay={0.1}>
              {[
                { title: "CNC & Precision Machining", desc: "Precision component fitting for gearboxes and shaft splines." },
                { title: "Boron Steel Heat Treatment", desc: "Extended blade and tyne working life in abrasive soils." },
                { title: "Heavy Structural Welding", desc: "Reinforced ISMC channel frames for tipping trailers and plows." },
                { title: "Automotive Paint Finishing", desc: "Anti-corrosive epoxy primer & polyurethane weather coatings." },
              ].map((item) => (
                <StaggerItem key={item.title}>
                  <div className="glass rounded-2xl p-5 space-y-3 hover:bg-white/[0.1] transition-all duration-300 h-full">
                    <CheckCircle className="w-5 h-5 text-[var(--gold-400)]" />
                    <h4 className="font-bold text-sm text-white">{item.title}</h4>
                    <p className="text-xs text-gray-400 leading-relaxed">{item.desc}</p>
                  </div>
                </StaggerItem>
              ))}
            </StaggerContainer>
          </div>
        </AnimatedSection>

        {/* Business Information Notice */}
        <AnimatedSection variant="fadeUp">
          <div className="bg-[var(--gold-50)] border border-[var(--gold-200)] rounded-2xl p-6 text-xs text-[var(--gold-800)] space-y-2">
            <p className="font-bold uppercase tracking-widest text-[11px] text-[var(--gold-700)]">Factory Location & Verification</p>
            <p>
              Factory Address: <span className="font-semibold">{cleanAddress}</span>
            </p>
            <p className="text-[var(--gold-600)]">
              * Note for buyers: Physical factory visits are welcomed during business hours (Mon-Sat, 8:30 AM - 7:00 PM). Please call ahead for custom machinery demonstrations.
            </p>
          </div>
        </AnimatedSection>

        {/* CTA */}
        <AnimatedSection variant="scaleUp">
          <div className="text-center space-y-5 pt-4">
            <h3 className="text-xl font-bold text-[var(--charcoal-900)] font-[family-name:var(--font-serif)]">Interested in Our Machinery Capabilities?</h3>
            <div className="flex flex-col sm:flex-row items-center justify-center space-y-3 sm:space-y-0 sm:space-x-4">
              <Link
                href="/products"
                className="px-7 py-3.5 text-sm font-bold text-white bg-gradient-to-r from-[var(--forest-700)] to-[var(--forest-600)] hover:from-[var(--forest-600)] hover:to-[var(--forest-500)] rounded-xl shadow-md transition-all duration-200"
              >
                Explore Products
              </Link>
              <Link
                href="/quote"
                className="px-7 py-3.5 text-sm font-bold text-[var(--charcoal-900)] bg-gradient-to-r from-[var(--gold-400)] to-[var(--gold-500)] hover:from-[var(--gold-300)] hover:to-[var(--gold-400)] rounded-xl shadow-md transition-all duration-200"
              >
                Request a Custom Quotation
              </Link>
            </div>
          </div>
        </AnimatedSection>
      </section>
    </div>
  );
}
