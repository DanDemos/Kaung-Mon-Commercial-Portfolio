"use client";

import {
  useEffect,
  useLayoutEffect,
  useState,
  type CSSProperties,
} from "react";
import "./site-loader.css";

type SiteLoaderProps = {
  /** Theme/prefs resolved — dissolve the gate. */
  ready: boolean;
};

const LOADING_MESSAGES = [
  "Fetching color of the year",
  "Getting ready for everything",
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
  /* Fixed first paint — Math.random in useState mismatches SSR hydration */
  const [message, setMessage] = useState<string>(LOADING_MESSAGES[0]);

  useEffect(() => {
    if (ready) return;

    setMessage((current) => pickMessage(current));
    const timer = window.setInterval(() => {
      setMessage((current) => pickMessage(current));
    }, MESSAGE_INTERVAL_MS);

    return () => window.clearInterval(timer);
  }, [ready]);

  /* Lock before paint — useEffect is too late; first frame can still scroll x. */
  useLayoutEffect(() => {
    if (ready) return;

    const html = document.documentElement;
    const { body } = document;
    const prevHtmlOverflow = html.style.overflow;
    const prevBodyOverflow = body.style.overflow;
    const prevHtmlOverscroll = html.style.overscrollBehavior;
    const prevBodyOverscroll = body.style.overscrollBehavior;
    html.style.overflow = "hidden";
    body.style.overflow = "hidden";
    html.style.overscrollBehavior = "none";
    body.style.overscrollBehavior = "none";

    return () => {
      html.style.overflow = prevHtmlOverflow;
      body.style.overflow = prevBodyOverflow;
      html.style.overscrollBehavior = prevHtmlOverscroll;
      body.style.overscrollBehavior = prevBodyOverscroll;
    };
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
