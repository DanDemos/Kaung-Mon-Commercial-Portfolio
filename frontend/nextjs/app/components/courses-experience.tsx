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
import { COURSES, courseById, type Course } from "../lib/courses";
import { BRAND } from "../lib/media";
import { markBootReady, readClientBootPrefs } from "../lib/theme-boot";
import Btn from "./btn";
import DayNightToggle from "./day-night-toggle";
import { useLocale } from "./locale-provider";
import LocaleToggle from "./locale-toggle";
import MediaImage from "./media-image";
import SectionTitle from "./section-title";
import SiteFooter from "./site-footer";
import SiteLoader from "./site-loader";
import { SiteNavLead, SiteNavStrip } from "./site-destination-nav";
import TextLink from "./text-link";
import ThemeCircles from "./theme-circles";
import "./brand-lockup.css";
import "./courses-experience.css";
import "./home-experience.css";
import "./site-header.css";

const logo = BRAND.logoMark;

type CoursesExperienceProps = {
  /** When set, show that course only. When omitted, show the chooser. */
  courseId?: string;
};

/**
 * Courses — pick one curriculum first; open a single course at `/courses/[slug]`.
 */
export default function CoursesExperience({ courseId }: CoursesExperienceProps) {
  const themes = useMemo(() => themesForYear(), []);
  const [themeId, setThemeId] = useState(DEFAULT_THEME_ID);
  const [customSeed, setCustomSeed] = useState(DEFAULT_CUSTOM_SEED);
  const [colorMode, setColorMode] = useState<ColorMode>(DEFAULT_COLOR_MODE);
  const [ready, setReady] = useState(false);

  const course = courseId ? courseById(courseId) : undefined;

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
    const nextCustom = isHexColor(storedCustom)
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
      {ready ? (
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
            <div className="km-site-header__row">
              <SiteNavLead>
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
              </SiteNavLead>

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
                  <LocaleToggle />
                </div>
              </div>
            </div>
            <SiteNavStrip />
          </header>

          <main className="mx-auto flex w-full max-w-6xl flex-1 flex-col px-6 pb-20 sm:px-8">
            {course ? (
              <CourseDetail course={course} />
            ) : courseId ? (
              <CourseMissing />
            ) : (
              <CourseChooser />
            )}
          </main>

          <SiteFooter />
        </div>
      ) : null}
    </>
  );
}

