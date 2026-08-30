import Link from "next/link";
import {
  Gauge,
  Ruler,
  Sprout,
  Layers,
  MapPin,
  Boxes,
  Phone,
  MessageCircle,
  ClipboardList,
  PenTool,
  FileText,
} from "lucide-react";
import AnimatedSection, { StaggerContainer, StaggerItem } from "@/components/AnimatedSection";
import TestimonialsSection from "@/components/TestimonialsSection";
import { getWhatsAppLink } from "@/lib/whatsapp";
import { DEFAULT_SITE_CONFIG } from "@/lib/config";

export const metadata = {
  title: "Field Support & Demonstrations",
  description:
    "Request a machinery demonstration or field visit from M/s Raj Agro Engineering Works. Tell us your tractor power, working width, crop and soil conditions and we will confirm the right build for your field.",
  alternates: { canonical: "/field-performance" },
};

/* ──────────────────────────────────────────────────────────────
   CONTENT INTEGRITY NOTE
   This page previously published field-trial results, award
   claims, live telemetry capability, yield-improvement figures
   and three named customer testimonials — none of which are
   documented anywhere in this repository or verifiable from the
   business's own records. All of it has been removed.

   What remains is limited to things that ARE verifiable: the
   engineering inputs the factory actually collects (these mirror
   the real quote form fields in src/app/quote/QuoteClient.tsx),
   the real enquiry-to-quotation process, and the real contact
   channels in src/lib/config.ts.

   When the owner has measured field data or signed-off customer
   reviews, add them here and to <TestimonialsSection /> — do not
   substitute estimates for them.
   ────────────────────────────────────────────────────────────── */

/** The specification inputs the factory needs before recommending or building a
 *  machine. These are the same parameters the quotation form collects. */
const ENGINEERING_INPUTS = [
  {
    icon: Gauge,
    label: "Tractor power",
    desc: "Available PTO horsepower decides the implement size we recommend and how the drive line is specified.",
  },
  {
    icon: Ruler,
    label: "Working width",
    desc: "The width you need per pass, in inches, matched against the frame and rotor length we can build.",
  },
  {
    icon: Sprout,
    label: "Crop and operation",
    desc: "Tilling, levelling, sowing, harvesting or threshing — the operation determines the configuration.",
  },
  {
    icon: Layers,
    label: "Soil and field condition",
    desc: "Soil type, moisture and whether the field is dry or puddled all affect blade choice and structure.",
  },
  {
    icon: Boxes,
    label: "Quantity required",
    desc: "Single unit or a fleet order — quantity affects the production schedule and factory pricing.",
  },
  {
    icon: MapPin,
    label: "Delivery location",
    desc: "Your district, state and PIN code, so we can confirm dispatch and transport arrangements.",
  },
];

/** The real enquiry → quotation sequence. No promises beyond what the factory does. */
const PROCESS = [
  {
    step: "01",
    icon: ClipboardList,
    title: "Share your field details",
    desc: "Send the parameters above by phone, WhatsApp or the quotation form. The more specific the requirement, the more accurate the response.",
  },
  {
    step: "02",
    icon: PenTool,
    title: "We confirm what fits",
    desc: "The factory reviews your requirement and confirms whether a standard build suits your field or whether a custom configuration is needed.",
  },
  {
    step: "03",
    icon: FileText,
    title: "Quotation and terms in writing",
    desc: "You receive pricing direct from the manufacturer, with specifications, warranty terms and delivery details stated on the quotation.",
  },
];

