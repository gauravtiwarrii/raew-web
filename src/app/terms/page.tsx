import Link from "next/link";
import { Scale } from "lucide-react";
import AnimatedSection from "@/components/AnimatedSection";
import { getSiteConfig } from "@/lib/site-settings";

export const metadata = {
  title: "Terms & Conditions",
  description:
    "The terms on which M/s Raj Agro Engineering Works supplies machinery, implements and engineering services, and the terms of use of this website.",
  alternates: { canonical: "/terms" },
};

export const revalidate = 3600;

/**
 * Terms and Conditions.
 *
 * Written to describe the commercial reality of this business rather than to
 * reproduce a template: machines are built to order, so the specification that
 * binds both sides is the one written on the quotation, and warranty cover is
 * whatever that quotation states. No warranty period, penalty rate, court or
 * registration number has been invented — where a figure is required, the
 * quotation is the document that carries it.
 */
export default async function TermsPage() {
  const config = await getSiteConfig();

  const cleanEmail = config.emailPrimary.split("[")[0].trim() || config.emailPrimary;
  const cleanPhone = config.phonePrimary.split("[")[0].trim() || config.phonePrimary;
  const cleanAddress = config.address.split("[")[0].trim() || config.address;
  const cleanGstin = (config.gstin || "").split("[")[0].trim();

  return (
    <div className="bg-[var(--bg)]">
      <section className="steel-plate on-dark relative overflow-hidden border-b border-[var(--border-inverse)]">
        <div className="blueprint-grid-dark absolute inset-0" aria-hidden="true" />
        <div className="shell relative py-16 sm:py-20">
          <AnimatedSection variant="fadeUp" delay={0.1}>
            <p className="eyebrow text-[var(--accent-on-dark)]">
              <Scale className="mr-2 inline h-3.5 w-3.5" aria-hidden="true" />
              Legal
            </p>
          </AnimatedSection>
          <AnimatedSection variant="fadeUp" delay={0.2}>
            <h1 className="mt-4 max-w-4xl text-3xl font-bold tracking-tight text-white sm:text-4xl lg:text-5xl">
              Terms &amp; Conditions
            </h1>
          </AnimatedSection>
          <AnimatedSection variant="fadeUp" delay={0.3}>
            <p className="mt-5 max-w-2xl text-sm leading-relaxed text-[var(--text-inverse-muted)] sm:text-base">
              These terms apply to machinery, implements and engineering services
              supplied by {config.businessName}, and to your use of this website.
            </p>
          </AnimatedSection>
        </div>
      </section>


      <section className="shell py-14 sm:py-20">
        <div className="mx-auto max-w-3xl">
          <article className="space-y-10 text-sm leading-relaxed text-[var(--text-muted)]">
            <div>
              <h2 className="text-lg font-bold tracking-tight text-[var(--text)]">
                1. Who these terms are between
              </h2>
              <p className="mt-3">
                {config.businessName} manufactures, fabricates and supplies
                agricultural machinery and engineering equipment from its works in
                Mirzapur, Uttar Pradesh. These terms govern the supply of that
                machinery and any related service, and the use of this website.
              </p>
            </div>

            <div>
              <h2 className="text-lg font-bold tracking-tight text-[var(--text)]">
                2. Enquiries and quotations
              </h2>
              <p className="mt-3">
                Prices shown anywhere on this website are stated as{" "}
                <span className="font-semibold text-[var(--text)]">
                  price on request
                </span>{" "}
                and are not offers. A quotation we issue is valid for the period
                written on it, is prepared for the tractor, working width and field
                conditions you describe to us, and becomes the governing description
                of the machine if you place an order.
              </p>
              <p className="mt-3">
                If the information you give us changes — a different tractor, a
                different working width, a different crop — the specification and the
                price may change with it, and we will confirm the revised figures in
                writing before proceeding.
              </p>
            </div>

            <div>
              <h2 className="text-lg font-bold tracking-tight text-[var(--text)]">
                3. Machines built to order
              </h2>
              <p className="mt-3">
                Most machines are built to order. Slight variation in finish,
                fasteners, fittings and component make is normal between builds, and a
                variation that does not change the working specification is not a
                defect. Where we have to substitute a component, we will substitute
                one of at least equal suitability.
              </p>
              <p className="mt-3">
                Drawings, dimensions, weights and capacities quoted are indicative
                unless stated otherwise on the quotation.
              </p>
            </div>

            <div>
              <h2 className="text-lg font-bold tracking-tight text-[var(--text)]">
                4. Orders, payment and delivery
              </h2>
              <p className="mt-3">
                An order is accepted when we confirm it in writing and, where an
                advance is called for, when that advance is received. Payment terms,
                delivery arrangements, freight and any applicable taxes are set out on
                the quotation and the invoice for your order.
              </p>
              <p className="mt-3">
                Delivery dates we give are estimates made in good faith. We are not
                responsible for delay caused by events outside our reasonable control,
                including transport disruption, shortage of raw material, or failure
                of a supplier.
              </p>
            </div>

            <div>
              <h2 className="text-lg font-bold tracking-tight text-[var(--text)]">
                5. Warranty
              </h2>
              <p className="mt-3">
                The warranty that applies to your machine is the one stated on your
                quotation before you order, and it is confirmed in writing there. We do
                not state a different or wider warranty on this website.
              </p>
              <p className="mt-3">
                Wear parts — blades, shovels, tines, discs, belts, hoses and similar
                consumable items — are not covered, and neither is damage from misuse,
                overloading, operation outside the rated tractor power, field
                accidents, or repair by anyone who is not authorised by us.
              </p>
            </div>

            <div>
              <h2 className="text-lg font-bold tracking-tight text-[var(--text)]">
                6. Spare parts and service
              </h2>
              <p className="mt-3">
                We supply spare parts for the machines we build, direct from the works.
                Parts availability for any particular model, and the price and lead
                time for a part, are confirmed when you ask us for them.
              </p>
            </div>

            <div>
              <h2 className="text-lg font-bold tracking-tight text-[var(--text)]">
                7. Website content
              </h2>
              <p className="mt-3">
                We keep the descriptions on this website as accurate as we can, but a
                website is not a specification sheet. Where this website and your
                quotation disagree, the quotation governs the machine you receive. If
                you spot something here that looks wrong, please tell us so we can
                correct it.
              </p>
            </div>

            <div>
              <h2 className="text-lg font-bold tracking-tight text-[var(--text)]">
                8. Intellectual property
              </h2>
              <p className="mt-3">
                The text, photographs, drawings and design of this website belong to
                us or are used with permission. You may print or save pages for your
                own reference. You may not republish our photographs or text as your
                own, or present our machines as another manufacturer&apos;s.
              </p>
            </div>

            <div>
              <h2 className="text-lg font-bold tracking-tight text-[var(--text)]">
                9. Limitation of liability
              </h2>
              <p className="mt-3">
                Our liability for any machine or service we supply is limited to the
                remedies set out in the warranty stated on your quotation. We are not
                liable for indirect or consequential loss, including loss of crop,
                loss of profit, or the cost of hiring a replacement machine.
              </p>
              <p className="mt-3">
                Nothing in these terms limits any liability that cannot lawfully be
                limited.
              </p>
            </div>

            <div>
              <h2 className="text-lg font-bold tracking-tight text-[var(--text)]">
                10. Governing law
              </h2>
              <p className="mt-3">
                These terms are governed by the laws of India. Any dispute arising out
                of them is subject to the jurisdiction of the courts having
                jurisdiction over our place of business stated below.
              </p>
            </div>

            <div>
              <h2 className="text-lg font-bold tracking-tight text-[var(--text)]">
                11. Changes to these terms
              </h2>
              <p className="mt-3">
                We may update these terms from time to time. The version published on
                this page at the time you place an order is the version that applies to
                that order; the terms printed on your quotation also apply.
              </p>
            </div>

            <div className="border-t border-[var(--border)] pt-8">
              <h2 className="text-lg font-bold tracking-tight text-[var(--text)]">
                12. How to reach us
              </h2>
              <address className="mt-4 not-italic">
                <span className="block font-semibold text-[var(--text)]">
                  {config.businessName}
                </span>
                <span className="mt-1 block">{cleanAddress}</span>
                {cleanGstin && (
                  <span className="mt-1 block font-mono text-xs">
                    GSTIN: {cleanGstin}
                  </span>
                )}
                <span className="mt-1 block">
                  Phone:{" "}
                  <a
                    href={`tel:${cleanPhone.replace(/[^\d+]/g, "")}`}
                    className="text-[var(--accent)] underline-offset-4 hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--focus)]"
                  >
                    {cleanPhone}
                  </a>
                </span>
                <span className="mt-1 block">
                  Email:{" "}
                  <a
                    href={`mailto:${cleanEmail}`}
                    className="break-all text-[var(--accent)] underline-offset-4 hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--focus)]"
                  >
                    {cleanEmail}
                  </a>
                </span>
              </address>

              <p className="mt-6 text-xs leading-relaxed text-[var(--text-subtle)]">
                See also our{" "}
                <Link
                  href="/privacy"
                  className="text-[var(--accent)] underline-offset-4 hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--focus)]"
                >
                  Privacy Policy
                </Link>
                , which explains how we handle the information you send us.
              </p>
            </div>
          </article>
        </div>
      </section>
    </div>
  );
}

