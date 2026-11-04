"use client";

import { useEffect, useRef, useState } from "react";
import type { ProjectPreview } from "../lib/media";
import { previewSources } from "../lib/project-video";
import "./media-frame.css";

type ProjectVideoProps = {
  preview: ProjectPreview["preview"];
  label: string;
  /** Fires once the first frame is ready to show. */
  onReady?: () => void;
};

/**
 * Active project preview. Loads immediately so the walkthrough isn't stuck
 * on a spinner while tabs try to auto-cycle.
 */
export default function ProjectVideo({ preview, label, onReady }: ProjectVideoProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const onReadyRef = useRef(onReady);
  const [status, setStatus] = useState<"loading" | "ready" | "error">("loading");
  const sources = previewSources(preview);
  const primary = sources[0].src;

  useEffect(() => {
    onReadyRef.current = onReady;
  }, [onReady]);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    let cancelled = false;
    let settled = false;
    setStatus("loading");

    function settle(next: "ready" | "error") {
      if (cancelled || settled) return;
      settled = true;
      setStatus(next);
      if (next === "ready") onReadyRef.current?.();
    }

    function onLoaded() {
      settle("ready");
    }
    function onFail() {
      settle("error");
    }

    video.addEventListener("loadeddata", onLoaded);
    video.addEventListener("canplay", onLoaded);
    video.addEventListener("error", onFail);
    video.load();

    if (video.readyState >= HTMLMediaElement.HAVE_CURRENT_DATA) {
      onLoaded();
    }

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!reduce) {
      void video.play().catch(() => {
        /* muted autoplay may still paint a frame via loadeddata */
      });
    }

    const watchdog = window.setTimeout(() => {
      if (!cancelled && !settled) {
        if (video.readyState >= HTMLMediaElement.HAVE_CURRENT_DATA) onLoaded();
        else onFail();
      }
    }, 12000);

    return () => {
      cancelled = true;
      window.clearTimeout(watchdog);
      video.removeEventListener("loadeddata", onLoaded);
      video.removeEventListener("canplay", onLoaded);
      video.removeEventListener("error", onFail);
      video.pause();
    };
  }, [primary]);

  const busy = status === "loading";
  const [shellVisible, setShellVisible] = useState(true);

  useEffect(() => {
    if (status !== "ready") {
      setShellVisible(true);
      return;
    }
    const hide = window.setTimeout(() => setShellVisible(false), 340);
    return () => window.clearTimeout(hide);
  }, [status]);

  return (
    <div
      className={[
        "km-media",
        "km-media--video",
        status === "ready" ? "km-media--ready" : "",
      ]
        .filter(Boolean)
        .join(" ")}
    >
      {shellVisible && status !== "error" ? (
        <div
          className="km-media__skeleton"
          role={busy ? "status" : undefined}
          aria-hidden={!busy}
          aria-label={busy ? `Loading ${label}` : undefined}
        >
          <span className="km-media__spinner" aria-hidden />
          {busy ? <p className="km-media__skeleton-label">Loading</p> : null}
        </div>
      ) : null}

      {status === "error" ? (
        <div className="km-media__fallback" role="img" aria-label={`${label} preview unavailable`}>
          <p className="km-media__fallback-title">{label}</p>
          <p className="km-media__fallback-note">Preview unavailable</p>
        </div>
      ) : null}

      <video
        ref={videoRef}
        className="km-media__video"
        muted
        loop
        playsInline
        preload="auto"
        aria-label={`${label} product preview`}
        aria-hidden={status !== "ready"}
      >
        {sources.map((source) => (
          <source key={source.src} src={source.src} type={source.type} />
        ))}
      </video>
    </div>
  );
}
