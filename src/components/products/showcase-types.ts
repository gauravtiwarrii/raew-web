/**
 * Shared shape for the product showcase.
 *
 * Types only, in their own module, so the client stage and the server wrapper can
 * both import it without either one dragging the other across the client
 * boundary. Importing this from a `"use client"` file is free — TypeScript erases
 * it, so nothing ships.
 *
 * `specs` arrives already parsed and already filtered. Doing that on the server
 * means the raw JSON string never crosses to the browser, and — more to the point
 * — the client stage has no opportunity to invent a value for a missing key,
 * because it only ever sees pairs that exist.
 */
export interface ShowcaseItem {
  id: string;
  name: string;
  slug: string;
  categoryName: string;
  shortDescription: string;
  /** Raw value from `Product.image`; the frame validates it before rendering. */
  image: string;
  specs: { key: string; value: string }[];
}
