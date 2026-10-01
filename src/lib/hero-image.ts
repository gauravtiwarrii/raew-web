/**
 * Hero photograph resolver — server-only.
 *
 * WHY THIS EXISTS
 *
 * The single largest lever on how premium this site feels is a real photograph of
 * RAEW's own machinery in the hero. There isn't one yet: `public/images/hero/`
 * holds a `.gitkeep` and nothing else. That is a content gap, not a code gap, and
 * the brief is explicit that missing information becomes a placeholder rather than
 * an invention — so the hero ships with a drafting-notation motif instead of a
 * stock tractor.
 *
 * The point of this module is that closing the gap must not require touching code.
 * The owner drops one file into `public/images/hero/` with one of the names below
 * and the next build renders it full-bleed. No admin field to find, no path to
 * paste, no component to edit. See `public/images/README.md` for the framing and
 * exposure the shot needs.
 *
 * WHY `existsSync` AND NOT A DATABASE FIELD
 *
 * The hero image is a design asset, not content the owner edits per-visit, and a
 * `site_settings` row would mean the hero silently depends on database state that
 * is invisible in the repository — the sort of thing that works locally and shows
 * an empty frame in production. A file on disk is checked at build time, is visible
 * in version control, and fails loudly if it is missing.
 *
 * WHY THE CANDIDATE LIST IS ORDERED
 *
 * Modern formats first. If the owner supplies both `workshop.avif` and
 * `workshop.jpg`, the smaller modern file wins without either being deleted. AVIF
 * and WebP are served as-is; a JPEG still goes through `next/image` optimisation.
 *
 * IMPORTANT: this module reads the filesystem, so it must only ever be imported
 * from a Server Component. `src/app/page.tsx` is the one caller. Importing it into
 * a `"use client"` file will break the client bundle.
 */

import { existsSync } from "node:fs";
import path from "node:path";

/**
 * Accepted hero filenames, most-preferred first. Extensions are matched exactly
 * and case-sensitively, which is deliberate: a case-insensitive match would
 * resolve on Windows and 404 on a Linux host, and that class of bug is only ever
 * discovered in production.
 */
const HERO_CANDIDATES = [
  "workshop.avif",
  "workshop.webp",
  "workshop.jpg",
  "workshop.jpeg",
  "workshop.png",
] as const;

const HERO_DIR = path.join(process.cwd(), "public", "images", "hero");

/**
 * The public URL of the hero photograph, or `null` when none has been supplied.
 *
 * `null` is the expected state today and callers must handle it as a first-class
 * case, not as an error.
 */
export function resolveHeroPhoto(): string | null {
  for (const name of HERO_CANDIDATES) {
    if (existsSync(path.join(HERO_DIR, name))) {
      return `/images/hero/${name}`;
    }
  }
  return null;
}
