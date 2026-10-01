"use client";

import { useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Send, CheckCircle2, AlertCircle, Paperclip } from "lucide-react";

/**
 * Careers application form.
 *
 * ── On the r\u00e9sum\u00e9 field ──
 * The brief asks for a r\u00e9sum\u00e9 upload and for uploads to be validated,
 * size-capped and stored securely. There is no object-storage adapter wired to
 * this project (no Cloudinary/S3 credentials exist), so an "upload" that
 * silently discarded the file would be a lie told in a form. Instead the field
 * does something real: a PDF/DOC/DOCX under 2 MB is read in the browser, checked
 * against an allow-list of MIME types, and submitted as a bounded data URL that
 * lands in `JobApplication.resumeUrl`. A link to an online CV is accepted as an
 * alternative for anyone who has one.
 *
 * Both paths are validated again server-side in `api/careers/route.ts` \u2014 a
 * client-side check is a courtesy to the applicant, never a security control.
 */

const MAX_RESUME_BYTES = 2 * 1024 * 1024; // 2 MB
const MAX_RESUME_DATA_LENGTH = 2_800_000; // base64 of 2 MB, plus header slack

const ACCEPTED_RESUME_TYPES = [
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
];

const ACCEPTED_RESUME_EXTENSIONS = ".pdf,.doc,.docx";

const applicationSchema = z.object({
  name: z.string().trim().min(2, "Full name is required").max(100),
  email: z.string().trim().email("Enter a valid email address").max(160),
  phone: z
    .string()
    .trim()
    .regex(/^[0-9+\-\s()]{8,20}$/, "Enter a valid phone number")
    .optional()
    .or(z.literal("")),
  jobId: z.string().trim().min(1, "Select the role you are applying for"),
  resumeLink: z
    .string()
    .trim()
    .url("Enter a full URL starting with https://")
    .max(500, "Please shorten this link")
    .optional()
    .or(z.literal("")),
  message: z
    .string()
    .trim()
    .max(2000, "Please keep this under 2000 characters")
    .optional()
    .or(z.literal("")),
  /** Honeypot. */
  website: z.string().optional(),
});

type ApplicationFormData = z.infer<typeof applicationSchema>;

interface JobOption {
  id: string;
  title: string;
}

interface CareerApplicationFormProps {
  jobs: JobOption[];
}

/* Same field recipe as the contact and quote forms, so a form anywhere on the
   site behaves identically. */
const LABEL_CLASS = "mb-1.5 block text-xs font-bold text-[var(--text)]";
const INPUT_BASE =
  "w-full rounded-[6px] border bg-[var(--surface-2)] px-3.5 py-2.5 text-sm text-[var(--text)] placeholder:text-[var(--text-subtle)] transition-colors duration-150 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--focus)]";
const ERROR_TEXT_CLASS =
  "mt-1.5 text-[11px] font-semibold text-[var(--color-danger-600)]";

function inputClass(hasError: boolean) {
  return `${INPUT_BASE} ${
    hasError
      ? "border-[var(--color-danger-500)]"
      : "border-[var(--border-strong)] hover:border-[var(--text-subtle)]"
  }`;
}

