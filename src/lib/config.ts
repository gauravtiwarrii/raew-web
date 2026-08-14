export interface SiteConfig {
  businessName: string;
  tagline: string;
  phonePrimary: string;
  phoneSecondary: string;
  whatsappNumber: string;
  emailPrimary: string;
  emailSales: string;
  address: string;
  gstin: string;
  googleMapsUrl: string;
  businessHours: string;
  establishedYear: string;
  facebookUrl: string;
  instagramUrl: string;
  youtubeUrl: string;
}

export const DEFAULT_SITE_CONFIG: SiteConfig = {
  businessName: process.env.NEXT_PUBLIC_BUSINESS_NAME || "M/s Raj Agro Engineering Works",
  tagline: "Precision Agricultural Machinery & Heavy Custom Engineering Solutions",
  phonePrimary: process.env.NEXT_PUBLIC_BUSINESS_PHONE || "9794427644",
  phoneSecondary: "[REPLACE WITH SECONDARY PHONE]",
  whatsappNumber: process.env.NEXT_PUBLIC_BUSINESS_WHATSAPP || "919794427644",
  emailPrimary: process.env.NEXT_PUBLIC_BUSINESS_EMAIL || "info@raew.in",
  emailSales: "[REPLACE WITH SALES EMAIL]",
  address:
    process.env.NEXT_PUBLIC_BUSINESS_ADDRESS ||
    "Madawa Newada, Post- Rehi, Mirzapur, Uttar Pradesh, India - 231211",
  gstin: process.env.NEXT_PUBLIC_BUSINESS_GSTIN || "09BAZPT1519D1Z8",
  googleMapsUrl: "[REPLACE WITH GOOGLE MAPS EMBED URL]",
  businessHours: "[REPLACE WITH BUSINESS HOURS]",
  establishedYear: "[REPLACE WITH ESTABLISHED YEAR OR LEAVE BLANK]",
  facebookUrl: "[REPLACE WITH FACEBOOK URL]",
  instagramUrl: "[REPLACE WITH INSTAGRAM URL]",
  youtubeUrl: "[REPLACE WITH YOUTUBE URL]",
};
