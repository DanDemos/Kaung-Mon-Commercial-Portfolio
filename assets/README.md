# Media assets

Library for brand, people, and project **masters**. The Next app imports images from here; **web video** lives under `nextjs/public/media/` so Turbopack can serve it without bundling.

## Layout

```
assets/
  brand/                 # Site chrome (imported)
    logo-mark.png
    clients/             # One optimized mark per client (kebab-case)
      {client-slug}.png  # Transparent PNG; keep only intentional badge fills (circle/color plates)
  people/
    voices/              # High-quality portraits (~640px JPEG q92 for Voices)
      {person-slug}.jpg
  projects/
    {project-slug}/
      master.mp4         # Best-quality source (also copied to public preview when possible)
      poster.jpg         # Optional still (add when available; may also copy to public)
      stills/            # Optional extra frames / UI shots
  _archive/              # Kept for reference; not wired into the site
    people/              # Unprocessed portrait originals
    videos-mobile/       # Unused mobile encodes

nextjs/public/media/
  projects/
    {project-slug}/
      preview.mp4        # Web delivery (primary — prefer master quality)
      preview.webm       # Optional fallback
```

## Naming

| Kind | Pattern | Example |
|------|---------|---------|
| Slugs | `kebab-case` | `myan-gate`, `kein-pyi-si` |
| Voice photo | `people/voices/{slug}.{ext}` | `wai-yan.png` |
| Project folder | `projects/{slug}/` | `projects/york-yoga/` |
| Web video | `nextjs/public/media/projects/{slug}/preview.{mp4,webm}` | |
| Master | `assets/projects/{slug}/master.mp4` | re-encode source only |
| Poster | `poster.jpg` | first-frame / branded still |

## Adding a project later

1. Create `assets/projects/{slug}/` and keep `master.mp4` there if you have a full export.
2. Drop web encodes into `nextjs/public/media/projects/{slug}/preview.mp4` and `preview.webm`.
3. Register the slug in `nextjs/app/lib/media.ts` (`PROJECT_PREVIEWS`).
4. Point path content / `ProjectStage` at that slug when copy is ready.

Do **not** `import` `.mp4` / `.webm` in app code — Turbopack has no loader for them. Use public URLs from the registry.

**Load strategy:** HTML/CSS/JS shell first (media gate after paint/idle). Each image/video shows its own spinner and may take longer — quality over early media bytes. Only the **active** project clip starts; other clips are not prefetched by default.

## Mobile variants — not used

Separate `*mobile*` encodes are **not** required for “looking better” on phones. The browser scales one landscape preview to the CSS box. Prefer one high-quality `preview.mp4` (from `master` when available); use responsive CSS (and later a poster), not a second video file.

## Do not commit

- Raw camera dumps, huge masters beyond what you need to re-encode, or duplicate exports. Keep `_archive/` / `master` lean.
