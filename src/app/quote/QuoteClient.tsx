"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  FileText,
  Send,
  CheckCircle2,
  AlertCircle,
  MessageSquare,
  ArrowLeft,
  ArrowRight,
  Check,
} from "lucide-react";
import { getWhatsAppLink } from "@/lib/whatsapp";

/* ────────────────────────────────────────────────────────────────
   Validation

   `city` and `state` are separate inputs here but the API stores a
   single `location` string, so they are joined on submit. Previously
   both inputs were registered to the same `location` field, meaning
   whichever rendered last silently overwrote the other.
   ──────────────────────────────────────────────────────────────── */
const phoneRule = z
  .string()
  .trim()
  .regex(/^[0-9+\-\s()]{8,20}$/, "Enter a valid phone number");

const quoteSchema = z.object({
  // Step 1 — machine
  productTitle: z.string().trim().min(1, "Select the machine you need"),
  quantity: z.coerce
    .number({ invalid_type_error: "Enter a quantity" })
    .int("Enter a whole number")
    .min(1, "Quantity must be at least 1")
    .max(999, "For orders above 999 units, please call us directly"),

  // Step 2 — requirement
  tractorHp: z.string().trim().max(40).optional(),
  workingWidth: z.string().trim().max(40).optional(),
  application: z.string().trim().max(120).optional(),
  requirement: z
    .string()
    .trim()
    .min(10, "Please describe your requirement in a little more detail")
    .max(1200, "Please keep this under 1200 characters"),

  // Step 3 — delivery
  city: z.string().trim().min(2, "District or city is required"),
  state: z.string().trim().min(2, "State is required"),
  pinCode: z
    .string()
    .trim()
    .regex(/^\d{6}$/, "PIN code must be 6 digits")
    .optional()
    .or(z.literal("")),

  // Step 4 — contact
  name: z.string().trim().min(2, "Full name is required"),
  company: z.string().trim().max(120).optional(),
  phone: phoneRule,
  whatsApp: phoneRule.optional().or(z.literal("")),
  email: z
    .string()
    .trim()
    .email("Enter a valid email address")
    .optional()
    .or(z.literal("")),

  // Step 5 — notes
  additionalNotes: z.string().trim().max(600).optional(),

  // honeypot
  website: z.string().optional(),
});

type QuoteFormData = z.infer<typeof quoteSchema>;

/* Fields validated before each step is allowed to advance. */
const STEPS = [
  { id: 1, label: "Machine", fields: ["productTitle", "quantity"] },
  {
    id: 2,
    label: "Requirement",
    fields: ["tractorHp", "workingWidth", "application", "requirement"],
  },
  { id: 3, label: "Delivery", fields: ["city", "state", "pinCode"] },
  {
    id: 4,
    label: "Contact",
    fields: ["name", "company", "phone", "whatsApp", "email"],
  },
  { id: 5, label: "Review", fields: ["additionalNotes"] },
] as const satisfies ReadonlyArray<{
  id: number;
  label: string;
  fields: ReadonlyArray<keyof QuoteFormData>;
}>;

const TOTAL_STEPS = STEPS.length;

interface QuoteClientProps {
  products: { id: string; name: string }[];
  initialProductTitle?: string;
  whatsappNumber?: string;
}

/* ────────────────────────────────────────────────────────────────
   Small local primitives — these replaced ~300 lines of duplicated
   label/input/error markup and wire up the ARIA attributes once.
   ──────────────────────────────────────────────────────────────── */
const controlClass =
  "w-full px-3 py-2.5 text-sm bg-[var(--surface)] border border-[var(--border-strong)] rounded-[6px] " +
  "text-[var(--text)] placeholder:text-[var(--text-subtle)] transition-colors " +
  "hover:border-[var(--text-subtle)] focus:border-[var(--accent)] " +
  "aria-[invalid=true]:border-[var(--color-danger-500)]";

