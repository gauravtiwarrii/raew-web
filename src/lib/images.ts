/**
 * Image authenticity guard.
 *
 * WHY THIS EXISTS
 *
 * The catalogue was seeded with four Unsplash stock photographs, cycled across
 * every product, every category and the whole gallery. The consequences were
 * visible on the live site:
 *
 *   • `photo-1592982537447-7440770cbfc9` illustrated the Rotavator, the
 *     Cultivator AND a category tile — three different things, one photo.
 *   • `photo-1581092160607-ee22621dd758` is a photograph of an unrelated
 *     company's fabrication workshop. It was used as a product image, a
 *     category image, a gallery item, and (until it was removed) as the
 *     homepage's "our quality inspection process" illustration.
 *
 * Two separate problems. First, presenting another firm's plant and machinery
 * as your own is a misrepresentation, not a styling choice. Second, one generic
 * photo standing in for several specific named machines is the single clearest
 * signal that a site's content is not real — precisely the impression this
 * rebuild is meant to avoid.
 *
 * The fix is applied at render time rather than only in `prisma/seed.ts`,
 * because the seed has already been run: the owner's `dev.db` (and any
 * deployed database) still holds these URLs. Guarding the render path means
 * existing rows are handled without needing a migration or a re-seed.
 *
 * Anything the owner supplies themselves — a local file under
 * /public/images/**, a Cloudinary or Supabase upload from the admin panel — is
 * treated as authentic. Only hosts that exclusively serve generic stock or
 * filler imagery are rejected.
 */

/**
 * Hosts that can never serve an authentic photograph of RAEW's own machinery.
 * Matched as substrings so query strings and subpaths do not defeat the check.
 */
const STOCK_IMAGE_HOSTS = [
  "images.unsplash.com",
  "unsplash.com",
  "via.placeholder.com",
  "placehold.co",
  "placeholder.com",
  "picsum.photos",
  "loremflickr.com",
  "dummyimage.com",
];

/**
 * Escape hatch for the site owner.
 *
 * Set to `true` to render stock imagery again instead of placeholders. This is
 * deliberately a single flag rather than a per-image decision: if generic
 * agricultural photography is preferred over honest empty frames until real
 * machine photographs are taken, that is the owner's call to make in one place.
 *
 * Leaving it `false` means every machine without a real photograph shows a
 * titled placeholder, which is accurate and looks intentional.
 */
export const ALLOW_STOCK_IMAGERY = false;

/**
 * True when `src` is a usable, non-stock image worth rendering.
 *
 * Returns false for null, undefined, empty/whitespace strings and known stock
 * hosts — so callers can treat a single falsey result as "show a placeholder".
 */
export function isAuthenticImage(src?: string | null): boolean {
  if (!src) return false;

  const trimmed = src.trim();
  if (!trimmed) return false;

  if (ALLOW_STOCK_IMAGERY) return true;

  const lowered = trimmed.toLowerCase();
  return !STOCK_IMAGE_HOSTS.some((host) => lowered.includes(host));
}

/**
 * Filter a list of image URLs down to the authentic ones, preserving order.
 * Used by the product gallery, where some secondary images may be real and
 * others seeded stock.
 */
export function authenticImages(sources: (string | null | undefined)[]): string[] {
  return sources.filter((s): s is string => isAuthenticImage(s)).map((s) => s.trim());
}
