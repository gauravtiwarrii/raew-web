import Link from "next/link";
import { Wrench, Shield, Cog, RefreshCw, Truck, ChevronRight } from "lucide-react";
import AnimatedSection, { StaggerContainer, StaggerItem } from "@/components/AnimatedSection";
import { getWhatsAppLink } from "@/lib/whatsapp";

export const metadata = {
  title: "Engineering Services & Support",
  description: "Machinery repair, custom fabrication, maintenance, boron steel replacement parts, and agricultural equipment engineering support.",
};

const services = [
  {
    icon: Cog,
    color: "gold",
    title: "Custom Equipment Manufacturing",
    desc: "Tailor-made manufacturing of agricultural implements designed around specific soil types, tractor horsepower ratings, and field row dimensions.",
  },
  {
    icon: Wrench,
    color: "forest",
    title: "Custom Metal Fabrication",
    desc: "Heavy structural welding, channel chassis construction for tipping trailers, boom sprayer mounts, and specialized industrial frames.",
  },
  {
    icon: RefreshCw,
    color: "gold",
    title: "Machinery Repair & Overhaul",
    desc: "Complete refurbishment of rotary tillers, multi-speed gearboxes, thresher drums, laser leveler hydraulic valves, and tractor trailer axles.",
  },
  {
    icon: Shield,
    color: "forest",
    title: "Genuine Spare Parts",
    desc: "Supply of high-carbon boron steel rotavator blades, heavy bevel gears, stubble cutter discs, laser leveler receivers, and hydraulic rams.",
  },
  {
    icon: Truck,
    color: "gold",
    title: "Preventative Maintenance",
    desc: "Seasonal machinery tune-up services prior to sowing and harvest seasons to prevent field breakdown during peak operating windows.",
  },
  {
    icon: Wrench,
    color: "forest",
    title: "On-Field Support",
    desc: "Field setup, laser leveler transmitter calibration, and technical operator training provided for contracting teams.",
  },
];

export default function ServicesPage() {
  const waUrl = getWhatsAppLink(undefined, "Hello, I am interested in your machinery repair / custom fabrication services.");

  return (
    <div className="pb-12">
      {/* Header Banner */}
      <section className="bg-[var(--charcoal-950)] text-white py-20 border-b border-[var(--charcoal-700)] relative overflow-hidden">
        <div className="absolute inset-0 dot-pattern opacity-20" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-4">
          <AnimatedSection variant="fadeUp" delay={0.1}>
            <div className="inline-flex items-center space-x-2 text-xs font-bold text-[var(--gold-400)] uppercase tracking-widest glass rounded-full px-5 py-2">
              <Wrench className="w-4 h-4 text-[var(--gold-400)]" />
              <span>Industrial Capabilities</span>
            </div>
          </AnimatedSection>
          <AnimatedSection variant="fadeUp" delay={0.2}>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight font-[family-name:var(--font-serif)]">
              Services & Technical Support
            </h1>
          </AnimatedSection>
          <AnimatedSection variant="fadeUp" delay={0.3}>
            <p className="text-sm text-gray-400 max-w-2xl leading-relaxed">
              From custom heavy structural fabrication to gearbox overhauls, boron blade replacement, and field maintenance, we provide end-to-end engineering support for agricultural machinery.
            </p>
          </AnimatedSection>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 space-y-16">
        {/* Services Grid */}
        <StaggerContainer className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8" staggerDelay={0.1}>
          {services.map((service) => (
            <StaggerItem key={service.title}>
              <div className="bg-white p-7 rounded-2xl border border-gray-200/80 shadow-sm hover:shadow-lg hover:shadow-black/[0.06] transition-all duration-300 space-y-4 card-premium h-full group">
                <div className={`w-11 h-11 rounded-xl flex items-center justify-center transition-colors duration-200 ${
                  service.color === "gold"
                    ? "bg-[var(--gold-50)] text-[var(--gold-600)] group-hover:bg-[var(--gold-100)]"
                    : "bg-[var(--forest-50)] text-[var(--forest-700)] group-hover:bg-[var(--forest-100)]"
                }`}>
                  <service.icon className="w-5 h-5" />
                </div>
                <h3 className="text-lg font-bold text-[var(--charcoal-900)]">{service.title}</h3>
                <p className="text-sm text-gray-500 leading-relaxed">{service.desc}</p>
              </div>
            </StaggerItem>
          ))}
        </StaggerContainer>

        {/* CTA Box */}
        <AnimatedSection variant="scaleUp">
          <div className="bg-gradient-to-br from-[var(--forest-900)] via-[var(--charcoal-950)] to-[var(--forest-900)] text-white rounded-3xl p-8 sm:p-12 border border-[var(--charcoal-700)] flex flex-col md:flex-row items-center justify-between gap-8 relative overflow-hidden">
            <div className="absolute inset-0 dot-pattern opacity-10" />
            <div className="absolute top-0 right-0 w-60 h-60 bg-[var(--gold-500)] opacity-[0.06] blur-[80px] rounded-full" />
            <div className="relative space-y-3 text-center md:text-left">
              <h2 className="text-2xl sm:text-3xl font-extrabold text-white font-[family-name:var(--font-serif)]">
                Need Repairs or Custom Engineering?
              </h2>
              <p className="text-sm text-gray-400">
                Contact our factory technical team directly or drop a message on WhatsApp.
              </p>
            </div>
            <div className="relative flex items-center space-x-4">
              <a
                href={waUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="px-7 py-3.5 text-sm font-bold text-[var(--charcoal-900)] bg-gradient-to-r from-[var(--gold-400)] to-[var(--gold-500)] hover:from-[var(--gold-300)] hover:to-[var(--gold-400)] rounded-xl shadow-lg shadow-[var(--gold-500)]/20 transition-all duration-200 inline-flex items-center"
              >
                <span>Consult Engineer</span>
                <ChevronRight className="w-4 h-4 ml-1" />
              </a>
            </div>
          </div>
        </AnimatedSection>
      </section>
    </div>
  );
}
