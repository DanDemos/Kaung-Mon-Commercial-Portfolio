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

function pickMessage(exclude?: string) {
  const pool =
    exclude == null
      ? LOADING_MESSAGES
      : LOADING_MESSAGES.filter((line) => line !== exclude);
  return pool[Math.floor(Math.random() * pool.length)] ?? LOADING_MESSAGES[0];
}

/**
 * Boot gate — petal spinner, bouncing dots, status line every 0.5s.
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
      <div className="km-loader__spinner" aria-hidden>
        {Array.from({ length: PETAL_COUNT }, (_, index) => (
          <span
            key={index}
            className="km-loader__petal"
            style={{ "--km-petal": index } as CSSProperties}
          />
        ))}
      </div>

      <div className="km-loader__dots" aria-hidden>
        <span />
        <span />
        <span />
      </div>

      <p className="km-loader__label">{message}</p>
    </div>
  );
}
