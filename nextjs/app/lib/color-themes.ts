import { recentCoty } from "./pantone-coty";
import { COLOR_TOKENS, type ColorTokenId } from "./colors.tokens";

export const THEME_STORAGE_KEY = "km-color-theme";
export const MODE_STORAGE_KEY = "km-color-mode";
export const CUSTOM_SEED_STORAGE_KEY = "km-color-custom-seed";
export const DEFAULT_THEME_ID = "young-night";
/** Fifth swatch — any seed from the color wheel, still runs through `tokensFromSeed`. */
export const CUSTOM_THEME_ID = "custom";
export const DEFAULT_CUSTOM_SEED = "#6B8F71";

/**
 * Personal brand default: Young Night charcoal canvas + fixed blue accent.
 * Circle still shows the charcoal seed; accent/atmosphere use the blue pair.
 * Only this preset is dual-tone — COTY / custom stay single-seed recipes.
 */
export const YOUNG_NIGHT_SEED = "#232323";
export const YOUNG_NIGHT_ACCENT = "#2C7BD3";

export type ColorMode = "light" | "dark";

export const DEFAULT_COLOR_MODE: ColorMode = "dark";

/**
 * Shared near-black for dark mode’s ~60% field.
 * Soft charcoal (not pure #000) so primaries stay clear on top.
 */
export const MODE_DARK_BASE = "#121212";
export const MODE_LIGHT_WHITE = "#ffffff";
/** Cool daylight paper — `neutral-shade` day canvases (not beige). */
const MODE_LIGHT_COOL_PAPER = "#f2f4f7";
/** Warm ivory paper — `neutral-tint` day canvases. */
const MODE_LIGHT_WARM_PAPER = "#faf7f2";

/**
 * Neutral accent *temperature* by value band (spectrum-general, not named themes).
 * Shade day → near-achromatic cool ink; tint → soft warm stone; tone → cool-slate mid.
 * Hue is only a bias — saturation stays low so accents don’t become “product blue.”
 */
const NEUTRAL_ACCENT_HUE = {
  shade: 215,
  tone: 200,
  tint: 36,
} as const;

/**
 * Value = position on the black↔white axis (shade / tone / tint).
 * Chroma = how much color vs gray (neutral / soft / vivid).
 * Classification uses measured S + luminance — never named swatches.
 */
export type SeedValue = "shade" | "tone" | "tint";
export type SeedChroma = "neutral" | "soft" | "vivid";
export type SeedSpectrumId = `${SeedChroma}-${SeedValue}`;

export type SeedSpectrum = {
  id: SeedSpectrumId;
  value: SeedValue;
  chroma: SeedChroma;
  h: number;
  s: number;
  l: number;
  lum: number;
};

export type ThemeTokens = {
  bg: string;
  bgElevated: string;
  /**
   * Logo + header wordmark: pure `#000` or `#fff` from canvas luminance
   * (dark canvas → white mark; light canvas → black mark).
   */
  brandMark: string;
  /** Hero title — from primary. */
  fgDisplay: string;
  /** Body / section titles. */
  fg: string;
  fgMuted: string;
  /** ~10% filled CTA surface — chromatic; must read against canvas. */
  accent: string;
  /** Ink on filled accent — `#000` or `#fff` from fill luminance. */
  onAccent: string;
  /** Text/link accent — AA on bg + glow; never the button fill. */
  accentFg: string;
  accentSoft: string;
  secondary: string;
  secondarySoft: string;
  line: string;
  heroGlow: string;
  heroWash: string;
  surface: ColorMode;
  /** Which spectrum recipe produced these tokens. */
  spectrum: SeedSpectrumId;
};

export type ColorTheme = {
  id: string;
  /** Swatch shown in the circle control (seed / primary). */
  swatch: string;
  /** Accessible name — not shown in UI, used for aria-label. */
  label: string;
};

type Hsl = { h: number; s: number; l: number };

type ChromaTextOptions = {
  minRatio: number;
  lightStart: number;
  lightFloor: number;
  satMin: number;
  satMax: number;
  toward: "dark" | "light";
};

/** Recipe for one spectrum cell — parameters, not named colors. */
type SpectrumRecipe = {
  light: {
    whiteMix: number;
    targetLum: number;
    elevatedPrimary: number;
    glowWhite: number;
    washPrimary: number;
    mutedMix: number;
    /** Day paper temperature for neutral cells (chromatic uses pure white). */
    paper?: "cool" | "warm" | "white";
    display: ChromaTextOptions;
    body: ChromaTextOptions;
    accent: ChromaTextOptions;
  };
  dark: {
    elevatedPrimary: number;
    glowPrimary: number;
    washPrimary: number;
    bodyInk: string;
    bodyPrimaryMix: number;
    mutedMix: number;
    display: ChromaTextOptions;
    accent: ChromaTextOptions;
  };
};

function clamp(n: number, min = 0, max = 255) {
  return Math.min(max, Math.max(min, Math.round(n)));
}

function clamp01(n: number) {
  return Math.min(1, Math.max(0, n));
}

function hexToRgb(hex: string): [number, number, number] {
  const raw = hex.replace("#", "").trim();
  const full =
    raw.length === 3
      ? raw
          .split("")
          .map((c) => c + c)
          .join("")
      : raw;
  const n = Number.parseInt(full, 16);
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
}

function rgbToHex(r: number, g: number, b: number) {
  return `#${[r, g, b]
    .map((v) => clamp(v).toString(16).padStart(2, "0"))
    .join("")}`;
}

function rgbToHsl(r: number, g: number, b: number): Hsl {
  const rr = r / 255;
  const gg = g / 255;
  const bb = b / 255;
  const max = Math.max(rr, gg, bb);
  const min = Math.min(rr, gg, bb);
  const l = (max + min) / 2;
  if (max === min) return { h: 0, s: 0, l };

  const d = max - min;
  const s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
  let h = 0;
  switch (max) {
    case rr:
      h = ((gg - bb) / d + (gg < bb ? 6 : 0)) / 6;
      break;
    case gg:
      h = ((bb - rr) / d + 2) / 6;
      break;
    default:
      h = ((rr - gg) / d + 4) / 6;
      break;
  }
  return { h: h * 360, s, l };
}

