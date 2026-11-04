"use client";

import Image, { type StaticImageData } from "next/image";
import { useState, type CSSProperties } from "react";
import { useMediaGate } from "../lib/media-gate";
import "./media-frame.css";

/** High visual quality — media may load slower; shell stays deferred via gate. */
export const MEDIA_IMAGE_QUALITY = 92;

type MediaImageProps = {
  src: StaticImageData | string;
  alt: string;
  width: number;
  height: number;
  className?: string;
  sizes?: string;
  quality?: number;
  /** Skip idle wait (header logo). */
  priority?: boolean;
  round?: boolean;
  /** Prefer contain (logos) over cover. */
  contain?: boolean;
};

/**
 * Image that waits for the media gate, shows a CSS skeleton, then fades in.
 * Shell size is reserved from width/height so decode never shifts layout.
 */
export default function MediaImage({
  src,
  alt,
  width,
  height,
  className,
  sizes,
  quality = MEDIA_IMAGE_QUALITY,
  priority = false,
  round = false,
  contain = false,
}: MediaImageProps) {
  const gate = useMediaGate({ priority });
  const [ready, setReady] = useState(false);
  const [failed, setFailed] = useState(false);

  const status = !gate ? "waiting" : failed ? "error" : ready ? "ready" : "loading";
  const showSkeleton = status === "waiting" || status === "loading" || status === "ready";

  const shellStyle = {
    "--km-media-w": `${width}px`,
    "--km-media-h": `${height}px`,
    "--km-media-ar": `${width} / ${height}`,
  } as CSSProperties;

  return (
    <span
      className={[
        "km-media",
        "km-media--image",
        round ? "km-media--round" : "",
        contain ? "km-media--contain" : "",
        status === "ready" ? "km-media--ready" : "",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
      style={shellStyle}
    >
      {showSkeleton ? (
        <span
          className="km-media__skeleton"
          aria-hidden={status === "ready"}
          role={status === "ready" ? undefined : "status"}
          aria-label={status === "ready" ? undefined : "Loading"}
        >
          <span className="km-media__spinner" />
        </span>
      ) : null}

      {status === "error" ? (
        <span className="km-media__fallback" aria-hidden />
      ) : null}

      {gate && !failed ? (
        <Image
          src={src}
          alt={alt}
          width={width}
          height={height}
          sizes={sizes}
          quality={quality}
          priority={priority}
          loading={priority ? "eager" : "lazy"}
          className="km-media__img"
          onLoadingComplete={() => setReady(true)}
          onError={() => setFailed(true)}
        />
      ) : null}
    </span>
  );
}
