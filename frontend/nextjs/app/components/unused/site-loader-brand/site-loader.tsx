"use client";

import { useEffect, useState } from "react";
import type { SiteLoaderProps } from "../../site-loader-types";
import { useLoaderScrollLock } from "../../use-loader-scroll-lock";
import "./site-loader.css";

/** Calm, unhurried — matches steady-host voice, not a status carnival. */
const LOADING_MESSAGES = [
  "One moment",
  "Setting the palette",
  "Almost ready",
] as const;

const MESSAGE_INTERVAL_MS = 2200;

function pickMessage(exclude?: string) {
  const pool =
    exclude == null
      ? LOADING_MESSAGES
      : LOADING_MESSAGES.filter((line) => line !== exclude);
  return pool[Math.floor(Math.random() * pool.length)] ?? LOADING_MESSAGES[0];
}

/**
 * Brand-first boot — soft accent aura + thin ring + display name.
 * Drop-in: same `SiteLoaderProps` as other variants.
 */
export default function SiteLoader({ ready }: SiteLoaderProps) {
  const [message, setMessage] = useState<string>(LOADING_MESSAGES[0]);

  useLoaderScrollLock(ready);

  useEffect(() => {
    if (ready) return;

    setMessage((current) => pickMessage(current));
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
      <div className="km-loader__stage">
        <div className="km-loader__aura" aria-hidden />
        <svg
          className="km-loader__ring"
          viewBox="0 0 64 64"
          width="72"
          height="72"
          aria-hidden
        >
          <circle
            className="km-loader__ring-track"
            cx="32"
            cy="32"
            r="28"
            fill="none"
          />
          <circle
            className="km-loader__ring-arc"
            cx="32"
            cy="32"
            r="28"
            fill="none"
          />
        </svg>
        <p className="km-loader__brand km-font-display">Kaung Mon</p>
      </div>

      <p className="km-loader__label" key={message}>
        {message}
      </p>
    </div>
  );
}