function hueToRgb(p: number, q: number, t: number) {
  let tt = t;
  if (tt < 0) tt += 1;
  if (tt > 1) tt -= 1;
  if (tt < 1 / 6) return p + (q - p) * 6 * tt;
  if (tt < 1 / 2) return q;
  if (tt < 2 / 3) return p + (q - p) * (2 / 3 - tt) * 6;
  return p;
}

function hslToHex(h: number, s: number, l: number) {
  const hh = ((h % 360) + 360) % 360;
  const ss = clamp01(s);
  const ll = clamp01(l);
  if (ss === 0) {
    const v = clamp(ll * 255);
    return rgbToHex(v, v, v);
  }
  const q = ll < 0.5 ? ll * (1 + ss) : ll + ss - ll * ss;
  const p = 2 * ll - q;
  const hk = hh / 360;
  const r = hueToRgb(p, q, hk + 1 / 3);
  const g = hueToRgb(p, q, hk);
  const b = hueToRgb(p, q, hk - 1 / 3);
  return rgbToHex(r * 255, g * 255, b * 255);
}

function hexToHsl(hex: string): Hsl {
  const [r, g, b] = hexToRgb(hex);
  return rgbToHsl(r, g, b);
}

function mix(a: string, b: string, t: number): string {
  const [ar, ag, ab] = hexToRgb(a);
  const [br, bg, bb] = hexToRgb(b);
  return rgbToHex(ar + (br - ar) * t, ag + (bg - ag) * t, ab + (bb - ab) * t);
}

function relativeLuminance(hex: string) {
  const channels = hexToRgb(hex).map((c) => {
    const s = c / 255;
    return s <= 0.03928 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4;
  });
  return 0.2126 * channels[0] + 0.7152 * channels[1] + 0.0722 * channels[2];
}

