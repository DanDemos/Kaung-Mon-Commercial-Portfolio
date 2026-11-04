"use client";

import Link from "next/link";
import { useLayoutEffect, useMemo, useState } from "react";
import {
  CUSTOM_SEED_STORAGE_KEY,
  CUSTOM_THEME_ID,
  DEFAULT_COLOR_MODE,
  DEFAULT_CUSTOM_SEED,
  DEFAULT_THEME_ID,
  MODE_STORAGE_KEY,
  THEME_STORAGE_KEY,
  applyThemeTokens,
  isColorMode,
  isHexColor,
  isThemeId,
  normalizeHex,
  themesForYear,
  tokensFromSeed,
  type ColorMode,
} from "../lib/color-themes";
import { BRAND } from "../lib/media";
import { markBootReady, readClientBootPrefs } from "../lib/theme-boot";
import DayNightToggle from "./day-night-toggle";
import MediaImage from "./media-image";
import SectionTitle from "./section-title";
import SiteFooter from "./site-footer";
import SiteLoader from "./site-loader";
import TextLink from "./text-link";
import ThemeCircles from "./theme-circles";
import WorkGallery from "./work-gallery";
import "./brand-lockup.css";
import "./home-experience.css";
import "./site-loader.css";
import "./work-experience.css";

const logo = BRAND.logoMark;

/**
 * Dedicated works page shell — same theme chrome as home, no path chooser.
 */
export default function WorkExperience() {
  const themes = useMemo(() => themesForYear(), []);
  const [themeId, setThemeId] = useState(DEFAULT_THEME_ID);
  const [customSeed, setCustomSeed] = useState(DEFAULT_CUSTOM_SEED);
  const [colorMode, setColorMode] = useState<ColorMode>(DEFAULT_COLOR_MODE);
  const [ready, setReady] = useState(false);

  const activeSwatch =
    themeId === CUSTOM_THEME_ID
      ? customSeed
      : (themes.find((theme) => theme.id === themeId) ?? themes[0]).swatch;
  const tokens = useMemo(
    () => tokensFromSeed(activeSwatch, colorMode),
    [activeSwatch, colorMode],
  );

  useLayoutEffect(() => {
    const boot = readClientBootPrefs();

    const storedCustom = window.localStorage.getItem(CUSTOM_SEED_STORAGE_KEY);
    const nextCustom =
      isHexColor(storedCustom)
        ? storedCustom.toUpperCase()
        : boot && isHexColor(boot.customSeed)
          ? boot.customSeed.toUpperCase()
          : DEFAULT_CUSTOM_SEED;

    const storedTheme = window.localStorage.getItem(THEME_STORAGE_KEY);
    const bootTheme = boot?.themeId ?? null;
    const nextThemeId = isThemeId(storedTheme, themes)
      ? storedTheme
      : isThemeId(bootTheme, themes)
        ? bootTheme
        : DEFAULT_THEME_ID;

    const storedMode = window.localStorage.getItem(MODE_STORAGE_KEY);
    let nextMode: ColorMode = DEFAULT_COLOR_MODE;
    if (isColorMode(storedMode)) nextMode = storedMode;
    else if (boot && isColorMode(boot.mode)) nextMode = boot.mode;

    setCustomSeed(nextCustom);
    setThemeId(nextThemeId);
    setColorMode(nextMode);

    const swatch =
      nextThemeId === CUSTOM_THEME_ID
        ? nextCustom
        : (themes.find((theme) => theme.id === nextThemeId) ?? themes[0]).swatch;
    applyThemeTokens(tokensFromSeed(swatch, nextMode));
    markBootReady();
    setReady(true);
  }, [themes]);

  useLayoutEffect(() => {
    if (!ready) return;
    applyThemeTokens(tokens);
  }, [tokens, ready]);

  function changeTheme(nextId: string) {
    setThemeId(nextId);
    window.localStorage.setItem(THEME_STORAGE_KEY, nextId);
  }

  function changeCustomSeed(hex: string) {
    const next = normalizeHex(hex);
    setCustomSeed(next);
    setThemeId(CUSTOM_THEME_ID);
    window.localStorage.setItem(CUSTOM_SEED_STORAGE_KEY, next);
    window.localStorage.setItem(THEME_STORAGE_KEY, CUSTOM_THEME_ID);
  }

  function changeColorMode(nextMode: ColorMode) {
    setColorMode(nextMode);
    window.localStorage.setItem(MODE_STORAGE_KEY, nextMode);
  }

  return (
    <>
      <SiteLoader ready={ready} />
      <div className="km-app relative flex min-h-full flex-1 flex-col overflow-x-hidden">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 -z-10 overflow-hidden"
        >
          <div className="absolute inset-0 bg-[var(--color-bg)]" />
          <div className="km-hero-glow absolute -left-[6%] top-[14%] h-[70vh] w-[68vw] rounded-full bg-[var(--color-hero-glow)] opacity-90 blur-3xl" />
          <div className="km-hero-wash absolute -right-[12%] top-[22%] h-[54vh] w-[48vw] rounded-full bg-[var(--color-hero-wash)] opacity-50 blur-3xl" />
          <div className="absolute inset-x-0 top-0 h-28 bg-gradient-to-b from-[var(--color-bg)] from-40% to-transparent" />
        </div>

        <header className="relative z-10 mx-auto flex w-full max-w-6xl flex-wrap items-center justify-between gap-x-4 gap-y-2 px-6 pb-2 pt-6 sm:px-8 sm:pt-8">
          <Link
            href="/"
            className="km-brand"
            aria-label="Kaung Mon, back to home"
          >
            <MediaImage
              src={logo}
              alt=""
              width={56}
              height={56}
              sizes="56px"
              quality={95}
              priority
              className="km-brand__mark"
            />
            <span className="km-brand__name text-[0.95rem] font-semibold tracking-[-0.02em] text-[var(--color-brand-mark)]">
              Kaung Mon
            </span>
          </Link>

          <div className="flex flex-wrap items-center gap-x-3 gap-y-2 sm:gap-x-4">
            <ThemeCircles
              themes={themes}
              activeId={themeId}
              customSeed={customSeed}
              onChange={changeTheme}
              onCustomSeedChange={changeCustomSeed}
            />
            <DayNightToggle mode={colorMode} onChange={changeColorMode} />
          </div>
        </header>

        <main className="mx-auto flex w-full max-w-6xl flex-1 flex-col px-6 pb-20 sm:px-8">
          <header className="km-work-page__intro km-rise">
            <SectionTitle
              label="Portfolio"
              title="Projects I've worked on"
              as="h1"
            />
            <p className="km-work-page__support">
              Same filters as before — Web, App, Chatbot, Designs, MMD. Hover a
              piece for the title and links; open home for live walkthroughs.
            </p>
            <p className="km-work-page__back">
              <TextLink href="/">← Back home</TextLink>
            </p>
          </header>

          <div className="km-rise km-delay-2 mt-10">
            <WorkGallery />
          </div>
        </main>

        <SiteFooter />
      </div>
    </>
  );
}
