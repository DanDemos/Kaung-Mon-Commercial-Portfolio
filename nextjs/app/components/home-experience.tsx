"use client";

import Image from "next/image";
import { useEffect, useMemo, useState } from "react";
import logo from "../../../shared/img/KLogoblack.png";
import {
  DEFAULT_COLOR_MODE,
  DEFAULT_THEME_ID,
  MODE_STORAGE_KEY,
  THEME_STORAGE_KEY,
  applyThemeTokens,
  isColorMode,
  isThemeId,
  themesForYear,
  tokensFromSeed,
  type ColorMode,
} from "../lib/color-themes";
import {
  CHOOSER_SEEN_KEY,
  CONTACT_EMAIL,
  CONTACT_MAILTO,
  DEFAULT_PATH,
  PATH_OPTIONS,
  PATH_STORAGE_KEY,
  contentFor,
  type VisitorPath,
} from "../lib/visitor-paths";
import DayNightToggle from "./day-night-toggle";
import PathChooserDialog from "./path-chooser-dialog";
import PathLensControl from "./path-lens-control";
import ThemeCircles from "./theme-circles";
import "./brand-lockup.css";
import "./glass-cta.css";

/** Let brand + hero land before the first-visit ask. */
const CHOOSER_OPEN_DELAY_MS = 900;

function isVisitorPath(value: string | null): value is VisitorPath {
  return (
    value === "hire" ||
    value === "craft" ||
    value === "build" ||
    value === "wander"
  );
}