function rgba(hex: string, alpha: number) {
  const [r, g, b] = hexToRgb(hex);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

function contrastRatio(a: string, b: string) {
  const l1 = relativeLuminance(a);
  const l2 = relativeLuminance(b);
  const lighter = Math.max(l1, l2);
  const darker = Math.min(l1, l2);
  return (lighter + 0.05) / (darker + 0.05);
}

/**
 * Place the seed on the spectrum grid.
 * Value from luminance (black↔white); chroma from HSL saturation.
 * Near-white / near-black residual tint still counts as neutral.
 */
export function classifySeed(hex: string): SeedSpectrum {
  const { h, s, l } = hexToHsl(hex);
  const lum = relativeLuminance(hex);

  let value: SeedValue;
  if (lum < 0.2 || l < 0.34) value = "shade";
  else if (lum > 0.55 || l > 0.72) value = "tint";
  else value = "tone";

  let chroma: SeedChroma;
  const nearWhiteNeutral = lum >= 0.72 && s < 0.28;
  const nearBlackNeutral = lum <= 0.06 && s < 0.2;
  if (s < 0.08 || nearWhiteNeutral || nearBlackNeutral) chroma = "neutral";
  else if (s < 0.42) chroma = "soft";
  else chroma = "vivid";

  return { id: `${chroma}-${value}`, value, chroma, h, s, l, lum };
}

function inkOpts(
  partial: ChromaTextOptions,
): ChromaTextOptions {
  return partial;
}

/**
 * Nine recipes: chroma × value.
 * Same kind of color (e.g. soft-tone) shares one system; tint vs tone
 * of that kind get different settings — not one flat solver for all seeds.
 */
const SPECTRUM_RECIPES: Record<SeedSpectrumId, SpectrumRecipe> = {
  /** Dark neutral. Day = cool graphite paper + near-achromatic cool ink accent. */
  "neutral-shade": {
    light: {
      whiteMix: 0.9,
      targetLum: 0.9,
      elevatedPrimary: 0.025,
      glowWhite: 0.88,
      washPrimary: 0.03,
      mutedMix: 0.38,
      paper: "cool",
      display: inkOpts({
        minRatio: 5.5,
        lightStart: 0.2,
        lightFloor: 0.08,
        satMin: 0,
        satMax: 0.06,
        toward: "dark",
      }),
      body: inkOpts({
        minRatio: 6.5,
        lightStart: 0.12,
        lightFloor: 0.05,
        satMin: 0,
        satMax: 0.05,
        toward: "dark",
      }),
      accent: inkOpts({
        minRatio: 3.4,
        lightStart: 0.34,
        lightFloor: 0.22,
        satMin: 0.04,
        satMax: 0.12,
        toward: "dark",
      }),
    },
    dark: {
      // Dark-into-dark seeds need stronger mixes; atmosphere uses lifted mist (see darkAtmosphereSeed)
      elevatedPrimary: 0.32,
      glowPrimary: 0.5,
      washPrimary: 0.22,
      bodyInk: "#d7dbe2",
      bodyPrimaryMix: 0.06,
      mutedMix: 0.42,
      display: inkOpts({
        minRatio: 10,
        lightStart: 0.95,
        lightFloor: 0.9,
        satMin: 0,
        satMax: 0.04,
        toward: "light",
      }),
      accent: inkOpts({
        minRatio: 3.4,
        lightStart: 0.72,
        lightFloor: 0.58,
        satMin: 0.04,
        satMax: 0.14,
        toward: "light",
      }),
    },
  },

  "neutral-tone": {
    light: {
      whiteMix: 0.55,
      targetLum: 0.78,
      elevatedPrimary: 0.05,
      glowWhite: 0.4,
      washPrimary: 0.1,
      mutedMix: 0.3,
      display: inkOpts({
        minRatio: 5,
        lightStart: 0.24,
        lightFloor: 0.08,
        satMin: 0,
        satMax: 0.1,
        toward: "dark",
      }),
      body: inkOpts({
        minRatio: 6,
        lightStart: 0.16,
        lightFloor: 0.05,
        satMin: 0,
        satMax: 0.08,
        toward: "dark",
      }),
      accent: inkOpts({
        minRatio: 3.5,
        lightStart: 0.38,
        lightFloor: 0.24,
        satMin: 0.48,
        satMax: 0.78,
        toward: "dark",
      }),
    },
    dark: {
      elevatedPrimary: 0.22,
      glowPrimary: 0.28,
      washPrimary: 0.16,
      bodyInk: "#d7dbe2",
      bodyPrimaryMix: 0.06,
      mutedMix: 0.4,
      display: inkOpts({
        minRatio: 9,
        lightStart: 0.94,
        lightFloor: 0.88,
        satMin: 0,
        satMax: 0.05,
        toward: "light",
      }),
      accent: inkOpts({
        minRatio: 3.5,
        lightStart: 0.7,
        lightFloor: 0.55,
        satMin: 0.5,
        satMax: 0.8,
        toward: "light",
      }),
    },
  },

  /** Light neutral. Day = warm ivory cloth, soft stone accent. */
  "neutral-tint": {
    light: {
      whiteMix: 0.42,
      targetLum: 0.93,
      elevatedPrimary: 0.04,
      glowWhite: 0.62,
      washPrimary: 0.05,
      mutedMix: 0.3,
      paper: "warm",
      display: inkOpts({
        minRatio: 5.2,
        lightStart: 0.28,
        lightFloor: 0.12,
        satMin: 0.04,
        satMax: 0.14,
        toward: "dark",
      }),
      body: inkOpts({
        minRatio: 6.2,
        lightStart: 0.16,
        lightFloor: 0.06,
        satMin: 0.02,
        satMax: 0.1,
        toward: "dark",
      }),
      accent: inkOpts({
        minRatio: 3.3,
        lightStart: 0.4,
        lightFloor: 0.28,
        satMin: 0.18,
        satMax: 0.36,
        toward: "dark",
      }),
    },
    dark: {
      // Light neutrals deepened via darkAtmosphereSeed — keep mixes moderate
      elevatedPrimary: 0.32,
      glowPrimary: 0.4,
      washPrimary: 0.22,
      bodyInk: "#e2ddd6",
      bodyPrimaryMix: 0.1,
      mutedMix: 0.38,
      display: inkOpts({
        minRatio: 8,
        lightStart: 0.92,
        lightFloor: 0.86,
        satMin: 0.02,
        satMax: 0.08,
        toward: "light",
      }),
      accent: inkOpts({
        minRatio: 3.4,
        lightStart: 0.72,
        lightFloor: 0.58,
        satMin: 0.1,
        satMax: 0.22,
        toward: "light",
      }),
    },
  },

  "soft-shade": {
    light: {
      whiteMix: 0.62,
      targetLum: 0.74,
      elevatedPrimary: 0.08,
      glowWhite: 0.28,
      washPrimary: 0.14,
      mutedMix: 0.28,
      display: inkOpts({
        minRatio: 4.8,
        lightStart: 0.28,
        lightFloor: 0.1,
        satMin: 0.28,
        satMax: 0.55,
        toward: "dark",
      }),
      body: inkOpts({
        minRatio: 5.8,
        lightStart: 0.18,
        lightFloor: 0.06,
        satMin: 0.2,
        satMax: 0.45,
        toward: "dark",
      }),
      accent: inkOpts({
        minRatio: 3.5,
        lightStart: 0.36,
        lightFloor: 0.22,
        satMin: 0.4,
        satMax: 0.72,
        toward: "dark",
      }),
    },
    dark: {
      elevatedPrimary: 0.32,
      glowPrimary: 0.4,
      washPrimary: 0.24,
      bodyInk: "#d7dbe2",
      bodyPrimaryMix: 0.1,
      mutedMix: 0.4,
      display: inkOpts({
        minRatio: 7,
        lightStart: 0.88,
        lightFloor: 0.78,
        satMin: 0.25,
        satMax: 0.55,
        toward: "light",
      }),
      accent: inkOpts({
        minRatio: 3.5,
        lightStart: 0.72,
        lightFloor: 0.55,
        satMin: 0.4,
        satMax: 0.75,
        toward: "light",
      }),
    },
  },

  /**
   * Mid muted chromatic — e.g. Mocha Mousse.
   * Light mode must stay a cream canvas with soft mocha air, not a dusty
   * mid-brown stain (seed-forward glow on a mid taupe fails that).
   */
  "soft-tone": {
    light: {
      whiteMix: 0.66,
      targetLum: 0.84,
      elevatedPrimary: 0.07,
      // Cream air — mid-tone glow must not stain under the display title
      glowWhite: 0.64,
      washPrimary: 0.12,
      mutedMix: 0.26,
      display: inkOpts({
        minRatio: 4.6,
        lightStart: 0.34,
        lightFloor: 0.16,
        satMin: 0.26,
        satMax: 0.48,
        toward: "dark",
      }),
      body: inkOpts({
        minRatio: 5.5,
        lightStart: 0.22,
        lightFloor: 0.1,
        satMin: 0.18,
        satMax: 0.4,
        toward: "dark",
      }),
      accent: inkOpts({
        minRatio: 3.2,
        lightStart: 0.48,
        lightFloor: 0.34,
        satMin: 0.28,
        satMax: 0.48,
        toward: "dark",
      }),
    },
    dark: {
      elevatedPrimary: 0.36,
      glowPrimary: 0.48,
      washPrimary: 0.28,
      bodyInk: "#e6ddd7",
      bodyPrimaryMix: 0.14,
      mutedMix: 0.36,
      display: inkOpts({
        minRatio: 7.5,
        lightStart: 0.9,
        lightFloor: 0.8,
        satMin: 0.22,
        satMax: 0.5,
        toward: "light",
      }),
      accent: inkOpts({
        minRatio: 3.4,
        lightStart: 0.68,
        lightFloor: 0.52,
        satMin: 0.3,
        satMax: 0.52,
        toward: "light",
      }),
    },
  },

  "soft-tint": {
    light: {
      whiteMix: 0.22,
      targetLum: 0.82,
      elevatedPrimary: 0.06,
      glowWhite: 0.1,
      washPrimary: 0.16,
      mutedMix: 0.18,
      display: inkOpts({
        minRatio: 4.5,
        lightStart: 0.28,
        lightFloor: 0.1,
        satMin: 0.22,
        satMax: 0.42,
        toward: "dark",
      }),
      body: inkOpts({
        minRatio: 5.5,
        lightStart: 0.18,
        lightFloor: 0.06,
        satMin: 0.16,
        satMax: 0.36,
        toward: "dark",
      }),
      accent: inkOpts({
        minRatio: 3.4,
        lightStart: 0.46,
        lightFloor: 0.3,
        satMin: 0.6,
        satMax: 0.9,
        toward: "dark",
      }),
    },
    dark: {
      elevatedPrimary: 0.34,
      glowPrimary: 0.42,
      washPrimary: 0.26,
      bodyInk: "#d7dbe2",
      bodyPrimaryMix: 0.1,
      mutedMix: 0.38,
      display: inkOpts({
        minRatio: 7,
        lightStart: 0.9,
        lightFloor: 0.8,
        satMin: 0.25,
        satMax: 0.58,
        toward: "light",
      }),
      accent: inkOpts({
        minRatio: 3.5,
        lightStart: 0.74,
        lightFloor: 0.58,
        satMin: 0.42,
        satMax: 0.8,
        toward: "light",
      }),
    },
  },

  "vivid-shade": {
    light: {
      whiteMix: 0.58,
      targetLum: 0.72,
      elevatedPrimary: 0.08,
      glowWhite: 0.22,
      washPrimary: 0.16,
      mutedMix: 0.28,
      display: inkOpts({
        minRatio: 4.8,
        lightStart: 0.3,
        lightFloor: 0.1,
        satMin: 0.4,
        satMax: 0.7,
        toward: "dark",
      }),
      body: inkOpts({
        minRatio: 5.8,
        lightStart: 0.18,
        lightFloor: 0.06,
        satMin: 0.3,
        satMax: 0.55,
        toward: "dark",
      }),
      accent: inkOpts({
        minRatio: 3.5,
        lightStart: 0.36,
        lightFloor: 0.22,
        satMin: 0.5,
        satMax: 0.85,
        toward: "dark",
      }),
    },
    dark: {
      elevatedPrimary: 0.34,
      glowPrimary: 0.44,
      washPrimary: 0.26,
      bodyInk: "#d7dbe2",
      bodyPrimaryMix: 0.1,
      mutedMix: 0.4,
      display: inkOpts({
        minRatio: 7,
        lightStart: 0.86,
        lightFloor: 0.74,
        satMin: 0.35,
        satMax: 0.7,
        toward: "light",
      }),
      accent: inkOpts({
        minRatio: 3.5,
        lightStart: 0.7,
        lightFloor: 0.55,
        satMin: 0.5,
        satMax: 0.88,
        toward: "light",
      }),
    },
  },

  "vivid-tone": {
    light: {
      whiteMix: 0.4,
      targetLum: 0.72,
      elevatedPrimary: 0.08,
      glowWhite: 0.1,
      washPrimary: 0.2,
      mutedMix: 0.18,
      display: inkOpts({
        minRatio: 4.5,
        lightStart: 0.26,
        lightFloor: 0.1,
        satMin: 0.32,
        satMax: 0.55,
        toward: "dark",
      }),
      body: inkOpts({
        minRatio: 5.5,
        lightStart: 0.16,
        lightFloor: 0.06,
        satMin: 0.22,
        satMax: 0.42,
        toward: "dark",
      }),
      accent: inkOpts({
        minRatio: 3.4,
        lightStart: 0.46,
        lightFloor: 0.3,
        satMin: 0.65,
        satMax: 0.95,
        toward: "dark",
      }),
    },
    dark: {
      elevatedPrimary: 0.32,
      glowPrimary: 0.42,
      washPrimary: 0.24,
      bodyInk: "#d7dbe2",
      bodyPrimaryMix: 0.1,
      mutedMix: 0.4,
      display: inkOpts({
        minRatio: 7,
        lightStart: 0.88,
        lightFloor: 0.76,
        satMin: 0.35,
        satMax: 0.72,
        toward: "light",
      }),
      accent: inkOpts({
        minRatio: 3.5,
        lightStart: 0.72,
        lightFloor: 0.55,
        satMin: 0.5,
        satMax: 0.9,
        toward: "light",
      }),
    },
  },

  /**
   * Light high-chroma — pastel tints (e.g. Peach Fuzz).
   * Light: soft pastel field + CTA fill = exact seed (circle promise).
   * Dark: charcoal field + exact seed CTA (quiet atmosphere only).
   * Soft-tone chromatrics do NOT inherit this night story — they keep seed air.
   * Future pastel COTYs inherit this cell — no per-name branches.
   */
  "vivid-tint": {
    light: {
      // Airier field so the *exact* seed CTA can read (pastel-on-pastel vanishes)
      whiteMix: 0.48,
      targetLum: 0.92,
      elevatedPrimary: 0.04,
      glowWhite: 0.22,
      washPrimary: 0.1,
      mutedMix: 0.16,
      display: inkOpts({
        minRatio: 4.5,
        lightStart: 0.28,
        lightFloor: 0.12,
        satMin: 0.35,
        satMax: 0.58,
        toward: "dark",
      }),
      body: inkOpts({
        minRatio: 5.5,
        lightStart: 0.18,
        lightFloor: 0.06,
        satMin: 0.22,
        satMax: 0.45,
        toward: "dark",
      }),
      // Fill bypasses these opts (exact seed). Kept for non-exact vivid cells / links.
      accent: inkOpts({
        minRatio: 3.2,
        lightStart: 0.48,
        lightFloor: 0.38,
        satMin: 0.42,
        satMax: 0.56,
        toward: "dark",
      }),
    },
    dark: {
      // Charcoal + seed button: atmosphere is a whisper, not a second swatch
      elevatedPrimary: 0.1,
      glowPrimary: 0.14,
      washPrimary: 0.08,
      bodyInk: "#ebe0d6",
      bodyPrimaryMix: 0.1,
      mutedMix: 0.32,
      display: inkOpts({
        minRatio: 7,
        lightStart: 0.92,
        lightFloor: 0.84,
        satMin: 0.2,
        satMax: 0.45,
        toward: "light",
      }),
      accent: inkOpts({
        minRatio: 3.4,
        lightStart: 0.72,
        lightFloor: 0.58,
        satMin: 0.5,
        satMax: 0.78,
        toward: "light",
      }),
    },
  },
};

function chromaTextFromColor(
  color: string,
  bg: string,
  options: ChromaTextOptions,
): string {
  const deepen = options.toward === "dark";
  const base = hexToHsl(color);
  const sat = Math.min(options.satMax, Math.max(base.s, options.satMin));
  let light = clamp01(
    deepen
      ? Math.min(Math.max(base.l, options.lightFloor), options.lightStart)
      : Math.max(base.l, options.lightStart, options.lightFloor),
  );

  let best = hslToHex(base.h, sat, light);
  let bestRatio = contrastRatio(best, bg);
  if (bestRatio >= options.minRatio) return best;

  for (let i = 0; i < 36; i++) {
    light = deepen
      ? Math.max(options.lightFloor, light - 0.025)
      : Math.min(0.96, light + 0.025);
    const next = hslToHex(base.h, sat, light);
    const ratio = contrastRatio(next, bg);
    if (ratio >= bestRatio) {
      best = next;
      bestRatio = ratio;
    }
    if (ratio >= options.minRatio) return next;
  }
  return best;
}

/**
 * Hero titles/body sit over atmosphere, not only flat canvas.
 * Harden against every ground (bg + glow), preferring mode direction then
 * flipping if a mid glow still fails — same pattern as accent text.
 * Always keep the candidate with the best *worst-case* contrast so a mid
 * glow never “wins” by bleaching ink that then vanishes on the canvas.
 */
function hardenInkOnGrounds(
  color: string,
  grounds: string[],
  options: ChromaTextOptions,
  mode: ColorMode,
): string {
  const preferred = mode === "light" ? "dark" : "light";
  const fallback = preferred === "dark" ? "light" : "dark";

  function worst(c: string) {
    return Math.min(...grounds.map((g) => contrastRatio(c, g)));
  }

  let best = color;
  let bestWorst = worst(best);

  for (const toward of [preferred, fallback] as const) {
    let out = color;
    for (const ground of grounds) {
      if (contrastRatio(out, ground) >= options.minRatio) continue;
      const hsl = hexToHsl(out);
      out = chromaTextFromColor(out, ground, {
        ...options,
        lightStart:
          toward === "dark"
            ? Math.min(hsl.l, options.lightStart)
            : Math.max(hsl.l, options.lightStart),
        toward,
      });
    }
    const score = worst(out);
    if (score > bestWorst) {
      best = out;
      bestWorst = score;
    }
    if (grounds.every((g) => contrastRatio(out, g) >= options.minRatio)) {
      return out;
    }
  }

  // Escape: mid glow + light canvas can defeat hue-locked steps — bias by canvas.
  const canvas = grounds[0] ?? (mode === "light" ? MODE_LIGHT_WHITE : MODE_DARK_BASE);
  const towardDark = relativeLuminance(canvas) >= 0.45;
  const pole = towardDark ? "#0a0908" : "#f7f2ec";
  let rescue = best;
  for (let i = 0; i < 28; i++) {
    if (worst(rescue) >= options.minRatio) return rescue;
    rescue = mix(rescue, pole, 0.18);
  }
  return worst(rescue) > bestWorst ? rescue : best;
}

/**
 * Accent source: chromatic seed stays itself.
 * Neutrals get value-banded temperature — never one shared bronze.
 * `neutral-shade` day: near-achromatic cool ink (graphite), not SaaS blue.
 */
function accentSeedFromPrimary(
  primary: string,
  spectrum: SeedSpectrum,
  mode: ColorMode,
): string {
  if (spectrum.chroma !== "neutral") return primary;

  const hue = NEUTRAL_ACCENT_HUE[spectrum.value];
  if (spectrum.value === "shade") {
    return hslToHex(
      hue,
      mode === "dark" ? 0.16 : 0.07,
      mode === "dark" ? 0.68 : 0.34,
    );
  }
  if (spectrum.value === "tint") {
    return hslToHex(
      hue,
      mode === "dark" ? 0.26 : 0.22,
      mode === "dark" ? 0.7 : 0.44,
    );
  }
  return hslToHex(
    hue,
    mode === "dark" ? 0.28 : 0.26,
    mode === "dark" ? 0.64 : 0.4,
  );
}

function lightPaperHex(recipe: SpectrumRecipe["light"]): string {
  if (recipe.paper === "cool") return MODE_LIGHT_COOL_PAPER;
  if (recipe.paper === "warm") return MODE_LIGHT_WARM_PAPER;
  return MODE_LIGHT_WHITE;
}

function lightModeBg(
  primary: string,
  recipe: SpectrumRecipe["light"],
): string {
  const paper = lightPaperHex(recipe);
  let bg = mix(primary, paper, recipe.whiteMix);
  for (let i = 0; i < 24 && relativeLuminance(bg) < recipe.targetLum; i++) {
    bg = mix(bg, paper, 0.1);
  }
  return bg;
}

/**
 * Light-mode hero glow white mix.
 * Chromatic *tints* stay seed-forward; *tones* and *shades* need enough white
 * or the glow becomes a mid blob — AA then bleaches title ink to match the
 * canvas (custom dark teals like #006480 vanish as “Wonderer” / section titles).
 */
function resolveLightGlowWhite(
  spectrum: SeedSpectrum,
  recipeGlowWhite: number,
): number {
  if (spectrum.chroma === "neutral") return recipeGlowWhite;
  if (spectrum.value === "tint") return Math.min(recipeGlowWhite, 0.1);
  // Soft/mid tones + dark shades: cream air so ink can clear bg *and* glow
  if (spectrum.value === "tone" || spectrum.value === "shade") {
    return Math.max(recipeGlowWhite, 0.62);
  }
  return Math.max(recipeGlowWhite, 0.28);
}

/**
 * Dark-mode atmosphere source (elevated / glow / wash).
 * Spectrum-general — not named themes:
 * - Near-black neutrals: lift a cool mist (dark-into-dark mixes are invisible)
 * - Near-white neutrals: deepen to warm stone (raw tint mixes wash into mid-gray mud)
 * - Chromatic *tints* (pastel seeds): mid-L seed-chroma mist — raw light pastels
 *   mixed into black brown out (peach → muddy cocoa)
 * - Chromatic tones/shades: seed as-is
 */
function darkAtmosphereSeed(
  primary: string,
  spectrum: SeedSpectrum,
): string {
  if (spectrum.chroma === "neutral") {
    if (spectrum.value === "shade" && spectrum.lum < 0.08) {
      return hslToHex(NEUTRAL_ACCENT_HUE.shade, 0.05, 0.48);
    }
    if (spectrum.value === "tint" && spectrum.lum > 0.55) {
      const h =
        spectrum.s > 0.02 ? spectrum.h : NEUTRAL_ACCENT_HUE.tint;
      return hslToHex(h, Math.min(Math.max(spectrum.s, 0.06), 0.12), 0.36);
    }
    if (spectrum.value === "tone" && spectrum.lum > 0.45) {
      return hslToHex(
        spectrum.s > 0.02 ? spectrum.h : NEUTRAL_ACCENT_HUE.tone,
        Math.min(Math.max(spectrum.s, 0.05), 0.12),
        0.38,
      );
    }
    return primary;
  }

  // Pastel / light chromatic seeds: keep the seed as atmosphere pigment.
  // Mixing is handled by mixDarkAtmosphere (seed-hued bridge, not pure black).
  if (spectrum.value === "tint" && spectrum.lum > 0.45) {
    return primary;
  }

  return primary;
}

/**
 * Mix atmosphere into the dark canvas.
 * Vivid pastel tints use low recipe amounts into charcoal (see SPECTRUM_RECIPES)
 * so night stays “charcoal + seed button” — not a browned field competing with
 * the CTA. Soft tints keep a mild seed-hue bridge so quiet pastels don’t gray out.
 */
function mixDarkAtmosphere(
  canvas: string,
  atmosphere: string,
  amount: number,
  spectrum: SeedSpectrum,
): string {
  if (
    spectrum.chroma === "soft" &&
    spectrum.value === "tint" &&
    spectrum.lum > 0.45
  ) {
    const bridge = hslToHex(
      spectrum.h,
      Math.min(0.45, Math.max(spectrum.s, 0.28)),
      0.14,
    );
    return mix(bridge, atmosphere, clamp01(amount));
  }
  // vivid-tint (and everything else): mix into the actual canvas (charcoal)
  return mix(canvas, atmosphere, amount);
}

function enforceInkHierarchy(
  display: string,
  body: string,
  mode: ColorMode,
): { display: string; body: string } {
  const delta = 0.05;
  let fgDisplay = display;
  let fg = body;

  if (mode === "dark") {
    for (let i = 0; i < 24; i++) {
      if (relativeLuminance(fgDisplay) >= relativeLuminance(fg) + delta) break;
      fgDisplay = mix(fgDisplay, MODE_LIGHT_WHITE, 0.1);
    }
  } else {
    for (let i = 0; i < 24; i++) {
      if (relativeLuminance(fg) <= relativeLuminance(fgDisplay) - delta) break;
      fg = mix(fg, "#0a0908", 0.1);
    }
  }

  return { display: fgDisplay, body: fg };
}

/** Pure black/white lockup ink from how light or dark the canvas is. */
function brandMarkForBg(bg: string) {
  return relativeLuminance(bg) < 0.45 ? "#ffffff" : "#000000";
}

/**
 * Keep muted readable on every ground it sits on (hero support/secondary
 * live over glow, not only flat bg). If any ground is luminous (pastel
 * night air), bias dark ink; otherwise lighten toward fg.
 */
function readableMuted(fg: string, grounds: string[], mixAmt: number) {
  const bg = grounds[0] ?? MODE_DARK_BASE;
  let muted = mix(fg, bg, mixAmt);
  const lightLift = mix(fg, "#f7f2ec", 0.4);
  const darkInk = "#140f0c";
  // Only force dark muted on truly light grounds (soft pastel air ~0.3+)
  const hasLuminousGround = grounds.some(
    (ground) => relativeLuminance(ground) > 0.3,
  );

  function worst(color: string) {
    return Math.min(...grounds.map((ground) => contrastRatio(color, ground)));
  }

  for (let i = 0; i < 32; i++) {
    if (worst(muted) >= 4.5) return muted;
    if (hasLuminousGround) {
      muted = mix(muted, darkInk, 0.28);
      continue;
    }
    const lighter = mix(muted, lightLift, 0.22);
    const darker = mix(muted, darkInk, 0.22);
    muted = worst(lighter) > worst(darker) ? lighter : darker;
  }
  return muted;
}

/**
 * CTA must read apart from the hero title — same hue family, not complementary.
 * Soft → muted deepen (Mocha). Vivid → burnished deepen (Peach), not max-sat orange.
 * Neutral → keep injected ink/stone quiet; don’t re-chroma into a loud brand.
 */
function separateAccentFromDisplay(
  accent: string,
  display: string,
  bg: string,
  mode: ColorMode,
  chroma: SeedChroma,
): string {
  const a = hexToHsl(accent);
  const d = hexToHsl(display);
  const hue = a.s > 0.04 ? a.h : d.h;

  const satBoost =
    chroma === "soft" ? 0.08 : chroma === "vivid" ? 0.06 : chroma === "neutral" ? 0.02 : 0.2;
  const satFloor =
    chroma === "soft"
      ? Math.max(a.s, 0.3)
      : chroma === "vivid"
        ? Math.max(a.s * 0.5, 0.36)
        : chroma === "neutral"
          ? Math.max(a.s, 0.05)
          : 0.55;
  const satCap =
    chroma === "soft" ? 0.48 : chroma === "vivid" ? 0.56 : chroma === "neutral" ? 0.14 : 0.96;
  let sat = Math.min(satCap, Math.max(a.s, d.s + satBoost, satFloor));
  if (chroma === "vivid" && sat - d.s < 0.06) {
    sat = Math.min(satCap, d.s + 0.1);
  }

  const lightStep = chroma === "soft" ? 0.1 : chroma === "vivid" ? 0.1 : 0.1;
  let light: number;
  if (mode === "light") {
    if (chroma === "soft") {
      // Deeper mocha fill vs title — not a brighter candy CTA
      light = clamp01(Math.min(Math.max(a.l, 0.3), d.l - 0.04, 0.48));
    } else if (chroma === "vivid") {
      // Exact-seed fill path skips this; fallback if a vivid cell still derives
      light = clamp01(Math.min(Math.max(a.l, 0.4), 0.5));
    } else if (chroma === "neutral") {
      light = clamp01(Math.min(Math.max(a.l, 0.32), 0.44));
    } else {
      light = clamp01(
        Math.max(d.l + lightStep, Math.min(0.54, Math.max(a.l, 0.4))),
      );
      if (Math.abs(light - d.l) < 0.1) light = clamp01(d.l + 0.14);
    }
  } else {
    light = clamp01(Math.min(d.l - lightStep * 0.65, Math.max(0.56, a.l)));
  }

  let out = hslToHex(hue, sat, light);
  if (contrastRatio(out, bg) >= 3.3) return out;

  return chromaTextFromColor(out, bg, {
    minRatio: 3.3,
    lightStart: light,
    lightFloor: mode === "light" ? 0.24 : 0.5,
    satMin: Math.min(sat, satCap),
    satMax: satCap,
    toward: mode === "light" ? "dark" : "light",
  });
}

/** Pure black/white ink on an accent fill — pick whichever contrasts better. */
function onAccentInk(fill: string) {
  const light = "#f7f4f1";
  const dark = "#0a0908";
  return contrastRatio(dark, fill) >= contrastRatio(light, fill) ? dark : light;
}

/**
 * Keep filled accent chromatically present on the canvas.
 * Do NOT run text-AA hardening on the fill (that washed fills to cream).
 * Soft seeds: deepen/presence without a 0.5 sat floor (that made Mocha orange).
 */
function ensureAccentFillPresence(
  fill: string,
  bg: string,
  mode: ColorMode,
  chroma: SeedChroma,
): string {
  let out = fill;
  const minPresence = 2.2;
  const satCap =
    chroma === "soft" ? 0.5 : chroma === "vivid" ? 0.58 : chroma === "neutral" ? 0.14 : 0.92;
  const satPushFloor =
    chroma === "soft" ? 0.28 : chroma === "vivid" ? 0.36 : chroma === "neutral" ? 0.04 : 0.5;
  for (let i = 0; i < 24 && contrastRatio(out, bg) < minPresence; i++) {
    const hsl = hexToHsl(out);
    out =
      mode === "light"
        ? hslToHex(
            hsl.h,
            Math.min(satCap, Math.max(hsl.s, satPushFloor) + 0.02),
            Math.max(0.22, hsl.l - 0.04),
          )
        : hslToHex(
            hsl.h,
            Math.min(satCap, Math.max(hsl.s, satPushFloor) + 0.02),
            Math.min(0.78, hsl.l + 0.04),
          );
  }
  return out;
}

/**
 * Text/link accent: AA on every ground. Direction follows *mode*, not
 * per-ground luminance (mid glow must not flip text toward cream).
 */
function hardenAccentText(
  accent: string,
  grounds: string[],
  mode: ColorMode,
  chroma: SeedChroma,
): string {
  // Don't re-chroma quiet neutrals/soft into vivid link colors
  const satCap =
    chroma === "neutral" ? 0.14 : chroma === "soft" ? 0.5 : 0.95;
  const baseS = hexToHsl(accent).s;
  const satMin =
    chroma === "neutral"
      ? Math.min(baseS, 0.1)
      : chroma === "soft"
        ? Math.max(baseS, 0.28)
        : Math.max(baseS, 0.42);

  const preferred = mode === "light" ? "dark" : "light";
  const fallback = preferred === "dark" ? "light" : "dark";

  function hardenToward(
    color: string,
    ground: string,
    toward: "dark" | "light",
  ) {
    const hsl = hexToHsl(color);
    return chromaTextFromColor(color, ground, {
      minRatio: 4.5,
      lightStart: toward === "dark" ? Math.min(hsl.l, 0.3) : Math.max(hsl.l, 0.72),
      lightFloor: toward === "dark" ? 0.06 : 0.52,
      satMin,
      satMax: satCap,
      toward,
    });
  }

  let out = accent;
  // Pass 1: mode-preferred direction. Pass 2: opposite if mid grounds still fail
  // (e.g. luminous peach glow on dark canvas — lightening text hurts AA).
  for (const toward of [preferred, fallback] as const) {
    for (const ground of grounds) {
      if (contrastRatio(out, ground) >= 4.5) continue;
      out = hardenToward(out, ground, toward);
    }
    if (grounds.every((g) => contrastRatio(out, g) >= 4.5)) return out;
  }
  return out;
}

function buildAccentPair(
  accentRaw: string,
  display: string,
  bg: string,
  heroGlow: string,
  mode: ColorMode,
  chroma: SeedChroma,
  accentOpts: ChromaTextOptions,
) {
  // Vivid (light pastels): fill IS the swatch — deepen reads as a different color.
  // Soft (midtones like Mocha): deepen for presence; seed is already near button weight.
  // Neutrals still derive.
  const exactSeedFill = chroma === "vivid";
  const separated = exactSeedFill
    ? accentRaw
    : separateAccentFromDisplay(
        chromaTextFromColor(accentRaw, bg, accentOpts),
        display,
        bg,
        mode,
        chroma,
      );
  const accent = exactSeedFill
    ? accentRaw
    : ensureAccentFillPresence(separated, bg, mode, chroma);
  const onAccent = onAccentInk(accent);
  // Text/links still AA-harden — never confuse link ink with the button fill
  const accentFg = hardenAccentText(separated, [bg, heroGlow], mode, chroma);
  return { accent, onAccent, accentFg };
}

/**
 * Dark:  60% near-black · 30% primary · 10% accent (seed family)
 * Light: 60% primary · 30% white · 10% accent (seed family)
 *
 * Flow: classify seed on spectrum → pick recipe → derive tokens.
 */
export function tokensFromSeed(
  seed: string,
  mode: ColorMode = DEFAULT_COLOR_MODE,
): ThemeTokens {
  const primary = seed;
  const spectrum = classifySeed(primary);
  const recipe = SPECTRUM_RECIPES[spectrum.id];
  // Brand pair: Young Night charcoal keeps spectrum recipes for canvas/ink,
  // but the 10% accent (+ night atmosphere) is locked to YOUNG_NIGHT_ACCENT.
  // Treat that accent as vivid so neutral sat caps don't crush the blue.
  const brandPair = isYoungNightSeed(primary);
  const accentRaw = brandPair
    ? YOUNG_NIGHT_ACCENT
    : accentSeedFromPrimary(primary, spectrum, mode);
  const accentChroma: SeedChroma = brandPair ? "vivid" : spectrum.chroma;

  if (mode === "dark") {
    const r = recipe.dark;
    const atmosphere = brandPair
      ? YOUNG_NIGHT_ACCENT
      : darkAtmosphereSeed(primary, spectrum);
    // Vivid pastel nights: true charcoal canvas — seed color lives on the CTA
    const bg = MODE_DARK_BASE;
    const bgElevated = mixDarkAtmosphere(
      bg,
      atmosphere,
      // Brand blue is chromatic — quieter elevated than neutral mist at 0.32
      brandPair ? 0.22 : r.elevatedPrimary,
      spectrum,
    );
    const heroGlow = mixDarkAtmosphere(
      bg,
      atmosphere,
      brandPair ? 0.38 : r.glowPrimary,
      spectrum,
    );
    const heroWash = mixDarkAtmosphere(
      bg,
      atmosphere,
      brandPair ? 0.14 : r.washPrimary,
      spectrum,
    );
    const ink = enforceInkHierarchy(
      hardenInkOnGrounds(
        chromaTextFromColor(primary, bg, r.display),
        [bg, heroGlow],
        r.display,
        mode,
      ),
      hardenInkOnGrounds(
        mix(r.bodyInk, primary, r.bodyPrimaryMix),
        [bg, heroGlow],
        {
          minRatio: 4.5,
          lightStart: 0.82,
          lightFloor: 0.7,
          satMin: 0,
          satMax: 0.22,
          toward: "light",
        },
        mode,
      ),
      mode,
    );
    const fgMuted = readableMuted(ink.body, [bg, heroGlow], r.mutedMix);
    const accents = buildAccentPair(
      accentRaw,
      ink.display,
      bg,
      heroGlow,
      mode,
      accentChroma,
      r.accent,
    );
    const brandMark = brandMarkForBg(bg);

    return {
      bg,
      bgElevated,
      brandMark,
      fgDisplay: ink.display,
      fg: ink.body,
      fgMuted,
      accent: accents.accent,
      onAccent: accents.onAccent,
      accentFg: accents.accentFg,
      accentSoft: rgba(accents.accent, 0.14),
      secondary: accents.accent,
      secondarySoft: rgba(accents.accent, 0.14),
      line: rgba(ink.body, 0.14),
      heroGlow,
      heroWash,
      surface: mode,
      spectrum: spectrum.id,
    };
  }

  const r = recipe.light;
  const paper = lightPaperHex(r);
  const bg = lightModeBg(primary, r);
  const bgElevated = mix(paper, primary, r.elevatedPrimary);
  // Tints keep seed-forward glow; mid tones need air or the atmosphere stains.
  const glowWhite = resolveLightGlowWhite(spectrum, r.glowWhite);
  let heroGlow = mix(primary, paper, glowWhite);
  // Day Young Night: cool paper + a soft blue wash so the brand pair still reads
  if (brandPair) {
    heroGlow = mix(heroGlow, YOUNG_NIGHT_ACCENT, 0.2);
  }
  const heroWash = mix(paper, primary, Math.max(r.washPrimary, 0.1));
  const ink = enforceInkHierarchy(
    hardenInkOnGrounds(
      chromaTextFromColor(primary, bg, r.display),
      [bg, heroGlow],
      r.display,
      mode,
    ),
    hardenInkOnGrounds(
      chromaTextFromColor(primary, bg, r.body),
      [bg, heroGlow],
      r.body,
      mode,
    ),
    mode,
  );
  const fgMuted = readableMuted(ink.body, [bg, heroGlow], r.mutedMix);
  const accents = buildAccentPair(
    accentRaw,
    ink.display,
    bg,
    heroGlow,
    mode,
    accentChroma,
    r.accent,
  );
  const brandMark = brandMarkForBg(bg);

  return {
    bg,
    bgElevated,
    brandMark,
    fgDisplay: ink.display,
    fg: ink.body,
    fgMuted,
    accent: accents.accent,
    onAccent: accents.onAccent,
    accentFg: accents.accentFg,
    accentSoft: rgba(accents.accent, 0.12),
    secondary: accents.accent,
    secondarySoft: rgba(accents.accent, 0.1),
    line: rgba(ink.body, 0.12),
    heroGlow,
    heroWash,
    surface: mode,
    spectrum: spectrum.id,
  };
}

export const YOUNG_NIGHT_THEME: ColorTheme = {
  id: DEFAULT_THEME_ID,
  swatch: YOUNG_NIGHT_SEED,
  label: "Young Night",
};

/** True when the active seed is the Young Night brand charcoal. */
export function isYoungNightSeed(seed: string): boolean {
  return seed.trim().toUpperCase() === YOUNG_NIGHT_SEED;
}

export function themesForYear(year = new Date().getFullYear()): ColorTheme[] {
  const cotyThemes = recentCoty(3, year).map((entry) => ({
    id: `coty-${entry.year}`,
    swatch: entry.hex,
    label: `${entry.name} ${entry.year}`,
  }));

  return [YOUNG_NIGHT_THEME, ...cotyThemes];
}

export function isColorMode(value: string | null): value is ColorMode {
  return value === "light" || value === "dark";
}

export function applyThemeTokens(
  tokens: ThemeTokens,
  target: HTMLElement = document.documentElement,
) {
  const map: Record<ColorTokenId, string> = {
    bg: tokens.bg,
    bgElevated: tokens.bgElevated,
    brandMark: tokens.brandMark,
    fgDisplay: tokens.fgDisplay,
    fg: tokens.fg,
    fgMuted: tokens.fgMuted,
    accent: tokens.accent,
    onAccent: tokens.onAccent,
    accentFg: tokens.accentFg,
    accentSoft: tokens.accentSoft,
    secondary: tokens.secondary,
    secondarySoft: tokens.secondarySoft,
    line: tokens.line,
    heroGlow: tokens.heroGlow,
    heroWash: tokens.heroWash,
  };

  for (const id of Object.keys(map) as ColorTokenId[]) {
    target.style.setProperty(COLOR_TOKENS[id].cssVar, map[id]);
  }
  target.dataset.themeSurface = tokens.surface;
  target.dataset.themeSpectrum = tokens.spectrum;
}

export function isThemeId(
  value: string | null,
  themes: ColorTheme[],
): value is string {
  return (
    !!value &&
    (value === CUSTOM_THEME_ID || themes.some((theme) => theme.id === value))
  );
}

/** `#RGB` or `#RRGGBB` → `#RRGGBB` uppercase; invalid → default custom seed. */
export function normalizeHex(value: string): string {
  const raw = value.trim();
  if (/^#[0-9A-Fa-f]{3}$/.test(raw)) {
    return `#${raw[1]}${raw[1]}${raw[2]}${raw[2]}${raw[3]}${raw[3]}`.toUpperCase();
  }
  if (/^#[0-9A-Fa-f]{6}$/.test(raw)) return raw.toUpperCase();
  return DEFAULT_CUSTOM_SEED;
}

export function isHexColor(value: string | null): value is string {
  return typeof value === "string" && /^#[0-9A-Fa-f]{6}$/.test(value);
}