export default function FieldPerformancePage() {
  const waUrl = getWhatsAppLink(
    undefined,
    "Hello, I would like to arrange a demonstration of your machinery. My field details are:",
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
            <p className="eyebrow text-[var(--accent-on-dark)]">Field Support</p>
          </AnimatedSection>
          <AnimatedSection variant="fadeUp" delay={0.12}>
            <h1 className="mt-4 max-w-3xl text-3xl font-bold tracking-tight text-white sm:text-4xl lg:text-5xl">
              Tell us the field. We&rsquo;ll specify the machine.
            </h1>
          </AnimatedSection>
          <AnimatedSection variant="fadeUp" delay={0.2}>
            <p className="mt-5 max-w-2xl text-sm leading-relaxed text-[var(--text-inverse-muted)] sm:text-base">
              Every implement we build is specified against a real field: the tractor pulling
              it, the width you need per pass, the crop, and the soil it has to work in. Send
              us those details and we will tell you exactly what we can supply.
            </p>
          </AnimatedSection>
          <AnimatedSection variant="fadeUp" delay={0.28}>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
              <Link
                href="/quote"
                className="inline-flex items-center justify-center rounded-md bg-[var(--accent)] px-6 py-3 text-sm font-bold text-[var(--accent-fg)] transition-colors duration-200 hover:bg-[var(--accent-hover)]"
              >
                Request a quotation
              </Link>
              <a
                href={waUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 rounded-md border border-white/20 bg-white/5 px-6 py-3 text-sm font-bold text-white transition-colors duration-200 hover:bg-white/10"
              >
                <MessageCircle className="h-4 w-4" aria-hidden="true" />
                Message the factory
              </a>
            </div>
          </AnimatedSection>
        </div>
      </section>

      <div className="shell space-y-20 py-16 sm:py-20">
        {/* ── Engineering inputs ─────────────────────────────── */}
        <section aria-labelledby="inputs-heading">
          <AnimatedSection variant="fadeUp">
            <div className="max-w-2xl">
              <p className="eyebrow text-[var(--accent)]">Specification Inputs</p>
              <h2
                id="inputs-heading"
                className="mt-3 text-2xl font-bold tracking-tight text-[var(--text)] sm:text-3xl"
              >
                What we need to know about your field
              </h2>
              <p className="mt-4 text-sm leading-relaxed text-[var(--text-muted)]">
                These are the parameters our quotation form collects, and the ones the
                workshop works from. Approximate answers are fine — we will confirm the
                details with you before anything is built.
              </p>
            </div>
          </AnimatedSection>

          <StaggerContainer className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {ENGINEERING_INPUTS.map((item) => (
              <StaggerItem key={item.label}>
                <div className="panel lift h-full p-6">
                  <div className="flex h-10 w-10 items-center justify-center rounded-md bg-[var(--accent-quiet-bg)] text-[var(--accent)]">
                    <item.icon className="h-5 w-5" aria-hidden="true" />
                  </div>
                  <h3 className="mt-4 text-base font-bold text-[var(--text)]">{item.label}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-[var(--text-muted)]">
                    {item.desc}
                  </p>
                </div>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </section>

        {/* ── Process ────────────────────────────────────────── */}
        <section aria-labelledby="process-heading">
          <AnimatedSection variant="fadeUp">
            <div className="max-w-2xl">
              <p className="eyebrow text-[var(--accent)]">How It Works</p>
              <h2
                id="process-heading"
                className="mt-3 text-2xl font-bold tracking-tight text-[var(--text)] sm:text-3xl"
              >
                From enquiry to quotation
              </h2>
            </div>
          </AnimatedSection>

          <StaggerContainer className="mt-10 grid grid-cols-1 gap-4 md:grid-cols-3">
            {PROCESS.map((item) => (
              <StaggerItem key={item.step}>
                <div className="panel h-full p-6">
                  <div className="rule-tick pt-5">
                    <div className="flex items-center justify-between">
                      <span className="spec-label">Step {item.step}</span>
                      <item.icon
                        className="h-5 w-5 text-[var(--text-subtle)]"
                        aria-hidden="true"
                      />
                    </div>
                    <h3 className="mt-4 text-base font-bold text-[var(--text)]">{item.title}</h3>
                    <p className="mt-2 text-sm leading-relaxed text-[var(--text-muted)]">
                      {item.desc}
                    </p>
                  </div>
                </div>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </section>

        {/* ── Testimonials (honest placeholder until real reviews exist) ── */}
        <section aria-labelledby="reviews-heading">
          <AnimatedSection variant="fadeUp">
            <div className="max-w-2xl">
              <p className="eyebrow text-[var(--accent)]">Customer Feedback</p>
              <h2
                id="reviews-heading"
                className="mt-3 text-2xl font-bold tracking-tight text-[var(--text)] sm:text-3xl"
              >
                What our customers say
              </h2>
              <p className="mt-4 text-sm leading-relaxed text-[var(--text-muted)]">
                We publish reviews only from customers who have actually taken delivery of a
                machine. If you own RAEW machinery and would like to share your experience,
                get in touch.
              </p>
            </div>
          </AnimatedSection>

          <div className="mt-10">
            <TestimonialsSection />
          </div>
        </section>

        {/* ── Demonstration request ──────────────────────────── */}
        <AnimatedSection variant="fadeUp">
          <section
            aria-labelledby="demo-heading"
            className="on-dark relative overflow-hidden rounded-xl border border-[var(--border-inverse)] steel-plate p-8 sm:p-12"
          >
            <div className="absolute inset-0 blueprint-grid-dark opacity-50" aria-hidden="true" />
            <div className="relative flex flex-col items-start justify-between gap-8 lg:flex-row lg:items-center">
              <div className="max-w-xl">
                <h2
                  id="demo-heading"
                  className="text-2xl font-bold tracking-tight text-white sm:text-3xl"
                >
                  Request a demonstration or field visit
                </h2>
                <p className="mt-4 text-sm leading-relaxed text-[var(--text-inverse-muted)]">
                  Demonstration and viewing requests are handled directly by the factory.
                  Send us your location and requirement and we will confirm what is possible
                  in your area. Enquiries are answered {DEFAULT_SITE_CONFIG.businessHours}.
                </p>
              </div>
              <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row">
                <a
                  href={waUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 rounded-md bg-[var(--accent)] px-6 py-3 text-sm font-bold text-[var(--accent-fg)] transition-colors duration-200 hover:bg-[var(--accent-hover)]"
                >
                  <MessageCircle className="h-4 w-4" aria-hidden="true" />
                  WhatsApp
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
          </section>
        </AnimatedSection>
      </div>
    </div>
  );
}
