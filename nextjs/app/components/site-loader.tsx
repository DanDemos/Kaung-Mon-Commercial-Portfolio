"use client";

import { useEffect, useState, type CSSProperties } from "react";
import "./site-loader.css";

type SiteLoaderProps = {
  /** Theme/prefs resolved — dissolve the gate. */
  ready: boolean;
};

const LOADING_MESSAGES = [
  "Fetching color of the year",
  "Getting everything ready",
  "Loading",
] as const;

const PETAL_COUNT = 8;
const MESSAGE_INTERVAL_MS = 500;

/** Almond leaf pointing up from spinner center — rotated per petal. */
const LEAF_PATH =
  "M24 5.5C27.4 9.8 28.6 14.2 24 19.5C19.4 14.2 20.6 9.8 24 5.5Z";

function pickMessage(exclude?: string) {
  const pool =
    exclude == null
      ? LOADING_MESSAGES
      : LOADING_MESSAGES.filter((line) => line !== exclude);
  return pool[Math.floor(Math.random() * pool.length)] ?? LOADING_MESSAGES[0];
}

/**
 * Boot gate — leaf-petal spinner (white→grey), bouncing dots, status every 0.5s.
 * Flat white / black canvas from day·night. Dissolves when ready.
 */
export default function SiteLoader({ ready }: SiteLoaderProps) {
  const [message, setMessage] = useState(() => pickMessage());

  useEffect(() => {
    if (ready) return;

    const timer = window.setInterval(() => {
      setMessage((current) => pickMessage(current));
    }, MESSAGE_INTERVAL_MS);

    return () => window.clearInterval(timer);
  }, [ready]);

  return (
    <div
      className={["km-loader", ready ? "km-loader--done" : ""]
        .filter(Boolean)
        .join(" ")}
      aria-hidden={ready || undefined}
      role={ready ? undefined : "status"}
      aria-live={ready ? undefined : "polite"}
    >
      <svg
        className="km-loader__spinner"
        viewBox="0 0 48 48"
        width="53"
        height="53"
        aria-hidden
      >
        {Array.from({ length: PETAL_COUNT }, (_, index) => (
          <path
            key={index}
            className="km-loader__petal"
            d={LEAF_PATH}
            transform={`rotate(${index * 45} 24 24)`}
            style={{ "--km-petal": index } as CSSProperties}
          />
        ))}
      </svg>

      <div className="km-loader__status">
        <p className="km-loader__label">{message}</p>
        <div className="km-loader__dots" aria-hidden>
          <span />
          <span />
          <span />
        </div>
      </div>
    </div>
  );
}
