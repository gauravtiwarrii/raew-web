import { Wrench, Shield, Cog, RefreshCw, Truck, ChevronRight, Phone } from "lucide-react";
import AnimatedSection, { StaggerContainer, StaggerItem } from "@/components/AnimatedSection";
import { getWhatsAppLink } from "@/lib/whatsapp";
import { DEFAULT_SITE_CONFIG } from "@/lib/config";

export const metadata = {
  title: "Engineering Services & Support",
  description: "Machinery repair, custom fabrication, maintenance, boron steel replacement parts, and agricultural equipment engineering support.",
  alternates: { canonical: "/services" },
};

/* The `color: "gold" | "forest"` field that used to alternate on these cards
   was dropped. It carried no meaning — it just tinted every other icon a
   different colour — and the design system now has one accent, used to mark
   what matters rather than to decorate every third tile. */
const services = [
  {
    icon: Cog,
    title: "Custom Equipment Manufacturing",
    desc: "Tailor-made manufacturing of agricultural implements designed around specific soil types, tractor horsepower ratings, and field row dimensions.",
  },
  {
    icon: Wrench,
    title: "Custom Metal Fabrication",
    desc: "Heavy structural welding, channel chassis construction for tipping trailers, boom sprayer mounts, and specialized industrial frames.",
  },
  {
    icon: RefreshCw,
    title: "Machinery Repair & Overhaul",
    desc: "Complete refurbishment of rotary tillers, multi-speed gearboxes, thresher drums, laser leveler hydraulic valves, and tractor trailer axles.",
  },
  {
    icon: Shield,
    title: "Genuine Spare Parts",
    desc: "Supply of high-carbon boron steel rotavator blades, heavy bevel gears, stubble cutter discs, laser leveler receivers, and hydraulic rams.",
  },
  {
    icon: Truck,
    title: "Preventative Maintenance",
    desc: "Seasonal machinery tune-up services prior to sowing and harvest seasons to prevent field breakdown during peak operating windows.",
  },
  {
    icon: Wrench,
    title: "On-Field Support",
    desc: "Field setup, laser leveler transmitter calibration, and technical operator training provided for contracting teams.",
  },
];

export default function ServicesPage() {
  const waUrl = getWhatsAppLink(undefined, "Hello, I am interested in your machinery repair / custom fabrication services.");
  const cleanPhone =
    DEFAULT_SITE_CONFIG.phonePrimary.split("[")[0].trim() || DEFAULT_SITE_CONFIG.phonePrimary;
  const telHref = `tel:${cleanPhone.replace(/[^\d+]/g, "")}`;

  return (
    <div className="bg-[var(--bg)]">
      {/* ── 1. HEADER ───────────────────────────────────────────────── */}
      <section className="steel-plate on-dark relative overflow-hidden border-b border-[var(--border-inverse)]">
        <div className="blueprint-grid-dark absolute inset-0" aria-hidden="true" />
        <div className="shell relative py-16 sm:py-20">
          <AnimatedSection variant="fadeUp" delay={0.1}>
            <p className="eyebrow text-[var(--accent-on-dark)]">
              <Wrench className="mr-2 inline h-3.5 w-3.5" aria-hidden="true" />
              Industrial Capabilities
            </p>
          </AnimatedSection>
          <AnimatedSection variant="fadeUp" delay={0.2}>
            <h1 className="mt-4 max-w-3xl text-3xl font-bold tracking-tight text-white sm:text-4xl lg:text-5xl">
              Services &amp; Technical Support
            </h1>
          </AnimatedSection>
          <AnimatedSection variant="fadeUp" delay={0.3}>
            <p className="mt-5 max-w-2xl text-sm leading-relaxed text-[var(--text-inverse-muted)] sm:text-base">
              From custom heavy structural fabrication to gearbox overhauls, boron blade replacement, and field maintenance, we provide end-to-end engineering support for agricultural machinery.
            </p>
          </AnimatedSection>
        </div>
      </section>

      {/* ── 2. SERVICES ─────────────────────────────────────────────── */}
      <section className="shell py-16 sm:py-20">
        <StaggerContainer
          className="grid grid-cols-1 gap-px bg-[var(--border)] md:grid-cols-2 lg:grid-cols-3"
          staggerDelay={0.08}
        >
          {services.map((service) => (
            <StaggerItem key={service.title} className="bg-[var(--surface)]">
              <div className="h-full px-7 py-8">
                <service.icon
                  className="h-6 w-6 text-[var(--accent)]"
                  aria-hidden="true"
                />
                <h2 className="mt-5 text-lg font-bold text-[var(--text)]">{service.title}</h2>
                <p className="mt-2.5 text-sm leading-relaxed text-[var(--text-muted)]">
                  {service.desc}
                </p>
              </div>
            </StaggerItem>
          ))}
        </StaggerContainer>
      </section>

      {/* ── 3. CTA ──────────────────────────────────────────────────── */}
      <section className="steel-plate on-dark relative overflow-hidden border-y border-[var(--border-inverse)]">
        <div className="blueprint-grid-dark absolute inset-0" aria-hidden="true" />
        <div className="shell relative flex flex-col items-start justify-between gap-8 py-14 lg:flex-row lg:items-center">
          <div className="max-w-xl">
            <h2 className="text-2xl font-bold tracking-tight text-white sm:text-3xl">
              Need Repairs or Custom Engineering?
            </h2>
            <p className="mt-4 text-sm leading-relaxed text-[var(--text-inverse-muted)]">
              Contact our factory technical team directly or drop a message on WhatsApp.
            </p>
          </div>

          {/* The copy has always said "directly or… WhatsApp", but only the
              WhatsApp button existed. The phone number makes it true. */}
          <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row">
            <a
              href={waUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex rounded-[6px] h-12 items-center justify-center gap-1.5 bg-[var(--accent)] px-7 text-sm font-bold text-[var(--accent-fg)] transition-colors duration-150 hover:bg-[var(--accent-hover)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--focus-inverse)]"
            >
              <span>
                Consult Engineer<span className="sr-only"> on WhatsApp (opens in a new tab)</span>
              </span>
              <ChevronRight className="h-4 w-4" aria-hidden="true" />
            </a>
            <a
              href={telHref}
              className="inline-flex rounded-[6px] h-12 items-center justify-center gap-2 border border-[var(--border-inverse)] px-7 text-sm font-bold text-white transition-colors duration-150 hover:bg-white/[0.06] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--focus-inverse)]"
            >
              <Phone className="h-4 w-4" aria-hidden="true" />
              {cleanPhone}
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
