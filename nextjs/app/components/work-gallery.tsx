"use client";

import { useMemo, useState } from "react";
import {
  PORTFOLIO_FILTERS,
  PORTFOLIO_ITEMS,
  type PortfolioCategory,
} from "../lib/portfolios";
import MediaImage from "./media-image";
import "./work-gallery.css";

type FilterId = "all" | PortfolioCategory;

/**
 * Works grid — same job as the old `.portfolio-container`:
 * filter chips + wrap with hover info overlay (title, kind, links).
 */
export default function WorkGallery() {
  const [filter, setFilter] = useState<FilterId>("all");

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
          <li
            key={item.slug}
            className={`km-portfolio__item portfolio-item filter-${item.category}`}
          >
            <div className="km-portfolio__wrap portfolio-wrap">
              <MediaImage
                src={item.cover}
                alt=""
                width={item.cover.width}
                height={item.cover.height}
                sizes="(max-width: 640px) 100vw, (max-width: 1100px) 50vw, 33vw"
                className="km-portfolio__media"
              />
              <div className="km-portfolio__info portfolio-info">
                <h2 className="km-portfolio__title">{item.title}</h2>
                <p className="km-portfolio__kind">{item.kind}</p>
                <div className="km-portfolio__links portfolio-links">
                  <a
                    href={item.cover.src}
                    target="_blank"
                    rel="noreferrer"
                    className="km-portfolio__link"
                    aria-label={`View ${item.title} image`}
                  >
                    <SearchIcon />
                  </a>
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
                  ) : null}
                </div>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
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
