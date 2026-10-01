import Link from "next/link";
import { ShieldCheck } from "lucide-react";
import AnimatedSection from "@/components/AnimatedSection";
import { getSiteConfig } from "@/lib/site-settings";

export const metadata = {
  title: "Privacy Policy",
  description:
    "How M/s Raj Agro Engineering Works collects, uses and protects the information you submit through this website.",
  alternates: { canonical: "/privacy" },
};

export const revalidate = 3600;

/**
 * Privacy Policy.
 *
 * Every statement below describes something the code in this repository
 * actually does — the fields the three public forms post, the in-memory rate
 * limiter that reads a request IP, the admin-only auth cookie, and the two
 * third-party embeds. Nothing here is boilerplate copied from another site, and
 * no retention period, registration number or grievance officer has been
 * invented: where the business has to state something only it knows, the text
 * says so plainly rather than filling the gap with a plausible-looking figure.
 *
 * Contact details are read from site settings, so an admin edit to the phone
 * number or the email address updates this page too.
 */
export default async function PrivacyPolicyPage() {
  const config = await getSiteConfig();

  const cleanEmail = config.emailPrimary.split("[")[0].trim() || config.emailPrimary;
  const cleanPhone = config.phonePrimary.split("[")[0].trim() || config.phonePrimary;
  const cleanAddress = config.address.split("[")[0].trim() || config.address;

  return (
    <div className="bg-[var(--bg)]">
      <section className="steel-plate on-dark relative overflow-hidden border-b border-[var(--border-inverse)]">
        <div className="blueprint-grid-dark absolute inset-0" aria-hidden="true" />
        <div className="shell relative py-16 sm:py-20">
          <AnimatedSection variant="fadeUp" delay={0.1}>
            <p className="eyebrow text-[var(--accent-on-dark)]">
              <ShieldCheck className="mr-2 inline h-3.5 w-3.5" aria-hidden="true" />
              Legal
            </p>
          </AnimatedSection>
          <AnimatedSection variant="fadeUp" delay={0.2}>
            <h1 className="mt-4 max-w-4xl text-3xl font-bold tracking-tight text-white sm:text-4xl lg:text-5xl">
              Privacy Policy
            </h1>
          </AnimatedSection>
          <AnimatedSection variant="fadeUp" delay={0.3}>
            <p className="mt-5 max-w-2xl text-sm leading-relaxed text-[var(--text-inverse-muted)] sm:text-base">
              This policy explains what information {config.businessName} collects
              through this website, why we collect it, and what you can ask us to do
              with it.
            </p>
          </AnimatedSection>
        </div>
      </section>

      <section className="shell py-14 sm:py-20">
        <div className="mx-auto max-w-3xl">
          <article className="space-y-10 text-sm leading-relaxed text-[var(--text-muted)]">
            <div>
              <h2 className="text-lg font-bold tracking-tight text-[var(--text)]">
                1. Information you give us
              </h2>
              <p className="mt-3">
                We only receive personal information when you choose to send it. There
                are three places on this website where you can do that, and these are
                the fields each one submits:
              </p>
              <ul className="mt-4 space-y-2.5">
                <li>
                  <span className="font-semibold text-[var(--text)]">
                    Enquiry and quotation form
                  </span>{" "}
                  — your name, company name if given, phone number, email address if
                  given, an optional WhatsApp number, the district, state and PIN code
                  you want delivery priced to, the machine or requirement you selected,
                  quantity, and the description you write.
                </li>
                <li>
                  <span className="font-semibold text-[var(--text)]">
                    Contact form
                  </span>{" "}
                  — your name, company or farm name if given, phone number, email
                  address if given, your city or district, and your message.
                </li>
                <li>
                  <span className="font-semibold text-[var(--text)]">Careers form</span>{" "}
                  — your name, email address, phone number if given, the role you are
                  applying for, a cover message, and a r&eacute;sum&eacute; which you may
                  either attach as a PDF, DOC or DOCX file or point to with a link.
                </li>
              </ul>
              <p className="mt-4">
                Nothing on this website requires you to create an account, and we do
                not ask for payment details anywhere.
              </p>
            </div>

            <div>
              <h2 className="text-lg font-bold tracking-tight text-[var(--text)]">
                2. Information collected automatically
              </h2>
              <p className="mt-3">
                Our hosting provider records standard server logs — the pages
                requested, timestamps, and the IP address a request came from — as all
                web servers do. We use these logs only to keep the site running and to
                detect abuse.
              </p>
              <p className="mt-3">
                To limit automated spam, our form endpoints apply a short-lived rate
                limit that counts submissions per IP address. That counter is held in
                memory on the server, expires within minutes, and is not written to
                our database.
              </p>
            </div>

            <div>
              <h2 className="text-lg font-bold tracking-tight text-[var(--text)]">
                3. Why we use it
              </h2>
              <p className="mt-3">
                We use what you send us to answer your enquiry, prepare a quotation,
                arrange delivery or service, assess a job application, and keep a
                record of the business we have transacted. We do not sell your
                information, and we do not use it for advertising.
              </p>
            </div>

            <div>
              <h2 className="text-lg font-bold tracking-tight text-[var(--text)]">
                4. Cookies
              </h2>
              <p className="mt-3">
                This website sets no advertising or analytics cookies. One cookie is
                issued, and only to staff: an admin sign-in token that keeps an
                authorised person logged in to the management area. It is httpOnly, is
                not readable by page scripts, and is never issued to ordinary
                visitors.
              </p>
            </div>

            <div>
              <h2 className="text-lg font-bold tracking-tight text-[var(--text)]">
                5. Services provided by other companies
              </h2>
              <p className="mt-3">
                Two parts of this site are supplied by third parties, and when they
                load, those companies will see your request to them:
              </p>
              <ul className="mt-4 space-y-2.5">
                <li>
                  <span className="font-semibold text-[var(--text)]">
                    Google Maps
                  </span>{" "}
                  — the embedded map on the contact page is served by Google, so
                  Google receives your IP address when the map loads.
                </li>
                <li>
                  <span className="font-semibold text-[var(--text)]">WhatsApp</span> —
                  the chat buttons open WhatsApp with a pre-written message. Nothing
                  is sent to WhatsApp unless you press the button, and the conversation
                  that follows is governed by WhatsApp&apos;s own privacy terms.
                </li>
              </ul>
            </div>

            <div>
              <h2 className="text-lg font-bold tracking-tight text-[var(--text)]">
                6. How long we keep it
              </h2>
              <p className="mt-3">
                Enquiries, quotations and contact messages are kept for as long as we
                need them to serve you and to maintain our business and tax records,
                after which they are deleted. Job applications are kept while the role
                is open and for a reasonable period afterwards in case a similar
                vacancy arises; you can ask us to delete yours at any time using the
                contact details below.
              </p>
            </div>

            <div>
              <h2 className="text-lg font-bold tracking-tight text-[var(--text)]">
                7. How your information is protected
              </h2>
              <p className="mt-3">
                Enquiries, applications and settings are stored in a database that is
                not publicly reachable. The management area is protected by a password
                that is stored only as a hash, sessions are carried in an httpOnly
                cookie, and every administrative endpoint checks authorisation before
                it will read or change anything. Form submissions are validated on the
                server, and uploaded r&eacute;sum&eacute;s are restricted to PDF, DOC or
                DOCX files of at most 2 MB.
              </p>
            </div>

            <div>
              <h2 className="text-lg font-bold tracking-tight text-[var(--text)]">
                8. Your choices
              </h2>
              <p className="mt-3">
                You may ask us what personal information we hold about you, ask for a
                copy of it, ask us to correct anything that is wrong, or ask us to
                delete it. Write to us using the contact details below and we will
                respond within a reasonable time.
              </p>
            </div>

            <div>
              <h2 className="text-lg font-bold tracking-tight text-[var(--text)]">
                9. Changes to this policy
              </h2>
              <p className="mt-3">
                If we change how this website handles personal information, we will
                update this page. The current version always applies from the moment it
                is published here.
              </p>
            </div>

            <div className="border-t border-[var(--border)] pt-8">
              <h2 className="text-lg font-bold tracking-tight text-[var(--text)]">
                10. Contacting us about privacy
              </h2>
              <p className="mt-3">
                Questions about this policy, or requests about your information, can be
                sent to:
              </p>
              <address className="mt-4 not-italic">
                <span className="block font-semibold text-[var(--text)]">
                  {config.businessName}
                </span>
                <span className="mt-1 block">{cleanAddress}</span>
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
                This policy describes how this website handles information. It is not
                legal advice, and it does not create rights beyond those given by
                applicable law. See also our{" "}
                <Link
                  href="/terms"
                  className="text-[var(--accent)] underline-offset-4 hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--focus)]"
                >
                  Terms &amp; Conditions
                </Link>
                .
              </p>
            </div>
          </article>
        </div>
      </section>
    </div>
  );
}
