"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X, Phone, Mail, Clock, MessageSquare, ChevronRight } from "lucide-react";
import { getWhatsAppLink } from "@/lib/whatsapp";

interface HeaderProps {
  phone?: string;
  email?: string;
  whatsapp?: string;
  businessHours?: string;
}

export default function Header({
  phone = "9794427644",
  email = "info@raew.in",
  whatsapp = "919794427644",
  businessHours = "[REPLACE WITH BUSINESS HOURS]",
}: HeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { name: "Home", href: "/" },
    { name: "About Us", href: "/about" },
    { name: "Products", href: "/products" },
    { name: "Categories", href: "/categories" },
    { name: "Services", href: "/services" },
    { name: "Gallery", href: "/gallery" },
    { name: "Contact", href: "/contact" },
  ];

  const cleanPhone = phone.split("[")[0].trim() || phone;
  const cleanEmail = email.split("[")[0].trim() || email;
  const whatsAppHref = getWhatsAppLink(undefined, undefined, whatsapp);

  return (
    <header className="w-full z-50 sticky top-0 bg-white border-b border-gray-200 shadow-xs">
      {/* Top Bar for Industrial Business Contacts */}
      <div className="bg-slate-900 text-gray-300 text-xs py-2 px-4 hidden md:block">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center space-x-6">
            <span className="flex items-center space-x-1.5 hover:text-amber-300 transition-colors">
              <Phone className="w-3.5 h-3.5 text-amber-400" />
              <span>{cleanPhone}</span>
            </span>
            <span className="flex items-center space-x-1.5 hover:text-amber-300 transition-colors">
              <Mail className="w-3.5 h-3.5 text-amber-400" />
              <span>{cleanEmail}</span>
            </span>
            <span className="flex items-center space-x-1.5 text-gray-400">
              <Clock className="w-3.5 h-3.5 text-amber-400" />
              <span>{businessHours}</span>
            </span>
          </div>

          <div className="flex items-center space-x-4">
            <Link
              href={whatsAppHref}
              target="_blank"
              className="flex items-center space-x-1 text-amber-300 hover:text-amber-200 transition-colors font-medium"
            >
              <MessageSquare className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
              <span>WhatsApp Quick Connect</span>
            </Link>
            <span className="text-gray-600">|</span>
            <Link href="/admin/login" className="hover:text-white transition-colors text-gray-400">
              Admin Portal
            </Link>
          </div>
        </div>
      </div>

      {/* Main Navigation Bar */}
      <nav className={`transition-all duration-200 ${scrolled ? "py-2.5 shadow-md" : "py-4"}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          {/* Logo & Brand Name */}
          <Link href="/" className="flex items-center space-x-3 group">
            <Image
              src="/branding/raew-logo.png"
              alt="Raj Agro Engineering Works logo"
              width={280}
              height={140}
              priority
              className="h-12 w-auto rounded-md"
            />
            <div className="flex flex-col">
              <span className="font-extrabold text-lg sm:text-xl text-slate-900 tracking-tight leading-tight group-hover:text-amber-700 transition-colors">
                M/s Raj Agro Engineering Works
              </span>
              <span className="text-xs text-amber-700 font-semibold tracking-wider uppercase">
                Agricultural Machinery & Custom Engineering
              </span>
            </div>
          </Link>

          {/* Desktop Nav Links */}
          <div className="hidden lg:flex items-center space-x-1">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.name}
                  href={link.href}
                  className={`px-3.5 py-2 rounded-md text-sm font-semibold transition-colors ${
                    isActive
                      ? "text-amber-800 bg-amber-50 font-bold"
                      : "text-gray-700 hover:text-amber-800 hover:bg-amber-50/60"
                  }`}
                >
                  {link.name}
                </Link>
              );
            })}
          </div>

          {/* Get a Quote CTA Button */}
          <div className="hidden sm:flex items-center space-x-3">
            <Link
              href="/quote"
              className="inline-flex items-center justify-center px-4 py-2.5 text-sm font-bold text-slate-950 bg-amber-400 hover:bg-amber-300 rounded-lg shadow-sm transition-all transform hover:-translate-y-0.5"
            >
              <span>Get a Quote</span>
              <ChevronRight className="w-4 h-4 ml-1" />
            </Link>
          </div>

          {/* Mobile Hamburger Toggle Button */}
          <div className="flex lg:hidden items-center space-x-2">
            <Link
              href="/quote"
              className="px-3 py-1.5 text-xs font-bold text-slate-950 bg-amber-400 rounded-md sm:hidden"
            >
              Quote
            </Link>

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-gray-700 hover:text-amber-800 hover:bg-amber-50 focus:outline-none"
              aria-label="Toggle Navigation Menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-white border-b border-gray-200 px-4 pt-2 pb-6 space-y-2 shadow-lg animate-in slide-in-from-top-2">
          <div className="space-y-1">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.name}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`block px-4 py-2.5 rounded-lg text-base font-semibold transition-colors ${
                    isActive ? "text-amber-800 bg-amber-50" : "text-gray-700 hover:bg-amber-50/60"
                  }`}
                >
                  {link.name}
                </Link>
              );
            })}
          </div>

          <div className="pt-4 border-t border-gray-100 space-y-3">
            <Link
              href="/quote"
              onClick={() => setMobileMenuOpen(false)}
              className="w-full flex items-center justify-center py-3 text-center text-sm font-bold text-slate-950 bg-amber-400 rounded-lg shadow-sm"
            >
              Request a Quote
            </Link>
            <Link
              href={whatsAppHref}
              target="_blank"
              onClick={() => setMobileMenuOpen(false)}
              className="w-full flex items-center justify-center py-2.5 text-center text-sm font-bold text-amber-900 bg-amber-50 rounded-lg border border-amber-200"
            >
              <MessageSquare className="w-4 h-4 mr-2 text-amber-700" />
              Chat on WhatsApp
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
