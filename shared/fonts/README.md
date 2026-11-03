# Fonts (classic CSS, not `next/font`)

## Why we use the old way

This repo targets **Next.js, Nuxt, PHP, and plain HTML** with one shared design layer under `shared/`.

`next/font` only runs inside Next’s build. Using it would mean:

- font setup lives in Next-only TSX, not in shared CSS
- other frontends still need a second, duplicate `@font-face` path
- more indirection (`variable` on `<html>` + Tailwind `font-sans` + `@theme`)

So we self-host Geist with classic CSS in `shared/css/fonts.css` + `shared/fonts/`, and each app only adds a preload link if it wants.

## What `next/font` normally does for you

| Feature | What Next does at build time | How we do it here |
| --- | --- | --- |
| Self-host | Downloads/bundles font into the Next build | Ship `GeistSans.woff2` in `shared/fonts/` |
| Subsetting | Keeps mostly the glyphs you ask for (e.g. `latin`) | Official variable woff2 is already ~70KB; `unicode-range` marks latin. Optional: shrink further later with `fonttools` / `pyftsubset` |
| Preload | Injects `<link rel="preload" as="font">` | Explicit preload in `nextjs/app/layout.tsx` (repeat in Nuxt/PHP/HTML as needed) |
| Fallback metrics | Rewrites Arial (etc.) size/ascent so swap jumps less | Skipped on purpose — we don’t use a metric-tuned fallback face |
| CSS variable | Exposes `--font-…` on a class | `:root { --font-sans: … }` in `fonts.css` |

## Files

- `GeistSans.woff2` — Geist Sans variable (weights 100–900), from [vercel/geist-font](https://github.com/vercel/geist-font) v1.7.2
- `CormorantGaramond-SemiBold.woff2` — Cormorant Garamond 600 (display), hero brand only; SIL OFL via [Google Fonts](https://fonts.google.com/specimen/Cormorant+Garamond)
- `OFL.txt` — SIL Open Font License (Geist; Cormorant Garamond likewise OFL)
- `../css/fonts.css` — `@font-face`, `--font-sans`, `--font-display`

## Using outside Next

```html
<link
  rel="preload"
  href="/shared/fonts/GeistSans.woff2"
  as="font"
  type="font/woff2"
  crossorigin
/>
<link rel="stylesheet" href="/shared/css/fonts.css" />
<link rel="stylesheet" href="/shared/css/base.css" />
```

(Adjust public URLs to however each stack serves the `shared/` folder.)
