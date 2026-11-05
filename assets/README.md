# Media assets

Library for brand, people, and portfolio **masters / covers**. The Next app imports images from here; **web video** lives under `nextjs/public/media/` so Turbopack can serve it without bundling.

## Layout

```
assets/
  brand/
    logo-mark.png
    unused/              # Logo originals / rejects (not imported)
    clients/
      {client-slug}.png  # Live marks — square white-disc plates when needed (wired in client-logos.ts)
      unused/            # Extra plates, squares, unoptimized exports
  people/
    voices/              # Live Voices portraits
    unused/              # Portrait originals / alternates
  portfolios/
    websites/            # Client / student sites
      {project-slug}/
        cover.jpg|.gif   # Grid still on /work
        master.mp4       # Optional full-quality source for walkthroughs
    mobile-apps/         # Play Store / student apps
      {project-slug}/
    chatbots/
      {project-slug}/
    drawings/            # Illustrations, pixel animations, UI studies
      {project-slug}/
    mmd/                 # MikuMikuDance videos
      {project-slug}/
    unused/              # Duplicate frames, source sheets, rejects
      videos-mobile/     # Unused mobile encodes

nextjs/public/media/
  projects/
    {project-slug}/
      preview.mp4        # Web delivery for home ProjectStage
      preview.webm       # Optional fallback
```

## Naming

| Kind | Pattern | Example |
|------|---------|---------|
| Slugs | `kebab-case` | `myan-gate`, `york-yoga` |
| Cover | `portfolios/{type}/{slug}/cover.{jpg,gif,png}` | `type` = websites, mobile-apps, chatbots, drawings, mmd |
| Master video | `portfolios/{type}/{slug}/master.mp4` | re-encode source only |
| Web video | `nextjs/public/media/projects/{slug}/preview.{mp4,webm}` | slug stays flat under public |
| Rejects | `{domain}/unused/…` | `portfolios/unused/`, `people/unused/` |

**Tradition:** anything not wired into the site sits in an `unused/` folder next to its live siblings — not a separate `_archive` tree.

## Adding a work later

1. Create `assets/portfolios/{type}/{slug}/` with `cover.jpg` (or `.gif`) — pick `websites`, `mobile-apps`, `chatbots`, `drawings`, or `mmd`.
2. If it has a walkthrough: add `master.mp4` here, drop web encodes into `nextjs/public/media/projects/{slug}/`, register in `media.ts` + home path projects.
3. Register the piece in `nextjs/app/lib/portfolios.ts` (`PORTFOLIO_ITEMS` + category; import cover from the typed path).
4. Park leftovers under `portfolios/unused/` (or the matching domain `unused/`).

Do **not** `import` `.mp4` / `.webm` in app code — use public URLs from the video registry.

## Mobile variants — not used

Prefer one high-quality `preview.mp4` from `master` when available; use responsive CSS, not a second mobile encode. Old mobile files live in `portfolios/unused/videos-mobile/`.
