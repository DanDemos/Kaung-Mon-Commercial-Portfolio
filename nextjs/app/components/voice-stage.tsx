"use client";

import {
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
  type KeyboardEvent,
} from "react";
import type { PathVoice } from "../lib/visitor-paths";
import { VOICE_PHOTOS } from "../lib/voice-photos";
import MediaImage from "./media-image";
import "./voice-stage.css";

/** Tablet+ with quotes: two-up. Mobile: one-up (see matchMedia). */
const VOICES_PER_SLIDE_TABLET = 2;
const TABLET_MQ = "(min-width: 768px)";

type VoiceStageProps = {
  voices: PathVoice[];
  title: string;
  /** When false, people only (photo / name / role) — no quote comments. */
  showQuotes?: boolean;
  /** Auto-advance interval in ms. 0 disables. */
  intervalMs?: number;
};

function chunkVoices(voices: PathVoice[], size: number): PathVoice[][] {
  const slides: PathVoice[][] = [];
  for (let i = 0; i < voices.length; i += size) {
    slides.push(voices.slice(i, i + size));
  }
  return slides;
}

/**
 * Voices carousel — 1-up on mobile / 2-up from tablet when quotes show;
 * compact people strip when quotes are off (Wonderer).
 */
export default function VoiceStage({
  voices,
  title,
  showQuotes = true,
  intervalMs = 5000,
}: VoiceStageProps) {
  const labelId = useId();
  const trackRef = useRef<HTMLUListElement>(null);
  const pauseTimer = useRef<number | null>(null);
  const scrollingRef = useRef(false);
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  /* Mobile-first default; tablet syncs on mount via matchMedia */
  const [quotedPerSlide, setQuotedPerSlide] = useState(1);

  useEffect(() => {
    if (!showQuotes) return;
    const mq = window.matchMedia(TABLET_MQ);
    const sync = () => setQuotedPerSlide(mq.matches ? VOICES_PER_SLIDE_TABLET : 1);
    sync();
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, [showQuotes]);

  const perSlide = showQuotes
    ? quotedPerSlide
    : Math.max(voices.length, 1);
  const slides = useMemo(
    () => chunkVoices(voices, perSlide),
    [voices, perSlide],
  );
  const slideCount = slides.length;
  const networkCount = voices.length;

  useEffect(() => {
    setIndex(0);
  }, [voices, perSlide]);

  // Scroll only the track — never scrollIntoView (that hijacks page scroll).
  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;
    const slide = track.children[index] as HTMLElement | undefined;
    if (!slide) return;
    scrollingRef.current = true;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    track.scrollTo({
      left: slide.offsetLeft,
      behavior: reduce ? "auto" : "smooth",
    });
    const done = window.setTimeout(() => {
      scrollingRef.current = false;
    }, reduce ? 0 : 400);
    return () => window.clearTimeout(done);
  }, [index]);

  useEffect(() => {
    if (slideCount < 2 || intervalMs <= 0 || paused) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const id = window.setInterval(() => {
      setIndex((i) => (i + 1) % slideCount);
    }, intervalMs);
    return () => window.clearInterval(id);
  }, [slideCount, intervalMs, paused]);

  useEffect(() => {
    return () => {
      if (pauseTimer.current != null) window.clearTimeout(pauseTimer.current);
    };
  }, []);

  if (networkCount === 0) return null;

  function go(next: number, manual = false) {
    setIndex(((next % slideCount) + slideCount) % slideCount);
    if (manual) {
      setPaused(true);
      if (pauseTimer.current != null) window.clearTimeout(pauseTimer.current);
      pauseTimer.current = window.setTimeout(() => setPaused(false), 10000);
    }
  }

  function onKeyDown(event: KeyboardEvent<HTMLDivElement>) {
    if (event.key === "ArrowRight") {
      event.preventDefault();
      go(index + 1, true);
    } else if (event.key === "ArrowLeft") {
      event.preventDefault();
      go(index - 1, true);
    }
  }

  function onScroll() {
    if (scrollingRef.current) return;
    const track = trackRef.current;
    if (!track) return;
    const nodes = Array.from(track.children) as HTMLElement[];
    if (nodes.length === 0) return;
    const mid = track.scrollLeft + track.clientWidth / 2;
    let best = 0;
    let bestDist = Number.POSITIVE_INFINITY;
    nodes.forEach((slide, i) => {
      const center = slide.offsetLeft + slide.offsetWidth / 2;
      const dist = Math.abs(center - mid);
      if (dist < bestDist) {
        bestDist = dist;
        best = i;
      }
    });
    if (best !== index) setIndex(best);
  }

  const activeSlide = slides[index] ?? slides[0];

  return (
    <div
      className={[
        "km-voice-stage",
        showQuotes ? "" : "km-voice-stage--people",
      ].join(" ")}
      role="region"
      aria-roledescription="carousel"
      aria-labelledby={labelId}
      onKeyDown={onKeyDown}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocusCapture={() => setPaused(true)}
      onBlurCapture={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget as Node | null)) {
          setPaused(false);
        }
      }}
    >
      <p id={labelId} className="sr-only">
        {title}
      </p>

      <div className="km-voice-stage__toolbar">
        <p className="km-voice-stage__count" aria-live="polite">
          {showQuotes
            ? `${networkCount} colleagues · ${index + 1} / ${slideCount}`
            : `${networkCount} people`}
        </p>
        {slideCount > 1 ? (
          <div className="km-voice-stage__controls">
            <button
              type="button"
              className="km-voice-stage__nav"
              aria-label="Previous slide"
              onClick={() => go(index - 1, true)}
            >
              ‹
            </button>
            <button
              type="button"
              className="km-voice-stage__nav"
              aria-label="Next slide"
              onClick={() => go(index + 1, true)}
            >
              ›
            </button>
          </div>
        ) : null}
      </div>

      <ul
        ref={trackRef}
        className="km-voice-stage__track"
        onScroll={onScroll}
        tabIndex={0}
        aria-label={`${title} slides`}
      >
        {slides.map((group, i) => (
          <li
            key={group.map((v) => v.id).join("-")}
            className="km-voice-stage__slide"
            aria-roledescription="slide"
            aria-label={`${i + 1} of ${slideCount}`}
            aria-hidden={i !== index}
          >
            <ul className="km-voice-stage__pair">
              {group.map((voice) => (
                <li key={voice.id} className="km-voice-stage__card">
                  <div className="km-voice-stage__person">
                    <MediaImage
                      src={VOICE_PHOTOS[voice.id]}
                      alt=""
                      width={128}
                      height={128}
                      sizes="128px"
                      round
                      className="km-voice-stage__photo"
                    />
                    <div className="min-w-0">
                      <p className="km-voice-stage__name">{voice.name}</p>
                      <p className="km-voice-stage__role">{voice.role}</p>
                    </div>
                  </div>
                  {showQuotes ? (
                    <blockquote className="km-voice-stage__quote">
                      “{voice.quote}”
                    </blockquote>
                  ) : null}
                </li>
              ))}
            </ul>
          </li>
        ))}
      </ul>

      {slideCount > 1 ? (
        <div
          className="km-voice-stage__dots"
          role="tablist"
          aria-label="Choose slide"
        >
          {slides.map((group, i) => (
            <button
              key={group.map((v) => v.id).join("-")}
              type="button"
              role="tab"
              aria-selected={i === index}
              aria-label={`Slide ${i + 1}`}
              className={[
                "km-voice-stage__dot",
                i === index ? "km-voice-stage__dot--active" : "",
              ].join(" ")}
              onClick={() => go(i, true)}
            />
          ))}
        </div>
      ) : null}

      <p className="sr-only" aria-live="polite">
        {activeSlide?.map((v) => v.name).join(", ")}
      </p>
    </div>
  );
}