export default function HomeExperience() {
  const themes = useMemo(() => themesForYear(), []);
  const [path, setPath] = useState<VisitorPath>(DEFAULT_PATH);
  const [themeId, setThemeId] = useState(DEFAULT_THEME_ID);
  const [colorMode, setColorMode] = useState<ColorMode>(DEFAULT_COLOR_MODE);
  const [chooserOpen, setChooserOpen] = useState(false);
  const [ready, setReady] = useState(false);
  const content = contentFor(path);
  const activeLabel =
    PATH_OPTIONS.find((option) => option.id === path)?.label ?? "Wonderer";
  const activeTheme =
    themes.find((theme) => theme.id === themeId) ?? themes[0];
  const tokens = useMemo(
    () => tokensFromSeed(activeTheme.swatch, colorMode),
    [activeTheme.swatch, colorMode],
  );

  useEffect(() => {
    const storedPath = window.localStorage.getItem(PATH_STORAGE_KEY);
    setPath(isVisitorPath(storedPath) ? storedPath : DEFAULT_PATH);

    const storedTheme = window.localStorage.getItem(THEME_STORAGE_KEY);
    const nextThemeId = isThemeId(storedTheme, themes)
      ? storedTheme
      : DEFAULT_THEME_ID;
    setThemeId(nextThemeId);

    const storedMode = window.localStorage.getItem(MODE_STORAGE_KEY);
    if (isColorMode(storedMode)) {
      setColorMode(storedMode);
    } else if (window.matchMedia("(prefers-color-scheme: light)").matches) {
      setColorMode("light");
    } else {
      setColorMode(DEFAULT_COLOR_MODE);
    }
    setReady(true);

    const seenChooser = window.localStorage.getItem(CHOOSER_SEEN_KEY) === "1";
    if (seenChooser) return;

    const timer = window.setTimeout(() => {
      setChooserOpen(true);
    }, CHOOSER_OPEN_DELAY_MS);

    return () => window.clearTimeout(timer);
  }, [themes]);

  useEffect(() => {
    applyThemeTokens(tokens);
  }, [tokens]);

  function markChooserSeen() {
    window.localStorage.setItem(CHOOSER_SEEN_KEY, "1");
  }

  function persist(next: VisitorPath) {
    setPath(next);
    window.localStorage.setItem(PATH_STORAGE_KEY, next);
  }

  function choose(next: VisitorPath) {
    persist(next);
    markChooserSeen();
    setChooserOpen(false);
  }

  function dismissChooser() {
    persist(DEFAULT_PATH);
    markChooserSeen();
    setChooserOpen(false);
  }

  function changeTheme(nextId: string) {
    setThemeId(nextId);
    window.localStorage.setItem(THEME_STORAGE_KEY, nextId);
  }

  function changeColorMode(nextMode: ColorMode) {
    setColorMode(nextMode);
    window.localStorage.setItem(MODE_STORAGE_KEY, nextMode);
  }

  return (
    <div className="relative flex min-h-full flex-1 flex-col overflow-x-hidden">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10 overflow-hidden"
      >
        <div className="absolute inset-0 bg-[var(--color-bg)]" />
        {/* Glow sits mid-field, not under the header lockup */}
        <div className="km-hero-glow absolute -left-[6%] top-[14%] h-[70vh] w-[68vw] rounded-full bg-[var(--color-hero-glow)] opacity-90 blur-3xl" />
        <div className="km-hero-wash absolute -right-[12%] top-[22%] h-[54vh] w-[48vw] rounded-full bg-[var(--color-hero-wash)] opacity-50 blur-3xl" />
        {/* Clear band behind logo / header controls */}
        <div className="absolute inset-x-0 top-0 h-28 bg-gradient-to-b from-[var(--color-bg)] from-40% to-transparent" />
        <div
          className="absolute inset-0 opacity-[0.2]"
          style={{
            backgroundImage:
              "radial-gradient(circle at 1px 1px, color-mix(in oklab, var(--color-fg) 14%, transparent) 1px, transparent 0)",
            backgroundSize: "28px 28px",
            maskImage:
              "linear-gradient(to bottom, transparent 0%, black 18%, black 55%, transparent 100%)",
          }}
        />
      </div>

      <header className="relative z-10 mx-auto flex w-full max-w-6xl flex-wrap items-center justify-between gap-x-4 gap-y-2 px-6 pb-2 pt-6 sm:px-8 sm:pt-8">
        <a href="#top" className="km-brand" aria-label="Kaung Mon — back to top">
          <Image
            src={logo}
            alt=""
            width={28}
            height={28}
            className={[
              "km-brand__mark h-7 w-7 object-contain",
              // Source mark is black; invert when lockup ink is white
              tokens.brandMark === "#ffffff" ? "invert" : "",
            ].join(" ")}
            priority
          />
          <span className="km-brand__name text-[0.95rem] font-semibold tracking-[-0.02em] text-[var(--color-brand-mark)]">
            Kaung Mon
          </span>
        </a>

        <div className="flex flex-wrap items-center gap-x-3 gap-y-2 sm:gap-x-4">
          <ThemeCircles
            themes={themes}
            activeId={activeTheme.id}
            onChange={changeTheme}
          />

          <div className="flex items-center gap-x-2.5">
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

      <main
        id="top"
        className="mx-auto flex w-full max-w-6xl flex-1 flex-col px-6 sm:px-8"
      >
        <section className="relative flex min-h-[calc(100svh-5.5rem)] flex-col justify-center pb-16 pt-10 sm:pb-20 sm:pt-6">
          <p
            className="km-rise km-delay-1 mb-5 text-[0.8rem] font-medium uppercase tracking-[0.18em] text-[var(--color-fg-muted)]"
            key={`eyebrow-${path}`}
          >
            {content.eyebrow}
          </p>

          <h1 className="km-font-display km-rise km-delay-2 max-w-[12ch] text-[clamp(3.25rem,11vw,6.75rem)] font-semibold leading-[0.9] tracking-[-0.02em] text-[var(--color-fg-display)]">
            Kaung Mon
          </h1>

          <p
            className="km-rise km-delay-3 mt-7 max-w-xl text-[clamp(1.15rem,2.4vw,1.55rem)] font-medium leading-snug tracking-[-0.025em] text-[var(--color-fg)]"
            key={`headline-${path}`}
          >
            {content.headline}
          </p>

          <p
            className="km-rise km-delay-4 mt-4 max-w-lg text-[1.02rem] leading-relaxed text-[var(--color-fg-muted)]"
            key={`support-${path}`}
          >
            {content.support}
          </p>

          <div className="km-rise km-delay-5 mt-9 flex flex-wrap items-center gap-x-5 gap-y-3">
            <a href={content.primaryCta.href} className="km-glass-cta">
              {/* Parallel chase (accent) — grow + exit */}
              <span className="km-glass-cta__edge" aria-hidden />
              <span className="km-glass-cta__edge" aria-hidden />
              <span className="km-glass-cta__edge" aria-hidden />
              <span className="km-glass-cta__edge" aria-hidden />
              {/* Same track as chase — white segments fade in after chase ends */}
              <span className="km-glass-cta__hold" aria-hidden />
              <span className="km-glass-cta__hold" aria-hidden />
              <span className="km-glass-cta__hold" aria-hidden />
              <span className="km-glass-cta__hold" aria-hidden />
              <span className="km-glass-cta__label">{content.primaryCta.label}</span>
            </a>
            <a
              href={content.secondaryCta.href}
              className="text-[0.95rem] text-[var(--color-fg-muted)] underline decoration-[color-mix(in_oklab,var(--color-fg)_28%,transparent)] underline-offset-4 transition-colors hover:text-[var(--color-fg)] hover:decoration-[var(--color-fg)]"
            >
              {content.secondaryCta.label}
            </a>
          </div>
        </section>

        <section
          id="work"
          className="border-t border-[var(--color-line)] py-20 sm:py-24"
          key={`work-${path}`}
        >
          <div className="km-rise max-w-2xl">
            <h2 className="text-[clamp(1.6rem,3vw,2.15rem)] font-semibold tracking-[-0.035em] text-[var(--color-fg)]">
              {content.sectionTitle}
            </h2>
            <p className="mt-3 text-[1.05rem] leading-relaxed text-[var(--color-fg-muted)]">
              {content.sectionSupport}
            </p>
          </div>

          <ul className="mt-12 grid list-none gap-x-12 gap-y-14 p-0 lg:grid-cols-2">
            {content.projects.map((project, index) => (
              <li
                key={project.title}
                className="km-rise border-t border-[var(--color-line)] pt-6"
                style={{ animationDelay: `${100 + index * 90}ms` }}
              >
                <p className="text-[0.75rem] font-medium uppercase tracking-[0.14em] text-[var(--color-fg-muted)]">
                  {project.meta}
                </p>
                <h3 className="mt-3 text-[1.35rem] font-semibold tracking-[-0.03em] text-[var(--color-fg)]">
                  {project.title}
                </h3>
                <p className="mt-3 text-[1.05rem] font-medium leading-snug tracking-[-0.015em] text-[var(--color-accent-fg)]">
                  {project.outcome}
                </p>
                <p className="mt-3 text-[0.98rem] leading-relaxed text-[var(--color-fg-muted)]">
                  {project.body}
                </p>
              </li>
            ))}
          </ul>

          <ul className="mt-16 grid list-none gap-x-10 gap-y-10 p-0 sm:grid-cols-3">
            {content.items.map((item, index) => (
              <li
                key={item.title}
                className="km-rise border-t border-[var(--color-line)] pt-5"
                style={{ animationDelay: `${200 + index * 70}ms` }}
              >
                <h3 className="text-[1.08rem] font-semibold tracking-[-0.02em] text-[var(--color-fg)]">
                  {item.title}
                </h3>
                <p className="mt-2 text-[0.98rem] leading-relaxed text-[var(--color-fg-muted)]">
                  {item.body}
                </p>
              </li>
            ))}
          </ul>
        </section>

        <section
          id="contact"
          className="border-t border-[var(--color-line)] py-20 sm:py-24"
          key={`contact-${path}`}
        >
          <h2 className="max-w-xl text-[clamp(1.6rem,3vw,2.15rem)] font-semibold tracking-[-0.035em] text-[var(--color-fg)]">
            {content.contactTitle}
          </h2>
          <p className="mt-3 max-w-lg text-[1.05rem] leading-relaxed text-[var(--color-fg-muted)]">
            {content.contactSupport}
          </p>
          <a
            href={CONTACT_MAILTO}
            className="mt-8 inline-block text-[1.05rem] font-semibold tracking-[-0.02em] text-[var(--color-accent-fg)] underline decoration-[color-mix(in_oklab,var(--color-accent-fg)_45%,transparent)] underline-offset-4 hover:decoration-[var(--color-accent-fg)]"
          >
            {CONTACT_EMAIL}
          </a>
        </section>
      </main>

      <PathChooserDialog
        open={chooserOpen}
        currentPath={path}
        onChoose={choose}
        onDismiss={dismissChooser}
      />
    </div>
  );
}
