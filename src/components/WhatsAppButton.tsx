"use client";

import { MessageCircle } from "lucide-react";
import { getWhatsAppLink } from "@/lib/whatsapp";

interface WhatsAppButtonProps {
  phone?: string;
}

/**
 * Floating WhatsApp action — desktop only.
 *
 * Below `lg` this used to sit at `bottom-6 right-6`, directly on top of
 * <MobileBottomBar />, which already offers WhatsApp as its first action. It is
 * now hidden on small screens: one entry point per viewport, no overlap.
 *
 * Colour: the brand gradient started at #25D366, against which a white icon
 * measures 1.98:1 — below the 3:1 WCAG minimum for meaningful non-text
 * content. The darker brand green #128C7E gives 4.13:1 and still reads as
 * WhatsApp. The infinite `pulse-ring` halo was also dropped; a permanently
 * animating badge reads as a pop-up ad, not as engineering.
 */
export default function WhatsAppButton({ phone }: WhatsAppButtonProps) {
  const waUrl = getWhatsAppLink(undefined, undefined, phone);

  return (
    <a
      href={waUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="whatsapp-float"
      aria-label="Connect with RAEW on WhatsApp"
    >
      <MessageCircle className="whatsapp-icon" aria-hidden="true" />
      <span>Chat on WhatsApp</span>
    </a>
  );
}
