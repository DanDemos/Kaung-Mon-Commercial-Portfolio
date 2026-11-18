"use client";

import Link from "next/link";
import { useLayoutEffect, useMemo, useState } from "react";
import {
  BLOG_POSTS,
  blogById,
  type BlogBlock,
  type BlogPost,
} from "../lib/blog";
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
import { useLocale } from "./locale-provider";
import LocaleToggle from "./locale-toggle";
import MediaImage from "./media-image";
import SectionTitle from "./section-title";
import SiteFooter from "./site-footer";
import SiteLoader from "./site-loader";
import { SiteNavLead, SiteNavStrip } from "./site-destination-nav";
import TextLink from "./text-link";
import ThemeCircles from "./theme-circles";
import "./blog-experience.css";
import "./brand-lockup.css";
import "./home-experience.css";
import "./site-header.css";

const logo = BRAND.logoMark;

type BlogExperienceProps = {
  /** When set, show that post. When omitted, show the index. */
  postId?: string;
};

/**
 * Blog — index of posts, or a single article at `/blog/[slug]`.
 * Content is static in `lib/blog.ts` (no backend).
 */
export default function BlogExperience({ postId }: BlogExperienceProps) {
  const themes = useMemo(() => themesForYear(), []);
  const [themeId, setThemeId] = useState(DEFAULT_THEME_ID);
  const [customSeed, setCustomSeed] = useState(DEFAULT_CUSTOM_SEED);
  const [colorMode, setColorMode] = useState<ColorMode>(DEFAULT_COLOR_MODE);
  const [ready, setReady] = useState(false);

  const post = postId ? blogById(postId) : undefined;

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
            {post ? (
              <BlogArticle post={post} />
            ) : postId ? (
              <BlogMissing />
            ) : (
              <BlogIndex />
            )}
          </main>

          <SiteFooter />
        </div>
      ) : null}
    </>
  );
}

function BlogIndex() {
  const { messages } = useLocale();
  return (
    <>
      <header className="km-blog-page__intro km-rise">
        <SectionTitle
          label={messages.blog.label}
          title={messages.blog.allTitle}
          as="h1"
        />
        <p className="km-blog-page__support">{messages.blog.allSupport}</p>
      </header>

      <ul className="km-blog-list km-rise km-delay-2">
        {BLOG_POSTS.map((item) => (
          <li key={item.id}>
            <Link href={`/blog/${item.id}`} className="km-blog-list__item">
              <span className="km-blog-list__cover">
                <MediaImage
                  src={item.cover}
                  alt={item.coverAlt}
                  width={item.coverWidth}
                  height={item.coverHeight}
                  sizes="(max-width: 672px) 100vw, 42rem"
                />
              </span>
              <span className="km-blog-list__meta">
                <time dateTime={item.date}>{item.dateLabel}</time>
                <span aria-hidden>·</span>
                <span className="km-blog-list__tags">
                  {item.tags.join(" · ")}
                </span>
              </span>
              <span className="km-blog-list__title">{item.title}</span>
              <span className="km-blog-list__excerpt">{item.excerpt}</span>
              <span className="km-blog-list__cta">
                {messages.blog.read}
                <span aria-hidden> →</span>
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </>
  );
}

function BlogArticle({ post }: { post: BlogPost }) {
  const { messages } = useLocale();
  return (
    <>
      <p className="km-blog-page__back km-rise">
        <TextLink href="/blog">{messages.blog.back}</TextLink>
      </p>

      <article
        className="km-blog-post km-rise km-delay-1"
        aria-labelledby={`blog-${post.id}-title`}
      >
        <SectionTitle
          label={messages.blog.label}
          title={
            <span id={`blog-${post.id}-title`}>{post.title}</span>
          }
          as="h1"
        />
        <p className="km-blog-post__meta">
          <time dateTime={post.date}>{post.dateLabel}</time>
          <span aria-hidden>·</span>
          <span className="km-blog-post__tags">{post.tags.join(" · ")}</span>
        </p>
        <p className="km-blog-post__excerpt">{post.excerpt}</p>

        <div className="km-blog-post__body">
          {post.body.map((block, index) => (
            <BlogBlockView key={`${post.id}-${index}`} block={block} />
          ))}
        </div>
      </article>
    </>
  );
}

function BlogBlockView({ block }: { block: BlogBlock }) {
  switch (block.type) {
    case "p":
      return <p>{block.text}</p>;
    case "h2":
      return <h2>{block.text}</h2>;
    case "ul":
      return (
        <ul>
          {block.items.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      );
    case "ol":
      return (
        <ol>
          {block.items.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ol>
      );
    case "image":
      return (
        <figure className="km-blog-post__figure">
          <span className="km-blog-post__figure-frame">
            <MediaImage
              src={block.src}
              alt={block.alt}
              width={block.width}
              height={block.height}
              sizes="(max-width: 672px) 100vw, 42rem"
            />
          </span>
          {block.caption ? (
            <figcaption className="km-blog-post__caption">
              {block.caption}
            </figcaption>
          ) : null}
        </figure>
      );
    case "hr":
      return <hr className="km-blog-post__hr" />;
    default:
      return null;
  }
}

function BlogMissing() {
  const { messages } = useLocale();
  return (
    <header className="km-blog-page__intro km-rise">
      <SectionTitle
        label={messages.blog.label}
        title={messages.blog.missingTitle}
        as="h1"
      />
      <p className="km-blog-page__support">{messages.blog.missingSupport}</p>
      <p className="km-blog-page__back">
        <TextLink href="/blog">{messages.blog.back}</TextLink>
      </p>
    </header>
  );
}
