"use client";

import { useCallback, useEffect, useId, useRef, useState } from "react";
import Link from "next/link";
import { ChevronDown } from "lucide-react";

export interface NavDropdownItem {
  name: string;
  href: string;
  desc?: string;
}

interface NavDropdownProps {
  label: string;
  items: NavDropdownItem[];
  isActive: boolean;
}

/**
 * Disclosure-style navigation dropdown.
 *
 * Deliberately a button + list rather than an ARIA `menu`: the contents are
 * ordinary page links, and `role="menu"` would put screen readers into an
 * application-style interaction model that fights normal link behaviour.
 *
 * Keyboard: Enter/Space toggles, ArrowDown opens and moves into the list,
 * Escape closes and restores focus to the trigger, Tab moves through the
 * links in DOM order. Pointer: opens on hover for fine pointers only, so a
 * touch tap does not open-then-immediately-close the panel.
 */
export default function NavDropdown({ label, items, isActive }: NavDropdownProps) {
  const [open, setOpen] = useState(false);
  const [hoverEnabled, setHoverEnabled] = useState(false);
  const panelId = useId();
  const wrapperRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const firstItemRef = useRef<HTMLAnchorElement>(null);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Only wire hover-to-open where a real pointer exists.
  useEffect(() => {
    const mq = window.matchMedia("(hover: hover) and (pointer: fine)");
    setHoverEnabled(mq.matches);
    const onChange = (e: MediaQueryListEvent) => setHoverEnabled(e.matches);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  const clearTimer = useCallback(() => {
    if (closeTimer.current) {
      clearTimeout(closeTimer.current);
      closeTimer.current = null;
    }
  }, []);

  useEffect(() => clearTimer, [clearTimer]);

  // Close when the pointer or focus goes elsewhere on the page.
  useEffect(() => {
    if (!open) return;
    const onPointerDown = (event: PointerEvent) => {
      if (!wrapperRef.current?.contains(event.target as Node)) setOpen(false);
    };
    const onFocusIn = (event: FocusEvent) => {
      if (!wrapperRef.current?.contains(event.target as Node)) setOpen(false);
    };
    document.addEventListener("pointerdown", onPointerDown);
    document.addEventListener("focusin", onFocusIn);
    return () => {
      document.removeEventListener("pointerdown", onPointerDown);
      document.removeEventListener("focusin", onFocusIn);
    };
  }, [open]);

  const handleKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (event.key === "Escape" && open) {
      event.preventDefault();
      setOpen(false);
      triggerRef.current?.focus();
    }
  };

  const handleTriggerKeyDown = (event: React.KeyboardEvent<HTMLButtonElement>) => {
    if (event.key === "ArrowDown") {
      event.preventDefault();
      setOpen(true);
      // Wait for the panel to mount before moving focus into it.
      requestAnimationFrame(() => firstItemRef.current?.focus());
    }
  };

  return (
    <div
      ref={wrapperRef}
      className="relative"
      onKeyDown={handleKeyDown}
      onMouseEnter={hoverEnabled ? () => { clearTimer(); setOpen(true); } : undefined}
      onMouseLeave={
        hoverEnabled
          ? () => {
              clearTimer();
              closeTimer.current = setTimeout(() => setOpen(false), 120);
            }
          : undefined
      }
    >
      <button
        ref={triggerRef}
        type="button"
        aria-expanded={open}
        aria-controls={panelId}
        onClick={() => setOpen((v) => !v)}
        onKeyDown={handleTriggerKeyDown}
        className={`inline-flex items-center gap-1 rounded-md px-3 py-2 text-sm font-semibold transition-colors duration-200 ${
          isActive
            ? "bg-[var(--accent-quiet-bg)] text-[var(--accent)]"
            : "text-[var(--text-muted)] hover:bg-[var(--surface-2)] hover:text-[var(--text)]"
        }`}
      >
        {label}
        <ChevronDown
          className={`h-3.5 w-3.5 transition-transform duration-200 ${open ? "rotate-180" : ""}`}
          aria-hidden="true"
        />
      </button>

      {open && (
        <div
          id={panelId}
          className="absolute left-0 top-full z-50 w-72 pt-2"
        >
          <ul className="panel animate-slide-down overflow-hidden p-1.5">
            {items.map((item, index) => (
              <li key={item.href}>
                <Link
                  ref={index === 0 ? firstItemRef : undefined}
                  href={item.href}
                  onClick={() => setOpen(false)}
                  className="block rounded-md px-3 py-2.5 transition-colors duration-150 hover:bg-[var(--surface-2)]"
                >
                  <span className="block text-sm font-bold text-[var(--text)]">{item.name}</span>
                  {item.desc && (
                    <span className="mt-0.5 block text-xs leading-snug text-[var(--text-subtle)]">
                      {item.desc}
                    </span>
                  )}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
