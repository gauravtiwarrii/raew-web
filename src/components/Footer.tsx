import Image from "next/image";
import Link from "next/link";
import {
  Phone, Mail, MapPin, Clock, MessageSquare, ArrowRight
} from "lucide-react";
import { DEFAULT_SITE_CONFIG, SiteConfig } from "@/lib/config";
import { getWhatsAppLink } from "@/lib/whatsapp";

interface FooterProps {
  config?: SiteConfig;
}

/**
 * Site footer.
 *
 * ── Earlier corrections, kept ──
 *   - The phone number and email address were plain `<span>`s. On a phone,
 *     the footer of a manufacturer's site is where people go to call, and
 *     nothing was tappable. Both are real `tel:` / `mailto:` links.
 *   - The WhatsApp link opened in a new tab with no `rel="noopener"`, and gave
 *     no warning that it would.
 *   - Body text used `text-gray-500` (#6b7280) on a near-black background,
 *     which measures 3.95:1 — under the 4.5:1 AA floor for normal text.
 *     `--text-inverse-muted` measures 7.9:1.
 *
 * ── This pass ──
 * Two changes.
 *
 * First, the scope moved from `.on-dark` on `--surface-inverse` (#0e1013) to
 * `.cinema` on `--cinema-void` (#070707). The closing CTA above the footer sits
 * on #0b0d0c, so the page now ends on its deepest value — the tone descends to
 * the bottom instead of stepping back up at the last moment.
 *
 * Second, the four-cell "feature bar" that sat across the top is gone. It read
 * "Practical Engineering / Field-focused equipment", "Full Machinery Catalog /
 * Products, categories & specs", "Sales Enquiries / Phone, WhatsApp & forms",
 * "Quick Quotations / Priced direct by the factory" — four icons restating
 * things the columns beneath already say, in the register of a template's
 * "why choose us" strip. No fact was lost: the catalogue, contact and quote
 * routes are all still one link away below. The space it occupied now carries
 * the wordmark, which is the one thing a footer can do that no other section
 * can — end the page on the company's name at a size nothing else on the site
 * uses.
 */
