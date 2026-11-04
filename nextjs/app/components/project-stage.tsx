"use client";

import { useEffect, useRef, useState } from "react";
import { PROJECT_PREVIEWS } from "../lib/media";
import { prefetchProjectVideos } from "../lib/project-video";
import type { PathProject } from "../lib/visitor-paths";
import ProjectVideo from "./project-video";
import "./project-stage.css";

type ProjectStageProps = {
  projects: PathProject[];
  /** Auto-advance interval in ms. 0 disables. */
  intervalMs?: number;
};

/**
 * Work stage: CSS chrome first, then tabs. Only the active clip mounts.
 * Auto-cycle waits until that clip is ready so visitors aren't stuck on Loading.
 */
export default function ProjectStage({
  projects,
  intervalMs = 8000,
}: ProjectStageProps) {
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);
  const [clipReady, setClipReady] = useState(false);
  const pauseTimer = useRef<number | null>(null);
  const project = projects[active] ?? projects[0];
  const count = projects.length;
  const media = project ? PROJECT_PREVIEWS[project.mediaSlug] : null;

  useEffect(() => {
    setActive(0);
    setClipReady(false);
  }, [projects]);

  useEffect(() => {
    setClipReady(false);
  }, [active]);

  useEffect(() => {
    const first = projects[0];
    if (!first) return;
    const slugs = projects.map((p) => p.mediaSlug);
    prefetchProjectVideos(slugs, { skip: first.mediaSlug });
  }, [projects]);

  useEffect(() => {
    if (!clipReady || count < 2 || intervalMs <= 0 || paused) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const id = window.setInterval(() => {
      setActive((i) => (i + 1) % count);
    }, intervalMs);
    return () => window.clearInterval(id);
  }, [clipReady, count, intervalMs, paused]);

  useEffect(() => {
    return () => {
      if (pauseTimer.current != null) window.clearTimeout(pauseTimer.current);
    };
  }, []);

  if (!project || !media) return null;

  function pauseTemporarily() {
    setPaused(true);
    if (pauseTimer.current != null) window.clearTimeout(pauseTimer.current);
    pauseTimer.current = window.setTimeout(() => setPaused(false), 10000);
  }

  function select(index: number) {
    setActive(index);
    pauseTemporarily();
  }

  return (
    <div
      className="km-project-stage"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocusCapture={() => setPaused(true)}
      onBlurCapture={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget as Node | null)) {
          setPaused(false);
        }
      }}
    >
      <div
        className="km-project-stage__tabs"
        role="tablist"
        aria-label="Selected work"
      >
        {projects.map((item, index) => {
          const selected = index === active;
          return (
            <button
              key={item.mediaSlug}
              type="button"
              role="tab"
              aria-selected={selected}
              id={`project-tab-${index}`}
              aria-controls="project-panel"
              className={[
                "km-project-stage__tab",
                selected ? "km-project-stage__tab--active" : "",
              ].join(" ")}
              onClick={() => select(index)}
            >
              <span className="km-project-stage__tab-meta">{item.meta}</span>
              <span className="km-project-stage__tab-title">{item.title}</span>
            </button>
          );
        })}
      </div>

      <div
        id="project-panel"
        role="tabpanel"
        aria-labelledby={`project-tab-${active}`}
        className="km-project-stage__panel"
      >
        <div className="km-project-stage__frame">
          <div className="km-project-stage__chrome" aria-hidden>
            <span />
            <span />
            <span />
            <p className="km-project-stage__url">
              {media.label.toLowerCase().replace(/\s+/g, "")}.app
            </p>
          </div>
          <div className="km-project-stage__screen km-project-stage__screen--video">
            <ProjectVideo
              key={media.slug}
              preview={media.preview}
              label={media.label}
              onReady={() => setClipReady(true)}
            />
          </div>
        </div>

        <div className="km-project-stage__copy">
          <p className="km-project-stage__outcome">{project.outcome}</p>
          <p className="km-project-stage__body">{project.body}</p>
        </div>
      </div>
    </div>
  );
}
