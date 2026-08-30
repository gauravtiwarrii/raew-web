# RAEW — Cinematic transformation handoff

Written 2026-08-25, at the end of the "Premium 3D Industrial Website Transformation" pass.
This document exists because the environment the work was done in cannot run a build. It
records what was verified, what was deliberately left alone, and what you need to check on
Windows before this goes anywhere near production.

---

## What you must run yourself

Two commands, on Windows, in `D:\RAEW Web`:

```
npm run build
npm run lint
```

`npm run build` could not be run during the work. `node_modules` was installed on Windows,
so it contains only win32 native binaries — `@tailwindcss/oxide-win32-x64-msvc` and
`lightningcss-win32-x64-msvc`. Tailwind therefore cannot compile in the Linux sandbox, and
neither `next build` nor `next dev` can start. Every claim in this file about *computed*
colour or *rendered* geometry is derived arithmetically from the source, not observed. The
build is the first real gate.

`npm run lint` will fail immediately, and not because of this work: **eslint is not
installed at all**, despite the `lint` script existing in `package.json`. Install it before
reading anything into that failure. Egress was blocked in the sandbox (`npm install` and
`npx` both return E403), so nothing could be added — that also rules out `three`,
`@react-three/fiber`, `@react-three/drei`, `gsap`, `lenis`, `prettier` and `stylelint`.

One more sandbox note so you don't lose an afternoon to it: `prisma validate` **hangs**
rather than erroring, because its query engine is a win32 binary. It is not stuck on your
schema.

## What was verified, and how

TypeScript compiles clean: `tsc --noEmit -p tsconfig.json` exits 0. That is the primary
gate here and it is a real one, since it validates every JSX tree in full.

Beyond that, the checks were scripted rather than eyeballed. `globals.css` parses under
PostCSS (`postcss.parse`, which is pure JS and a genuine CSS validator) and its structure
balances — 788 lines, 66 `/*` against 66 `*/`, 62 `{` against 62 `}`, no unterminated
comment. This matters more than it sounds: an unterminated CSS comment leaves prose sitting
in CSS scope, and `tsc` never reads CSS, so nothing else in the toolchain would catch it.

Every CSS custom property referenced from non-admin TSX was cross-checked against the
definitions in `globals.css`: 38 distinct tokens used, 107 defined, zero undefined. The one
defined-but-unreferenced token, `--surface-inverse-2`, was kept rather than deleted, with a
comment in place explaining that it is the second step of the `--surface-inverse` ramp that
the utility bar and the inner-page hero bands still use, and stating the condition under
which it becomes safe to remove.

Because `noUnusedLocals` is off in `tsconfig.json`, dead imports had to be scripted for
separately — that check is clean, as are the client/server boundary check and a scan for
`.map()` without a `key`.

Contrast was measured, never estimated. Roughly thirty pairings were run through a WCAG
script; the results are recorded inline at the call sites that depend on them. Three
choices were *rejected* on measurement and the reasoning left in the code so it isn't
relitigated: `--accent-bright` as the overlay CTA ground (white on it is 3.77:1, and 14px
bold does not qualify as large text — that needs 18.66px bold), rebinding `--accent` on the
overlay header wrapper (it is a button background carrying white labels in four places, so
re-pointing it would drop those to about 1.9:1), and `.cinema`'s own `--surface-2` for
header hover fills (at `#0b0d0c` it is *darker* than its ground, so it reads as pressed-in
rather than hovered).

## First things to look at in a browser

Start with three homepage sections and the footer. A change to the cascade layering in
`globals.css` alters the *computed* background of `page.tsx` at lines 109, 252 and 682 —
they were rendering `#070707` where their class lists always intended the stage and riser
values — and it changes the footer's default inherited text colour, which is now
`#94a3b8` (7.86:1) rather than `#f8fafc`. These are fixes, but they are fixes you should
see rather than trust.