export default function Footer({ config = DEFAULT_SITE_CONFIG }: FooterProps) {
  const currentYear = new Date().getFullYear();
  const cleanPhone = config.phonePrimary.split("[")[0].trim() || config.phonePrimary;
  const cleanEmail = config.emailPrimary.split("[")[0].trim() || config.emailPrimary;
  const cleanAddress = config.address.split("[")[0].trim() || config.address;
  const cleanGstin = (config.gstin || "").split("[")[0].trim();
  const whatsAppHref = getWhatsAppLink(undefined, undefined, config.whatsappNumber);
  const telHref = `tel:${cleanPhone.replace(/[^\d+]/g, "")}`;

  /* The rule was `border-[var(--accent)]`. #0a5728 against #070707 measures
     2.23:1 — which is under the 3:1 floor for a non-text graphic, so this
     WAS a failure once the accent moved onto the mark's own green. It is
     also a weighting problem on top of that: at 2px, a ratio that low reads
     as a smudge rather than a mark, and this rule's job is to be the one
     thing that anchors four column headings down the page.
     `--accent-on-dark` (#70db99) measures 11.78:1 on the same ground and
     actually holds.

     (An earlier note here claimed 1.35:1. That figure was wrong and is
     recorded as wrong on purpose: it was inconsistent with the two numbers
     beside it — white on the accent is 8.73:1 and white on #070707 is
     19.25:1, which forces the accent-on-void ratio to about
     19.25 / 8.73 ≈ 2.2, and the measured value is 2.23:1. If a contrast
     figure in this codebase does not reconcile with its neighbours,
     re-measure it before acting on it.) */
  const columnHeading =
    "mb-5 border-l-2 border-[var(--accent-on-dark)] pl-3 text-xs font-bold uppercase tracking-[0.14em] text-[var(--text-inverse)]";

  return (
    <footer className="cinema relative overflow-x-clip border-t border-[var(--cinema-edge)] text-[var(--text-inverse-muted)]">
      <div
        className="blueprint-grid-dark pointer-events-none absolute inset-0 opacity-30"
        aria-hidden="true"
      />

      {/* Main footer content */}
      <div className="shell relative grid grid-cols-1 gap-10 py-16 md:grid-cols-2 lg:grid-cols-6 lg:gap-12">
        {/* Brand column */}
        <div className="space-y-5 lg:col-span-2">
          <div className="flex items-center gap-3">
            {/* The inverse mark. The footer sits on --cinema-void (#070707),
                where the artwork's charcoal gear is invisible, so this is the
                version re-pitched to near-white plus the light brand tint —
                generated from the same master as the header mark by
                `scripts/generate-brand-assets.ps1`.

                `alt=""` because the two lines beside it already carry the
                company name; announcing the mark as well would say it twice. */}
            <Image
              src="/branding/raew-mark-inverse.png"
              alt=""
              width={275}
              height={242}
              className="h-11 w-auto shrink-0"
            />
            <span className="flex min-w-0 flex-col">
              <span className="text-xl font-bold tracking-tight text-[var(--text-inverse)]">
                Raj Agro Engineering
              </span>
              {/* The brand's own line, at micro-type. It is the one place in
                  the footer where the company speaks rather than enumerates. */}
              <span className="spec-label mt-1">{config.brandTagline}</span>
            </span>
          </div>
          <p className="max-w-sm text-sm leading-relaxed text-[var(--text-inverse-muted)]">
            Manufacturer of high-performance agricultural machinery, rotavators, laser land levelers, threshers, tipping trailers and custom engineering implements.
          </p>
          <div className="flex flex-wrap items-center gap-3 pt-1">
            <Link
              href={whatsAppHref}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex h-11 items-center gap-2 bg-[var(--accent)] px-5 text-xs font-bold uppercase tracking-[0.1em] text-[var(--accent-fg)] transition-colors duration-150 hover:bg-[var(--accent-hover)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--focus-inverse)]"
            >
              <MessageSquare className="h-4 w-4" aria-hidden="true" />
              <span>
                WhatsApp Us<span className="sr-only"> (opens in a new tab)</span>
              </span>
            </Link>
            <Link
              href="/quote"
              className="inline-flex h-11 items-center gap-2 border border-[rgb(255_255_255/0.22)] px-5 text-xs font-bold uppercase tracking-[0.1em] text-[var(--text-inverse)] transition-colors duration-150 hover:border-[var(--accent-on-dark)] hover:text-[var(--accent-on-dark)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--focus-inverse)]"
            >
              <span>Request Quote</span>
              <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
            </Link>
          </div>
        </div>

        {/* Quick links */}
        <div>
          <h2 className={columnHeading}>Quick Links</h2>
          <ul className="space-y-3 text-sm">
            {[
              { href: "/", label: "Home" },
              { href: "/about", label: "About Company" },
              { href: "/products", label: "Product Catalog" },
              { href: "/categories", label: "Machinery Categories" },
              { href: "/services", label: "Services" },
              { href: "/manufacturing", label: "Manufacturing" },
              { href: "/projects", label: "Projects" },
              { href: "/gallery", label: "Gallery" },
              { href: "/blog", label: "News & Insights" },
              { href: "/careers", label: "Careers" },
            ].map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className="text-[var(--text-inverse-muted)] transition-colors duration-150 hover:text-[var(--text-inverse)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--focus-inverse)]"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Customer actions */}
        <div>
          <h2 className={columnHeading}>Customer</h2>
          <ul className="space-y-3 text-sm">
            {[
              { href: "/quote", label: "Request a Quote" },
              { href: "/contact", label: "Contact Us" },
              { href: "/after-sales", label: "After-Sales Support" },
              { href: "/field-performance", label: "Field Support" },
            ].map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className="text-[var(--text-inverse-muted)] transition-colors duration-150 hover:text-[var(--text-inverse)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--focus-inverse)]"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Legal */}
        <div>
          <h2 className={columnHeading}>Legal</h2>
          <ul className="space-y-3 text-sm">
            {[
              { href: "/privacy", label: "Privacy Policy" },
              { href: "/terms", label: "Terms & Conditions" },
            ].map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className="text-[var(--text-inverse-muted)] transition-colors duration-150 hover:text-[var(--text-inverse)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--focus-inverse)]"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Contact */}
        <div>
          <h2 className={columnHeading}>Factory Contact</h2>
          {/* A description list: each label/value pair is explicit, and the
              labels stay available to screen readers while the icons carry
              them visually. */}
          <dl className="space-y-3 text-sm">
            <div className="flex items-start gap-2.5">
              <dt className="sr-only">Factory address</dt>
              <MapPin
                className="mt-0.5 h-4 w-4 shrink-0 text-[var(--accent-on-dark)]"
                aria-hidden="true"
              />
              <dd>{cleanAddress}</dd>
            </div>

            {cleanGstin && (
              <div className="flex items-center gap-2.5">
                <dt className="sr-only">GSTIN</dt>
                <span
                  className="w-4 shrink-0 text-center text-[10px] font-bold leading-4 text-[var(--accent-on-dark)]"
                  aria-hidden="true"
                >
                  ID
                </span>
                <dd className="font-mono">GSTIN: {cleanGstin}</dd>
              </div>
            )}

            <div className="flex items-center gap-2.5">
              <dt className="sr-only">Phone</dt>
              <Phone
                className="h-4 w-4 shrink-0 text-[var(--accent-on-dark)]"
                aria-hidden="true"
              />
              <dd>
                <a
                  href={telHref}
                  className="transition-colors duration-150 hover:text-[var(--text-inverse)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--focus-inverse)]"
                >
                  {cleanPhone}
                </a>
              </dd>
            </div>

            <div className="flex items-center gap-2.5">
              <dt className="sr-only">Email</dt>
              <Mail
                className="h-4 w-4 shrink-0 text-[var(--accent-on-dark)]"
                aria-hidden="true"
              />
              <dd className="min-w-0">
                <a
                  href={`mailto:${cleanEmail}`}
                  className="break-all transition-colors duration-150 hover:text-[var(--text-inverse)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--focus-inverse)]"
                >
                  {cleanEmail}
                </a>
              </dd>
            </div>

            <div className="flex items-start gap-2.5">
              <dt className="sr-only">Business hours</dt>
              <Clock
                className="mt-0.5 h-4 w-4 shrink-0 text-[var(--accent-on-dark)]"
                aria-hidden="true"
              />
              <dd className="text-xs">{config.businessHours}</dd>
            </div>
          </dl>
        </div>
      </div>

      {/* ── Wordmark ──
          `aria-hidden` and not a heading: the company name is already in the
          logo's alt text at the top of this footer and again in the copyright
          line below, so announcing a third "RAEW" would be noise. This is
          typography, not content.

          The size is `clamp(2rem, 32vw, 27rem)`, derived rather than picked.
          "RAEW" in Space Grotesk Bold uppercase measures about 2.63em wide
          after -0.045em tracking, and the shell's content box is the viewport
          minus its gutters, capped at 80rem - 4rem = 1216px. 32vw keeps the
          mark at roughly 89% of that box from 320px up to 1280px — big enough
          to read as a wordmark, with margin against font-metric variation —
          and the 27rem ceiling stops it running past the shell above 1440px.
          `overflow-x-clip` on the footer is the backstop, so a metric surprise
          degrades to a clipped letter and never to a horizontal scrollbar.

          The stroke is set to 2px here: `.wordmark-outline` defaults to 1px,
          which is correct at the 8rem plate numbers in the product showcase
          and vanishes at this scale. */}
      <div className="relative border-t border-[var(--cinema-edge)] pt-12">
        <div className="shell">
          <span
            aria-hidden="true"
            className="wordmark-outline block select-none font-display font-bold leading-[0.8] tracking-[-0.045em] text-[clamp(2rem,32vw,27rem)]"
            style={
              {
                "--wordmark-stroke": "rgb(255 255 255 / 0.14)",
                "--wordmark-stroke-w": "2px",
              } as React.CSSProperties
            }
          >
            RAEW
          </span>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="relative border-t border-[var(--cinema-edge)] py-6 text-xs text-[var(--text-inverse-muted)]">
        <div className="shell flex flex-col items-center justify-between gap-5 lg:flex-row">
          <p>
            © {currentYear}{" "}
            <span className="font-semibold text-[var(--text-inverse)]">
              M/s Raj Agro Engineering Works
            </span>
            . All rights reserved.
          </p>

          <Link
            href="https://www.refrens.com/"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Accounting powered by Refrens (opens in a new tab)"
            className="inline-flex border border-[var(--cinema-edge)] transition-colors duration-150 hover:border-[var(--accent-on-dark)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--focus-inverse)]"
          >
            {/* alt is empty because the link already carries an accessible
                name — otherwise the badge is announced twice. */}
            <Image
              src="/badges/refrens-powered.webp"
              alt=""
              width={352}
              height={111}
              className="h-auto w-56 sm:w-64"
              sizes="(max-width: 640px) 224px, 256px"
            />
          </Link>

          <div className="flex items-center gap-6">
            <Link
              href="/contact"
              className="transition-colors duration-150 hover:text-[var(--text-inverse)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--focus-inverse)]"
            >
              Contact
            </Link>
            <span className="text-[var(--cinema-edge)]" aria-hidden="true">
              |
            </span>
            <Link
              href="/quote"
              className="transition-colors duration-150 hover:text-[var(--text-inverse)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--focus-inverse)]"
            >
              Get a Quote
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
