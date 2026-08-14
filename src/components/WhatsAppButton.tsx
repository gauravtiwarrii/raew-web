"use client";

import { MessageSquare } from "lucide-react";
import { getWhatsAppLink } from "@/lib/whatsapp";

interface WhatsAppButtonProps {
  phone?: string;
}

export default function WhatsAppButton({ phone }: WhatsAppButtonProps) {
  const waUrl = getWhatsAppLink(undefined, undefined, phone);

  return (
    <a
      href={waUrl}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat on WhatsApp"
      className="fixed bottom-6 right-6 z-40 bg-emerald-600 hover:bg-emerald-700 text-white p-3.5 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 flex items-center space-x-2 group"
    >
      <MessageSquare className="w-6 h-6 fill-white text-emerald-600" />
      <span className="hidden md:inline-block max-w-0 overflow-hidden group-hover:max-w-xs transition-all duration-500 ease-in-out whitespace-nowrap text-xs font-bold pl-1 pr-2">
        Enquire on WhatsApp
      </span>
    </a>
  );
}
