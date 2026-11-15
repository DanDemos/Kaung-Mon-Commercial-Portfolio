/** In-page section ids. Scroll targets, never written into the URL. */
export type PageSection =
  | "top"
  | "work"
  | "clients"
  | "about"
  | "voices"
  | "contact";

export function isPageSection(value: string): value is PageSection {
  return (
    value === "top" ||
    value === "work" ||
    value === "clients" ||
    value === "about" ||
    value === "voices" ||
    value === "contact"
  );
}

/** Drop `#…` from the address bar without a history entry. */
export function clearLocationHash() {
  if (typeof window === "undefined") return;
  if (!window.location.hash) return;
  const clean = `${window.location.pathname}${window.location.search}`;
  window.history.replaceState(null, "", clean);
}

/**
 * Smooth-scroll to a section without changing the URL.
 * Non-technical visitors should never see `#contact` stuck in the bar.
 */
export function scrollToSection(section: PageSection) {
  if (typeof document === "undefined") return;
  const el = document.getElementById(section);
  if (!el) return;

  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  el.scrollIntoView({ behavior: reduce ? "auto" : "smooth", block: "start" });
  clearLocationHash();
}
