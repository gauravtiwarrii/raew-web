"use client";

import { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Phone, Mail, MapPin, Clock, MessageSquare, Send, CheckCircle2, AlertCircle } from "lucide-react";
import { SiteConfig } from "@/lib/config";
import { getWhatsAppLink } from "@/lib/whatsapp";

const contactSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  company: z.string().optional(),
  phone: z.string().min(8, "Valid phone number required"),
  email: z.string().email("Valid email required").optional().or(z.literal("")),
  location: z.string().min(2, "City / District is required"),
  message: z.string().min(10, "Please provide message details (at least 10 characters)"),
  website: z.string().optional(),
});

type ContactFormData = z.infer<typeof contactSchema>;

interface ContactClientProps {
  config: SiteConfig;
}

/* Shared field styling. Kept as constants rather than repeated inline so that a
   change to the focus ring or the error border cannot land on five of the six
   fields and miss one. */
const LABEL_CLASS = "mb-1.5 block text-xs font-bold text-[var(--text)]";
const INPUT_BASE =
  "w-full rounded-[6px] border bg-[var(--surface-2)] px-3.5 py-2.5 text-sm text-[var(--text)] placeholder:text-[var(--text-subtle)] transition-colors duration-150 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--focus)]";
const ERROR_TEXT_CLASS = "mt-1.5 text-[11px] font-semibold text-[var(--color-danger-600)]";

function inputClass(hasError: boolean) {
  return `${INPUT_BASE} ${
    hasError
      ? "border-[var(--color-danger-500)]"
      : "border-[var(--border-strong)] hover:border-[var(--text-subtle)]"
  }`;
}

/**
 * Contact page.
 *
 * The form had a serious accessibility defect: not one of its six `<label>`
 * elements was associated with its input. There were no `id` attributes and no
 * `htmlFor`, so clicking a label did nothing, and a screen reader reached each
 * field with no idea what it was for. Validation messages had the same problem
 * — they were rendered as loose paragraphs with no `aria-describedby` and no
 * `aria-invalid`, so a non-sighted user was told a field was wrong only by the
 * form refusing to submit. Both are wired up properly now.
 *
 * The address, phone numbers and email address were also plain text. On the
 * contact page of a manufacturer, they are the point of the page, so they are
 * now `tel:` / `mailto:` links and the address opens the map.
 */
