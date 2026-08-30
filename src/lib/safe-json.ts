/**
 * Tolerant JSON reader for the free-text JSON columns in the SQLite schema.
 *
 * `Product.specifications`, `features`, `applications` and `galleryImages` are
 * `String` columns holding JSON, and they are editable from the admin panel.
 * That means a malformed value is not a hypothetical: one bad paste in a
 * textarea would otherwise throw inside a server component and return a 500 for
 * the whole page, taking the rest of the product detail down with it.
 *
 * This lived as a private copy inside `app/products/[slug]/page.tsx`. It moved
 * here when the homepage showcase needed the same behaviour — a parser that
 * decides whether a page 500s should exist once, not once per call site, or the
 * two copies will eventually disagree about what "safe" means.
 *
 * `parsed ?? fallback` is deliberate: `JSON.parse("null")` succeeds and yields
 * `null`, which would then be spread or iterated by the caller and crash a step
 * later, in a place with no obvious connection to the bad data.
 */
export function parseJson<T>(raw: string | null | undefined, fallback: T): T {
  if (!raw) return fallback;
  try {
    const parsed = JSON.parse(raw);
    return (parsed ?? fallback) as T;
  } catch {
    return fallback;
  }
}

/**
 * Read a spec map into ordered key/value pairs, dropping anything that is not a
 * usable string pair.
 *
 * The filtering matters for the showcase, which renders these as CAD-style
 * callouts: an empty value would draw a leader line pointing at nothing, and a
 * nested object would render as "[object Object]" beside a real dimension, which
 * looks like a data error in a place the reader is being asked to trust. Nothing
 * is invented to fill a gap — a product with three specs shows three callouts.
 */
export function toSpecPairs(
  raw: string | null | undefined,
  limit?: number
): { key: string; value: string }[] {
  const map = parseJson<Record<string, unknown>>(raw, {});
  if (typeof map !== "object" || Array.isArray(map)) return [];

  const pairs = Object.entries(map)
    .filter(
      (entry): entry is [string, string] =>
        typeof entry[1] === "string" && entry[1].trim().length > 0
    )
    .map(([key, value]) => ({ key, value: value.trim() }));

  return typeof limit === "number" ? pairs.slice(0, limit) : pairs;
}
