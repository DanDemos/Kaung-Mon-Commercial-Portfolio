"use client";

import dynamic from "next/dynamic";
import { useEffect, useLayoutEffect, useMemo, useState } from "react";
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
import { clearLocationHash, scrollToSection } from "../lib/scroll-section";
import { markBootReady, readClientBootPrefs } from "../lib/theme-boot";
import {
  CHOOSER_SEEN_KEY,
  CONTACT_EMAIL,
  CONTACT_MAILTO,
  DEFAULT_PATH,
  PATH_OPTIONS,
  PATH_STORAGE_KEY,
  contentFor,
  type PathCta,
  type VisitorPath,
} from "../lib/visitor-paths";
import Btn from "./btn";
import DayNightToggle from "./day-night-toggle";
import FocusRail from "./focus-rail";
import MediaImage from "./media-image";
import PathLensControl from "./path-lens-control";
import ProjectStage from "./project-stage";
import SiteFooter from "./site-footer";
import SiteLoader from "./site-loader";
import TextLink from "./text-link";
import ThemeCircles from "./theme-circles";
import TypewriterRoles from "./typewriter-roles";
import "./brand-lockup.css";
import "./home-experience.css";
import "./site-loader.css";

const PathChooserDialog = dynamic(() => import("./path-chooser-dialog"), {
  ssr: false,
});
const ClientStage = dynamic(() => import("./client-stage"));
const VoiceStage = dynamic(() => import("./voice-stage"));
const ContactDock = dynamic(() => import("./contact-dock"));

/** Let brand + hero land before the first-visit ask. */
const CHOOSER_OPEN_DELAY_MS = 900;

const logo = BRAND.logoMark;

function isVisitorPath(value: string | null): value is VisitorPath {
  return (
    value === "hire" ||
    value === "craft" ||
    value === "build" ||
    value === "wander"
  );
}

function PathBtn({ cta }: { cta: PathCta }) {
  if ("section" in cta) {
    return <Btn section={cta.section}>{cta.label}</Btn>;
  }
  return <Btn href={cta.href}>{cta.label}</Btn>;
}

/** Quiet sibling — underlined text, not a second primary. */
function PathTextLink({ cta }: { cta: PathCta }) {
  if ("section" in cta) {
    return <TextLink section={cta.section}>{cta.label}</TextLink>;
  }
  return <TextLink href={cta.href}>{cta.label}</TextLink>;
}