The reason sits in Tailwind v4's layer order. `tailwindcss/index.css` declares
`@layer theme, base, components, utilities`, and unlayered author CSS outranks *all*
layered CSS. So anything a call site is expected to override with a utility has to live
inside `@layer components`. Worth keeping in mind for any future edit to that file.

Then look at the overlay header between 320px and 420px wide. The logo mark, the truncating
wordmark and the hamburger should all be present and whole. At 320px they previously were
not: the logo `<Link>` carried `shrink-0` and held about 236px of max-content against 288px
of available width, and because `html { overflow-x: clip }` is the site's horizontal-scroll
backstop, the excess was *clipped* rather than made scrollable — which shaved off the menu
button on the one width where it is the only way into the navigation. The fix was `min-w-0`
on the link and its text column, `shrink-0` moved onto the `<Image>`, `truncate` on both
text spans, a `text-sm min-[360px]:text-base sm:text-lg` ramp on the wordmark, and removal
of a third, redundant mobile "Quote" pill (`MobileBottomBar` already carries Get Quote).

While you are in the header, scroll past the 20px threshold on the homepage and watch the
2px accent rule. It fades in rather than mounting, specifically so the bar does not jiggle
on the first scroll event.

## The one accepted trade-off

On non-homepage routes the navigation condenses on scroll, and that shift is about 13px —
roughly 0.015 CLS. It is real and it is left in. Quoting the comment now in `Header.tsx`:
*"Removing it entirely means giving the bar a fixed height and scaling the logo by
transform instead, which changes the measured geometry of every light page and needs to be
checked in a browser. Flagged rather than done blind."*

## Content integrity — items awaiting your sign-off

Nothing was invented. Products, specifications, addresses and contact details all come from
`src/lib/config.ts`, `prisma/seed.ts` and `src/lib/translations/*.json`.

`prisma/seed.ts` still carries a block marked
`⚠️ UNVERIFIED PERFORMANCE FIGURES — OWNER SIGN-OFF REQUIRED`, covering "3x longer
lifespan", "99.5% grain purity output", "saves up to 35% irrigation water" (twice) and
"IP67 rated". These were left intact rather than deleted because they may well be your real
specifications, and all of them are editable from the admin panel. They need your
confirmation either way.

Also note that your local `.env` has no `ADMIN_SEED_PASSWORD`, so re-running
`prisma/seed.ts` will throw until you add one.

Three pieces of copy were removed across the passes: the footer's four-cell feature strip,
section 9's "Priced direct by the factory" chip (the same claim is still made verbatim in
bento cell 5), and the header's third mobile Quote CTA. No fact was lost and no route
became unreachable in any of the three cases.

## Where photographs go

The catalogue currently ships placeholder frames; `src/lib/images.ts` gates real imagery
behind `isAuthenticImage`, with `ALLOW_STOCK_IMAGERY` as the reversal switch. Three slots
are designed and waiting, so adding real photographs is a swap rather than a redesign: the
hero visual at 21:9 on a dark ground, `ShowcaseFrame` at 4:3 and at least 1600×1200 on a
dark ground, and the `ImagePlaceholder` in homepage section 3, captioned "Fabrication bay —
Mirzapur works". Category tiles will pick up a real `cat.image` automatically as soon as it
passes `isAuthenticImage`.

## Deliberately out of scope

`/admin/*` — nine files, 228 raw-Tailwind colour occurrences — keeps its own dark
slate/amber identity. It is an internal tool, and pulling it into the public design system
was not part of the brief.

The gallery lost its 3D showcase and marquee view modes in an earlier pass.

The 3D upgrade seam is worth knowing about before anyone extends the hero. Because the WebGL
libraries could not be installed, the hero visual is built from Framer Motion 12, CSS 3D
transforms and SVG — but it sits behind `dynamic(() => import("./CssEngineVisual"),
{ ssr: false })` in `src/components/hero/HeroVisual.tsx`, with a `blueprint-grid-dark` +
`stage-light` + `grain` composition as the loading state rather than a spinner. A real
Three.js scene can replace `CssEngineVisual` without touching anything around it. Keep any
future WebGL work behind that boundary.
