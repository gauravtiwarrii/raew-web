# Website images

Drop real photographs of your own machinery and works into these folders. Every
image you add here appears on the site immediately — no code changes needed.

## Folders

| Folder     | What goes here                                                            |
| ---------- | ------------------------------------------------------------------------- |
| `products/`| One clear photograph per machine, plus any extra angles.                   |
| `company/` | The works, the fabrication bay, the team, machinery being built.           |
| `hero/`    | The one wide photograph behind the homepage headline. See below.           |
| `gallery/` | Field photographs, installations, delivered machines.                      |

## The homepage hero photograph

This is the single highest-impact image on the site — the full-screen panel a
first-time visitor sees behind "ENGINEERED FOR THE FIELD." It is worth spending
more effort on this one photo than on all the others put together.

**To add it,** save one file at exactly this path:

```
public/images/hero/workshop.jpg
```

That is the whole procedure. There is no admin field and no code change; the
site looks for that file on each build and uses it if it is there. `.avif`,
`.webp`, `.jpeg` and `.png` work too, and if you happen to have several, the
first match in the order `.avif`, `.webp`, `.jpg`, `.jpeg`, `.png` wins.

The name must be lowercase — `workshop.jpg`, not `Workshop.JPG`. Windows
treats those as the same file and Linux does not, so a capitalised name will
look correct on your own machine and then fail to appear on the live site.

**What to photograph.** Your actual works, doing actual work. A machine part
way through fabrication on the shop floor, a welder mid-weld, a finished
rotavator behind a tractor in a field. What does *not* work: a posed group
photograph, a shot of the building's front gate, anything with the logo or
lettering in it, or a generic tractor picture that could belong to anyone.

**Shape and size.** Wide landscape, roughly 2.4:1 or wider if you have it, and
about 2400px on the long edge — larger than the guidance below for the other
folders, because this one fills the whole screen. The photograph is cropped
from the centre to fill whatever shape the visitor's screen is, so keep some
slack at all four edges. The headline sits over the left third, so put the
subject centre or right of centre, and do not rely on detail in the bottom-left
corner being visible.

**Do not darken it first.** The site dims the photograph and lays a dark wash
over the left side itself, so that white text stays readable no matter what you
supply. A bright, well-exposed daylight photograph is the *best* input here;
one you have already darkened will come out muddy.

**If there is no file,** the homepage draws a fine engineering figure in place
of a photograph. That is a deliberate designed state, not a broken one, so
there is no rush and no penalty for leaving the slot empty until you have a
photo you are happy with. Renaming or removing the file returns the site to it.

One note for whoever deploys the site: this image is part of the project rather
than the database, so it needs to be committed and deployed like any other file.

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