export default function HomeExperience() {
  const themes = useMemo(() => themesForYear(), []);
  // SSR + first hydrate use defaults; boot script covers paint until we resolve storage.
  const [path, setPath] = useState<VisitorPath>(DEFAULT_PATH);
  const [themeId, setThemeId] = useState(DEFAULT_THEME_ID);
  const [customSeed, setCustomSeed] = useState(DEFAULT_CUSTOM_SEED);
  const [colorMode, setColorMode] = useState<ColorMode>(DEFAULT_COLOR_MODE);
  const [chooserOpen, setChooserOpen] = useState(false);
  const [ready, setReady] = useState(false);
  const content = contentFor(path);
  const activeLabel =
    PATH_OPTIONS.find((option) => option.id === path)?.label ?? "Wonderer";
  const activeSwatch =
    themeId === CUSTOM_THEME_ID
      ? customSeed
      : (themes.find((theme) => theme.id === themeId) ?? themes[0]).swatch;
  const tokens = useMemo(
    () => tokensFromSeed(activeSwatch, colorMode),
    [activeSwatch, colorMode],
  );

  // Resolve stored prefs + full tokens before revealing the app (no dark→light flash).
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

    const seenChooser = window.localStorage.getItem(CHOOSER_SEEN_KEY) === "1";
    if (seenChooser) return;

    const timer = window.setTimeout(() => {
      setChooserOpen(true);
    }, CHOOSER_OPEN_DELAY_MS);

    return () => window.clearTimeout(timer);
  }, [themes]);

  // Keep CSS vars in sync after boot when the visitor changes theme/mode.
  useLayoutEffect(() => {
    if (!ready) return;
    applyThemeTokens(tokens);
  }, [tokens, ready]);

  // Never leave `#contact` (etc.) stuck in the address bar for non-tech visitors.
  useEffect(() => {
    clearLocationHash();
  }, []);

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
      <SiteLoader
        ready={ready}
        invertMark={tokens.brandMark === "#ffffff"}
      />
      <div className="km-app relative flex min-h-full flex-1 flex-col overflow-x-hidden">
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
        <button
          type="button"
          className="km-brand"
          aria-label="Kaung Mon, back to top"
          onClick={() => scrollToSection("top")}
        >
          <MediaImage
            src={logo}
            alt=""
            width={56}
            height={56}
            sizes="56px"
            quality={95}
            priority
            className={[
              "km-brand__mark",
              tokens.brandMark === "#ffffff" ? "km-media--invert" : "",
            ].join(" ")}
          />
          <span className="km-brand__name text-[0.95rem] font-semibold tracking-[-0.02em] text-[var(--color-brand-mark)]">
            Kaung Mon
          </span>
        </button>

        <div className="flex flex-wrap items-center gap-x-3 gap-y-2 sm:gap-x-4">
          <ThemeCircles
            themes={themes}
            activeId={themeId}
            customSeed={customSeed}
            onChange={changeTheme}
            onCustomSeedChange={changeCustomSeed}
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

          <div className="km-rise km-delay-2" key={`roles-${path}`}>
            <TypewriterRoles roles={content.roles} />
          </div>

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
            <PathBtn cta={content.primaryCta} />
            <PathTextLink cta={content.secondaryCta} />
          </div>
        </section>

        {content.items.length > 0 ? (
          <section className="km-home-section" key={`focus-${path}`}>
            <div className="km-home-section__head km-rise">
              <h2 className="km-home-section__title">{content.focusTitle}</h2>
              {content.focusSupport ? (
                <p className="km-home-section__support">{content.focusSupport}</p>
              ) : null}
            </div>
            <div className="km-rise">
              <FocusRail items={content.items} />
            </div>
          </section>
        ) : null}

        <section id="work" className="km-home-section" key={`work-${path}`}>
          <div className="km-home-section__head km-rise">
            <h2 className="km-home-section__title">{content.sectionTitle}</h2>
            {content.sectionSupport ? (
              <p className="km-home-section__support">{content.sectionSupport}</p>
            ) : null}
          </div>
          <div className="km-rise">
            <ProjectStage key={path} projects={content.projects} />
          </div>
        </section>

        <section id="clients" className="km-home-section" key={`clients-${path}`}>
          <div className="km-home-section__head km-rise">
            <h2 className="km-home-section__title">{content.clientsTitle}</h2>
            {content.clientsSupport ? (
              <p className="km-home-section__support">{content.clientsSupport}</p>
            ) : null}
          </div>
          <div className="km-rise">
            <ClientStage title={content.clientsTitle} />
          </div>
        </section>

        <section id="about" className="km-home-section" key={`about-${path}`}>
          <div className="km-home-section__head km-rise">
            <h2 className="km-home-section__title">{content.aboutTitle}</h2>
          </div>
          <div className="km-home-about km-rise">
            <p className="km-home-about__body">{content.aboutBody}</p>
            <PathBtn cta={content.aboutCta} />
          </div>
        </section>

        {content.voices.length > 0 ? (
          <section
            id="voices"
            className="km-home-section"
            key={`voices-${path}`}
          >
            <div className="km-home-section__head km-rise">
              <h2 className="km-home-section__title">{content.voicesTitle}</h2>
              {content.voicesSupport ? (
                <p className="km-home-section__support">{content.voicesSupport}</p>
              ) : null}
            </div>
            <div className="km-rise">
              <VoiceStage
                title={content.voicesTitle}
                voices={content.voices}
              />
            </div>
          </section>
        ) : null}

        <section id="contact" className="km-home-section" key={`contact-${path}`}>
          <div className="km-rise">
            <ContactDock
              title={content.contactTitle}
              support={content.contactSupport}
              email={CONTACT_EMAIL}
              mailto={CONTACT_MAILTO}
            />
          </div>
        </section>
      </main>

      <SiteFooter
        invertMark={tokens.brandMark === "#ffffff"}
        showVoices={content.voices.length > 0}
      />

      <PathChooserDialog
        open={chooserOpen}
        currentPath={path}
        onChoose={choose}
        onDismiss={dismissChooser}
      />
    </div>
    </>
  );
}
