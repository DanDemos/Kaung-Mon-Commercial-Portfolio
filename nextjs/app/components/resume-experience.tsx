"use client";

import dynamic from "next/dynamic";
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
import { RESUME_EDUCATION, RESUME_EXPERIENCE } from "../lib/resume";
import { markBootReady, readClientBootPrefs } from "../lib/theme-boot";
import {
  CHOOSER_SEEN_KEY,
  CONTACT_MAILTO,
  DEFAULT_PATH,
  PATH_OPTIONS,
  PATH_STORAGE_KEY,
  type VisitorPath,
} from "../lib/visitor-paths";
import Btn from "./btn";
import DayNightToggle from "./day-night-toggle";
import MediaImage from "./media-image";
import PathLensControl from "./path-lens-control";
import SectionTitle from "./section-title";
import SiteFooter from "./site-footer";
import SiteLoader from "./site-loader";
import TextLink from "./text-link";
import ThemeCircles from "./theme-circles";
import "./brand-lockup.css";
import "./home-experience.css";
import "./resume-experience.css";
import "./site-loader.css";

const PathChooserDialog = dynamic(() => import("./path-chooser-dialog"), {
  ssr: false,
});

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
 * Recruiter-only resume. Other lenses see a soft gate, not a hard 404.
 */
export default function ResumeExperience() {
  const themes = useMemo(() => themesForYear(), []);
  const [path, setPath] = useState<VisitorPath>(DEFAULT_PATH);
  const [themeId, setThemeId] = useState(DEFAULT_THEME_ID);
  const [customSeed, setCustomSeed] = useState(DEFAULT_CUSTOM_SEED);
  const [colorMode, setColorMode] = useState<ColorMode>(DEFAULT_COLOR_MODE);
  const [ready, setReady] = useState(false);
  const [chooserOpen, setChooserOpen] = useState(false);

  const activeLabel =
    PATH_OPTIONS.find((option) => option.id === path)?.label ?? "Wonderer";
  const isRecruiter = path === "hire";

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

  function persistPath(next: VisitorPath) {
    setPath(next);
    window.localStorage.setItem(PATH_STORAGE_KEY, next);
    window.localStorage.setItem(CHOOSER_SEEN_KEY, "1");
  }

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
      <div className="km-app relative flex min-h-full flex-1 flex-col">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 -z-10 overflow-hidden"
        >
          <div className="absolute inset-0 bg-[var(--color-bg)]" />
          <div className="km-hero-glow absolute -left-[6%] top-[14%] h-[70vh] w-[68vw] rounded-full bg-[var(--color-hero-glow)] opacity-90 blur-3xl" />
          <div className="km-hero-wash absolute -right-[12%] top-[22%] h-[54vh] w-[48vw] rounded-full bg-[var(--color-hero-wash)] opacity-50 blur-3xl" />
          <div className="absolute inset-x-0 top-0 h-28 bg-gradient-to-b from-[var(--color-bg)] from-40% to-transparent" />
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
              <PathLensControl
                label={activeLabel}
                ready={ready}
                open={chooserOpen}
                onOpen={() => setChooserOpen(true)}
              />
              <DayNightToggle mode={colorMode} onChange={changeColorMode} />
            </div>
          </div>
        </header>

        <main className="mx-auto flex w-full max-w-6xl flex-1 flex-col px-6 pb-20 sm:px-8">
          {!ready ? null : isRecruiter ? (
            <ResumeBody />
          ) : (
            <ResumeGate onUnlock={() => persistPath("hire")} />
          )}
        </main>

        <SiteFooter />
      </div>

      <PathChooserDialog
        open={chooserOpen}
        currentPath={path}
        onChoose={(next) => {
          persistPath(next);
          setChooserOpen(false);
        }}
        onDismiss={() => setChooserOpen(false)}
      />
    </>
  );
}

function ResumeGate({ onUnlock }: { onUnlock: () => void }) {
  return (
    <section className="km-resume-gate km-rise">
      <SectionTitle
        label="Recruiter only"
        title="Resume is behind the Recruiter lens"
        as="h1"
      />
      <p className="km-resume-gate__support">
        Switch to Recruiter to view education and experience. Other visitors keep
        the quieter tour on home.
      </p>
      <div className="km-resume-gate__actions">
        <Btn type="button" onClick={onUnlock}>
          View as recruiter
        </Btn>
        <TextLink href="/">Back home</TextLink>
      </div>
    </section>
  );
}

function ResumeBody() {
  return (
    <div className="km-resume km-rise">
      <header className="km-resume__intro">
        <div className="km-resume__heading-row">
          <SectionTitle
            label="Resume"
            title="Education & experience"
            as="h1"
          />
          <p className="km-resume__aside">Hiring snapshot</p>
        </div>
        <p className="km-resume__support">
          Roles, schooling, and what shipped. For the fuller product story, watch
          the walkthroughs on home.
        </p>
        <p className="km-resume__links">
          <TextLink href="/">← Home</TextLink>
          <span aria-hidden> · </span>
          <TextLink href={CONTACT_MAILTO}>Email me</TextLink>
        </p>
      </header>

      <div className="km-resume__columns">
        <ResumeColumn title="Education" entries={RESUME_EDUCATION} />
        <ResumeColumn title="Experience" entries={RESUME_EXPERIENCE} />
      </div>
    </div>
  );
}

function ResumeColumn({
  title,
  entries,
}: {
  title: string;
  entries: typeof RESUME_EDUCATION;
}) {
  return (
    <section className="km-resume__column" aria-labelledby={`resume-${title}`}>
      <h2 id={`resume-${title}`} className="km-resume__column-title">
        {title}
      </h2>
      <ol className="km-resume__list">
        {entries.map((entry) => (
          <li key={`${entry.title}-${entry.dates}`} className="km-resume__item">
            <div className="km-resume__item-head">
              <h3 className="km-resume__item-title">{entry.title}</h3>
              <p className="km-resume__item-dates">{entry.dates}</p>
            </div>
            <p className="km-resume__item-org">{entry.org}</p>
            {entry.body ? (
              <p className="km-resume__item-body">{entry.body}</p>
            ) : null}
            {entry.bullets && entry.bullets.length > 0 ? (
              <ul className="km-resume__bullets">
                {entry.bullets.map((bullet) => (
                  <li key={bullet}>{bullet}</li>
                ))}
              </ul>
            ) : null}
          </li>
        ))}
      </ol>
    </section>
  );
}
