import {
  PROJECT_PREVIEWS,
  type ProjectMediaSlug,
  type ProjectPreview,
} from "./media";

/**
 * Prefer MP4 for reliability (Windows / Safari / Chromium).
 * WebM stays as a secondary `<source>` where useful.
 */
export function preferredPreviewUrl(preview: ProjectPreview["preview"]): string {
  return preview.mp4;
}

export function previewSources(preview: ProjectPreview["preview"]) {
  return [
    { src: preview.mp4, type: "video/mp4" },
    { src: preview.webm, type: "video/webm" },
  ] as const;
}

function runWhenIdle(task: () => void) {
  if (typeof window === "undefined") return;
  const ric = window.requestIdleCallback?.bind(window);
  if (ric) {
    ric(() => task(), { timeout: 4000 });
    return;
  }
  window.setTimeout(task, 1200);
}

/**
 * Optionally warm other project videos after the page is fully idle.
 * Disabled by default so HTML/CSS/JS + the active clip aren't fighting
 * multi‑MB downloads. Call with `{ eager: true }` only if you want it.
 */
export function prefetchProjectVideos(
  slugs: ProjectMediaSlug[],
  options?: { skip?: ProjectMediaSlug; eager?: boolean },
) {
  if (typeof document === "undefined") return;
  if (!options?.eager) return;

  const skip = options?.skip;
  const urls = slugs
    .filter((slug) => slug !== skip)
    .map((slug) => preferredPreviewUrl(PROJECT_PREVIEWS[slug].preview));

  const unique = [...new Set(urls)];

  function warm() {
    for (const href of unique) {
      const link = document.createElement("link");
      link.rel = "prefetch";
      link.as = "video";
      link.href = href;
      link.setAttribute("data-km-video-prefetch", href);
      if (!document.head.querySelector(`link[data-km-video-prefetch="${href}"]`)) {
        document.head.appendChild(link);
      }
    }
  }

  if (document.readyState === "complete") {
    runWhenIdle(warm);
    return;
  }

  window.addEventListener(
    "load",
    () => {
      runWhenIdle(warm);
    },
    { once: true },
  );
}
