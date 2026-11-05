"use client";

import { useEffect, useId, useRef } from "react";
import {
  ROLE_OPTIONS,
  WANDER_OPTION,
  type VisitorPath,
} from "../lib/visitor-paths";
import "./draw-underline.css";
import "./modal-surface.css";
import "./path-chooser-dialog.css";
import "./section-title.css";

type PathChooserDialogProps = {
  open: boolean;
  currentPath: VisitorPath;
  onChoose: (path: VisitorPath) => void;
  onDismiss: () => void;
};

export default function PathChooserDialog({
  open,
  currentPath,
  onChoose,
  onDismiss,
}: PathChooserDialogProps) {
  const titleId = useId();
  const descriptionId = useId();
  const panelRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!open) return;

    // Lock scroll without layout jump: overflow:hidden drops the scrollbar,
    // so pad by its width to keep the page from shifting sideways.
    const scrollbarWidth =
      window.innerWidth - document.documentElement.clientWidth;
    const previousOverflow = document.body.style.overflow;
    const previousPaddingRight = document.body.style.paddingRight;
    document.body.style.overflow = "hidden";
    if (scrollbarWidth > 0) {
      document.body.style.paddingRight = `${scrollbarWidth}px`;
    }
    closeRef.current?.focus();

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        event.preventDefault();
        onDismiss();
      }
    }

    window.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      document.body.style.paddingRight = previousPaddingRight;
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [open, onDismiss]);

  if (!open) return null;

  const wondererActive = currentPath === WANDER_OPTION.id;

  return (
    <div className="km-path-chooser fixed inset-0 z-50 overflow-y-auto overscroll-contain">
      <button
        type="button"
        aria-label="Close path chooser"
        className="fixed inset-0 bg-[color-mix(in_oklab,var(--color-fg)_28%,transparent)] backdrop-blur-[2px] transition-opacity"
        onClick={onDismiss}
      />

      {/*
        Overlay scrolls. Panel uses my-auto + h-fit so it hugs content and
        centers when short; when taller than the phone, margins collapse and
        the full card stays reachable by scrolling (avoids stretch from
        unsupported `align-items: safe center`).
      */}
      <div className="relative flex min-h-dvh justify-center p-4 py-5 sm:p-6">
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        aria-describedby={descriptionId}
        className="km-path-chooser__panel km-modal-surface km-rise relative z-10 my-auto h-fit w-full max-w-md p-5 sm:p-8"
      >
        <button
          ref={closeRef}
          type="button"
          aria-label="Close"
          onClick={onDismiss}
          className="absolute right-3 top-3 inline-flex size-9 items-center justify-center rounded-full text-[var(--color-fg-muted)] transition-[background-color,color,transform] duration-150 hover:bg-[color-mix(in_oklab,var(--color-fg)_7%,transparent)] hover:text-[var(--color-fg)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-accent)]"
        >
          <svg
            width="14"
            height="14"
            viewBox="0 0 14 14"
            fill="none"
            aria-hidden
          >
            <path
              d="M3 3l8 8M11 3L3 11"
              stroke="currentColor"
              strokeWidth="1.6"
              strokeLinecap="round"
            />
          </svg>
        </button>

        <p className="km-section-title__label pr-10">Optional</p>
        <h2
          id={titleId}
          className="km-section-title__title"
        >
          What are you looking for?
        </h2>
        <p
          id={descriptionId}
          className="km-path-chooser__desc text-[0.98rem] leading-relaxed text-[var(--color-fg-muted)]"
        >
          You can stay as a wonderer, or choose a lens if you&apos;re hiring, curious about the craft, or need a site built.
        </p>

        <div
          role="group"
          aria-label="Visitor type"
          className="km-path-chooser__roles"
        >
          {ROLE_OPTIONS.map((option) => {
            const active = currentPath === option.id;
            return (
              <button
                key={option.id}
                type="button"
                aria-pressed={active}
                onClick={() => onChoose(option.id)}
                className={[
                  "km-path-chooser__role",
                  active ? "km-path-chooser__role--active" : "",
                ].join(" ")}
              >
                <span className="km-path-chooser__role-label">
                  {option.label}
                </span>
                <span className="km-path-chooser__role-hint">
                  {option.hint}
                </span>
              </button>
            );
          })}
        </div>

        <button
          type="button"
          aria-pressed={wondererActive}
          onClick={() => onChoose(WANDER_OPTION.id)}
          className={[
            "km-path-chooser__wonderer",
            wondererActive ? "km-path-chooser__wonderer--active" : "",
          ].join(" ")}
        >
          <span className="km-path-chooser__wonderer-label km-draw-underline">
            Continue as {WANDER_OPTION.label.toLowerCase()}
            <span aria-hidden className="ml-1">
              →
            </span>
          </span>
        </button>
      </div>
      </div>
    </div>
  );
}
