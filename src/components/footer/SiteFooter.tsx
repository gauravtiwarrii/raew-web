import Link from "next/link";
import Image from "next/image";

export default function SiteFooter() {
  return (
    <footer className="new-footer">
      <div className="footer-orbit" aria-hidden="true" />
      <div className="shell footer-content">
        <div className="footer-lead"><Image src="/branding/raew-logo-inverse.png" alt="Raj Agro Engineering Works" width={190} height={164} className="footer-logo" /><p className="eyebrow">Built for the work ahead</p><h2>Let&apos;s make the field<br /><em>more capable.</em></h2><Link className="footer-cta" href="/quote">Talk to engineering <span>↗</span></Link></div>
        <div className="footer-links"><div><p className="footer-label">Explore</p><Link href="/products">Machinery</Link><Link href="/manufacturing">Engineering</Link><Link href="/projects">Projects</Link><Link href="/gallery">Field notes</Link></div><div><p className="footer-label">Connect</p><a href="mailto:info@raew.in">info@raew.in</a><a href="tel:+917651861335">+91 76518 61335</a><Link href="/contact">Contact RAEW</Link><a href="https://wa.me/917651861335" target="_blank" rel="noreferrer">WhatsApp ↗</a></div></div>
        <div className="footer-base"><span>© 2026 Raj Agro Engineering Works</span><span>Mirzapur, Uttar Pradesh, India</span><Link href="/privacy">Privacy</Link><a href="https://www.refrens.com/" target="_blank" rel="noopener noreferrer" aria-label="Accounting software powered by Refrens"><Image src="/branding/Accounting-Software-Powered-by-Refrens.webp" alt="Accounting software powered by Refrens" width={220} height={56} className="refrens-badge" /></a></div>
      </div>
    </footer>
  );
}
