import { DEFAULT_SITE_CONFIG } from "./config";

export function getWhatsAppLink(productName?: string, customMessage?: string, rawPhone?: string): string {
  const phone = rawPhone || DEFAULT_SITE_CONFIG.whatsappNumber;
  const cleanPhone = phone.replace(/[^0-9]/g, "");

  if (cleanPhone.length < 8) {
    return "/contact";
  }

  let message = "";
  if (customMessage) {
    message = customMessage;
  } else if (productName) {
    message = `Hello M/s Raj Agro Engineering Works,\n\nI am interested in acquiring details and a quotation for:\n*${productName}*\n\nPlease share technical specifications, pricing, and availability.\n\nThank you.`;
  } else {
    message = "Hello M/s Raj Agro Engineering Works,\n\nI visited your website and would like to enquire about your agricultural machinery and custom engineering capabilities.\n\nPlease get in touch. Thank you.";
  }

  return `https://wa.me/${cleanPhone}?text=${encodeURIComponent(message)}`;
}
