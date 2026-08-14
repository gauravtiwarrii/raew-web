"use client";

import { motion } from "framer-motion";
import { MessageSquare } from "lucide-react";
import { getWhatsAppLink } from "@/lib/whatsapp";

interface WhatsAppButtonProps {
  phone?: string;
}

export default function WhatsAppButton({ phone }: WhatsAppButtonProps) {
  const waUrl = getWhatsAppLink(undefined, undefined, phone);

  return (
    <motion.a
      href={waUrl}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat on WhatsApp"
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ delay: 1.5, type: "spring", stiffness: 260, damping: 20 }}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.95 }}
      className="fixed bottom-6 right-6 z-40 bg-gradient-to-br from-[#25D366] to-[#128C7E] text-white p-4 rounded-2xl shadow-xl shadow-emerald-600/30 flex items-center space-x-2 group pulse-ring"
    >
      <MessageSquare className="w-6 h-6 fill-white text-white" />
      <span className="hidden md:inline-block max-w-0 overflow-hidden group-hover:max-w-[200px] transition-all duration-500 ease-in-out whitespace-nowrap text-xs font-bold pl-0 group-hover:pl-1 pr-0 group-hover:pr-2">
        Enquire on WhatsApp
      </span>
    </motion.a>
  );
}
