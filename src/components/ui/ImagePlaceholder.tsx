import { ImageOff } from "lucide-react";

interface ImagePlaceholderProps {
  /** What the eventual photograph should show, e.g. "Fabrication bay". */
  label: string;
  /** Optional second line, e.g. the suggested file path. */
  hint?: string;
  className?: string;
  /** Render for a dark background. */
  dark?: boolean;
}

/**
 * Deliberate placeholder for a photograph the company has not supplied yet.
 *
 * The site previously filled these gaps with Unsplash stock — including a
 * stranger's fabrication workshop captioned as RAEW's own quality-inspection
 * process. Presenting another company's plant as your own is worse than an
 * honest gap, so unsourced stock imagery is replaced by this component.
 *
 * It is styled as a drawing frame rather than a broken-image box: on a page
 * about engineering, an empty titled panel reads as "photo pending", which is
 * true, and does not damage the impression of the rest of the page.
 */
export default function ImagePlaceholder({
  label,
  hint,
  className = "",
  dark = false,
}: ImagePlaceholderProps) {
  return (
    <div
      role="img"
      aria-label={`Placeholder — photograph pending: ${label}`}
      className={`relative flex flex-col items-center justify-center overflow-hidden border text-center ${
        dark
          ? "border-[var(--border-inverse)] bg-[var(--surface-inverse)]"
          : "border-[var(--border-strong)] bg-[var(--surface-2)]"
      } ${className}`}
    >
      <div
        className={`absolute inset-0 ${dark ? "blueprint-grid-dark" : "blueprint-grid-fine"}`}
        aria-hidden="true"
      />

      {/* Corner ticks — a drafting frame, not an error state. */}
      <span
        aria-hidden="true"
        className={`absolute left-3 top-3 h-3 w-3 border-l border-t ${
          dark ? "border-white/25" : "border-[var(--text-subtle)]"
        }`}
      />
      <span
        aria-hidden="true"
        className={`absolute right-3 top-3 h-3 w-3 border-r border-t ${
          dark ? "border-white/25" : "border-[var(--text-subtle)]"
        }`}
      />
      <span
        aria-hidden="true"
        className={`absolute bottom-3 left-3 h-3 w-3 border-b border-l ${
          dark ? "border-white/25" : "border-[var(--text-subtle)]"
        }`}
      />
      <span
        aria-hidden="true"
        className={`absolute bottom-3 right-3 h-3 w-3 border-b border-r ${
          dark ? "border-white/25" : "border-[var(--text-subtle)]"
        }`}
      />

      <div className="relative flex flex-col items-center gap-2 px-6 py-8">
        <ImageOff
          className={`h-6 w-6 ${dark ? "text-white/35" : "text-[var(--text-subtle)]"}`}
          aria-hidden="true"
        />
        <p
          className={`spec-label ${
            dark ? "text-[var(--text-inverse-muted)]" : "text-[var(--text-muted)]"
          }`}
        >
          {label}
        </p>
        {hint && (
          <p
            className={`max-w-[24ch] text-[11px] leading-relaxed ${
              dark ? "text-white/40" : "text-[var(--text-subtle)]"
            }`}
          >
            {hint}
          </p>
        )}
      </div>
    </div>
  );
}
