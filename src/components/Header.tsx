"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { Menu, X, Phone, Mail, Clock, MessageSquare, ChevronRight, Globe } from "lucide-react";
import { getWhatsAppLink } from "@/lib/whatsapp";
import { useLanguage } from "@/lib/language-context";
import NavDropdown, { type NavDropdownItem } from "@/components/navbar/NavDropdown";

interface HeaderProps {
  phone?: string;
  email?: string;
  whatsapp?: string;
  businessHours?: string;
}

interface NavGroup {
  label: string;
  href: string;
  items?: NavDropdownItem[];
}

/**
 * Nine flat links previously sat in one row, which read as a sitemap rather
 * than a considered navigation. They are grouped here into five entries —
 * every original route is still one click away, nothing was dropped.
 */
const NAV: NavGroup[] = [
  {
    label: "Products",
    href: "/products",
    items: [
      { name: "All Machinery", href: "/products", desc: "Full catalogue with specifications" },
      { name: "Categories", href: "/categories", desc: "Browse by machine type" },
      { name: "Gallery", href: "/gallery", desc: "Machines and workshop photographs" },
    ],
  },
  {
    label: "Solutions",
    href: "/services",
    items: [
      { name: "Services", href: "/services", desc: "Custom fabrication and engineering" },
      { name: "After-Sales Support", href: "/after-sales", desc: "Spare parts, repairs and warranty" },
      { name: "Field Support", href: "/field-performance", desc: "Demonstrations and specification help" },
    ],
  },
  { label: "About", href: "/about" },
  { label: "Industries", href: "/#industries" },
  { label: "Contact", href: "/contact" },
];

