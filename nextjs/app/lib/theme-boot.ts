import {
  CUSTOM_SEED_STORAGE_KEY,
  CUSTOM_THEME_ID,
  DEFAULT_COLOR_MODE,
  DEFAULT_CUSTOM_SEED,
  DEFAULT_THEME_ID,
  MODE_STORAGE_KEY,
  THEME_STORAGE_KEY,
  YOUNG_NIGHT_ACCENT,
  YOUNG_NIGHT_SEED,
  type ColorMode,
} from "./color-themes";
import { recentCoty } from "./pantone-coty";

export type KmBootPrefs = {
  mode: ColorMode;
  themeId: string;
  customSeed: string;
  seed: string;
};

declare global {
  interface Window {
    __KM_BOOT__?: KmBootPrefs;
  }
}

/** Known preset swatches for the pre-paint boot script (must stay in sync with themesForYear). */
export function presetSwatchesForBoot(
  year = new Date().getFullYear(),
): Record<string, string> {
  const map: Record<string, string> = {
    [DEFAULT_THEME_ID]: YOUNG_NIGHT_SEED,
  };
  for (const entry of recentCoty(3, year)) {
    map[`coty-${entry.year}`] = entry.hex;
  }
  return map;
}

/**
 * Inline sync boot — runs before first paint.
 * Resolves stored theme prefs, paints a mode-correct canvas, exposes window.__KM_BOOT__.
 * Full token recipes still apply in React; this kills the dark→light flash.
 */
export function getThemeBootScript(): string {
  const presets = presetSwatchesForBoot();
  const payload = {
    modeKey: MODE_STORAGE_KEY,
    themeKey: THEME_STORAGE_KEY,
    customKey: CUSTOM_SEED_STORAGE_KEY,
    defaultMode: DEFAULT_COLOR_MODE,
    defaultThemeId: DEFAULT_THEME_ID,
    customThemeId: CUSTOM_THEME_ID,
    defaultCustomSeed: DEFAULT_CUSTOM_SEED,
    youngNightSeed: YOUNG_NIGHT_SEED,
    youngNightAccent: YOUNG_NIGHT_ACCENT,
    presets,
    darkBg: "#121212",
    lightBg: "#f2f4f7",
    darkFg: "#eceff3",
    lightFg: "#1a1816",
  };

  return `(function(){
  try {
    var p = ${JSON.stringify(payload)};
    var mode = null;
    try { mode = localStorage.getItem(p.modeKey); } catch (e) {}
    if (mode !== "light" && mode !== "dark") {
      mode = p.defaultMode;
    }
    var themeId = null;
    try { themeId = localStorage.getItem(p.themeKey); } catch (e) {}
    if (!themeId) themeId = p.defaultThemeId;
    var customSeed = p.defaultCustomSeed;
    try {
      var raw = localStorage.getItem(p.customKey);
      if (raw && /^#[0-9A-Fa-f]{6}$/.test(raw)) customSeed = raw.toUpperCase();
    } catch (e) {}
    var seed = p.presets[themeId] || p.presets[p.defaultThemeId];
    if (themeId === p.customThemeId) seed = customSeed;
    if (!seed) seed = p.presets[p.defaultThemeId];

    var root = document.documentElement;
    var bg = mode === "light" ? p.lightBg : p.darkBg;
    var fg = mode === "light" ? p.lightFg : p.darkFg;
    var brandPair = String(seed).toUpperCase() === p.youngNightSeed;
    var accent = brandPair ? p.youngNightAccent : seed;
    root.style.setProperty("--color-bg", bg);
    root.style.setProperty("--color-bg-elevated", bg);
    root.style.setProperty("--color-fg", fg);
    root.style.setProperty("--color-fg-display", fg);
    root.style.setProperty("--color-fg-muted", mode === "light" ? "#5c574f" : "#9aa3ad");
    root.style.setProperty("--color-brand-mark", mode === "light" ? "#000000" : "#ffffff");
    root.style.setProperty("--color-line", mode === "light" ? "rgba(26,24,22,0.12)" : "rgba(236,239,243,0.14)");
    root.style.setProperty("--color-accent", accent);
    root.style.setProperty("--color-accent-fg", accent);
    root.style.setProperty("--color-secondary", accent);
    /* Young Night: flat canvas — no blue hero hue before tokens apply */
    root.style.setProperty("--color-hero-glow", bg);
    root.style.setProperty("--color-hero-wash", bg);
    if (brandPair) {
      root.style.setProperty("--color-on-accent", "#ffffff");
      /* Exact brand blue only — no softened #89b5e6 accent-fg */
      root.style.setProperty("--color-accent-fg", p.youngNightAccent);
      root.style.setProperty("--color-secondary", p.youngNightAccent);
      /* Neutral soft fills — no blue washes on surfaces */
      root.style.setProperty("--color-accent-soft", "rgba(204,208,215,0.08)");
      root.style.setProperty("--color-secondary-soft", "rgba(204,208,215,0.08)");
      root.dataset.themeBrand = "young-night";
    } else {
      delete root.dataset.themeBrand;
    }
    root.dataset.themeSurface = mode;
    root.dataset.kmBoot = "loading";
    window.__KM_BOOT__ = {
      mode: mode,
      themeId: themeId,
      customSeed: customSeed,
      seed: seed
    };
  } catch (e) {
    document.documentElement.dataset.kmBoot = "loading";
  }
})();`;
}

export function readClientBootPrefs(): KmBootPrefs | null {
  if (typeof window === "undefined") return null;
  return window.__KM_BOOT__ ?? null;
}

export function markBootReady() {
  if (typeof document === "undefined") return;
  document.documentElement.dataset.kmBoot = "ready";
}
