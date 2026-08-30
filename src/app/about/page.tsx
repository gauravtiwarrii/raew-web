import Link from "next/link";
import { ShieldCheck, Award, Factory, Cpu, CheckCircle } from "lucide-react";
import AnimatedSection, { StaggerContainer, StaggerItem } from "@/components/AnimatedSection";
import { DEFAULT_SITE_CONFIG } from "@/lib/config";
import ImagePlaceholder from "@/components/ui/ImagePlaceholder";

export const metadata = {
  title: "About Us",
  description: "Learn about M/s Raj Agro Engineering Works - Our mission, engineering capabilities, quality standards, and agricultural machinery manufacturing plant.",
  alternates: { canonical: "/about" },
};

export default function AboutPage() {
  const cleanAddress = DEFAULT_SITE_CONFIG.address.split("[")[0].trim();

  return (
    <div className="bg-[var(--bg)]">
      {/* ── 1. HEADER ───────────────────────────────────────────────── */}
      <section className="steel-plate on-dark relative overflow-hidden border-b border-[var(--border-inverse)]">
        <div className="blueprint-grid-dark absolute inset-0" aria-hidden="true" />
        <div className="shell relative py-16 sm:py-20">
          <AnimatedSection variant="fadeUp" delay={0.1}>
            <p className="eyebrow text-[var(--accent-on-dark)]">
              <Factory className="mr-2 inline h-3.5 w-3.5" aria-hidden="true" />
              Industrial Heritage &amp; Excellence
            </p>
          </AnimatedSection>
          <AnimatedSection variant="fadeUp" delay={0.2}>
            <h1 className="mt-4 max-w-4xl text-3xl font-bold tracking-tight text-white sm:text-4xl lg:text-5xl">
              About M/s Raj Agro Engineering Works
            </h1>
          </AnimatedSection>
          <AnimatedSection variant="fadeUp" delay={0.3}>
            <p className="mt-5 max-w-3xl text-sm leading-relaxed text-[var(--text-inverse-muted)] sm:text-base">
              Engineering robust agricultural machinery and specialized heavy equipment tailored for maximum productivity, fuel efficiency, and long term durability.
            </p>
          </AnimatedSection>
        </div>
      </section>

      {/* ── 2. STORY ────────────────────────────────────────────────── */}
      <section className="shell py-16 sm:py-20">
        <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-12 lg:gap-16">
          <AnimatedSection variant="slideLeft" className="space-y-6 lg:col-span-6">
            <h2 className="text-2xl font-bold tracking-tight text-[var(--text)] sm:text-3xl lg:text-4xl">
              Our Journey &amp; Manufacturing Identity
            </h2>
            <p className="text-sm leading-relaxed text-[var(--text-muted)] sm:text-base">
              M/s Raj Agro Engineering Works was founded with a singular commitment: to provide Indian farmers and custom agricultural contractors with heavy-duty machinery built to withstand demanding field operations.
            </p>
            <p className="text-sm leading-relaxed text-[var(--text-muted)] sm:text-base">
              From high-torque rotary tillers and multi-crop threshers to precision laser land levelers and heavy hydraulic tipping trailers, our manufacturing process prioritizes structural strength, premium alloy materials, and low operational wear.
            </p>

            <div className="border-l-2 border-[var(--accent)] bg-[var(--accent-quiet-bg)] px-5 py-4">
              <h3 className="spec-label text-[var(--accent-quiet-text)]">Quality Commitment</h3>
              <p className="mt-2 text-xs leading-relaxed text-[var(--accent-quiet-text)]">
                Every unit manufactured in our facility undergoes rigorous load, torque, and alignment inspections before dispatch to ensure zero field failures.
              </p>
            </div>
          </AnimatedSection>

          <AnimatedSection variant="slideRight" className="lg:col-span-6">
            {/*
              This was a stock Unsplash photograph
              (photo-1581092160607-ee22621dd758) of an unrelated company's
              fabrication workshop, captioned "Engineering Manufacturing Plant"
              as though it were ours. The same image was also used on the
              homepage and as a seeded product photo. Presenting another firm's
              plant as your own is a misrepresentation, so it is replaced with
              an honest placeholder until a real photograph of the Mirzapur
              works is supplied. See public/images/README.md.
            */}
            <ImagePlaceholder
              label="Fabrication bay — Mirzapur works"
              hint="Add a real photograph at /public/images/company/"
              className="aspect-4/3 w-full"
            />
          </AnimatedSection>
        </div>
      </section>

      {/* ── 3. MISSION, VISION, VALUES ──────────────────────────────── */}
      <section className="border-y border-[var(--border)] bg-[var(--surface-2)]">
        <div className="shell py-16 sm:py-20">
          <StaggerContainer
            className="grid grid-cols-1 gap-px bg-[var(--border)] md:grid-cols-3"
            staggerDelay={0.1}
          >
            {[
              { icon: Award, title: "Our Mission", desc: "To engineer and deliver durable, fuel-efficient agricultural machinery that enhances farm output while lowering maintenance expenses for operators." },
              { icon: Cpu, title: "Our Vision", desc: "To be the premier Indian choice for high-precision land leveling systems, rotary tillers, and heavy structural farm implements." },
              { icon: ShieldCheck, title: "Our Values", desc: "Engineering integrity, transparent customer communication, strict quality testing, and responsive after-sales spare parts support." },
            ].map((card) => (
              <StaggerItem key={card.title} className="bg-[var(--surface)]">
                <div className="h-full px-7 py-8">
                  <card.icon className="h-6 w-6 text-[var(--accent)]" aria-hidden="true" />
                  <h3 className="mt-5 text-lg font-bold text-[var(--text)]">{card.title}</h3>
                  <p className="mt-2.5 text-sm leading-relaxed text-[var(--text-muted)]">
                    {card.desc}
                  </p>
                </div>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </div>
      </section>

      {/* ── 4. INFRASTRUCTURE & CAPABILITIES ────────────────────────── */}
      <section className="steel-plate on-dark relative overflow-hidden border-b border-[var(--border-inverse)]">
        <div className="blueprint-grid-dark absolute inset-0" aria-hidden="true" />
        <div className="shell relative py-16 sm:py-20">
          <AnimatedSection variant="fadeUp">
            <div className="max-w-2xl">
              <p className="eyebrow text-[var(--accent-on-dark)]">
                Factory &amp; Technical Capabilities
              </p>
              <h2 className="mt-4 text-2xl font-bold tracking-tight text-white sm:text-3xl">
                Manufacturing Infrastructure
              </h2>
            </div>
          </AnimatedSection>

          <StaggerContainer
            className="mt-10 grid grid-cols-1 gap-px bg-[var(--border-inverse)] sm:grid-cols-2 lg:grid-cols-4"
            staggerDelay={0.08}
          >
            {[
              { title: "CNC & Precision Machining", desc: "Precision component fitting for gearboxes and shaft splines." },
              { title: "Boron Steel Heat Treatment", desc: "Extended blade and tyne working life in abrasive soils." },
              { title: "Heavy Structural Welding", desc: "Reinforced ISMC channel frames for tipping trailers and plows." },
              { title: "Automotive Paint Finishing", desc: "Anti-corrosive epoxy primer & polyurethane weather coatings." },
            ].map((item) => (
              <StaggerItem key={item.title} className="bg-[var(--surface-inverse)]">
                <div className="h-full px-6 py-7">
                  <CheckCircle
                    className="h-5 w-5 text-[var(--accent-on-dark)]"
                    aria-hidden="true"
                  />
                  <h3 className="mt-4 text-sm font-bold text-white">{item.title}</h3>
                  <p className="mt-2 text-xs leading-relaxed text-[var(--text-inverse-muted)]">
                    {item.desc}
                  </p>
                </div>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </div>
      </section>

      {/* ── 5. FACTORY LOCATION NOTICE ──────────────────────────────── */}
      <section className="shell py-16 sm:py-20">
        <AnimatedSection variant="fadeUp">
          <div className="panel px-6 py-6 sm:px-8">
            <h2 className="spec-label text-[var(--text-subtle)]">
              Factory Location &amp; Verification
            </h2>
            <p className="mt-3 text-sm text-[var(--text)]">
              Factory Address: <span className="font-semibold">{cleanAddress}</span>
            </p>
            <p className="mt-2 text-xs leading-relaxed text-[var(--text-muted)]">
              * Note for buyers: Physical factory visits are welcomed during business hours (Mon-Sat, 8:30 AM - 7:00 PM). Please call ahead for custom machinery demonstrations.
            </p>
          </div>
        </AnimatedSection>

        {/* ── 6. CTA ────────────────────────────────────────────────── */}
        <AnimatedSection variant="fadeUp">
          <div className="mt-14 border-t border-[var(--border)] pt-12 text-center">
            <h2 className="text-xl font-bold tracking-tight text-[var(--text)] sm:text-2xl">
              Interested in Our Machinery Capabilities?
            </h2>
            <div className="mt-7 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <Link
                href="/products"
                className="inline-flex rounded-[6px] h-12 w-full items-center justify-center bg-[var(--accent)] px-7 text-sm font-bold text-[var(--accent-fg)] transition-colors duration-150 hover:bg-[var(--accent-hover)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--focus)] sm:w-auto"
              >
                Explore Products
              </Link>
              <Link
                href="/quote"
                className="inline-flex rounded-[6px] h-12 w-full items-center justify-center border border-[var(--border-strong)] px-7 text-sm font-bold text-[var(--text)] transition-colors duration-150 hover:bg-[var(--surface-2)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--focus)] sm:w-auto"
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
