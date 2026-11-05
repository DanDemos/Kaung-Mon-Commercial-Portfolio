"use client";

import Image, { type StaticImageData } from "next/image";
import { useEffect, useId, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import {
  PORTFOLIO_FILTERS,
  PORTFOLIO_ITEMS,
  portfolioMetaLabel,
  type PortfolioCategory,
  type PortfolioItem,
  type PortfolioMode,
} from "../lib/portfolios";
import MediaImage from "./media-image";
import "./work-gallery.css";

type FilterId = "all" | PortfolioCategory;

type LightboxState = {
  title: string;
  /** Base kind (Animation, Drawing, …) — mode label overlays when modes exist. */
  kind: string;
  /** Year · tool line when known. */
  meta: string | null;
  cover: StaticImageData;
  modes?: PortfolioMode[];
  modeIndex: number;
  onModeChange?: (index: number) => void;
};

/**
 * Works grid — same job as the old `.portfolio-container`:
 * filter chips + wrap with hover info overlay (title, kind, links).
 */
export default function WorkGallery() {
  const [filter, setFilter] = useState<FilterId>("all");
  const [lightbox, setLightbox] = useState<LightboxState | null>(null);

  const visible = useMemo(() => {
    if (filter === "all") return PORTFOLIO_ITEMS;
    return PORTFOLIO_ITEMS.filter((item) => item.category === filter);
  }, [filter]);

  return (
    <div className="km-portfolio">
      <ul
        className="km-portfolio__filters"
        id="portfolio-flters"
        role="tablist"
        aria-label="Filter works"
      >
        {PORTFOLIO_FILTERS.map((item) => {
          const active = item.id === filter;
          return (
            <li key={item.id} role="presentation">
              <button
                type="button"
                role="tab"
                aria-selected={active}
                className={[
                  "km-portfolio__filter",
                  active ? "km-portfolio__filter--active" : "",
                ].join(" ")}
                onClick={() => setFilter(item.id)}
              >
                {item.label}
              </button>
            </li>
          );
        })}
      </ul>

      <ul className="km-portfolio__container portfolio-container">
        {visible.map((item) => (
          <PortfolioCard
            key={item.slug}
            item={item}
            onView={(state) => setLightbox(state)}
          />
        ))}
      </ul>

      {lightbox ? (
        <PortfolioLightbox
          {...lightbox}
          onClose={() => setLightbox(null)}
        />
      ) : null}
    </div>
  );
}

function PortfolioCard({
  item,
  onView,
}: {
  item: PortfolioItem;
  onView: (state: LightboxState) => void;
}) {
  const modes = item.modes;
  const canCycle = (modes?.length ?? 0) > 1;
  const [modeIndex, setModeIndex] = useState(0);
  const mode = modes?.[modeIndex];
  const cover = mode?.cover ?? item.cover;
  const kind = mode ? mode.label : item.kind;
  const meta = portfolioMetaLabel(item);

  function cycleMode() {
    if (!modes || modes.length < 2) return;
    setModeIndex((i) => (i + 1) % modes.length);
  }

  return (
    <li
      className={`km-portfolio__item portfolio-item filter-${item.category}`}
    >
      <div
        className={[
          "km-portfolio__wrap",
          "portfolio-wrap",
          canCycle ? "km-portfolio__wrap--cycle" : "",
        ]
          .filter(Boolean)
          .join(" ")}
        onClick={canCycle ? cycleMode : undefined}
      >
        <MediaImage
          key={`${item.slug}-${mode?.id ?? "cover"}`}
          src={cover}
          alt=""
          width={cover.width}
          height={cover.height}
          sizes="(max-width: 640px) 100vw, (max-width: 1100px) 50vw, 33vw"
          className="km-portfolio__media"
        />
        <div className="km-portfolio__info portfolio-info">
          <h2 className="km-portfolio__title">{item.title}</h2>
          <p className="km-portfolio__kind">
            {canCycle ? (
              <>
                <span className="km-portfolio__kind-base">{item.kind}</span>
                <span className="km-portfolio__kind-mode" aria-live="polite">
                  {kind}
                </span>
              </>
            ) : (
              kind
            )}
          </p>
          {meta ? <p className="km-portfolio__meta">{meta}</p> : null}
          {canCycle ? (
            <p className="km-portfolio__hint">Click to switch</p>
          ) : null}
          <div
            className="km-portfolio__links portfolio-links"
            onClick={(event) => event.stopPropagation()}
          >
            {canCycle ? (
              <button
                type="button"
                className="km-portfolio__link"
                onClick={cycleMode}
                aria-label={`Show ${item.title} ${modes![(modeIndex + 1) % modes!.length].label}`}
              >
                <SwapIcon />
              </button>
            ) : null}
            <button
              type="button"
              className="km-portfolio__link"
              onClick={() =>
                onView({
                  title: item.title,
                  kind: item.kind,
                  meta,
                  cover,
                  modes: canCycle ? modes : undefined,
                  modeIndex,
                  onModeChange: canCycle ? setModeIndex : undefined,
                })
              }
              aria-label={`View ${item.title}${mode ? ` ${mode.label}` : ""} fullscreen`}
            >
              <SearchIcon />
            </button>
            {item.href ? (
              <a
                href={item.href}
                target="_blank"
                rel="noreferrer"
                className="km-portfolio__link"
                aria-label={`Open ${item.title}`}
              >
                <LinkIcon />
              </a>
            ) : item.archivedHref ? (
              <span
                className="km-portfolio__offline"
                title={item.archivedHref}
              >
                Offline
              </span>
            ) : null}
          </div>
        </div>
      </div>
    </li>
  );
}

function PortfolioLightbox({
  title,
  kind,
  meta,
  cover,
  modes,
  modeIndex: initialModeIndex,
  onModeChange,
  onClose,
}: LightboxState & { onClose: () => void }) {
  const titleId = useId();
  const closeRef = useRef<HTMLButtonElement>(null);
  const [mounted, setMounted] = useState(false);
  const [modeIndex, setModeIndex] = useState(initialModeIndex);
  const canSwitch = (modes?.length ?? 0) > 1;
  const activeMode = modes?.[modeIndex];
  const activeCover = activeMode?.cover ?? cover;
  const activeKind = activeMode ? `${kind} · ${activeMode.label}` : kind;

  function selectMode(next: number) {
    if (!modes || modes.length < 2) return;
    const index = ((next % modes.length) + modes.length) % modes.length;
    setModeIndex(index);
    onModeChange?.(index);
  }

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const scrollbarWidth =
      window.innerWidth - document.documentElement.clientWidth;
    const previousOverflow = document.body.style.overflow;
    const previousPaddingRight = document.body.style.paddingRight;
    document.body.style.overflow = "hidden";
    if (scrollbarWidth > 0) {
      document.body.style.paddingRight = `${scrollbarWidth}px`;
    }
    closeRef.current?.focus();

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        event.preventDefault();
        onClose();
        return;
      }
      if (!canSwitch || !modes || modes.length < 2) return;
      if (event.key !== "ArrowRight" && event.key !== "ArrowLeft") return;
      event.preventDefault();
      const step = event.key === "ArrowRight" ? 1 : -1;
      setModeIndex((current) => {
        const index =
          (((current + step) % modes.length) + modes.length) % modes.length;
        onModeChange?.(index);
        return index;
      });
    }

    window.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      document.body.style.paddingRight = previousPaddingRight;
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [onClose, canSwitch, modes, onModeChange]);

  if (!mounted) return null;

  return createPortal(
    <div className="km-portfolio-lightbox">
      <button
        type="button"
        className="km-portfolio-lightbox__scrim"
        aria-label="Close fullscreen view"
        onClick={onClose}
      />
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        className="km-portfolio-lightbox__stage"
      >
        <button
          ref={closeRef}
          type="button"
          className="km-portfolio-lightbox__close"
          aria-label="Close"
          onClick={onClose}
        >
          <CloseIcon />
        </button>
        <Image
          key={activeMode?.id ?? "cover"}
          src={activeCover}
          alt={title}
          width={activeCover.width}
          height={activeCover.height}
          sizes="100vw"
          quality={92}
          className="km-portfolio-lightbox__media"
          priority
        />
        <div className="km-portfolio-lightbox__meta">
          <p id={titleId} className="km-portfolio-lightbox__title">
            {title}
          </p>
          <p className="km-portfolio-lightbox__kind" aria-live="polite">
            {activeKind}
          </p>
          {meta ? (
            <p className="km-portfolio-lightbox__meta-line">{meta}</p>
          ) : null}
          {canSwitch && modes ? (
            <div
              className="km-portfolio-lightbox__switch"
              role="group"
              aria-label={`${title} animation`}
            >
              {modes.map((mode, index) => {
                const active = index === modeIndex;
                return (
                  <button
                    key={mode.id}
                    type="button"
                    className={[
                      "km-portfolio-lightbox__switch-btn",
                      active ? "km-portfolio-lightbox__switch-btn--active" : "",
                    ]
                      .filter(Boolean)
                      .join(" ")}
                    aria-pressed={active}
                    onClick={() => selectMode(index)}
                  >
                    {mode.label}
                  </button>
                );
              })}
            </div>
          ) : null}
        </div>
      </div>
    </div>,
    document.body,
  );
}

function SwapIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M7 7h11l-2.2-2.2M18 17H7l2.2 2.2"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function SearchIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden>
      <circle cx="11" cy="11" r="6.5" stroke="currentColor" strokeWidth="1.8" />
      <path
        d="M16.2 16.2L20 20"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
    </svg>
  );
}

function LinkIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M10 14a4 4 0 0 0 5.66 0l2.12-2.12a4 4 0 0 0-5.66-5.66L11 7.34"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
      <path
        d="M14 10a4 4 0 0 0-5.66 0L6.22 12.12a4 4 0 1 0 5.66 5.66L13 16.66"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
    </svg>
  );
}

function CloseIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 14 14" fill="none" aria-hidden>
      <path
        d="M2 2l10 10M12 2L2 12"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
    </svg>
  );
}
