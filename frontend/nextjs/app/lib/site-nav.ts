import {
  FOOTER_NAV,
  type FooterNavItem,
  type VisitorPath,
} from "./visitor-paths";

export type SiteNavItem = FooterNavItem & {
  /** When set, link only shows for that visitor path (e.g. Resume → hire). */
  requiresPath?: VisitorPath;
};

/**
 * Full header sitemap. Home is listed (not only the brand).
 * Resume is Recruiter-lens only — other paths soft-gate the page if reached.
 */
export const SITE_NAV_ITEMS: SiteNavItem[] = FOOTER_NAV.map((item) =>
  item.href === "/resume" ? { ...item, requiresPath: "hire" as const } : item,
);

export function siteNavForPath(path: VisitorPath | null): SiteNavItem[] {
  return SITE_NAV_ITEMS.filter(
    (item) => !item.requiresPath || item.requiresPath === path,
  );
}
