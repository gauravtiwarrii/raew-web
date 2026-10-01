"use client";

import Link from "next/link";
import Image from "next/image";
import { Menu, X } from "lucide-react";
import { useState } from "react";

const links = [
  { href: "/products", label: "Machinery" },
  { href: "/manufacturing", label: "Engineering" },
  { href: "/projects", label: "Projects" },
  { href: "/gallery", label: "Field notes" },
];

export default function SiteNavigation() {
  const [open, setOpen] = useState(false);
  return (
    <header className="site-nav-wrap">
      <nav className="site-nav" aria-label="Main navigation">
        <Link href="/" className="wordmark" onClick={() => setOpen(false)}>
          <Image src="/branding/raew-mark-inverse.png" alt="RAEW" width={42} height={37} className="nav-logo" priority />
          <span className="nav-company">M/s Raj Agro Engineering Works</span>
        </Link>
        <div className="desktop-nav">
          {links.map((link) => <Link key={link.href} href={link.href}>{link.label}</Link>)}
        </div>
        <div className="nav-actions">
          <Link href="/quote" className="nav-quote">Start a project <span>↗</span></Link>
          <button className="menu-button" type="button" onClick={() => setOpen(!open)} aria-expanded={open} aria-label={open ? "Close menu" : "Open menu"}>
            {open ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>
      </nav>
      {open && <div className="mobile-nav"><div>{links.map((link) => <Link key={link.href} href={link.href} onClick={() => setOpen(false)}>{link.label}</Link>)}<Link href="/quote" className="mobile-quote" onClick={() => setOpen(false)}>Start a project <span>↗</span></Link></div></div>}
    </header>
  );
}
