import type { Metadata } from "next";
import { Inter, Space_Grotesk, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import WhatsAppButton from "@/components/WhatsAppButton";
import MobileBottomBar from "@/components/MobileBottomBar";
import { LanguageProvider } from "@/lib/language-context";
import MotionProvider from "@/components/MotionProvider";
import ScrollProgressRail from "@/components/motion/ScrollProgressRail";
import SmoothScrollProvider from "@/components/motion/SmoothScrollProvider";
import CustomCursor from "@/components/motion/CustomCursor";
import { getSiteConfig, isPlaceholderValue } from "@/lib/site-settings";

/* Body text — neutral, highly legible at small sizes. */
const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

/* Display face — Space Grotesk. Two deliberate swaps got us here:
   DM Serif Display (editorial/luxury) → Manrope (neutral geometric) →
   Space Grotesk, which is a proto-grotesque with drafting-table
   character: flat-sided G, squared terminals, narrow uppercase.

   No `weight` array, so Next serves the single VARIABLE file covering
   the 300–700 axis instead of four static cuts — fewer bytes than the
   Manrope it replaces, and font count stays at three.

   Note the axis stops at 700; there is no 800. That is intentional
   rather than a limitation we worked around: 35 headings across the
   site were all set to `font-extrabold`, so weight was carrying no
   hierarchical information at all. Hierarchy now comes from size and
   tracking, and headings sit at 700. If you reach for `font-extrabold`
   on a heading, the browser will smear a synthetic bold — use a larger
   size step instead. */
const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-grotesk",
  display: "swap",
});

/* Technical labels, spec keys and measurements. Monospace signals
   precision and keeps numeric columns aligned. */
const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-mono-technical",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "M/s Raj Agro Engineering Works | Premium Agricultural Machinery",
    template: "%s | Raj Agro Engineering Works",
  },
  description:
    "Premium agricultural machinery manufacturer in Uttar Pradesh. Rotavators, laser land levelers, multi-crop threshers, tipping trailers and custom farm implements built for Indian farming conditions.",
  keywords: [
    "Raj Agro Engineering Works",
    "Agricultural Machinery Manufacturer",
    "Rotavator Manufacturer India",
    "Laser Land Leveler Mirzapur",
    "Multi Crop Thresher",
    "Tractor Tipping Trailer",
    "Agricultural Implements Uttar Pradesh",
    "Custom Farm Equipment Fabrication",
    "Agricultural Machinery Mirzapur",
    "Farm Equipment Manufacturer UP",
  ],
  authors: [{ name: "M/s Raj Agro Engineering Works" }],
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "https://raew.in"),
  /* There was an `alternates: { canonical: "/" }` here. Because metadata is
     inherited, and because only /products and /products/[slug] declared their
     own, every other page — /about, /services, /contact, /gallery, /categories,
     /quote, /after-sales, /field-performance — emitted
     <link rel="canonical" href="https://raew.in/">, i.e. each one told Google
     it was a duplicate of the homepage and should not be indexed on its own.
     That directly contradicted sitemap.ts, which lists them all as indexable.
     Canonicals are now declared per page; the homepage declares its own. */
  openGraph: {
    title: "M/s Raj Agro Engineering Works | Premium Agricultural Machinery",
    description:
      "Premium agricultural machinery built for Indian farming conditions. Rotavators, laser levelers, threshers & custom implements from Mirzapur, Uttar Pradesh.",
    type: "website",
    locale: "en_IN",
    siteName: "M/s Raj Agro Engineering Works",
    url: process.env.NEXT_PUBLIC_SITE_URL || "https://raew.in",
  },
  twitter: {
    card: "summary_large_image",
    title: "M/s Raj Agro Engineering Works | Agricultural Machinery",
    description:
      "Rotavators, laser land levelers, threshers, tipping trailers & custom machinery. Direct from manufacturer in Mirzapur, UP.",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const config = await getSiteConfig();

  // LocalBusiness + Organization structured data
  const localBusinessSchema: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": ["LocalBusiness", "Organization"],
    name: config.businessName,
    description:
      "Agricultural machinery and engineering solutions manufacturer based in Mirzapur, Uttar Pradesh, India.",
    url: process.env.NEXT_PUBLIC_SITE_URL || "https://raew.in",
    priceRange: "Price on Request",
    image: `${process.env.NEXT_PUBLIC_SITE_URL || "https://raew.in"}/branding/raew-logo.png`,
    logo: `${process.env.NEXT_PUBLIC_SITE_URL || "https://raew.in"}/branding/raew-logo.png`,
  };

  if (!isPlaceholderValue(config.phonePrimary)) {
    localBusinessSchema.telephone = config.phonePrimary;
  }

  if (!isPlaceholderValue(config.address)) {
    localBusinessSchema.address = {
      "@type": "PostalAddress",
      streetAddress: "Madawa Newada, Post- Rehi",
      addressLocality: "Mirzapur",
      addressRegion: "Uttar Pradesh",
      postalCode: "231211",
      addressCountry: "IN",
    };
    localBusinessSchema.geo = {
      "@type": "GeoCoordinates",
      latitude: "25.1448",
      longitude: "82.5691",
    };
  }

  if (!isPlaceholderValue(config.gstin)) {
    localBusinessSchema.taxID = config.gstin;
  }

  if (!isPlaceholderValue(config.emailPrimary)) {
    localBusinessSchema.email = config.emailPrimary;
  }

  // WebSite schema with SearchAction
  const websiteSchema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "M/s Raj Agro Engineering Works",
    url: process.env.NEXT_PUBLIC_SITE_URL || "https://raew.in",
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: `${process.env.NEXT_PUBLIC_SITE_URL || "https://raew.in"}/products?search={search_term_string}`,
      },
      "query-input": "required name=search_term_string",
    },
  };

  return (
    <html
      lang="en"
      className={`${inter.variable} ${spaceGrotesk.variable} ${jetbrainsMono.variable} scroll-smooth`}
    >
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(localBusinessSchema),
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(websiteSchema),
          }}
        />
      </head>
      <body
        className="min-h-screen flex flex-col antialiased font-[family-name:var(--font-inter)] bg-[var(--bg)] text-[var(--text)]"
        /* Bottom padding on mobile to avoid content behind sticky bottom bar */
        style={{ paddingBottom: "env(safe-area-inset-bottom, 0)" }}
      >
        <a href="#main" className="skip-link">
          Skip to main content
        </a>
        <LanguageProvider>
          <MotionProvider>
            {/* Renders nothing and imports Lenis + GSAP only inside an effect,
                so neither package enters the shared layout chunk and neither is
                downloaded at all on touch devices or under reduced motion. */}
            <SmoothScrollProvider />
            {/* Both render nothing on touch devices and under reduced-motion,
                and neither participates in layout, so they cannot shift
                content. The cursor additionally returns null during SSR. */}
            <ScrollProgressRail />
            <CustomCursor />
            <Header
              phone={config.phonePrimary}
              email={config.emailPrimary}
              whatsapp={config.whatsappNumber}
              businessHours={config.businessHours}
            />
            <main id="main" className="flex-grow pb-14 lg:pb-0">
              {children}
            </main>
            <WhatsAppButton phone={config.whatsappNumber} />
            <MobileBottomBar phone={config.phonePrimary} whatsapp={config.whatsappNumber} />
            <Footer config={config} />
          </MotionProvider>
        </LanguageProvider>
      </body>
    </html>
  );
}