function Field({
  label,
  htmlFor,
  error,
  hint,
  required,
  children,
}: {
  label: string;
  htmlFor: string;
  error?: string;
  hint?: string;
  required?: boolean;
  children: ReactNode;
}) {
  return (
    <div>
      <label
        htmlFor={htmlFor}
        className="block text-xs font-semibold text-[var(--text)] mb-1.5"
      >
        {label}
        {required && (
          <span className="text-[var(--color-danger-500)] ml-0.5" aria-hidden="true">
            *
          </span>
        )}
        {!required && (
          <span className="ml-1.5 font-normal text-[var(--text-subtle)]">
            (optional)
          </span>
        )}
      </label>
      {children}
      {hint && !error && (
        <p id={`${htmlFor}-hint`} className="text-[11px] text-[var(--text-subtle)] mt-1">
          {hint}
        </p>
      )}
      {error && (
        <p
          id={`${htmlFor}-error`}
          role="alert"
          className="text-[11px] font-medium text-[var(--color-danger-600)] mt-1"
        >
          {error}
        </p>
      )}
    </div>
  );
}

export default function QuoteClient({
  products,
  initialProductTitle = "",
  whatsappNumber,
}: QuoteClientProps) {
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [lastProductTitle, setLastProductTitle] = useState(initialProductTitle);
  const [currentStep, setCurrentStep] = useState(1);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const hasMovedRef = useRef(false);

  const {
    register,
    handleSubmit,
    reset,
    watch,
    trigger,
    getValues,
    formState: { errors },
  } = useForm<QuoteFormData>({
    resolver: zodResolver(quoteSchema),
    mode: "onTouched",
    defaultValues: {
      productTitle: initialProductTitle || (products[0]?.name ?? ""),
      quantity: 1,
      tractorHp: "",
      workingWidth: "",
      application: "",
      requirement: "",
      city: "",
      state: "",
      pinCode: "",
      name: "",
      company: "",
      phone: "",
      whatsApp: "",
      email: "",
      additionalNotes: "",
      website: "",
    },
  });

  const selectedProductTitle = watch("productTitle");

  /* Move keyboard focus to the new step heading so screen-reader and
     keyboard users are not left at the bottom of the previous step. */
  useEffect(() => {
    if (!hasMovedRef.current) return;
    headingRef.current?.focus();
  }, [currentStep]);

  const goNext = async () => {
    const valid = await trigger(
      STEPS[currentStep - 1].fields as unknown as (keyof QuoteFormData)[],
      { shouldFocus: true }
    );
    if (!valid) return;
    hasMovedRef.current = true;
    setErrorMessage(null);
    setCurrentStep((s) => Math.min(s + 1, TOTAL_STEPS));
  };

  const goBack = () => {
    hasMovedRef.current = true;
    setErrorMessage(null);
    setCurrentStep((s) => Math.max(s - 1, 1));
  };

  const onSubmit = async (data: QuoteFormData) => {
    setSubmitting(true);
    setErrorMessage(null);
    setLastProductTitle(data.productTitle);

    /* The API persists a fixed set of columns. Rather than dropping the
       engineering details on the floor (the previous behaviour), fold
       them into `message` so the sales team receives everything. */
    const detailPairs: [string, string | undefined][] = [
      ["Quantity", String(data.quantity)],
      ["Tractor HP", data.tractorHp],
      ["Working width", data.workingWidth],
      ["Intended application", data.application],
      ["WhatsApp", data.whatsApp],
    ];
    const details = detailPairs
      .filter(([, v]) => v && v.trim().length > 0)
      .map(([k, v]) => `${k}: ${v!.trim()}`);

    const message = [
      data.requirement.trim(),
      details.length ? `\nRequirement details\n${details.join("\n")}` : "",
      data.additionalNotes?.trim()
        ? `\nAdditional notes\n${data.additionalNotes.trim()}`
        : "",
    ]
      .filter(Boolean)
      .join("\n")
      .slice(0, 2000); // API caps message length

    const location = [data.city.trim(), data.state.trim(), data.pinCode?.trim()]
      .filter((v) => v && v.length > 0)
      .join(", ");

    /* Link the enquiry to the catalogue row when the chosen name maps to
       a real product, so it shows up against that product in admin. */
    const matched = products.find((p) => p.name === data.productTitle);

    try {
      const res = await fetch("/api/enquiries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: data.name,
          company: data.company || "",
          phone: data.phone,
          email: data.email || "",
          productId: matched?.id ?? "",
          productTitle: data.productTitle,
          quantity: data.quantity,
          location,
          message,
          website: data.website || "",
          source: "QUOTE_FORM",
        }),
      });

      const json = await res.json().catch(() => ({}));
      if (!res.ok) {
        throw new Error(json.error || "We could not submit your request.");
      }

      setSubmitted(true);
      reset();
      hasMovedRef.current = false;
      setCurrentStep(1);
    } catch (err) {
      setErrorMessage(
        err instanceof Error
          ? `${err.message} Please try again, or reach us on WhatsApp.`
          : "An unexpected error occurred. Please try again."
      );
    } finally {
      setSubmitting(false);
    }
  };

  const waUrl = getWhatsAppLink(
    lastProductTitle || selectedProductTitle,
    undefined,
    whatsappNumber
  );

  const activeStep = STEPS[currentStep - 1];

  return (
    <div className="py-10 sm:py-14">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* ── Header ── */}
        <header className="steel-plate on-dark text-white p-8 sm:p-10 rounded-[10px] border border-[var(--border-inverse)] relative overflow-hidden">
          <div
            className="absolute inset-0 blueprint-grid-dark opacity-60 pointer-events-none"
            aria-hidden="true"
          />
          <div className="relative space-y-4">
            <span className="chip-dark">
              <FileText className="w-3.5 h-3.5" aria-hidden="true" />
              Formal price proposal
            </span>
            <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-white">
              Request a machinery quotation
            </h1>
            <p className="text-sm text-[var(--text-inverse-muted)] max-w-xl leading-relaxed">
              Share your machine, working parameters and delivery location. Our
              engineering team reviews every request and responds with direct
              factory pricing.
            </p>
          </div>
        </header>

        {submitted ? (
          /* ── Success ── */
          <div
            className="panel p-8 sm:p-10 text-center space-y-5"
            role="status"
            aria-live="polite"
          >
            <span className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-[var(--accent-quiet-bg)] border border-[var(--accent-quiet-border)]">
              <CheckCircle2
                className="w-7 h-7 text-[var(--accent)]"
                aria-hidden="true"
              />
            </span>
            <h2 className="text-2xl font-bold text-[var(--text)]">
              Quotation request received
            </h2>
            <p className="text-sm text-[var(--text-muted)] max-w-md mx-auto leading-relaxed">
              Your request{lastProductTitle ? " for " : ""}
              {lastProductTitle && (
                <span className="font-semibold text-[var(--text)]">
                  {lastProductTitle}
                </span>
              )}{" "}
              has been logged. Our engineering sales lead will contact you with
              formal pricing.
            </p>

            <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
              <a
                href={waUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto px-5 py-3 text-sm font-semibold text-[var(--accent-fg)] bg-[var(--accent)] hover:bg-[var(--accent-hover)] rounded-[6px] transition-colors inline-flex items-center justify-center gap-2"
              >
                <MessageSquare className="w-4 h-4" aria-hidden="true" />
                Follow up on WhatsApp
              </a>
              <button
                type="button"
                onClick={() => setSubmitted(false)}
                className="w-full sm:w-auto px-5 py-3 text-sm font-semibold text-[var(--text)] bg-[var(--surface-2)] hover:bg-[var(--surface-3)] border border-[var(--border)] rounded-[6px] transition-colors"
              >
                Request another quote
              </button>
            </div>
          </div>
        ) : (
          <div className="panel p-6 sm:p-8">
            {/* ── Stepper ── */}
            <nav aria-label="Quotation progress" className="mb-8">
              <ol className="flex items-center gap-1.5 sm:gap-2">
                {STEPS.map((step) => {
                  const done = currentStep > step.id;
                  const active = currentStep === step.id;
                  return (
                    <li key={step.id} className="flex-1 min-w-0">
                      <div
                        className="flex items-center gap-2"
                        aria-current={active ? "step" : undefined}
                      >
                        <span
                          className={[
                            "shrink-0 w-6 h-6 rounded-full grid place-items-center text-[10px] font-bold border transition-colors",
                            done
                              ? "bg-[var(--accent)] border-[var(--accent)] text-white"
                              : active
                                ? "bg-[var(--surface)] border-[var(--accent)] text-[var(--accent)]"
                                : "bg-[var(--surface-2)] border-[var(--border-strong)] text-[var(--text-subtle)]",
                          ].join(" ")}
                        >
                          {done ? (
                            <Check className="w-3.5 h-3.5" aria-hidden="true" />
                          ) : (
                            step.id
                          )}
                        </span>
                        <span
                          className={[
                            "eyebrow hidden md:block truncate",
                            active
                              ? "text-[var(--text)]"
                              : "text-[var(--text-subtle)]",
                          ].join(" ")}
                        >
                          {step.label}
                        </span>
                      </div>
                      <span
                        className={[
                          "mt-2 block h-[3px] rounded-full transition-colors",
                          done || active
                            ? "bg-[var(--accent)]"
                            : "bg-[var(--surface-3)]",
                        ].join(" ")}
                      />
                    </li>
                  );
                })}
              </ol>
              <p className="sr-only" aria-live="polite">
                Step {currentStep} of {TOTAL_STEPS}: {activeStep.label}
              </p>
            </nav>

            <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-6">
              {/* Honeypot — real users never fill this */}
              <div className="hidden" aria-hidden="true">
                <label htmlFor="website">Website</label>
                <input
                  id="website"
                  type="text"
                  tabIndex={-1}
                  autoComplete="off"
                  {...register("website")}
                />
              </div>

              {errorMessage && (
                <div
                  role="alert"
                  className="p-3 bg-[var(--color-danger-50)] border border-[var(--color-danger-500)]/30 rounded-[6px] flex items-start gap-2 text-xs text-[var(--color-danger-600)]"
                >
                  <AlertCircle className="w-4 h-4 shrink-0 mt-px" aria-hidden="true" />
                  <span>{errorMessage}</span>
                </div>
              )}

              <h2
                ref={headingRef}
                tabIndex={-1}
                className="text-lg font-bold text-[var(--text)] outline-none"
              >
                <span className="eyebrow text-[var(--text-subtle)] block mb-1">
                  Step {currentStep} of {TOTAL_STEPS}
                </span>
                {
                  [
                    "Which machine do you need?",
                    "Tell us about your requirement",
                    "Where should we deliver?",
                    "How can we reach you?",
                    "Anything else we should know?",
                  ][currentStep - 1]
                }
              </h2>

              {/* ── Step 1: Machine ── */}
              {currentStep === 1 && (
                <div className="space-y-4">
                  <Field
                    label="Target product / equipment"
                    htmlFor="productTitle"
                    required
                    error={errors.productTitle?.message}
                  >
                    <select
                      id="productTitle"
                      {...register("productTitle")}
                      aria-invalid={!!errors.productTitle}
                      aria-describedby={
                        errors.productTitle ? "productTitle-error" : undefined
                      }
                      className={controlClass}
                    >
                      <option value="">Select equipment</option>
                      {products.map((p) => (
                        <option key={p.id} value={p.name}>
                          {p.name}
                        </option>
                      ))}
                      <option value="Custom Agricultural Machine">
                        Custom agricultural machine
                      </option>
                      <option value="Custom Engineering Equipment">
                        Custom engineering equipment
                      </option>
                    </select>
                  </Field>

                  <Field
                    label="Required quantity"
                    htmlFor="quantity"
                    required
                    error={errors.quantity?.message}
                  >
                    <input
                      id="quantity"
                      type="number"
                      min={1}
                      max={999}
                      inputMode="numeric"
                      {...register("quantity")}
                      aria-invalid={!!errors.quantity}
                      aria-describedby={
                        errors.quantity ? "quantity-error" : undefined
                      }
                      className={controlClass}
                    />
                  </Field>
                </div>
              )}

              {/* ── Step 2: Requirement ── */}
              {currentStep === 2 && (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <Field
                      label="Tractor HP"
                      htmlFor="tractorHp"
                      hint="Helps us match the right model"
                      error={errors.tractorHp?.message}
                    >
                      <input
                        id="tractorHp"
                        type="text"
                        inputMode="numeric"
                        placeholder="e.g. 50"
                        {...register("tractorHp")}
                        aria-describedby="tractorHp-hint"
                        className={controlClass}
                      />
                    </Field>

                    <Field
                      label="Working width (inches)"
                      htmlFor="workingWidth"
                      error={errors.workingWidth?.message}
                    >
                      <input
                        id="workingWidth"
                        type="text"
                        inputMode="numeric"
                        placeholder="e.g. 60, 72, 84"
                        {...register("workingWidth")}
                        className={controlClass}
                      />
                    </Field>
                  </div>

                  <Field
                    label="Intended application"
                    htmlFor="application"
                    error={errors.application?.message}
                  >
                    <input
                      id="application"
                      type="text"
                      placeholder="e.g. tilling, threshing, land levelling"
                      {...register("application")}
                      className={controlClass}
                    />
                  </Field>

                  <Field
                    label="Your requirement"
                    htmlFor="requirement"
                    required
                    hint="Soil type, crop, acreage or any customisation you need"
                    error={errors.requirement?.message}
                  >
                    <textarea
                      id="requirement"
                      rows={5}
                      placeholder="Describe the machine you need, the conditions it will work in, and any custom specifications."
                      {...register("requirement")}
                      aria-invalid={!!errors.requirement}
                      aria-describedby={
                        errors.requirement
                          ? "requirement-error"
                          : "requirement-hint"
                      }
                      className={controlClass}
                    />
                  </Field>
                </div>
              )}

              {/* ── Step 3: Delivery ── */}
              {currentStep === 3 && (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <Field
                      label="District / city"
                      htmlFor="city"
                      required
                      error={errors.city?.message}
                    >
                      <input
                        id="city"
                        type="text"
                        autoComplete="address-level2"
                        placeholder="e.g. Mirzapur"
                        {...register("city")}
                        aria-invalid={!!errors.city}
                        aria-describedby={errors.city ? "city-error" : undefined}
                        className={controlClass}
                      />
                    </Field>

                    <Field
                      label="State"
                      htmlFor="state"
                      required
                      error={errors.state?.message}
                    >
                      <input
                        id="state"
                        type="text"
                        autoComplete="address-level1"
                        placeholder="e.g. Uttar Pradesh"
                        {...register("state")}
                        aria-invalid={!!errors.state}
                        aria-describedby={errors.state ? "state-error" : undefined}
                        className={controlClass}
                      />
                    </Field>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <Field
                      label="PIN code"
                      htmlFor="pinCode"
                      hint="Lets us estimate freight accurately"
                      error={errors.pinCode?.message}
                    >
                      <input
                        id="pinCode"
                        type="text"
                        inputMode="numeric"
                        maxLength={6}
                        autoComplete="postal-code"
                        placeholder="e.g. 231211"
                        {...register("pinCode")}
                        aria-invalid={!!errors.pinCode}
                        aria-describedby={
                          errors.pinCode ? "pinCode-error" : "pinCode-hint"
                        }
                        className={controlClass}
                      />
                    </Field>
                  </div>
                </div>
              )}

              {/* ── Step 4: Contact ── */}
              {currentStep === 4 && (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <Field
                      label="Full name"
                      htmlFor="name"
                      required
                      error={errors.name?.message}
                    >
                      <input
                        id="name"
                        type="text"
                        autoComplete="name"
                        {...register("name")}
                        aria-invalid={!!errors.name}
                        aria-describedby={errors.name ? "name-error" : undefined}
                        className={controlClass}
                      />
                    </Field>

                    <Field
                      label="Company / farm / agency"
                      htmlFor="company"
                      error={errors.company?.message}
                    >
                      <input
                        id="company"
                        type="text"
                        autoComplete="organization"
                        {...register("company")}
                        className={controlClass}
                      />
                    </Field>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <Field
                      label="Mobile / phone"
                      htmlFor="phone"
                      required
                      error={errors.phone?.message}
                    >
                      <input
                        id="phone"
                        type="tel"
                        autoComplete="tel"
                        placeholder="e.g. 76518 61335"
                        {...register("phone")}
                        aria-invalid={!!errors.phone}
                        aria-describedby={errors.phone ? "phone-error" : undefined}
                        className={controlClass}
                      />
                    </Field>

                    <Field
                      label="WhatsApp number"
                      htmlFor="whatsApp"
                      hint="If different from the number above"
                      error={errors.whatsApp?.message}
                    >
                      <input
                        id="whatsApp"
                        type="tel"
                        {...register("whatsApp")}
                        aria-invalid={!!errors.whatsApp}
                        aria-describedby={
                          errors.whatsApp ? "whatsApp-error" : "whatsApp-hint"
                        }
                        className={controlClass}
                      />
                    </Field>
                  </div>

                  <Field
                    label="Email address"
                    htmlFor="email"
                    error={errors.email?.message}
                  >
                    <input
                      id="email"
                      type="email"
                      autoComplete="email"
                      placeholder="name@example.com"
                      {...register("email")}
                      aria-invalid={!!errors.email}
                      aria-describedby={errors.email ? "email-error" : undefined}
                      className={controlClass}
                    />
                  </Field>
                </div>
              )}

              {/* ── Step 5: Review ── */}
              {currentStep === 5 && (
                <div className="space-y-5">
                  <Field
                    label="Additional requirements / notes"
                    htmlFor="additionalNotes"
                    error={errors.additionalNotes?.message}
                  >
                    <textarea
                      id="additionalNotes"
                      rows={4}
                      placeholder="Any further specifications or special instructions."
                      {...register("additionalNotes")}
                      className={controlClass}
                    />
                  </Field>

                  {/* Summary of what will be sent */}
                  <div className="rounded-[6px] border border-[var(--border)] bg-[var(--surface-2)] p-4">
                    <p className="eyebrow text-[var(--text-subtle)] mb-3">
                      Summary
                    </p>
                    <dl className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-2 text-xs">
                      {(
                        [
                          ["Machine", getValues("productTitle")],
                          ["Quantity", String(getValues("quantity") ?? "")],
                          ["Tractor HP", getValues("tractorHp")],
                          ["Working width", getValues("workingWidth")],
                          [
                            "Deliver to",
                            [
                              getValues("city"),
                              getValues("state"),
                              getValues("pinCode"),
                            ]
                              .filter(Boolean)
                              .join(", "),
                          ],
                          ["Contact", getValues("name")],
                          ["Phone", getValues("phone")],
                        ] as [string, string | undefined][]
                      )
                        .filter(([, v]) => v && v.trim().length > 0)
                        .map(([k, v]) => (
                          <div key={k} className="flex justify-between gap-3">
                            <dt className="spec-label">{k}</dt>
                            <dd className="text-[var(--text)] font-medium text-right break-words">
                              {v}
                            </dd>
                          </div>
                        ))}
                    </dl>
                  </div>

                  {/* Documents: WhatsApp and email are real, working
                      channels. The previous build showed a file input
                      that was never registered or uploaded anywhere. */}
                  <p className="text-xs text-[var(--text-muted)] leading-relaxed">
                    Have drawings or reference photos? Send your request first,
                    then share the files with us on{" "}
                    <a
                      href={waUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-semibold text-[var(--accent)] underline underline-offset-2 hover:text-[var(--accent-hover)]"
                    >
                      WhatsApp
                    </a>{" "}
                    and we will attach them to your enquiry.
                  </p>
                </div>
              )}

              {/* ── Navigation ── */}
              <div className="pt-2 flex flex-col-reverse sm:flex-row sm:justify-between gap-3 border-t border-[var(--border)] mt-2 pt-5">
                {currentStep > 1 ? (
                  <button
                    type="button"
                    onClick={goBack}
                    disabled={submitting}
                    className="inline-flex items-center justify-center gap-2 px-5 py-3 text-sm font-semibold text-[var(--text)] bg-[var(--surface-2)] hover:bg-[var(--surface-3)] border border-[var(--border)] rounded-[6px] transition-colors disabled:opacity-50"
                  >
                    <ArrowLeft className="w-4 h-4" aria-hidden="true" />
                    Back
                  </button>
                ) : (
                  <span aria-hidden="true" className="hidden sm:block" />
                )}

                {currentStep < TOTAL_STEPS ? (
                  <button
                    type="button"
                    onClick={goNext}
                    className="inline-flex items-center justify-center gap-2 px-5 py-3 text-sm font-semibold text-[var(--accent-fg)] bg-[var(--accent)] hover:bg-[var(--accent-hover)] rounded-[6px] transition-colors"
                  >
                    Continue
                    <ArrowRight className="w-4 h-4" aria-hidden="true" />
                  </button>
                ) : (
                  <button
                    type="submit"
                    disabled={submitting}
                    className="inline-flex items-center justify-center gap-2 px-5 py-3 text-sm font-semibold text-[var(--accent-fg)] bg-[var(--accent)] hover:bg-[var(--accent-hover)] rounded-[6px] transition-colors disabled:opacity-60"
                  >
                    {submitting ? (
                      "Submitting…"
                    ) : (
                      <>
                        <Send className="w-4 h-4" aria-hidden="true" />
                        Submit quotation request
                      </>
                    )}
                  </button>
                )}
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}
