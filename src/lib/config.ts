export interface SiteConfig {
  businessName: string;
  tagline: string;
  phonePrimary: string;
  phoneSecondary: string;
  whatsappNumber: string;
  emailPrimary: string;
  emailSales: string;
  address: string;
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
  phonePrimary: process.env.NEXT_PUBLIC_BUSINESS_PHONE || "[REPLACE WITH ACTUAL BUSINESS PHONE]",
  phoneSecondary: "[REPLACE WITH SECONDARY PHONE]",
  whatsappNumber: process.env.NEXT_PUBLIC_BUSINESS_WHATSAPP || "[REPLACE WITH ACTUAL WHATSAPP NUMBER]",
  emailPrimary: process.env.NEXT_PUBLIC_BUSINESS_EMAIL || "[REPLACE WITH BUSINESS EMAIL]",
  emailSales: "[REPLACE WITH SALES EMAIL]",
  address: process.env.NEXT_PUBLIC_BUSINESS_ADDRESS || "[REPLACE WITH FACTORY ADDRESS]",
  googleMapsUrl: "[REPLACE WITH GOOGLE MAPS EMBED URL]",
  businessHours: "[REPLACE WITH BUSINESS HOURS]",
  establishedYear: "[REPLACE WITH ESTABLISHED YEAR OR LEAVE BLANK]",
  facebookUrl: "[REPLACE WITH FACEBOOK URL]",
  instagramUrl: "[REPLACE WITH INSTAGRAM URL]",
  youtubeUrl: "[REPLACE WITH YOUTUBE URL]",
};
