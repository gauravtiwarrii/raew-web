"use client";

import { useCallback, useEffect, useRef } from "react";

/**
 * useFocusTrap — keeps Tab focus inside `ref` while `active`.
 *
 * Also handles the two things every hand-rolled modal in this codebase was
 * missing: it moves focus into the container on open, and returns focus to
 * whatever was focused before on close. Without the restore, closing a
 * lightbox drops keyboard users back at the top of the document.
 */
export function useFocusTrap<T extends HTMLElement>(
  ref: React.RefObject<T | null>,
  active: boolean
) {
  const previouslyFocused = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (!active) return;
    const node = ref.current;
    if (!node) return;

    previouslyFocused.current = document.activeElement as HTMLElement | null;

    const getFocusable = () =>
      Array.from(
        node.querySelectorAll<HTMLElement>(
          'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'
        )
      ).filter((el) => el.offsetParent !== null || el === document.activeElement);

    // Focus the first control so the keyboard user starts inside the dialog.
    const focusable = getFocusable();
    (focusable[0] ?? node).focus();

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key !== "Tab") return;
      const items = getFocusable();
      if (items.length === 0) {
        e.preventDefault();
        return;
      }
      const first = items[0];
      const last = items[items.length - 1];
      const current = document.activeElement;

      if (e.shiftKey && (current === first || !node.contains(current))) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && current === last) {
        e.preventDefault();
        first.focus();
      }
    };

    node.addEventListener("keydown", onKeyDown);
    return () => {
      node.removeEventListener("keydown", onKeyDown);
      previouslyFocused.current?.focus?.();
    };
  }, [ref, active]);
}

/**
 * useScrollLock — prevents the page behind a modal from scrolling.
 *
 * Compensates for the disappearing scrollbar so the layout underneath does not
 * jump sideways when the lock engages.
 *
 * `body.style.overflow = "hidden"` is the whole mechanism now, and it is enough.
 * There used to be a second half: a `lockScroll()` call that suspended Lenis,
 * which was genuinely required at the time — Lenis reads wheel events itself and
 * kept integrating a target scroll position even while the document could not
 * move, so on close it snapped to wherever that phantom target had drifted,
 * potentially the whole length of however long the modal was open with a finger on
 * the wheel. Removing Lenis removed the phantom target, and with it the need for
 * the second lock. This is the concrete cost that a smooth-scroll library imposes
 * on the rest of an application: every native scroll behaviour has to be
 * re-implemented against it.
 */
export function useScrollLock(active: boolean) {
  useEffect(() => {
    if (!active) return;
    const { body } = document;
    const previousOverflow = body.style.overflow;
    const previousPaddingRight = body.style.paddingRight;
    const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;

    body.style.overflow = "hidden";
    if (scrollbarWidth > 0) {
      body.style.paddingRight = `${scrollbarWidth}px`;
    }

    return () => {
      body.style.overflow = previousOverflow;
      body.style.paddingRight = previousPaddingRight;
    };
  }, [active]);
}

/** useOnEscape — calls `handler` when Escape is pressed while `active`. */
export function useOnEscape(active: boolean, handler: () => void) {
  const stable = useCallback(handler, [handler]);

  useEffect(() => {
    if (!active) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.stopPropagation();
        stable();
      }
    };
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [active, stable]);
}
