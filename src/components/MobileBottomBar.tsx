"use client";

import Link from "next/link";
import { MessageSquare, Phone, FileText } from "lucide-react";
import { getWhatsAppLink } from "@/lib/whatsapp";

interface MobileBottomBarProps {
  phone?: string;
  whatsapp?: string;
}

/**
 * Persistent mobile action bar. `<main>` in layout.tsx carries `pb-14` so the
 * bar never covers page content.
 *
 * Note on colour: the WhatsApp brand green (#25D366) was previously used as the
 * label colour here. Against white it measures 1.98:1 — far below WCAG AA, and
 * at 10px it was effectively unreadable. The icon carries the brand
 * recognition; the label uses the accessible accent green instead.
 */
export default function MobileBottomBar({
  phone = "+91 7651861335",
  whatsapp,
}: MobileBottomBarProps) {
  const cleanPhone = phone.replace(/[^0-9+]/g, "");
  const waUrl = getWhatsAppLink(undefined, undefined, whatsapp);

  return (
    <nav
      className="fixed inset-x-0 bottom-0 z-40 border-t border-[var(--border)] bg-[var(--surface)] shadow-[0_-2px_12px_rgb(8_9_11_/_0.08)] lg:hidden"
      style={{ paddingBottom: "env(safe-area-inset-bottom, 0px)" }}
      aria-label="Quick contact"
    >
      <ul className="grid grid-cols-3 divide-x divide-[var(--border)]">
        <li className="contents">
          <a
            href={waUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex flex-col items-center justify-center gap-1 py-2.5 text-[var(--accent)] transition-colors duration-150 active:bg-[var(--accent-quiet-bg)]"
          >
            <MessageSquare className="h-5 w-5" aria-hidden="true" />
            <span className="text-[11px] font-bold tracking-tight">WhatsApp</span>
          </a>
        </li>

        <li className="contents">
          <a
            href={`tel:${cleanPhone}`}
            className="flex flex-col items-center justify-center gap-1 py-2.5 text-[var(--text-muted)] transition-colors duration-150 active:bg-[var(--surface-2)]"
          >
            <Phone className="h-5 w-5" aria-hidden="true" />
            <span className="text-[11px] font-bold tracking-tight">Call</span>
          </a>
        </li>

        <li className="contents">
          <Link
            href="/quote"
            className="flex flex-col items-center justify-center gap-1 bg-[var(--accent)] py-2.5 text-[var(--accent-fg)] transition-colors duration-150 hover:bg-[var(--accent-hover)] active:bg-[var(--accent-active)]"
          >
            <FileText className="h-5 w-5" aria-hidden="true" />
            <span className="text-[11px] font-bold tracking-tight">Get Quote</span>
          </Link>
        </li>
      </ul>
    </nav>
  );
}
