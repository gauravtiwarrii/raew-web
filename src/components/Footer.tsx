import Image from "next/image";
import Link from "next/link";
import { Phone, Mail, MapPin, Clock, MessageSquare, ShieldCheck, ArrowRight } from "lucide-react";
import { DEFAULT_SITE_CONFIG, SiteConfig } from "@/lib/config";
import { getWhatsAppLink } from "@/lib/whatsapp";

interface FooterProps {
  config?: SiteConfig;
}

export default function Footer({ config = DEFAULT_SITE_CONFIG }: FooterProps) {
  const currentYear = new Date().getFullYear();
  const cleanPhone = config.phonePrimary.split("[")[0].trim() || config.phonePrimary;
  const cleanEmail = config.emailPrimary.split("[")[0].trim() || config.emailPrimary;
  const cleanAddress = config.address.split("[")[0].trim() || config.address;
  const cleanGstin = (config.gstin || "").split("[")[0].trim();
  const whatsAppHref = getWhatsAppLink(undefined, undefined, config.whatsappNumber);

  return (
    <footer className="bg-[var(--charcoal-950)] text-gray-400 border-t border-[var(--charcoal-700)]">
      {/* Feature bar */}
      <div className="bg-[var(--charcoal-900)] border-b border-[var(--charcoal-700)] py-6 px-4">
        <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 text-center md:text-left">
          {[
            { icon: ShieldCheck, title: "Practical Engineering", desc: "Field-focused equipment" },
            { icon: ArrowRight, title: "Full Machinery Catalog", desc: "Products, categories & specs" },
            { icon: Phone, title: "Sales Enquiries", desc: "Phone, WhatsApp & forms" },
            { icon: MessageSquare, title: "Quick Quotations", desc: "Fast response guaranteed" },
          ].map((item) => (
            <div key={item.title} className="flex items-center space-x-3 justify-center md:justify-start group">
              <div className="p-2.5 rounded-xl bg-[var(--charcoal-800)] text-[var(--gold-500)] group-hover:bg-[var(--gold-500)]/10 transition-colors duration-200">
                <item.icon className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-white">{item.title}</h4>
                <p className="text-xs text-gray-500">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Main footer content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
        {/* Brand column */}
        <div className="lg:col-span-2 space-y-5">
          <div className="flex items-center space-x-3">
            <Image
              src="/branding/raew-logo.png"
              alt="Raj Agro Engineering Works logo"
              width={260}
              height={130}
              className="h-11 w-auto rounded-md"
            />
            <span className="font-extrabold text-xl text-white tracking-tight">
              Raj Agro Engineering
            </span>
          </div>
          <p className="text-sm text-gray-500 leading-relaxed max-w-sm">
            Manufacturer of high-performance agricultural machinery, rotavators, laser land levelers, threshers, tipping trailers and custom engineering implements.
          </p>
          <div className="flex items-center space-x-3 pt-1">
            <Link
              href={whatsAppHref}
              target="_blank"
              className="px-5 py-2.5 text-xs font-bold text-[var(--charcoal-900)] bg-gradient-to-r from-[var(--gold-400)] to-[var(--gold-500)] hover:from-[var(--gold-300)] hover:to-[var(--gold-400)] rounded-xl transition-all duration-200 inline-flex items-center space-x-1.5"
            >
              <MessageSquare className="w-4 h-4" />
              <span>WhatsApp Us</span>
            </Link>
            <Link
              href="/quote"
              className="px-5 py-2.5 text-xs font-bold text-[var(--gold-400)] border border-[var(--gold-500)]/30 hover:bg-[var(--gold-500)]/10 rounded-xl transition-all duration-200 inline-flex items-center space-x-1.5"
            >
              <span>Request Quote</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>

        {/* Quick links */}
        <div>
          <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-5 border-l-2 border-[var(--gold-500)] pl-3">
            Quick Links
          </h3>
          <ul className="space-y-3 text-sm">
            {[
              { href: "/", label: "Home" },
              { href: "/about", label: "About Company" },
              { href: "/products", label: "Product Catalog" },
              { href: "/categories", label: "Machinery Categories" },
              { href: "/services", label: "Services" },
              { href: "/gallery", label: "Gallery" },
              { href: "/contact", label: "Contact Us" },
              { href: "/quote", label: "Request a Quote" },
            ].map((link) => (
              <li key={link.href}>
                <Link href={link.href} className="hover:text-[var(--gold-400)] transition-colors duration-200">
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Catalog areas */}
        <div>
          <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-5 border-l-2 border-[var(--gold-500)] pl-3">
            Catalog Areas
          </h3>
          <ul className="space-y-3 text-sm text-gray-500">
            <li>Agricultural Machinery</li>
            <li>Farm Equipment</li>
            <li>Agricultural Implements</li>
            <li>Engineering Equipment</li>
            <li>Fabrication Products</li>
            <li>Custom Machinery</li>
            <li>Spare Parts</li>
          </ul>
        </div>

        {/* Contact */}
        <div className="space-y-3">
          <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-5 border-l-2 border-[var(--gold-500)] pl-3">
            Factory Contact
          </h3>
          <div className="space-y-3 text-sm text-gray-400">
            <div className="flex items-start space-x-2.5">
              <MapPin className="w-4 h-4 text-[var(--gold-500)] mt-0.5 shrink-0" />
              <span>{cleanAddress}</span>
            </div>
            {cleanGstin && (
              <div className="flex items-center space-x-2.5">
                <span className="w-4 h-4 shrink-0 text-[var(--gold-500)] font-bold text-[10px] leading-4 text-center">
                  ID
                </span>
                <span>GSTIN: {cleanGstin}</span>
              </div>
            )}
            <div className="flex items-center space-x-2.5">
              <Phone className="w-4 h-4 text-[var(--gold-500)] shrink-0" />
              <span>{cleanPhone}</span>
            </div>
            <div className="flex items-center space-x-2.5">
              <Mail className="w-4 h-4 text-[var(--gold-500)] shrink-0" />
              <span>{cleanEmail}</span>
            </div>
            <div className="flex items-start space-x-2.5">
              <Clock className="w-4 h-4 text-[var(--gold-500)] mt-0.5 shrink-0" />
              <span className="text-xs text-gray-500">{config.businessHours}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-[var(--charcoal-700)] py-6 px-4 text-xs text-gray-500">
        <div className="max-w-7xl mx-auto flex flex-col lg:flex-row justify-between items-center gap-4">
          <div>
            © {currentYear}{" "}
            <span className="font-semibold text-white">M/s Raj Agro Engineering Works</span>. All
            rights reserved.
          </div>
          <Link
            href="https://www.refrens.com/"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Accounting powered by Refrens"
            className="inline-flex rounded-2xl ring-1 ring-[var(--gold-500)]/40 shadow-[0_0_18px_rgba(199,138,44,0.2)] transition-transform duration-200 hover:scale-[1.02]"
          >
            <Image
              src="/badges/refrens-powered.webp"
              alt="Accounting Powered by Refrens.com"
              width={352}
              height={111}
              className="h-auto w-56 sm:w-64 rounded-2xl"
              sizes="(max-width: 640px) 224px, 256px"
            />
          </Link>
          <div className="flex items-center space-x-6">
            <Link href="/contact" className="hover:text-[var(--gold-400)] transition-colors duration-200">
              Contact
            </Link>
            <span className="text-[var(--charcoal-600)]">|</span>
            <Link href="/quote" className="hover:text-[var(--gold-400)] transition-colors duration-200">
              Get a Quote
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
