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
import {
  DEFAULT_PATH,
  PATH_STORAGE_KEY,
  contentFor,
  type VisitorPath,
} from "../lib/visitor-paths";
import ContactDock from "./contact-dock";
import DayNightToggle from "./day-night-toggle";
import MediaImage from "./media-image";
import SiteFooter from "./site-footer";
import SiteLoader from "./site-loader";
import TextLink from "./text-link";
import ThemeCircles from "./theme-circles";
import "./brand-lockup.css";
import "./home-experience.css";
import "./site-loader.css";

const logo = BRAND.logoMark;

function isVisitorPath(value: string | null): value is VisitorPath {
  return (
    value === "hire" ||
    value === "craft" ||
    value === "build" ||
    value === "wander"
  );
}

/**
 * Dedicated contact page — form lives here; home only invites.
 */
export default function ContactExperience() {
  const themes = useMemo(() => themesForYear(), []);
  const [path, setPath] = useState<VisitorPath>(DEFAULT_PATH);
  const [themeId, setThemeId] = useState(DEFAULT_THEME_ID);
  const [customSeed, setCustomSeed] = useState(DEFAULT_CUSTOM_SEED);
  const [colorMode, setColorMode] = useState<ColorMode>(DEFAULT_COLOR_MODE);
  const [ready, setReady] = useState(false);

  const content = contentFor(path);
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

    const storedPath = window.localStorage.getItem(PATH_STORAGE_KEY);
    const nextPath = isVisitorPath(storedPath) ? storedPath : DEFAULT_PATH;

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

    setPath(nextPath);
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
      {ready ? (
        <div className="km-app relative flex min-h-full flex-1 flex-col">
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 -z-10 overflow-hidden"
          >
            {/* Flat canvas — no hero-glow blue wash on the contact page */}
            <div className="absolute inset-0 bg-[var(--color-bg)]" />
          </div>

          <header className="km-site-header">
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

            <div className="km-site-header__controls">
              <ThemeCircles
                themes={themes}
                activeId={themeId}
                customSeed={customSeed}
                onChange={changeTheme}
                onCustomSeedChange={changeCustomSeed}
              />
              <div className="km-site-header__path-mode">
                <DayNightToggle mode={colorMode} onChange={changeColorMode} />
              </div>
            </div>
          </header>

          <main className="mx-auto flex w-full max-w-6xl flex-1 flex-col px-6 pb-20 sm:px-8">
            <p className="km-contact-page__back km-rise">
              <TextLink href="/">← Back home</TextLink>
            </p>
            <div className="km-rise km-delay-1">
              <ContactDock support={content.contactFormSupport} />
            </div>
          </main>

          <SiteFooter />
        </div>
      ) : null}
    </>
  );
}