function CourseChooser() {
  const { messages } = useLocale();
  return (
    <>
      <header className="km-courses-page__intro km-rise">
        <SectionTitle
          label={messages.courses.learn}
          title={messages.courses.allTitle}
          as="h1"
        />
        <p className="km-courses-page__support">{messages.courses.allSupport}</p>
      </header>

      <ul className="km-course-picker km-rise km-delay-2">
        {COURSES.map((item) => (
          <li key={item.id}>
            <Link href={`/courses/${item.id}`} className="km-course-picker__item">
              <span className="km-course-picker__label">{item.level}</span>
              <span className="km-course-picker__title">{item.title}</span>
              <span className="km-course-picker__meta">
                {item.duration}
                <span aria-hidden> · </span>
                {item.lessons.length} lessons
                {item.docs ? (
                  <>
                    <span aria-hidden> · </span>
                    Paired with {item.docs.label}
                  </>
                ) : null}
              </span>
              <span className="km-course-picker__blurb">{item.blurb}</span>
              <span className="km-course-picker__cta">
                Open course
                <span aria-hidden> →</span>
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </>
  );
}

function CourseDetail({ course }: { course: Course }) {
  const { messages } = useLocale();
  const stepped = course.pace === "stepped";
  const [step, setStep] = useState(0);
  const safeStep = Math.min(step, course.lessons.length - 1);
  const lesson = course.lessons[safeStep];
  const isFirst = safeStep === 0;
  const isLast = safeStep === course.lessons.length - 1;

  return (
    <>
      <p className="km-courses-page__back km-rise">
        <TextLink href="/courses">{messages.courses.back}</TextLink>
      </p>

      <article
        className="km-course km-rise km-delay-1"
        aria-labelledby={`course-${course.id}-title`}
      >
        <SectionTitle
          label={course.level}
          title={
            <span id={`course-${course.id}-title`}>{course.title}</span>
          }
          as="h1"
        />
        <p className="km-course__meta">
          <span>{course.duration}</span>
          <span aria-hidden>·</span>
          <span>
            {stepped
              ? `${course.lessons.length} steps`
              : `${course.lessons.length} lessons`}
          </span>
        </p>
        <p className="km-course__blurb">{course.blurb}</p>
        {course.docs ? (
          <p className="km-course__docs">
            {stepped
              ? "Optional help if you get stuck: "
              : "Practice the docs: "}
            <TextLink
              href={course.docs.href}
              target="_blank"
              rel="noopener noreferrer"
            >
              {course.docs.label}
            </TextLink>
            {stepped
              ? ". You can finish every step without leaving this page."
              : ". Each lesson also links to a matching topic page."}
          </p>
        ) : null}

        {stepped && lesson ? (
          <div className="km-course__stepped">
            <p className="km-course__step-progress" aria-live="polite">
              {messages.courses.stepOf(safeStep + 1, course.lessons.length)}
            </p>
            <LessonBlock
              course={course}
              lesson={lesson}
              index={safeStep}
              headingLevel="h2"
            />
            <div className="km-course__step-nav">
              <Btn
                type="button"
                disabled={isFirst}
                onClick={() => setStep((current) => Math.max(0, current - 1))}
              >
                {messages.courses.previous}
              </Btn>
              {isLast ? (
                <Btn href="/courses">{messages.courses.back}</Btn>
              ) : (
                <Btn
                  type="button"
                  onClick={() =>
                    setStep((current) =>
                      Math.min(course.lessons.length - 1, current + 1),
                    )
                  }
                >
                  {messages.courses.next}
                </Btn>
              )}
            </div>
          </div>
        ) : (
          <ol className="km-course__lessons">
            {course.lessons.map((item, index) => (
              <LessonBlock
                key={item.id}
                course={course}
                lesson={item}
                index={index}
                headingLevel="h2"
                asListItem
              />
            ))}
          </ol>
        )}
      </article>
    </>
  );
}

function LessonBlock({
  course,
  lesson,
  index,
  headingLevel,
  asListItem = false,
}: {
  course: Course;
  lesson: Course["lessons"][number];
  index: number;
  headingLevel: "h2" | "h3";
  asListItem?: boolean;
}) {
  const { messages } = useLocale();
  const Heading = headingLevel;
  const body = (
    <>
      <div className="km-course__lesson-head">
        <span className="km-course__lesson-index">
          {String(index + 1).padStart(2, "0")}
        </span>
        <Heading className="km-course__lesson-title">{lesson.title}</Heading>
      </div>
      <p className="km-course__lesson-summary">{lesson.summary}</p>
      <ul className="km-course__points">
        {lesson.points.map((point) => (
          <li key={point}>{point}</li>
        ))}
      </ul>
      {lesson.example ? (
        <pre className="km-course__example">
          <code>{lesson.example}</code>
        </pre>
      ) : null}
      {lesson.tryThis ? (
        <p className="km-course__try-this">
          <span className="km-course__try-label">
            {messages.courses.yourTurn}
          </span>
          {lesson.tryThis}
        </p>
      ) : null}
      {lesson.docsHref ? (
        <p className="km-course__lesson-docs">
          <TextLink
            href={lesson.docsHref}
            target="_blank"
            rel="noopener noreferrer"
          >
            {course.docs
              ? `Another explanation on ${course.docs.label}`
              : "Read the docs"}
            <span aria-hidden> ↗</span>
          </TextLink>
        </p>
      ) : null}
    </>
  );

  if (asListItem) {
    return (
      <li className="km-course__lesson" id={lesson.id}>
        {body}
      </li>
    );
  }

  return (
    <div className="km-course__lesson km-course__lesson--focus" id={lesson.id}>
      {body}
    </div>
  );
}

function CourseMissing() {
  const { messages } = useLocale();
  return (
    <header className="km-courses-page__intro km-rise">
      <SectionTitle
        label={messages.courses.allTitle}
        title={messages.courses.missingTitle}
        as="h1"
      />
      <p className="km-courses-page__support">
        {messages.courses.missingSupport}
      </p>
      <p className="km-courses-page__back">
        <TextLink href="/courses">{messages.courses.back}</TextLink>
      </p>
    </header>
  );
}
