"use client";

import "./site-loader.css";

type SiteLoaderProps = {
  /** Theme/prefs resolved — dissolve the gate. */
  ready: boolean;
};

/**
 * Boot gate — CSS logo frame (no K / no accent square) + spinner + Loading…
 * Dissolves as soon as prefs/tokens are ready.
 */
export default function SiteLoader({ ready }: SiteLoaderProps) {
  return (
    <div
      className={["km-loader", ready ? "km-loader--done" : ""]
        .filter(Boolean)
        .join(" ")}
      aria-hidden={ready || undefined}
      role={ready ? undefined : "status"}
      aria-live={ready ? undefined : "polite"}
    >
      <div className="km-loader__mark" aria-hidden>
        <span className="km-loader__frame" />
        <span className="km-loader__spinner" />
      </div>
      <p className="km-loader__label">
        Loading
        <span className="km-loader__dots">
          <span>.</span>
          <span>.</span>
          <span>.</span>
        </span>
      </p>
    </div>
  );
}
