# Website images

Drop real photographs of your own machinery and works into these folders. Every
image you add here appears on the site immediately — no code changes needed.

## Folders

| Folder     | What goes here                                                            |
| ---------- | ------------------------------------------------------------------------- |
| `products/`| One clear photograph per machine, plus any extra angles.                   |
| `company/` | The works, the fabrication bay, the team, machinery being built.           |
| `hero/`    | Wide landscape shots for page banners.                                     |
| `gallery/` | Field photographs, installations, delivered machines.                      |

## How to add a product photograph

1. Save the photo into `products/` with a clear filename, for example
   `multi-speed-heavy-duty-rotavator.jpg`.
2. Open the admin panel at `/admin/products`, edit that machine, and set its
   image to `/images/products/multi-speed-heavy-duty-rotavator.jpg`.
3. Save. The catalogue and the product page pick it up on the next page load.

The leading `/` matters: paths are relative to `public/`, so a file at
`public/images/products/rotavator.jpg` is referenced as
`/images/products/rotavator.jpg`.

## Why some machines currently show an empty frame

The catalogue was originally seeded with four stock photographs from Unsplash,
reused across all six machines, four categories and the gallery. That meant two
different machines shared one generic photo, and one of the images was actually
a photograph of an unrelated company's workshop.

Rather than present other people's equipment as yours, the site now shows a
titled placeholder wherever an authentic photograph is missing. Adding a real
photo replaces the placeholder automatically.

If you would rather show generic agricultural stock imagery in the meantime,
open `src/lib/images.ts` and set `ALLOW_STOCK_IMAGERY` to `true`. That is a
single deliberate switch, so the decision stays yours.

## Practical notes

- **Format** — JPEG for photographs, PNG only when you need transparency.
  WebP is fine and smaller if your camera or editor can produce it.
- **Size** — roughly 1600px on the long edge is plenty. Next.js resizes and
  serves modern formats automatically, so there is no benefit to uploading
  20-megapixel originals; they only slow the first load.
- **Shape** — product cards crop to 16:10 and product pages to 16:11, so keep
  the machine centred and leave a little room around it.
- **Filenames** — lowercase, hyphens instead of spaces, no accents. Avoid
  `My Photo (1).JPG`; use `tipping-trailer-side-view.jpg`.
- **Text in images** — avoid it. It cannot be translated, read by screen
  readers, or searched. Put wording in the page content instead.

## Uploading from the admin panel instead

The admin panel also accepts image URLs from hosted services, which is easier
if you are working from a phone. Cloudinary, Supabase Storage, imgbb, Imgur,
Google Photos and S3 are already permitted in `next.config.ts`. Any other host
must be added to `images.remotePatterns` there first, or Next.js will refuse to
load it.
