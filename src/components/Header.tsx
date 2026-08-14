"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, Phone, Mail, Clock, MessageSquare, ChevronRight } from "lucide-react";
import { getWhatsAppLink } from "@/lib/whatsapp";

interface HeaderProps {
  phone?: string;
  email?: string;
  whatsapp?: string;
  businessHours?: string;
}

export default function Header({
  phone = "+91 7651861335",
  email = "info@raew.in",
  whatsapp = "919794427644",
  businessHours = "24/7",
}: HeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [pathname]);

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
    <header className="w-full z-50 sticky top-0">
      {/* Animated gradient top accent line */}
      <div className="h-[2px] bg-gradient-to-r from-[var(--gold-600)] via-[var(--forest-600)] to-[var(--gold-600)] bg-[length:200%_100%] animate-[gradient-shift_4s_ease_infinite]" />

      {/* Top Bar — Contact Info */}
      <div className="bg-[var(--charcoal-900)] text-gray-400 text-xs py-2 px-4 hidden md:block">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center space-x-6">
            <a href={`tel:${cleanPhone}`} className="flex items-center space-x-1.5 hover:text-[var(--gold-400)] transition-colors duration-200">
              <Phone className="w-3.5 h-3.5 text-[var(--gold-500)]" />
              <span>{cleanPhone}</span>
            </a>
            <a href={`mailto:${cleanEmail}`} className="flex items-center space-x-1.5 hover:text-[var(--gold-400)] transition-colors duration-200">
              <Mail className="w-3.5 h-3.5 text-[var(--gold-500)]" />
              <span>{cleanEmail}</span>
            </a>
            <span className="flex items-center space-x-1.5 text-gray-500">
              <Clock className="w-3.5 h-3.5 text-[var(--gold-500)]" />
              <span>{businessHours}</span>
            </span>
          </div>

          <div className="flex items-center space-x-4">
            <Link
              href={whatsAppHref}
              target="_blank"
              className="flex items-center space-x-1.5 text-[var(--gold-400)] hover:text-[var(--gold-300)] transition-colors duration-200 font-medium"
            >
              <MessageSquare className="w-3.5 h-3.5 fill-[var(--gold-500)] text-[var(--gold-500)]" />
              <span>WhatsApp Quick Connect</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Main Navigation Bar */}
      <nav
        className={`transition-all duration-300 border-b ${
          scrolled
            ? "py-2 bg-white/90 backdrop-blur-xl shadow-lg shadow-black/[0.04] border-gray-200/60"
            : "py-3.5 bg-white border-gray-200"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          {/* Logo & Brand Name */}
          <Link href="/" className="flex items-center space-x-3 group">
            <Image
              src="/branding/raew-logo.png"
              alt="Raj Agro Engineering Works logo"
              width={280}
              height={140}
              priority
              className={`w-auto rounded-md transition-all duration-300 ${scrolled ? "h-9" : "h-11"}`}
            />
            <div className="flex flex-col">
              <span className="font-extrabold text-lg sm:text-xl text-[var(--charcoal-900)] tracking-tight leading-tight group-hover:text-[var(--gold-600)] transition-colors duration-200">
                Raj Agro Engineering
              </span>
              <span className="text-[10px] text-[var(--gold-600)] font-semibold tracking-[0.15em] uppercase">
                Agricultural Machinery & Engineering
              </span>
            </div>
          </Link>

          {/* Desktop Nav Links */}
          <div className="hidden lg:flex items-center space-x-0.5">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.name}
                  href={link.href}
                  className={`relative px-3.5 py-2 rounded-lg text-sm font-semibold transition-all duration-200 ${
                    isActive
                      ? "text-[var(--gold-700)] bg-[var(--gold-50)]"
                      : "text-gray-600 hover:text-[var(--gold-700)] hover:bg-[var(--gold-50)]"
                  }`}
                >
                  {link.name}
                  {isActive && (
                    <motion.div
                      layoutId="nav-indicator"
                      className="absolute bottom-0 left-3 right-3 h-[2px] bg-[var(--gold-500)] rounded-full"
                      transition={{ type: "spring", stiffness: 500, damping: 30 }}
                    />
                  )}
                </Link>
              );
            })}
          </div>

          {/* Get a Quote CTA */}
          <div className="hidden sm:flex items-center space-x-3">
            <Link
              href="/quote"
              className="inline-flex items-center justify-center px-5 py-2.5 text-sm font-bold text-[var(--charcoal-900)] bg-gradient-to-r from-[var(--gold-400)] to-[var(--gold-500)] hover:from-[var(--gold-300)] hover:to-[var(--gold-400)] rounded-lg shadow-md shadow-[var(--gold-500)]/20 transition-all duration-200 transform hover:-translate-y-0.5"
            >
              <span>Get a Quote</span>
              <ChevronRight className="w-4 h-4 ml-1" />
            </Link>
          </div>

          {/* Mobile Hamburger */}
          <div className="flex lg:hidden items-center space-x-2">
            <Link
              href="/quote"
              className="px-3 py-1.5 text-xs font-bold text-[var(--charcoal-900)] bg-[var(--gold-400)] rounded-lg sm:hidden"
            >
              Quote
            </Link>

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-gray-700 hover:text-[var(--gold-700)] hover:bg-[var(--gold-50)] focus:outline-none transition-colors duration-200"
              aria-label="Toggle Navigation Menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Drawer Menu with Framer Motion */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
            className="lg:hidden bg-white border-b border-gray-200 overflow-hidden shadow-lg"
          >
            <div className="px-4 pt-2 pb-6 space-y-2">
              <div className="space-y-1">
                {navLinks.map((link, index) => {
                  const isActive = pathname === link.href;
                  return (
                    <motion.div
                      key={link.name}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05, duration: 0.3 }}
                    >
                      <Link
                        href={link.href}
                        onClick={() => setMobileMenuOpen(false)}
                        className={`block px-4 py-2.5 rounded-lg text-base font-semibold transition-colors duration-200 ${
                          isActive
                            ? "text-[var(--gold-700)] bg-[var(--gold-50)]"
                            : "text-gray-700 hover:bg-[var(--gold-50)] hover:text-[var(--gold-700)]"
                        }`}
                      >
                        {link.name}
                      </Link>
                    </motion.div>
                  );
                })}
              </div>

              <div className="pt-4 border-t border-gray-100 space-y-3">
                <Link
                  href="/quote"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full flex items-center justify-center py-3 text-center text-sm font-bold text-[var(--charcoal-900)] bg-gradient-to-r from-[var(--gold-400)] to-[var(--gold-500)] rounded-lg shadow-md"
                >
                  Request a Quote
                </Link>
                <Link
                  href={whatsAppHref}
                  target="_blank"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full flex items-center justify-center py-2.5 text-center text-sm font-bold text-[var(--gold-700)] bg-[var(--gold-50)] rounded-lg border border-[var(--gold-200)]"
                >
                  <MessageSquare className="w-4 h-4 mr-2 text-[var(--gold-600)]" />
                  Chat on WhatsApp
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