export default function Header({
  phone = "+91 7651861335",
  email = "info@raew.in",
  whatsapp = "917651861335",
  businessHours = "24/7",
}: HeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();
  const { lang, t, setLang } = useLanguage();
  const prefersReducedMotion = useReducedMotion();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [pathname]);

  const cleanPhone = phone.split("[")[0].trim() || phone;
  const cleanEmail = email.split("[")[0].trim() || email;
  const whatsAppHref = getWhatsAppLink(undefined, undefined, whatsapp);
  const telHref = `tel:${cleanPhone.replace(/[^\d+]/g, "")}`;

  const isGroupActive = (group: NavGroup) =>
    group.items
      ? group.items.some((item) => pathname === item.href)
      : pathname === group.href;

  const toggleLang = () => setLang(lang === "en" ? "hi" : "en");
  const langLabel = lang === "en" ? t("language.hindi") : t("language.english");

  /* ── Overlay mode ────────────────────────────────────────────────
     The homepage opens on a full-viewport dark hero, so the navigation
     sits ON it rather than above it — no 100px band of chrome across the
     first thing a visitor sees. Every other route opens on a light page,
     where a transparent bar would put dark-on-light nav text over white
     and hang a translucent black panel over nothing. So transparency is
     ROUTE-GATED, not global. If another route ever gains a dark
     full-bleed hero, add it to this check; do not remove the check.

     One consequence worth knowing before editing the active states
     below: `isGroupActive` compares against `pathname`, and NAV has no
     "/" entry, so on the homepage nothing is active. That is why the
     `--accent-quiet-bg` / `--accent` active pill needs no dark variant —
     it never renders in overlay mode. If a "Home" entry is ever added to
     NAV, that pill will start appearing on black and will need one. */
  const overlay = pathname === "/";

  /* The bar goes opaque when the drawer is open as well as on scroll. An
     opaque panel hanging off a fully transparent bar reads as a bug. */
  const solid = scrolled || mobileMenuOpen;

  /* ── Why these are complete literal class strings ──
     Tailwind v4 scans source TEXT for candidates. A composed
     `text-[${someVariable}]` yields a class name at runtime that was
     never compiled, so the rule simply does not exist. Every branch
     below therefore spells its classes out in full, even where that
     means repeating a prefix.

     `.cinema` on the wrapper is the whole trick: it rebinds `--text`,
     `--text-muted`, `--surface`, `--border`, `--focus` and
     `--shadow-panel` for this subtree, so the nav links, the dropdown
     trigger, NavDropdown's `.panel`, the hamburger and the entire mobile
     drawer render correctly on black with ZERO changes to their own
     class lists or to NavDropdown.tsx.

     `--surface-2` is rebound past `.cinema`'s value because in this
     subtree it is only ever a hover fill, and `.cinema` points it at
     `--cinema-stage` (#0b0d0c) — a fill DARKER than the ground it sits
     on, which reads as pressed-in rather than picked-up. A 10% white
     wash is the supporting cue; the primary hover signal is the label
     going `--text-muted` → `--text`.

     `backdrop-blur` is gated on `solid` rather than always on: a
     permanent backdrop-filter layer on a sticky element is real GPU
     cost on a phone for no visible gain, since what sits behind the
     unscrolled bar is a near-black gradient that blurs to itself. */
  const barChrome = overlay
    ? `cinema absolute inset-x-0 top-0 z-10 [--surface-2:rgb(255_255_255/0.10)] transition-colors duration-300 ${
        solid
          ? "border-b border-[rgb(255_255_255/0.10)] bg-[rgb(7_7_7/0.72)] backdrop-blur-xl"
          : "border-b border-transparent bg-transparent"
      }`
    : "";

  return (
    /* One sticky context only. The nav previously declared `sticky top-0`
       inside an already-sticky header, which does nothing but risk stacking
       bugs. Note `html { overflow-x: clip }` in globals.css — using `hidden`
       there would silently disable this.

       In overlay mode the header itself collapses to `h-0` and the bar
       becomes an absolutely positioned child. That is what lets it paint
       over the hero while contributing NOTHING to layout: no measured
       `--header-h`, no spacer element whose height has to be kept in sync
       with the bar's across three breakpoints, and no negative margin on
       the hero. The hero already carries `pt-28 md:pt-32` (112 / 128px)
       against a bar that measures roughly 70px on mobile and 99px on
       desktop unscrolled, so it needed no change at all.

       `min-h-0` is belt and braces. `<header>` is a flex item of
       `body.flex-col`, where `min-height: auto` resolves to the
       content-based minimum; both children are out of flow in overlay
       mode so that minimum is already zero, but the day someone adds an
       in-flow child here, `h-0` alone would quietly stop being zero.

       `sticky` rather than `fixed` even at zero height: the containing
       block is the body, which spans the document, so a zero-height
       sticky top bar pins exactly like a fixed one — and it keeps working
       if the header is ever moved inside a scroll container. */
    <header className={`sticky top-0 z-50 w-full ${overlay ? "h-0 min-h-0" : ""}`}>
      {/* ── Dismiss layer (overlay mode only) ──
          The drawer floats over the hero here instead of pushing it down,
          and the hero's CTAs sit inside the area it covers — so a tap
          meant to dismiss the menu would otherwise land on "Request a
          Quote" and navigate. The scrim makes that dead zone visible and
          closes on tap.

          It lives OUTSIDE the bar wrapper on purpose: `position: fixed`
          resolves against the viewport only because `<header>` sets no
          transform, filter or backdrop-filter, and the wrapper below does
          set `backdrop-filter` — inside it, `fixed inset-0` would size to
          the bar. Painted before the bar in DOM order, so the bar stays
          on top without either needing a z-index of its own.

          `aria-hidden` with a click handler and no tab stop is deliberate:
          it duplicates the X button, which is always visible and is the
          keyboard route. Adding a second focusable "close" would announce
          the same action twice. */}
      <AnimatePresence>
        {overlay && mobileMenuOpen && (
          <motion.div
            aria-hidden="true"
            onClick={() => setMobileMenuOpen(false)}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25, ease: [0.2, 0, 0.2, 1] }}
            className="fixed inset-0 bg-[rgb(7_7_7/0.6)] lg:hidden"
          />
        )}
      </AnimatePresence>

      <div className={barChrome}>
        {/* Machined accent rule. Was an infinitely animating gradient.
            In overlay mode it FADES in with the rest of the chrome rather
            than mounting: rendering it conditionally would add 2px of
            height on the first scroll event and shift the whole bar. */}
        <div
          className={`h-[2px] transition-colors duration-300 ${
            overlay && !solid ? "bg-transparent" : "bg-[var(--accent)]"
          }`}
          aria-hidden="true"
        />

        {/* ── Utility bar ──────────────────────────────────────────
            In overlay mode it drops its own ground so the wrapper supplies
            one continuous translucent layer instead of two stacked ones.
            `.on-dark` is redundant under `.cinema` but harmless, and it is
            what keeps this bar correct on every other route.

            Contrast holds in both states: `--text-inverse-muted` measures
            7.86:1 on the hero's own #070707, 6.1:1 over the brightest
            point of `.stage-light`, and 7.54:1 on the scrolled bar's 72%
            black composited over the lightest steel value on the site. */}
        <div
          className={`on-dark hidden text-xs text-[var(--text-inverse-muted)] md:block ${
            overlay ? "bg-transparent" : "bg-[var(--surface-inverse)]"
          }`}
        >
          <div className="shell flex items-center justify-between py-2">
            <div className="flex items-center gap-6">
              <a
                href={telHref}
                className="flex items-center gap-1.5 transition-colors duration-200 hover:text-[var(--text-inverse)]"
              >
                <Phone className="h-3.5 w-3.5 text-[var(--accent-on-dark)]" aria-hidden="true" />
                <span>{cleanPhone}</span>
              </a>
              <a
                href={`mailto:${cleanEmail}`}
                className="flex items-center gap-1.5 transition-colors duration-200 hover:text-[var(--text-inverse)]"
              >
                <Mail className="h-3.5 w-3.5 text-[var(--accent-on-dark)]" aria-hidden="true" />
                <span>{cleanEmail}</span>
              </a>
              <span className="flex items-center gap-1.5">
                <Clock className="h-3.5 w-3.5 text-[var(--accent-on-dark)]" aria-hidden="true" />
                <span>{businessHours}</span>
              </span>
            </div>

            <div className="flex items-center gap-5">
              <a
                href={whatsAppHref}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 font-semibold text-[var(--accent-on-dark)] transition-colors duration-200 hover:text-[var(--accent-on-dark-strong)]"
              >
                <MessageSquare className="h-3.5 w-3.5" aria-hidden="true" />
                <span>WhatsApp</span>
              </a>

              <button
                type="button"
                onClick={toggleLang}
                aria-label={`${t("language.switcherLabel")}: ${langLabel}`}
                className="flex items-center gap-1.5 font-semibold text-[var(--accent-on-dark)] transition-colors duration-200 hover:text-[var(--accent-on-dark-strong)]"
              >
                <Globe className="h-3.5 w-3.5" aria-hidden="true" />
                <span>{langLabel}</span>
              </button>
            </div>
          </div>
        </div>

        {/* ── Main navigation ────────────────────────────────────
            The border and ground are both conditional. In overlay mode the
            wrapper above owns them, and a second `border-b` here would draw
            a hairline across the middle of the chrome. The shadow is dropped
            too — `--shadow-panel` is a soft black drop shadow, which is
            invisible work against a near-black hero; the scrolled bar's
            separation comes from its own top border and the blur instead.

            `py-2` / `py-3` on `scrolled` stays in both modes: the bar
            tightening as you scroll is the change that actually reads.

            ── Known, measured, and accepted: a ~13px shift ──
            This is one of only two animations on the site that touch a
            layout property (`padding` here, the logo's `height` below);
            everything else is transform or opacity. In OVERLAY mode that
            costs nothing downstream, because the bar is out of flow — the
            hero does not move. On every other route the header is in flow,
            so condensing from roughly 99px to 86px pulls `<main>` up by
            about 13px on the first scroll past 20px.

            Scroll is a continuous interaction, so Chrome does NOT set
            `hadRecentInput` for it, which means this shift does count
            toward CLS. It works out at roughly 0.015 (impact fraction ~1.0
            × distance fraction 13/~870), once per page view, against a
            0.1 "good" budget — so it is small and bounded rather than
            free. Removing it entirely means giving the bar a fixed height
            and scaling the logo by transform instead, which changes the
            measured geometry of every light page and needs to be checked
            in a browser. Flagged rather than done blind. */}
        <nav
          aria-label="Primary"
          className={`border-b transition-[padding,box-shadow] duration-300 ${
            overlay ? "border-transparent bg-transparent" : "border-[var(--border)] bg-[var(--surface)]"
          } ${
            scrolled
              ? overlay
                ? "py-2"
                : "py-2 shadow-[var(--shadow-panel)]"
              : "py-3"
          }`}
        >
          <div className="shell flex items-center justify-between gap-4">
            {/* ── Logo & wordmark ──
                `min-w-0` and no `shrink-0`, which is the reverse of what this
                was. With `shrink-0` the group held its max-content width — mark
                (66px at h-11) plus a 12px gap plus roughly 158px of "Raj Agro
                Engineering" at 16px extrabold, so about 236px — and the row
                needed 292px against the 288px a 320px viewport leaves after
                gutters. The overflow went where `html { overflow-x: clip }`
                sends it: the hamburger's right edge got shaved off, on the one
                width where the hamburger is the only way into the navigation.

                So the mark is `shrink-0` and everything to its right may
                shrink. `truncate` on the wordmark is the structural guarantee:
                whatever a font metric or a longer company name does, the mark
                and the menu button are always whole and the page never scrolls
                sideways. The step down to `text-sm` under 360px is what keeps
                the ellipsis from ever actually being needed on a real phone. */}
            <Link href="/" className="group flex min-w-0 items-center gap-3">
              <Image
                src="/branding/raew-logo.png"
                alt="Raj Agro Engineering Works logo"
                width={612}
                height={408}
                priority
                className={`w-auto shrink-0 transition-[height] duration-300 ${scrolled ? "h-9" : "h-11"}`}
              />
              <span className="flex min-w-0 flex-col">
                {/* The hover colour is mode-dependent for a measured reason.
                    `--accent` (#047857) as TEXT on the stage black measures
                    3.67:1 — fine as a 2px rule or a button ground, below the
                    4.5:1 floor for a 16–18px bold wordmark. `--accent-on-dark`
                    (#34d399) measures 10.48:1 on the same ground.

                    Rebinding `--accent` on the wrapper would have fixed this
                    in one line and broken four other things: in this subtree
                    `--accent` is a button BACKGROUND carrying white label text
                    (both quote CTAs, the drawer's primary button), and pointing
                    it at #34d399 would drop those labels to about 1.9:1. */}
                <span
                  className={`truncate text-sm font-extrabold leading-tight tracking-tight text-[var(--text)] transition-colors duration-200 min-[360px]:text-base sm:text-lg ${
                    overlay
                      ? "group-hover:text-[var(--accent-on-dark)]"
                      : "group-hover:text-[var(--accent)]"
                  }`}
                >
                  Raj Agro Engineering
                </span>
                <span className="spec-label hidden truncate sm:block">
                  Agricultural Machinery &amp; Engineering
                </span>
              </span>
            </Link>

            {/* Desktop links */}
            <div className="hidden items-center gap-1 lg:flex">
              {NAV.map((group) =>
                group.items ? (
                  <NavDropdown
                    key={group.label}
                    label={group.label}
                    items={group.items}
                    isActive={isGroupActive(group)}
                  />
                ) : (
                  <Link
                    key={group.label}
                    href={group.href}
                    className={`relative rounded-md px-3 py-2 text-sm font-semibold transition-colors duration-200 ${
                      isGroupActive(group)
                        ? "bg-[var(--accent-quiet-bg)] text-[var(--accent)]"
                        : "text-[var(--text-muted)] hover:bg-[var(--surface-2)] hover:text-[var(--text)]"
                    }`}
                  >
                    {group.label}
                    {isGroupActive(group) && (
                      <motion.span
                        layoutId="nav-indicator"
                        className="absolute inset-x-3 bottom-0.5 h-[2px] bg-[var(--accent)]"
                        transition={{ type: "spring", stiffness: 500, damping: 30 }}
                      />
                    )}
                  </Link>
                )
              )}
            </div>

            {/* Desktop CTA.
                This deliberately does NOT change in overlay mode. `--accent`
                as a shape against #070707 measures 3.67:1, clearing the 3:1
                non-text threshold, and its white label sits at 5.48:1 on the
                fill — so the button is legible and, being the only saturated
                area in the bar, it is unambiguously the primary action.

                `--accent-bright` (#059669) was tried first because it reads
                livelier on black; it was rejected on measurement. White on it
                is 3.77:1, and a 14px bold label is not "large text" (that
                needs 18.66px bold), so it would have failed AA outright. */}
            <div className="hidden shrink-0 sm:flex">
              <Link
                href="/quote"
                className="inline-flex items-center gap-1 rounded-md bg-[var(--accent)] px-5 py-2.5 text-sm font-bold text-[var(--accent-fg)] transition-colors duration-200 hover:bg-[var(--accent-hover)]"
              >
                Get a Quote
                <ChevronRight className="h-4 w-4" aria-hidden="true" />
              </Link>
            </div>

            {/* ── Mobile controls ──
                The narrow "Quote" pill that used to sit here (`sm:hidden`, so
                only under 640px) has been removed. It was the third quote CTA
                on those widths: `MobileBottomBar` is rendered globally from
                layout.tsx as `fixed bottom-0 lg:hidden` with a full-width cell
                on `--accent` reading "Get Quote", and the drawer below carries
                "Request a Quote" as its primary button. Nothing is lost —
                `/quote` stays one tap away, more prominently than it was here.

                Removing it also bought back about 65px on exactly the widths
                where the row had none, which is why the mark, the name and
                the menu button now all fit at 320px. */}
            <div className="flex shrink-0 items-center lg:hidden">
              <button
                type="button"
                onClick={() => setMobileMenuOpen((v) => !v)}
                aria-expanded={mobileMenuOpen}
                aria-controls="mobile-nav"
                aria-label={mobileMenuOpen ? "Close navigation menu" : "Open navigation menu"}
                className="rounded-md p-2 text-[var(--text-muted)] transition-colors duration-200 hover:bg-[var(--surface-2)] hover:text-[var(--text)]"
              >
                {mobileMenuOpen ? (
                  <X className="h-6 w-6" aria-hidden="true" />
                ) : (
                  <Menu className="h-6 w-6" aria-hidden="true" />
                )}
              </button>
            </div>
          </div>
        </nav>

        {/* ── Mobile drawer ──────────────────────────────────────
            `height: 0 → auto` is the one animation on this page that is not
            compositor-only, and it is deliberate: on every route except the
            homepage this header is in flow, so the drawer has to push the
            page down as it opens. A transform reveal would slide it over the
            content instead, which on a light page means text visible through
            nothing and a hard jump when the drawer's real height lands.

            It is also the one animation `MotionConfig reducedMotion="user"`
            in MotionProvider does NOT switch off — that setting suppresses
            transform and layout animations, and `height` is neither. So the
            branch is explicit here. Under reduced motion the drawer takes its
            natural height immediately and only cross-fades: a 120ms opacity
            change carries no vestibular risk, while 250ms of a panel growing
            out of nothing does. */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              id="mobile-nav"
              initial={prefersReducedMotion ? { opacity: 0 } : { opacity: 0, height: 0 }}
              animate={prefersReducedMotion ? { opacity: 1 } : { opacity: 1, height: "auto" }}
              exit={prefersReducedMotion ? { opacity: 0 } : { opacity: 0, height: 0 }}
              transition={{ duration: prefersReducedMotion ? 0.12 : 0.25, ease: [0.2, 0, 0.2, 1] }}
              className="overflow-hidden border-b border-[var(--border)] bg-[var(--surface)] shadow-[var(--shadow-panel)] lg:hidden"
            >
              {/* `svh`, not `vh`. On iOS Safari `100vh` is the *expanded*
                  viewport, so `70vh` can exceed 70% of what is actually
                  visible and put the bottom of a long menu behind the browser
                  chrome. `70svh` is 70% of the smallest viewport, which is the
                  only one guaranteed to be on screen.

                  `data-lenis-prevent` hands wheel gestures over this element
                  back to the browser. Lenis intercepts wheel events globally
                  and calls preventDefault, so without this a wheel inside a
                  nested vertical scroller scrolls the PAGE behind the open menu
                  and the menu itself never moves. It looks like a mobile-only
                  concern because the drawer is `lg:hidden`, but Lenis is active
                  on any fine-pointer device — including a desktop browser
                  resized below 1024px, which is how everyone tests this. */}
              <div
                data-lenis-prevent
                className="shell max-h-[70svh] overflow-y-auto py-4"
              >
                <ul className="space-y-1">
                  {NAV.map((group) => (
                    <li key={group.label}>
                      {group.items ? (
                        <>
                          <p className="spec-label px-3 pb-1 pt-3">{group.label}</p>
                          <ul>
                            {group.items.map((item) => (
                              <li key={item.href}>
                                <Link
                                  href={item.href}
                                  onClick={() => setMobileMenuOpen(false)}
                                  className={`block rounded-md px-3 py-2.5 text-base font-semibold transition-colors duration-200 ${
                                    pathname === item.href
                                      ? "bg-[var(--accent-quiet-bg)] text-[var(--accent)]"
                                      : "text-[var(--text-muted)] hover:bg-[var(--surface-2)]"
                                  }`}
                                >
                                  {item.name}
                                </Link>
                              </li>
                            ))}
                          </ul>
                        </>
                      ) : (
                        <Link
                          href={group.href}
                          onClick={() => setMobileMenuOpen(false)}
                          className={`mt-1 block rounded-md px-3 py-2.5 text-base font-semibold transition-colors duration-200 ${
                            isGroupActive(group)
                              ? "bg-[var(--accent-quiet-bg)] text-[var(--accent)]"
                              : "text-[var(--text)] hover:bg-[var(--surface-2)]"
                          }`}
                        >
                          {group.label}
                        </Link>
                      )}
                    </li>
                  ))}
                </ul>

                <div className="mt-4 space-y-3 border-t border-[var(--border)] pt-4">
                  <Link
                    href="/quote"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex w-full items-center justify-center rounded-md bg-[var(--accent)] py-3 text-sm font-bold text-[var(--accent-fg)]"
                  >
                    Request a Quote
                  </Link>
                  {/* Secondary action, and it has to keep reading as secondary.
                      On the light drawer the mint `--accent-quiet-bg` fill is
                      quieter than the solid green button above it. On the dark
                      drawer it inverts: #ecfdf5 against `--cinema-riser` is
                      17.59:1, which would make this the brightest element on
                      the panel and the loudest thing in the menu. And its
                      `--accent` label on that riser is only 3.38:1. So on dark
                      it becomes an outline button — no fill, hairline border,
                      `--accent-on-dark` label at 9.64:1. */}
                  <a
                    href={whatsAppHref}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => setMobileMenuOpen(false)}
                    className={`flex w-full items-center justify-center gap-2 rounded-md border py-2.5 text-sm font-bold ${
                      overlay
                        ? "border-[rgb(255_255_255/0.22)] text-[var(--accent-on-dark)]"
                        : "border-[var(--accent-quiet-border)] bg-[var(--accent-quiet-bg)] text-[var(--accent)]"
                    }`}
                  >
                    <MessageSquare className="h-4 w-4" aria-hidden="true" />
                    Chat on WhatsApp
                  </a>

                  {/* The switcher used to live only in the desktop utility bar,
                      leaving Hindi unreachable on a phone. */}
                  <div className="flex items-center justify-between gap-3 pt-1">
                    <a
                      href={telHref}
                      className="flex items-center gap-2 text-sm font-semibold text-[var(--text-muted)]"
                    >
                      {/* Same 3.38:1 problem as the WhatsApp label above, and
                          an icon has no size exemption worth relying on. */}
                      <Phone
                        className={`h-4 w-4 ${
                          overlay ? "text-[var(--accent-on-dark)]" : "text-[var(--accent)]"
                        }`}
                        aria-hidden="true"
                      />
                      {cleanPhone}
                    </a>
                    <button
                      type="button"
                      onClick={toggleLang}
                      aria-label={`${t("language.switcherLabel")}: ${langLabel}`}
                      className="flex items-center gap-1.5 rounded-md border border-[var(--border)] px-3 py-1.5 text-sm font-semibold text-[var(--text-muted)]"
                    >
                      <Globe className="h-4 w-4" aria-hidden="true" />
                      {langLabel}
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </header>
  );
}
