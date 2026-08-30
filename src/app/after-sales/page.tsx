import Link from "next/link";
import {
  Wrench,
  Phone,
  FileText,
  Factory,
  Settings2,
  MessageSquare,
  ChevronRight,
} from "lucide-react";
import AnimatedSection, { StaggerContainer, StaggerItem } from "@/components/AnimatedSection";
import { getWhatsAppLink } from "@/lib/whatsapp";
import { DEFAULT_SITE_CONFIG } from "@/lib/config";

export const metadata = {
  title: "After-Sales Support & Spare Parts",
  description:
    "Support direct from the manufacturer: factory spare parts, repairs and refurbishment at our Mirzapur works, warranty terms stated on your quotation, and a direct line to the people who built your machine.",
  alternates: { canonical: "/after-sales" },
};

/* ──────────────────────────────────────────────────────────────
   CONTENT INTEGRITY NOTE
   This page previously advertised a service infrastructure that
   does not exist in this project or its records: worldwide parts
   shipping, "authorized service partners across India", scheduled
   preventive-maintenance contracts, a technical support hotline,
   formal on-site operator training programmes, and an online
   "Customer Service Portal" (there is no such route in the app).

   Those are promises a customer can hold the business to, so they
   have been replaced with what a direct-from-factory manufacturer
   at Mirzapur can actually offer. Every item below traces to real
   data in src/lib/config.ts or src/lib/translations/*.json.

   If the owner does operate a dealer or service network, add it
   back here with the real coverage — do not restore the estimates.
   ────────────────────────────────────────────────────────────── */
const supportServices = [
  {
    icon: Wrench,
    title: "Factory Spare Parts",
    desc: "Wear components, blades and replacement parts supplied direct from the works that built the machine — no third-party sourcing.",
  },
  {
    icon: Phone,
    title: "A Direct Line to the Works",
    desc: `Speak to the factory rather than a call centre. Phone and WhatsApp enquiries are answered ${DEFAULT_SITE_CONFIG.businessHours}.`,
  },
  {
    icon: FileText,
    title: "Warranty Terms in Writing",
    desc: "The warranty applying to your machine is stated on your quotation before you order, so the cover is clear from the outset.",
  },
  {
    icon: Factory,
    title: "Repairs & Refurbishment",
    desc: "Major repairs, overhauls and refurbishment are carried out at our Mirzapur works, where the machine was originally fabricated.",
  },
  {
    icon: Settings2,
    title: "Modifications & Retrofits",
    desc: "Working width, hitch arrangement or capacity can be altered on existing machines when your tractor or cropping pattern changes.",
  },
  {
    icon: MessageSquare,
    title: "Operating Guidance",
    desc: "Setup, adjustment and maintenance questions answered by the people who fabricated the machine, by phone, WhatsApp or at the works.",
  },
];

