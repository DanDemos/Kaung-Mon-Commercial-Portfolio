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
 * After the document is fully loaded, warm remaining project videos in the
 * background so tab switches feel instant — without competing with first paint.
 */
export function prefetchProjectVideos(
  slugs: ProjectMediaSlug[],
  options?: { skip?: ProjectMediaSlug },
) {
  if (typeof document === "undefined") return;

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
