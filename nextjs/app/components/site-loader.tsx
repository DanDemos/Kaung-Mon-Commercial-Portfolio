"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { BRAND } from "../lib/media";
import "./site-loader.css";

type SiteLoaderProps = {
  /** Theme/prefs resolved — reveal K, then discard after a beat. */
  ready: boolean;
};

type Phase = "loading" | "revealed" | "done";

const DISCARD_DELAY_MS = 500;

/**
 * Boot gate — logo with K blocked + spinner on the block.
 * When ready: drop the block/spinner, wait 0.5s, then discard the screen.
 */
export default function SiteLoader({ ready }: SiteLoaderProps) {
  const [phase, setPhase] = useState<Phase>("loading");

  useEffect(() => {
    if (!ready) {
      setPhase("loading");
      return;
    }

    setPhase("revealed");
    const timer = window.setTimeout(() => {
      setPhase("done");
    }, DISCARD_DELAY_MS);

    return () => window.clearTimeout(timer);
  }, [ready]);

  const blocking = phase === "loading";
  const discarded = phase === "done";

  return (
    <div
      className={[
        "km-loader",
        phase === "revealed" ? "km-loader--revealed" : "",
        discarded ? "km-loader--done" : "",
      ]
        .filter(Boolean)
        .join(" ")}
      aria-hidden={discarded || undefined}
      role={blocking ? "status" : undefined}
      aria-live={blocking ? "polite" : undefined}
      aria-label={blocking ? "Loading" : undefined}
    >
      <div className="km-loader__mark">
        <Image
          src={BRAND.logoMark}
          alt=""
          width={160}
          height={160}
          priority
          className="km-loader__logo"
        />
        <span
          className={[
            "km-loader__k-block",
            blocking ? "" : "km-loader__k-block--hide",
          ]
            .filter(Boolean)
            .join(" ")}
          aria-hidden
        >
          <span className="km-loader__spinner" />
        </span>
      </div>
    </div>
  );
}