export default function AfterSalesPage() {
  const waUrl = getWhatsAppLink(
    undefined,
    "Hello, I need after-sales support for my Raj Agro Engineering Works machinery.",
    undefined
  );
  const telHref = `tel:${DEFAULT_SITE_CONFIG.phonePrimary.replace(/[^\d+]/g, "")}`;

  return (
    <div>
      {/* ── Header ───────────────────────────────────────────── */}
      <section className="on-dark steel-plate relative overflow-hidden border-b border-[var(--border-inverse)]">
        <div className="absolute inset-0 blueprint-grid-dark opacity-60" aria-hidden="true" />
        <div className="shell relative py-16 sm:py-20 lg:py-24">
          <AnimatedSection variant="fadeUp" delay={0.05}>
            <p className="eyebrow text-[var(--accent-on-dark)]">Customer Care</p>
          </AnimatedSection>
          <AnimatedSection variant="fadeUp" delay={0.12}>
            <h1 className="mt-4 max-w-3xl text-3xl font-bold tracking-tight text-white sm:text-4xl lg:text-5xl">
              Support from the people who built it.
            </h1>
          </AnimatedSection>
          <AnimatedSection variant="fadeUp" delay={0.2}>
            <p className="mt-5 max-w-2xl text-sm leading-relaxed text-[var(--text-inverse-muted)] sm:text-base">
              Because we manufacture and sell direct, after-sales requests go to the workshop
              itself. The people answering know how your machine was built, what parts went
              into it, and how to put it right.
            </p>
          </AnimatedSection>
        </div>
      </section>

      <div className="shell space-y-20 py-16 sm:py-20">
        {/* ── Support services ───────────────────────────────── */}
        <section aria-labelledby="support-heading">
          <AnimatedSection variant="fadeUp">
            <div className="max-w-2xl">
              <p className="eyebrow text-[var(--accent)]">What We Provide</p>
              <h2
                id="support-heading"
                className="mt-3 text-2xl font-bold tracking-tight text-[var(--text)] sm:text-3xl"
              >
                After-sales support
              </h2>
            </div>
          </AnimatedSection>

          <StaggerContainer
            className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3"
            staggerDelay={0.08}
          >
            {supportServices.map((service) => (
              <StaggerItem key={service.title}>
                <div className="panel lift h-full p-6">
                  <div className="flex h-10 w-10 items-center justify-center rounded-md bg-[var(--accent-quiet-bg)] text-[var(--accent)]">
                    <service.icon className="h-5 w-5" aria-hidden="true" />
                  </div>
                  <h3 className="mt-4 text-base font-bold text-[var(--text)]">{service.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-[var(--text-muted)]">
                    {service.desc}
                  </p>
                </div>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </section>

        {/* ── Parts enquiry guidance ─────────────────────────── */}
        <AnimatedSection variant="fadeUp">
          <section
            aria-labelledby="parts-heading"
            className="panel p-6 sm:p-8 lg:flex lg:items-start lg:gap-10"
          >
            <div className="lg:max-w-sm">
              <p className="eyebrow text-[var(--accent)]">Ordering Parts</p>
              <h2
                id="parts-heading"
                className="mt-3 text-xl font-bold tracking-tight text-[var(--text)] sm:text-2xl"
              >
                What to tell us
              </h2>
              <p className="mt-3 text-sm leading-relaxed text-[var(--text-muted)]">
                Sending these details with your first message saves a round of questions and
                gets you a price faster.
              </p>
            </div>
            <ul className="mt-6 grid flex-1 grid-cols-1 gap-x-8 gap-y-4 sm:grid-cols-2 lg:mt-0">
              {[
                "Machine name or model as it appears on your invoice",
                "Approximate year or month of purchase",
                "The part needed, with a photograph if possible",
                "Tractor make and horsepower it runs behind",
                "Quantity required",
                "Delivery district, state and PIN code",
              ].map((item) => (
                <li key={item} className="rule-tick pt-3">
                  <p className="text-sm leading-relaxed text-[var(--text-muted)]">{item}</p>
                </li>
              ))}
            </ul>
          </section>
        </AnimatedSection>

        {/* ── CTA ────────────────────────────────────────────── */}
        <AnimatedSection variant="fadeUp">
          <section
            aria-labelledby="support-cta-heading"
            className="on-dark relative overflow-hidden rounded-xl border border-[var(--border-inverse)] steel-plate p-8 sm:p-12"
          >
            <div className="absolute inset-0 blueprint-grid-dark opacity-50" aria-hidden="true" />
            <div className="relative flex flex-col items-start justify-between gap-8 lg:flex-row lg:items-center">
              <div className="max-w-xl">
                <h2
                  id="support-cta-heading"
                  className="text-2xl font-bold tracking-tight text-white sm:text-3xl"
                >
                  Need parts or a repair?
                </h2>
                <p className="mt-4 text-sm leading-relaxed text-[var(--text-inverse-muted)]">
                  Message the works with your machine details and what you need. For anything
                  urgent, calling is quickest.
                </p>
              </div>
              <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row">
                <a
                  href={waUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 rounded-md bg-[var(--accent)] px-6 py-3 text-sm font-bold text-[var(--accent-fg)] transition-colors duration-200 hover:bg-[var(--accent-hover)]"
                >
                  <MessageSquare className="h-4 w-4" aria-hidden="true" />
                  WhatsApp the works
                </a>
                <a
                  href={telHref}
                  className="inline-flex items-center justify-center gap-2 rounded-md border border-white/20 bg-white/5 px-6 py-3 text-sm font-bold text-white transition-colors duration-200 hover:bg-white/10"
                >
                  <Phone className="h-4 w-4" aria-hidden="true" />
                  {DEFAULT_SITE_CONFIG.phonePrimary}
                </a>
              </div>
            </div>
            <div className="relative mt-8 border-t border-white/10 pt-6">
              <Link
                href="/contact"
                className="inline-flex items-center gap-1 text-sm font-bold text-[var(--accent-on-dark)] transition-colors duration-200 hover:text-[var(--accent-on-dark-strong)]"
              >
                All contact details and factory address
                <ChevronRight className="h-4 w-4" aria-hidden="true" />
              </Link>
            </div>
          </section>
        </AnimatedSection>
      </div>
    </div>
  );
}
