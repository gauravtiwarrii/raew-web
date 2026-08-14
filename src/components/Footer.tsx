import Image from "next/image";
import Link from "next/link";
import { Phone, Mail, MapPin, Clock, MessageSquare, Wrench, ShieldCheck, ArrowRight } from "lucide-react";
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
  const whatsAppHref = getWhatsAppLink(undefined, undefined, config.whatsappNumber);

  return (
    <footer className="bg-slate-950 text-gray-300 border-t border-slate-800">
      <div className="bg-emerald-950 border-b border-emerald-900 py-6 px-4">
        <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 text-center md:text-left">
          <div className="flex items-center space-x-3 justify-center md:justify-start">
            <div className="p-2.5 rounded-lg bg-emerald-900 text-amber-400">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-white">Practical Engineering</h4>
              <p className="text-xs text-emerald-300">Field-focused equipment information</p>
            </div>
          </div>

          <div className="flex items-center space-x-3 justify-center md:justify-start">
            <div className="p-2.5 rounded-lg bg-emerald-900 text-amber-400">
              <Wrench className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-white">Editable Catalog</h4>
              <p className="text-xs text-emerald-300">Products, categories, and specs</p>
            </div>
          </div>

          <div className="flex items-center space-x-3 justify-center md:justify-start">
            <div className="p-2.5 rounded-lg bg-emerald-900 text-amber-400">
              <Phone className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-white">Sales Enquiries</h4>
              <p className="text-xs text-emerald-300">Phone, WhatsApp, and forms</p>
            </div>
          </div>

          <div className="flex items-center space-x-3 justify-center md:justify-start">
            <div className="p-2.5 rounded-lg bg-emerald-900 text-amber-400">
              <MessageSquare className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-white">Quotation Requests</h4>
              <p className="text-xs text-emerald-300">Stored in the admin dashboard</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-lg bg-emerald-700 flex items-center justify-center text-amber-400">
              <Wrench className="w-6 h-6" />
            </div>
            <span className="font-extrabold text-xl text-white tracking-tight">
              M/s Raj Agro Engineering Works
            </span>
          </div>
          <p className="text-sm text-gray-400 leading-relaxed max-w-sm">
            Agricultural machinery and engineering business website with editable products, categories, gallery items, enquiries, and contact details.
          </p>
          <div className="flex items-center space-x-4 pt-2">
            <Link
              href={whatsAppHref}
              target="_blank"
              className="px-4 py-2 text-xs font-bold text-white bg-emerald-700 hover:bg-emerald-600 rounded-md transition-colors inline-flex items-center space-x-1.5"
            >
              <MessageSquare className="w-4 h-4" />
              <span>WhatsApp Us</span>
            </Link>
            <Link
              href="/quote"
              className="px-4 py-2 text-xs font-bold text-amber-400 border border-amber-500/50 hover:bg-amber-500/10 rounded-md transition-colors inline-flex items-center space-x-1.5"
            >
              <span>Request Quote</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>

        <div>
          <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-4 border-l-2 border-emerald-500 pl-2">
            Quick Links
          </h3>
          <ul className="space-y-2.5 text-sm">
            <li><Link href="/" className="hover:text-emerald-400 transition-colors">Home</Link></li>
            <li><Link href="/about" className="hover:text-emerald-400 transition-colors">About Company</Link></li>
            <li><Link href="/products" className="hover:text-emerald-400 transition-colors">Product Catalog</Link></li>
            <li><Link href="/categories" className="hover:text-emerald-400 transition-colors">Machinery Categories</Link></li>
            <li><Link href="/services" className="hover:text-emerald-400 transition-colors">Services</Link></li>
            <li><Link href="/gallery" className="hover:text-emerald-400 transition-colors">Gallery</Link></li>
            <li><Link href="/contact" className="hover:text-emerald-400 transition-colors">Contact Us</Link></li>
            <li><Link href="/quote" className="hover:text-emerald-400 transition-colors">Request a Quote</Link></li>
          </ul>
        </div>

        <div>
          <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-4 border-l-2 border-emerald-500 pl-2">
            Catalog Areas
          </h3>
          <ul className="space-y-2.5 text-sm text-gray-400">
            <li>Agricultural Machinery</li>
            <li>Farm Equipment</li>
            <li>Agricultural Implements</li>
            <li>Engineering Equipment</li>
            <li>Fabrication Products</li>
            <li>Custom Machinery</li>
            <li>Spare Parts</li>
          </ul>
        </div>

        <div className="space-y-3">
          <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-4 border-l-2 border-emerald-500 pl-2">
            Factory Contact
          </h3>
          <div className="space-y-3 text-sm text-gray-300">
            <div className="flex items-start space-x-2.5">
              <MapPin className="w-4 h-4 text-emerald-500 mt-1 shrink-0" />
              <span>{cleanAddress}</span>
            </div>
            <div className="flex items-center space-x-2.5">
              <Phone className="w-4 h-4 text-emerald-500 shrink-0" />
              <span>{cleanPhone}</span>
            </div>
            <div className="flex items-center space-x-2.5">
              <Mail className="w-4 h-4 text-emerald-500 shrink-0" />
              <span>{cleanEmail}</span>
            </div>
            <div className="flex items-start space-x-2.5">
              <Clock className="w-4 h-4 text-amber-500 mt-0.5 shrink-0" />
              <span className="text-xs text-gray-400">{config.businessHours}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-slate-900 border-t border-slate-800 py-6 px-4 text-xs text-gray-400">
        <div className="max-w-7xl mx-auto flex flex-col lg:flex-row justify-between items-center gap-4">
          <div>
            (c) {currentYear} <span className="font-semibold text-white">M/s Raj Agro Engineering Works</span>. All rights reserved.
          </div>
          <Link
            href="https://www.refrens.com/"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Accounting powered by Refrens"
            className="inline-flex rounded-2xl ring-1 ring-violet-400/50 shadow-[0_0_18px_rgba(124,58,237,0.45)] transition-transform hover:scale-[1.02]"
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
            <Link href="/admin/login" className="hover:text-emerald-400 transition-colors">
              Admin Portal
            </Link>
            <span>|</span>
            <span className="text-gray-500">Built for editable business content</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
