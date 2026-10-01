import type { Metadata, Viewport } from "next";
import { DM_Mono, Manrope } from "next/font/google";
import "./globals.css";
import SiteNavigation from "@/components/navigation/SiteNavigation";
import SiteFooter from "@/components/footer/SiteFooter";
import WhatsAppButton from "@/components/WhatsAppButton";

const manrope = Manrope({ subsets: ["latin"], variable: "--font-body", display: "swap" });
const dmMono = DM_Mono({ subsets: ["latin"], weight: ["400", "500"], variable: "--font-mono", display: "swap" });

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "https://raew.in"),
  title: { default: "RAEW | Agricultural Engineering", template: "%s | RAEW" },
  description: "Agricultural machinery and custom engineering solutions from Raj Agro Engineering Works.",
  openGraph: { title: "RAEW | Agricultural Engineering", description: "Machines shaped around the field.", type: "website", locale: "en_IN" },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = { themeColor: "#08100d", colorScheme: "dark" };

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const organization = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "Raj Agro Engineering Works",
    url: process.env.NEXT_PUBLIC_SITE_URL || "https://raew.in",
    description: "Agricultural machinery and engineering solutions.",
  };

  return (
    <html lang="en" className={`${manrope.variable} ${dmMono.variable}`}>
      <body>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(organization) }} />
        <SiteNavigation />
        {children}
        <SiteFooter />
        <WhatsAppButton />
      </body>
    </html>
  );
}
