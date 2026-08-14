import type { Metadata } from "next";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import WhatsAppButton from "@/components/WhatsAppButton";
import { getSiteConfig, isPlaceholderValue } from "@/lib/site-settings";

export const metadata: Metadata = {
  title: {
    default: "M/s Raj Agro Engineering Works | Precision Agricultural Machinery",
    template: "%s | M/s Raj Agro Engineering Works",
  },
  description:
    "Manufacturer of high-performance agricultural machinery, multi-speed rotavators, laser land levelers, multi-crop threshers, tipping trailers, and custom engineering implements.",
  keywords: [
    "Raj Agro Engineering Works",
    "Agricultural Machinery Manufacturer",
    "Rotavator Manufacturer India",
    "Laser Land Leveler",
    "Multi Crop Thresher",
    "Tractor Tipping Trailer",
    "Agricultural Implements",
    "Custom Farm Equipment Fabrication",
  ],
  authors: [{ name: "M/s Raj Agro Engineering Works" }],
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"),
  openGraph: {
    title: "M/s Raj Agro Engineering Works",
    description:
      "Reliable agricultural machinery and engineering solutions built around performance, durability and customer needs.",
    type: "website",
    locale: "en_IN",
    siteName: "M/s Raj Agro Engineering Works",
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const config = await getSiteConfig();
  const structuredData: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    name: config.businessName,
    description: "Agricultural machinery and engineering solutions business.",
    url: process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000",
    priceRange: "Price on Request",
  };

  if (!isPlaceholderValue(config.phonePrimary)) {
    structuredData.telephone = config.phonePrimary;
  }

  if (!isPlaceholderValue(config.address)) {
    structuredData.address = {
      "@type": "PostalAddress",
      streetAddress: config.address,
      addressCountry: "IN",
    };
  }

  return (
    <html lang="en" className="scroll-smooth">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(structuredData),
          }}
        />
      </head>
      <body className="min-h-screen flex flex-col antialiased bg-gray-50 text-slate-900">
        <Header
          phone={config.phonePrimary}
          email={config.emailPrimary}
          whatsapp={config.whatsappNumber}
          businessHours={config.businessHours}
        />
        <main className="flex-grow">{children}</main>
        <WhatsAppButton phone={config.whatsappNumber} />
        <Footer config={config} />
      </body>
    </html>
  );
}
