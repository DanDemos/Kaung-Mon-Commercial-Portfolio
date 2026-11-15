/**
 * Young Night brand colors — hardcoded for this dashboard only.
 * Intentionally duplicated (not imported from frontend/) so the backend
 * package stays self-contained.
 *
 * Seed charcoal: #232323 · Accent blue: #2C7BD3
 * Dark values mirror the portfolio’s default Young Night dark canvas.
 */

export const MODE_STORAGE_KEY = "km-dash-color-mode";
export const DEFAULT_MODE = "dark";

/** @typedef {"light" | "dark"} ColorMode */

export const YOUNG_NIGHT = {
  seed: "#232323",
  accent: "#2C7BD3",
  dark: {
    bg: "#121212",
    bgElevated: "#1a1a1a",
    fgDisplay: "#f2f2f2",
    fg: "#ccd0d7",
    fgMuted: "#a3a5a8",
    accent: "#2c7bd3",
    onAccent: "#ffffff",
    brandMark: "#ffffff",
    line: "rgba(204, 208, 215, 0.14)",
    soft: "rgba(204, 208, 215, 0.08)",
    inputBg: "#0c0c0c",
    danger: "#e8a090",
  },
  light: {
    bg: "#f2f4f7",
    bgElevated: "#ffffff",
    fgDisplay: "#121212",
    fg: "#1a1c1f",
    fgMuted: "#5c6370",
    accent: "#2c7bd3",
    onAccent: "#ffffff",
    brandMark: "#121212",
    line: "rgba(26, 28, 31, 0.12)",
    soft: "rgba(44, 123, 211, 0.1)",
    inputBg: "#e8ebf0",
    danger: "#b42318",
  },
};

/** @returns {ColorMode} */
export function readStoredMode() {
  try {
    const raw = localStorage.getItem(MODE_STORAGE_KEY);
    if (raw === "light" || raw === "dark") return raw;
  } catch {
    /* private mode */
  }
  return DEFAULT_MODE;
}

/** @param {ColorMode} mode */
export function persistMode(mode) {
  try {
    localStorage.setItem(MODE_STORAGE_KEY, mode);
  } catch {
    /* private mode */
  }
}

/** @param {ColorMode} mode */
export function applyMode(mode) {
  const root = document.documentElement;
  root.dataset.themeSurface = mode;
  root.style.colorScheme = mode;
}

/** @param {ColorMode} mode */
export function toggleMode(mode) {
  return mode === "dark" ? "light" : "dark";
}