export default function ContactClient({ config }: ContactClientProps) {
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const successRef = useRef<HTMLHeadingElement>(null);

  const cleanPhone = config.phonePrimary.split("[")[0].trim() || config.phonePrimary;
  const cleanPhoneSecondary = (config.phoneSecondary || "").split("[")[0].trim();
  const cleanEmail = config.emailPrimary.split("[")[0].trim() || config.emailPrimary;
  const cleanAddress = config.address.split("[")[0].trim() || config.address;
  const cleanGstin = (config.gstin || "").split("[")[0].trim();
  const waUrl = getWhatsAppLink(undefined, undefined, config.whatsappNumber);
  const hasConfiguredMap = config.googleMapsUrl.startsWith("https://") || config.googleMapsUrl.startsWith("http://");

  const telHref = (value: string) => `tel:${value.replace(/[^\d+]/g, "")}`;

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ContactFormData>({
    resolver: zodResolver(contactSchema),
  });

  // Swapping the form out for the confirmation panel used to drop focus back to
  // the top of the document with no announcement, so a screen reader user had
  // no idea the submission had worked.
  useEffect(() => {
    if (submitted) successRef.current?.focus();
  }, [submitted]);

  const onSubmit = async (data: ContactFormData) => {
    setSubmitting(true);
    setErrorMessage(null);

    try {
      const res = await fetch("/api/enquiries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...data,
          source: "CONTACT_FORM",
        }),
      });

      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "Failed to send message");

      setSubmitted(true);
      reset();
    } catch (err: any) {
      setErrorMessage(err.message || "An unexpected error occurred. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="bg-[var(--bg)]">
      {/* ── 1. HEADER ───────────────────────────────────────────────── */}
      <section className="steel-plate on-dark relative overflow-hidden border-b border-[var(--border-inverse)]">
        <div className="blueprint-grid-dark absolute inset-0" aria-hidden="true" />
        <div className="shell relative py-16 sm:py-20">
          <p className="eyebrow text-[var(--accent-on-dark)]">
            <Phone className="mr-2 inline h-3.5 w-3.5" aria-hidden="true" />
            Get in Touch
          </p>
          <h1 className="mt-4 max-w-3xl text-3xl font-bold tracking-tight text-white sm:text-4xl lg:text-5xl">
            Contact M/s Raj Agro Engineering Works
          </h1>
          <p className="mt-5 max-w-2xl text-sm leading-relaxed text-[var(--text-inverse-muted)] sm:text-base">
            Reach our sales and engineering support team directly via phone, WhatsApp, or the enquiry form below.
          </p>
        </div>
      </section>

      <section className="shell py-16 sm:py-20">
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-12">
          {/* ── 2. CONTACT DETAILS ────────────────────────────────── */}
          <div className="space-y-6 lg:col-span-5">
            <div className="panel px-6 py-6 sm:px-7">
              <h2 className="border-b border-[var(--border)] pb-4 text-lg font-bold text-[var(--text)]">
                Factory &amp; Sales Office
              </h2>

              <dl className="mt-5 space-y-5 text-sm">
                <div className="flex items-start gap-3">
                  <MapPin
                    className="mt-0.5 h-5 w-5 shrink-0 text-[var(--accent)]"
                    aria-hidden="true"
                  />
                  <div>
                    <dt className="font-bold text-[var(--text)]">Address</dt>
                    <dd className="mt-0.5 text-xs leading-relaxed text-[var(--text-muted)]">
                      {cleanAddress}
                    </dd>
                  </div>
                </div>

                {cleanGstin && (
                  <div className="flex items-start gap-3">
                    <span
                      className="mt-0.5 w-5 shrink-0 text-center text-[11px] font-bold leading-5 text-[var(--accent)]"
                      aria-hidden="true"
                    >
                      ID
                    </span>
                    <div>
                      <dt className="font-bold text-[var(--text)]">GSTIN</dt>
                      <dd className="mt-0.5 font-mono text-xs text-[var(--text-muted)]">
                        {cleanGstin}
                      </dd>
                    </div>
                  </div>
                )}

                <div className="flex items-start gap-3">
                  <Phone
                    className="mt-0.5 h-5 w-5 shrink-0 text-[var(--accent)]"
                    aria-hidden="true"
                  />
                  <div>
                    <dt className="font-bold text-[var(--text)]">
                      {cleanPhoneSecondary ? "Phone Numbers" : "Phone Number"}
                    </dt>
                    <dd className="mt-0.5 text-xs text-[var(--text-muted)]">
                      <a
                        href={telHref(cleanPhone)}
                        className="transition-colors duration-150 hover:text-[var(--accent)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--focus)]"
                      >
                        {cleanPhone}
                      </a>
                    </dd>
                    {/* Rendered an empty line when no secondary number was set. */}
                    {cleanPhoneSecondary && (
                      <dd className="mt-0.5 text-xs text-[var(--text-muted)]">
                        <a
                          href={telHref(cleanPhoneSecondary)}
                          className="transition-colors duration-150 hover:text-[var(--accent)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--focus)]"
                        >
                          {cleanPhoneSecondary}
                        </a>
                      </dd>
                    )}
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Mail
                    className="mt-0.5 h-5 w-5 shrink-0 text-[var(--accent)]"
                    aria-hidden="true"
                  />
                  <div className="min-w-0">
                    <dt className="font-bold text-[var(--text)]">Email Contact</dt>
                    <dd className="mt-0.5 text-xs text-[var(--text-muted)]">
                      <a
                        href={`mailto:${cleanEmail}`}
                        className="break-all transition-colors duration-150 hover:text-[var(--accent)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--focus)]"
                      >
                        {cleanEmail}
                      </a>
                    </dd>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Clock
                    className="mt-0.5 h-5 w-5 shrink-0 text-[var(--accent)]"
                    aria-hidden="true"
                  />
                  <div>
                    <dt className="font-bold text-[var(--text)]">Working Hours</dt>
                    <dd className="mt-0.5 text-xs text-[var(--text-muted)]">
                      {config.businessHours}
                    </dd>
                  </div>
                </div>
              </dl>

              <div className="mt-6 border-t border-[var(--border)] pt-5">
                <a
                  href={waUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-[6px] bg-[var(--accent)] px-4 text-xs font-bold uppercase tracking-[0.1em] text-[var(--accent-fg)] transition-colors duration-150 hover:bg-[var(--accent-hover)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--focus)]"
                >
                  <MessageSquare className="h-4 w-4" aria-hidden="true" />
                  <span>
                    Chat Instantly on WhatsApp
                    <span className="sr-only"> (opens in a new tab)</span>
                  </span>
                </a>
              </div>
            </div>

            {/* Map */}
            <div className="h-64 overflow-hidden rounded-[10px] border border-[var(--border)] bg-[var(--surface)]">
              {hasConfiguredMap ? (
                <iframe
                  title="Google map showing the location of the Raj Agro Engineering Works factory"
                  src={config.googleMapsUrl}
                  className="h-full w-full border-0"
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                />
              ) : (
                <div className="blueprint-grid-fine flex h-full items-center justify-center p-6 text-center">
                  <p className="text-xs font-semibold text-[var(--text-muted)]">
                    Google Maps will appear after the factory map URL is configured in admin settings.
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* ── 3. ENQUIRY FORM ───────────────────────────────────── */}
          <div className="lg:col-span-7">
            <div className="panel px-6 py-7 sm:px-8 sm:py-8">
              <h2 className="text-xl font-bold text-[var(--text)]">Send an Enquiry</h2>
              <p className="mt-1.5 text-xs text-[var(--text-muted)]">
                Fill out your machinery requirement and our team will get back to you promptly.
              </p>

              {submitted ? (
                <div className="mt-6 rounded-[6px] border border-[var(--accent-quiet-border)] bg-[var(--accent-quiet-bg)] px-6 py-8 text-center">
                  <CheckCircle2
                    className="mx-auto h-11 w-11 text-[var(--accent)]"
                    aria-hidden="true"
                  />
                  <h3
                    ref={successRef}
                    tabIndex={-1}
                    className="mt-4 text-lg font-bold text-[var(--accent-quiet-text)] outline-none"
                  >
                    Enquiry Received Successfully!
                  </h3>
                  <p className="mx-auto mt-2 max-w-md text-xs leading-relaxed text-[var(--accent-quiet-text)]">
                    Thank you for contacting M/s Raj Agro Engineering Works. Our technical sales representative will respond to your query shortly.
                  </p>
                  <button
                    type="button"
                    onClick={() => setSubmitted(false)}
                    className="mt-5 inline-flex h-10 items-center rounded-[6px] border border-[var(--accent)] px-5 text-xs font-bold uppercase tracking-[0.1em] text-[var(--accent-quiet-text)] transition-colors duration-150 hover:bg-[var(--accent)] hover:text-[var(--accent-fg)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--focus)]"
                  >
                    Send Another Message
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit(onSubmit)} className="mt-6 space-y-5" noValidate>
                  {/* Honeypot: hidden from everyone, including assistive tech. */}
                  <input
                    type="text"
                    tabIndex={-1}
                    autoComplete="off"
                    {...register("website")}
                    className="hidden"
                    aria-hidden="true"
                  />

                  {errorMessage && (
                    // role="alert" so the failure is announced rather than
                    // silently appearing above the fold.
                    <div
                      role="alert"
                      className="flex items-start gap-2 rounded-[6px] border border-[var(--color-danger-500)]/30 bg-[var(--color-danger-50)] p-3 text-xs text-[var(--color-danger-600)]"
                    >
                      <AlertCircle
                        className="mt-0.5 h-4 w-4 shrink-0 text-[var(--color-danger-500)]"
                        aria-hidden="true"
                      />
                      <span>{errorMessage}</span>
                    </div>
                  )}

                  <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                    <div>
                      <label htmlFor="contact-name" className={LABEL_CLASS}>
                        Your Full Name <span aria-hidden="true">*</span>
                      </label>
                      <input
                        id="contact-name"
                        type="text"
                        autoComplete="name"
                        required
                        aria-invalid={errors.name ? true : undefined}
                        aria-describedby={errors.name ? "contact-name-error" : undefined}
                        {...register("name")}
                        placeholder="e.g. Ramesh Kumar"
                        className={inputClass(!!errors.name)}
                      />
                      {errors.name && (
                        <p id="contact-name-error" className={ERROR_TEXT_CLASS}>
                          {errors.name.message}
                        </p>
                      )}
                    </div>

                    <div>
                      <label htmlFor="contact-company" className={LABEL_CLASS}>
                        Company / Farm Name
                      </label>
                      <input
                        id="contact-company"
                        type="text"
                        autoComplete="organization"
                        {...register("company")}
                        placeholder="e.g. Green Valley Agro"
                        className={inputClass(false)}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                    <div>
                      <label htmlFor="contact-phone" className={LABEL_CLASS}>
                        Phone Number <span aria-hidden="true">*</span>
                      </label>
                      <input
                        id="contact-phone"
                        type="tel"
                        inputMode="tel"
                        autoComplete="tel"
                        required
                        aria-invalid={errors.phone ? true : undefined}
                        aria-describedby={errors.phone ? "contact-phone-error" : undefined}
                        {...register("phone")}
                        placeholder="7651861335"
                        className={inputClass(!!errors.phone)}
                      />
                      {errors.phone && (
                        <p id="contact-phone-error" className={ERROR_TEXT_CLASS}>
                          {errors.phone.message}
                        </p>
                      )}
                    </div>

                    <div>
                      <label htmlFor="contact-location" className={LABEL_CLASS}>
                        City / District / State <span aria-hidden="true">*</span>
                      </label>
                      <input
                        id="contact-location"
                        type="text"
                        autoComplete="address-level2"
                        required
                        aria-invalid={errors.location ? true : undefined}
                        aria-describedby={errors.location ? "contact-location-error" : undefined}
                        {...register("location")}
                        placeholder="e.g. Ludhiana, Punjab"
                        className={inputClass(!!errors.location)}
                      />
                      {errors.location && (
                        <p id="contact-location-error" className={ERROR_TEXT_CLASS}>
                          {errors.location.message}
                        </p>
                      )}
                    </div>
                  </div>

                  <div>
                    <label htmlFor="contact-email" className={LABEL_CLASS}>
                      Email Address
                    </label>
                    <input
                      id="contact-email"
                      type="email"
                      inputMode="email"
                      autoComplete="email"
                      aria-invalid={errors.email ? true : undefined}
                      aria-describedby={errors.email ? "contact-email-error" : undefined}
                      {...register("email")}
                      placeholder="name@example.com"
                      className={inputClass(!!errors.email)}
                    />
                    {errors.email && (
                      <p id="contact-email-error" className={ERROR_TEXT_CLASS}>
                        {errors.email.message}
                      </p>
                    )}
                  </div>

                  <div>
                    <label htmlFor="contact-message" className={LABEL_CLASS}>
                      Requirement Details <span aria-hidden="true">*</span>
                    </label>
                    <textarea
                      id="contact-message"
                      rows={4}
                      required
                      aria-invalid={errors.message ? true : undefined}
                      aria-describedby={errors.message ? "contact-message-error" : undefined}
                      {...register("message")}
                      placeholder="Specify machinery models required, quantity, tractor HP, or custom fabrication needs..."
                      className={inputClass(!!errors.message)}
                    />
                    {errors.message && (
                      <p id="contact-message-error" className={ERROR_TEXT_CLASS}>
                        {errors.message.message}
                      </p>
                    )}
                  </div>

                  {/* The asterisks were never explained anywhere on the page. */}
                  <p className="text-[11px] text-[var(--text-subtle)]">
                    Fields marked * are required.
                  </p>

                  <button
                    type="submit"
                    disabled={submitting}
                    className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-[6px] bg-[var(--accent)] px-4 text-xs font-bold uppercase tracking-[0.1em] text-[var(--accent-fg)] transition-colors duration-150 hover:bg-[var(--accent-hover)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--focus)] disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    <Send className="h-4 w-4" aria-hidden="true" />
                    <span>{submitting ? "Submitting Enquiry..." : "Submit Enquiry"}</span>
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
