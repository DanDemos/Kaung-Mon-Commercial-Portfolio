"use client";

import { useMemo, useState } from "react";
import {
  PORTFOLIO_FILTERS,
  portfoliosForFilter,
  type PortfolioCategory,
} from "../lib/portfolios";
import MediaImage from "./media-image";
import "./work-gallery.css";

type FilterId = "all" | PortfolioCategory;

/**
 * Full works grid — category filters + cover stills.
 * Not the old magnifier-overlay card pattern.
 */
export default function WorkGallery() {
  const [filter, setFilter] = useState<FilterId>("all");
  const items = useMemo(() => portfoliosForFilter(filter), [filter]);

  return (
    <div className="km-work-gallery">
      <div
        className="km-work-gallery__filters"
        role="tablist"
        aria-label="Filter works"
      >
        {PORTFOLIO_FILTERS.map((item) => {
          const active = item.id === filter;
          return (
            <button
              key={item.id}
              type="button"
              role="tab"
              aria-selected={active}
              className={[
                "km-work-gallery__filter",
                active ? "km-work-gallery__filter--active" : "",
              ].join(" ")}
              onClick={() => setFilter(item.id)}
            >
              {item.label}
            </button>
          );
        })}
      </div>

      <p className="km-work-gallery__count" aria-live="polite">
        {items.length} {items.length === 1 ? "piece" : "pieces"}
      </p>

      <ul className="km-work-gallery__grid">
        {items.map((item) => (
          <li key={item.slug} className="km-work-gallery__item">
            <article className="km-work-gallery__card">
              <div className="km-work-gallery__frame">
                <MediaImage
                  src={item.cover}
                  alt=""
                  width={item.cover.width}
                  height={item.cover.height}
                  sizes="(max-width: 640px) 100vw, (max-width: 1100px) 50vw, 33vw"
                  className="km-work-gallery__media"
                />
              </div>
              <div className="km-work-gallery__meta">
                <h2 className="km-work-gallery__title">{item.title}</h2>
                <p className="km-work-gallery__kind">
                  {item.category}
                  {item.hasWalkthrough ? " · walkthrough on home" : ""}
                </p>
              </div>
            </article>
          </li>
        ))}
      </ul>
    </div>
  );
}
