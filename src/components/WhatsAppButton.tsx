"use client";

import { motion } from "framer-motion";
import { MessageSquare } from "lucide-react";
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
    <motion.a
      href={waUrl}
      target="_blank"
      rel="noopener noreferrer"
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.8, duration: 0.3, ease: [0.2, 0, 0.2, 1] }}
      whileTap={{ scale: 0.97 }}
      className="fixed bottom-6 right-6 z-40 hidden items-center gap-2 rounded-lg bg-[#128C7E] px-4 py-3 text-sm font-bold text-white shadow-[var(--shadow-raised)] transition-colors duration-200 hover:bg-[#0f7268] lg:inline-flex"
    >
      <MessageSquare className="h-5 w-5" aria-hidden="true" />
      Enquire on WhatsApp
    </motion.a>
  );
}
