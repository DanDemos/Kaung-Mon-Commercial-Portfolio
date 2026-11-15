/**
 * Named color roles for the portfolio theme system.
 * Values are produced at runtime from a seed (see color-themes.ts);
 * this file is the single catalog of *names* / CSS variables / jobs.
 */

/**
 * Ratio model (see color-themes.ts):
 * - Dark:  60% near-black (#121212) · 30% primary (swatch) · 10% accent (seed)
 * - Light: 60% primary · 30% white · 10% accent (seed family)
 *
 * Seed is classified on value (shade/tone/tint) × chroma (neutral/soft/vivid)
 * before a spectrum recipe builds tokens — not one flat path for every hex.
 */
export const COLOR_TOKENS = {
  bg: {
    cssVar: "--color-bg",
    name: "Background",
    job: "Dominant field — dark base (dark mode) or primary mix (light mode)",
  },
  bgElevated: {
    cssVar: "--color-bg-elevated",
    name: "Background elevated",
    job: "Raised surfaces — primary-tinted dark (dark) or white-led (light)",
  },
  brandMark: {
    cssVar: "--color-brand-mark",
    name: "Brand mark",
    job: "Logo lockup wordmark — pure black or white from canvas luminance",
  },
  fgDisplay: {
    cssVar: "--color-fg-display",
    name: "Display ink",
    job: "Hero title (Kaung Mon) — from primary",
  },

  fg: {
    cssVar: "--color-fg",
    name: "Body ink",
    job: "Section titles and primary reading text",
  },
  fgMuted: {
    cssVar: "--color-fg-muted",
    name: "Muted ink",
    job: "Supporting copy, meta, quiet controls",
  },
  accent: {
    cssVar: "--color-accent",
    name: "Accent fill",
    job: "~10% filled CTA surface — chromatic seed family; must read vs canvas",
  },
  onAccent: {
    cssVar: "--color-on-accent",
    name: "On accent",
    job: "Ink on filled accent controls — black or white from fill luminance",
  },
  accentFg: {
    cssVar: "--color-accent-fg",
    name: "Accent text",
    job: "Text/link accent — ≥4.5:1 on bg and hero glow (never used as fill)",
  },
  accentSoft: {
    cssVar: "--color-accent-soft",
    name: "Accent soft",
    job: "Accent wash for hover / selection fills",
  },
  secondary: {
    cssVar: "--color-secondary",
    name: "Secondary",
    job: "Alias of accent (~10% CTA role)",
  },
  secondarySoft: {
    cssVar: "--color-secondary-soft",
    name: "Secondary soft",
    job: "Soft fill twin of accent",
  },
  line: {
    cssVar: "--color-line",
    name: "Line",
    job: "Dividers and hairlines",
  },
  heroGlow: {
    cssVar: "--color-hero-glow",
    name: "Hero glow",
    job: "Atmosphere — primary into mode base",
  },
  heroWash: {
    cssVar: "--color-hero-wash",
    name: "Hero wash",
    job: "Atmosphere — primary / white support",
  },
} as const;

export type ColorTokenId = keyof typeof COLOR_TOKENS;

/** Stable list of token ids (for iteration / docs / debugging). */
export const COLOR_TOKEN_IDS = Object.keys(COLOR_TOKENS) as ColorTokenId[];

export function colorCssVar(id: ColorTokenId): string {
  return COLOR_TOKENS[id].cssVar;
}
