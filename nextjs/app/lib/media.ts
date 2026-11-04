/**
 * Media registry — images import from `/assets`; videos are public URLs
 * (Turbopack cannot bundle `.mp4` / `.webm` as modules).
 *
 * Voice portraits live in `voice-photos.ts` so the hero path does not
 * pull below-fold images into the first client chunk.
 */

import logoMark from "../../../assets/brand/logo-mark.png";

export const BRAND = {
  logoMark,
} as const;

export type ProjectMediaSlug =
  | "essential"
  | "genesis"
  | "myan-gate"
  | "york-yoga";

export type ProjectPreview = {
  /** Stable id — folder name under public/media/projects/ */
  slug: ProjectMediaSlug;
  /** Short label for alt text / chrome */
  label: string;
  /** Web delivery — prefer webm then mp4 in <video> */
  preview: {
    mp4: string;
    webm: string;
  };
};

function projectPreviewUrls(slug: ProjectMediaSlug) {
  const base = `/media/projects/${slug}`;
  return {
    mp4: `${base}/preview.mp4`,
    webm: `${base}/preview.webm`,
  };
}

/**
 * Project screen recordings. `preview.mp4` should be the best practical
 * encode (often a copy of `assets/portfolios/{slug}/master.mp4`).
 */
export const PROJECT_PREVIEWS: Record<ProjectMediaSlug, ProjectPreview> = {
  essential: {
    slug: "essential",
    label: "Essential",
    preview: projectPreviewUrls("essential"),
  },
  genesis: {
    slug: "genesis",
    label: "Genesis",
    preview: projectPreviewUrls("genesis"),
  },
  "myan-gate": {
    slug: "myan-gate",
    label: "MyanGate",
    preview: projectPreviewUrls("myan-gate"),
  },
  "york-yoga": {
    slug: "york-yoga",
    label: "York Yoga",
    preview: projectPreviewUrls("york-yoga"),
  },
};

export const PROJECT_MEDIA_LIST = Object.values(PROJECT_PREVIEWS);