export default function CareerApplicationForm({ jobs }: CareerApplicationFormProps) {
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [resumeData, setResumeData] = useState<string | null>(null);
  const [resumeName, setResumeName] = useState<string>("");
  const [resumeError, setResumeError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ApplicationFormData>({
    resolver: zodResolver(applicationSchema),
    defaultValues: { jobId: jobs[0]?.id ?? "", website: "" },
  });

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    setResumeError(null);
    setResumeData(null);
    setResumeName("");

    if (!file) return;

    if (!ACCEPTED_RESUME_TYPES.includes(file.type)) {
      setResumeError("Attach a PDF, DOC or DOCX file.");
      if (fileInputRef.current) fileInputRef.current.value = "";
      return;
    }

    if (file.size > MAX_RESUME_BYTES) {
      setResumeError("The file must be 2 MB or smaller.");
      if (fileInputRef.current) fileInputRef.current.value = "";
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      const result = typeof reader.result === "string" ? reader.result : "";
      if (!result) {
        setResumeError("That file could not be read. Try attaching it again.");
        return;
      }
      setResumeData(result);
      setResumeName(file.name);
    };
    reader.onerror = () => setResumeError("That file could not be read.");
    reader.readAsDataURL(file);
  };

  const clearResume = () => {
    setResumeData(null);
    setResumeName("");
    setResumeError(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const onSubmit = async (data: ApplicationFormData) => {
    if (resumeData && resumeData.length > MAX_RESUME_DATA_LENGTH) {
      setResumeError("The file must be 2 MB or smaller.");
      return;
    }

    setSubmitting(true);
    setErrorMessage(null);

    try {
      const res = await fetch("/api/careers", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: data.name,
          email: data.email,
          phone: data.phone || "",
          jobId: data.jobId,
          message: data.message || "",
          resumeUrl: resumeData || data.resumeLink || "",
          website: data.website || "",
        }),
      });

      const json = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(json.error || "We could not submit your application.");

      setSubmitted(true);
      reset();
      clearResume();
    } catch (err) {
      setErrorMessage(
        err instanceof Error ? err.message : "An unexpected error occurred. Please try again."
      );
    } finally {
      setSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <div
        className="border border-[var(--border)] bg-[var(--surface)] px-6 py-12 text-center sm:px-10"
        role="status"
        aria-live="polite"
      >
        <span className="inline-flex h-14 w-14 items-center justify-center rounded-full border border-[var(--accent-quiet-border)] bg-[var(--accent-quiet-bg)]">
          <CheckCircle2 className="h-7 w-7 text-[var(--accent)]" aria-hidden="true" />
        </span>
        <h3 className="mt-5 text-xl font-bold tracking-tight text-[var(--text)]">
          Application received
        </h3>
        <p className="mx-auto mt-3 max-w-md text-sm leading-relaxed text-[var(--text-muted)]">
          Thank you. Your details have reached our works office and we will contact
          you if there is a match for the role.
        </p>
        <button
          type="button"
          onClick={() => setSubmitted(false)}
          className="mt-7 inline-flex h-11 items-center justify-center rounded-[6px] border border-[var(--border-strong)] px-6 text-xs font-bold uppercase tracking-[0.08em] text-[var(--text)] transition-colors duration-150 hover:bg-[var(--surface-2)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--focus)]"
        >
          Submit another application
        </button>
      </div>
    );
  }

  return (
    <div className="border border-[var(--border)] bg-[var(--surface)] px-6 py-8 sm:px-8">
      <h3 className="text-xl font-bold tracking-tight text-[var(--text)]">
        Apply to RAEW
      </h3>
      <p className="mt-2 max-w-xl text-sm leading-relaxed text-[var(--text-muted)]">
        Tell us which role you are after and a little about your experience. Fields
        marked with an asterisk are required.
      </p>

      {errorMessage && (
        <div
          role="alert"
          className="mt-6 flex items-start gap-2.5 border border-[var(--color-danger-500)] bg-[var(--surface-2)] px-4 py-3 text-xs leading-relaxed text-[var(--color-danger-600)]"
        >
          <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
          <span>{errorMessage}</span>
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="mt-6 space-y-5" noValidate>
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
          <div>
            <label htmlFor="career-name" className={LABEL_CLASS}>
              Full Name <span aria-hidden="true">*</span>
            </label>
            <input
              id="career-name"
              type="text"
              autoComplete="name"
              required
              aria-invalid={errors.name ? true : undefined}
              aria-describedby={errors.name ? "career-name-error" : undefined}
              {...register("name")}
              className={inputClass(!!errors.name)}
            />
            {errors.name && (
              <p id="career-name-error" className={ERROR_TEXT_CLASS}>
                {errors.name.message}
              </p>
            )}
          </div>

          <div>
            <label htmlFor="career-email" className={LABEL_CLASS}>
              Email Address <span aria-hidden="true">*</span>
            </label>
            <input
              id="career-email"
              type="email"
              inputMode="email"
              autoComplete="email"
              required
              aria-invalid={errors.email ? true : undefined}
              aria-describedby={errors.email ? "career-email-error" : undefined}
              {...register("email")}
              className={inputClass(!!errors.email)}
            />
            {errors.email && (
              <p id="career-email-error" className={ERROR_TEXT_CLASS}>
                {errors.email.message}
              </p>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
          <div>
            <label htmlFor="career-phone" className={LABEL_CLASS}>
              Phone Number
            </label>
            <input
              id="career-phone"
              type="tel"
              inputMode="tel"
              autoComplete="tel"
              aria-invalid={errors.phone ? true : undefined}
              aria-describedby={errors.phone ? "career-phone-error" : undefined}
              {...register("phone")}
              className={inputClass(!!errors.phone)}
            />
            {errors.phone && (
              <p id="career-phone-error" className={ERROR_TEXT_CLASS}>
                {errors.phone.message}
              </p>
            )}
          </div>

          <div>
            <label htmlFor="career-role" className={LABEL_CLASS}>
              Position Applied For <span aria-hidden="true">*</span>
            </label>
            <select
              id="career-role"
              required
              aria-invalid={errors.jobId ? true : undefined}
              aria-describedby={errors.jobId ? "career-role-error" : undefined}
              {...register("jobId")}
              className={inputClass(!!errors.jobId)}
            >
              {jobs.map((job) => (
                <option key={job.id} value={job.id}>
                  {job.title}
                </option>
              ))}
            </select>
            {errors.jobId && (
              <p id="career-role-error" className={ERROR_TEXT_CLASS}>
                {errors.jobId.message}
              </p>
            )}
          </div>
        </div>

        <div>
          <label htmlFor="career-resume" className={LABEL_CLASS}>
            R\u00e9sum\u00e9 (PDF, DOC or DOCX, maximum 2 MB)
          </label>
          <input
            id="career-resume"
            ref={fileInputRef}
            type="file"
            accept={ACCEPTED_RESUME_EXTENSIONS}
            onChange={handleFileChange}
            aria-invalid={resumeError ? true : undefined}
            aria-describedby="career-resume-help"
            className="block w-full cursor-pointer rounded-[6px] border border-[var(--border-strong)] bg-[var(--surface-2)] px-3.5 py-2.5 text-sm text-[var(--text)] transition-colors duration-150 file:mr-3 file:cursor-pointer file:rounded-[4px] file:border-0 file:bg-[var(--accent)] file:px-3 file:py-1.5 file:text-xs file:font-bold file:uppercase file:tracking-[0.08em] file:text-[var(--accent-fg)] hover:border-[var(--text-subtle)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--focus)]"
          />
          <p id="career-resume-help" className="mt-1.5 text-[11px] leading-relaxed text-[var(--text-subtle)]">
            The file is attached to your application for the hiring team to review.
          </p>

          {resumeName && !resumeError && (
            <p className="mt-2 inline-flex items-center gap-2 border border-[var(--accent-quiet-border)] bg-[var(--accent-quiet-bg)] px-2.5 py-1.5 text-[11px] font-semibold text-[var(--accent-quiet-text)]">
              <Paperclip className="h-3.5 w-3.5" aria-hidden="true" />
              {resumeName}
              <button
                type="button"
                onClick={clearResume}
                className="ml-1 underline underline-offset-2 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--focus)]"
              >
                Remove<span className="sr-only"> attached r\u00e9sum\u00e9</span>
              </button>
            </p>
          )}

          {resumeError && (
            <p className={ERROR_TEXT_CLASS} role="alert">
              {resumeError}
            </p>
          )}
        </div>

        <div>
          <label htmlFor="career-resume-link" className={LABEL_CLASS}>
            Or link to your online CV
          </label>
          <input
            id="career-resume-link"
            type="url"
            inputMode="url"
            placeholder="https://drive.google.com/..."
            aria-invalid={errors.resumeLink ? true : undefined}
            aria-describedby={
              errors.resumeLink ? "career-resume-link-error" : undefined
            }
            {...register("resumeLink")}
            className={inputClass(!!errors.resumeLink)}
          />
          {errors.resumeLink && (
            <p id="career-resume-link-error" className={ERROR_TEXT_CLASS}>
              {errors.resumeLink.message}
            </p>
          )}
        </div>
        <div>
          <label htmlFor="career-message" className={LABEL_CLASS}>
            Cover Message
          </label>
          <textarea
            id="career-message"
            rows={5}
            placeholder="Tell us about your experience with fabrication, machinery, or field support."
            aria-invalid={errors.message ? true : undefined}
            aria-describedby={
              errors.message ? "career-message-error" : "career-message-help"
            }
            {...register("message")}
            className={inputClass(!!errors.message)}
          />
          {errors.message ? (
            <p id="career-message-error" className={ERROR_TEXT_CLASS}>
              {errors.message.message}
            </p>
          ) : (
            <p
              id="career-message-help"
              className="mt-1.5 text-[11px] leading-relaxed text-[var(--text-subtle)]"
            >
              Optional, but it helps us route your application to the right team.
            </p>
          )}
        </div>

        {/* Honeypot. Hidden from sight and from assistive technology, and
            excluded from the tab order — a real applicant never reaches it. */}
        <div className="hidden" aria-hidden="true">
          <label htmlFor="career-website">Website</label>
          <input
            id="career-website"
            type="text"
            tabIndex={-1}
            autoComplete="off"
            {...register("website")}
          />
        </div>

        <button
          type="submit"
          disabled={submitting}
          className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-[6px] bg-[var(--accent)] px-6 text-xs font-bold uppercase tracking-[0.1em] text-[var(--accent-fg)] transition-colors duration-150 hover:bg-[var(--accent-hover)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--focus)] disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
        >
          <Send className="h-4 w-4" aria-hidden="true" />
          {submitting ? "Submitting\u2026" : "Submit Application"}
        </button>
      </form>
    </div>
  );
}



