"use client";

import { useEffect, useId, useRef } from "react";
import {
  ROLE_OPTIONS,
  WANDER_OPTION,
  type VisitorPath,
} from "../lib/visitor-paths";
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
    <div className="fixed inset-0 z-50 flex items-end justify-center p-4 sm:items-center">
      <button
        type="button"
        aria-label="Close path chooser"
        className="absolute inset-0 bg-[color-mix(in_oklab,var(--color-fg)_28%,transparent)] backdrop-blur-[2px] transition-opacity"
        onClick={onDismiss}
      />

      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        aria-describedby={descriptionId}
        className="km-rise relative z-10 w-full max-w-md border border-[var(--color-line)] bg-[var(--color-bg-elevated)] p-6 shadow-[0_24px_80px_rgba(18,24,31,0.18)] sm:p-8"
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
          Who are you here as?
        </h2>
        <p
          id={descriptionId}
          className="mt-2 text-[0.98rem] leading-relaxed text-[var(--color-fg-muted)]"
        >
          Default is wonderer. Pick a role only if you want a different view.
        </p>

        <div
          role="group"
          aria-label="Visitor type"
          className="mt-7 flex flex-col"
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
                  "-mx-3 flex items-baseline justify-between gap-4 border-t border-[var(--color-line)] px-3 py-3.5 text-left transition-[background-color,color] duration-150",
                  active
                    ? "bg-[var(--color-accent-soft)] text-[var(--color-accent-fg)]"
                    : "bg-transparent text-[var(--color-fg)] hover:bg-[var(--color-accent-soft)] hover:text-[var(--color-accent-fg)]",
                ].join(" ")}
              >
                <span className="text-[1.05rem] font-semibold tracking-[-0.02em]">
                  {option.label}
                </span>
                <span className="text-sm text-[var(--color-fg-muted)]">
                  {option.hint}
                </span>
              </button>
            );
          })}
        </div>

        <div className="mt-2 border-t border-[var(--color-line)] pt-3">
          <button
            type="button"
            aria-pressed={wondererActive}
            onClick={() => onChoose(WANDER_OPTION.id)}
            className={[
              "km-path-chooser__wonderer",
              wondererActive ? "km-path-chooser__wonderer--active" : "",
            ].join(" ")}
          >
            Continue as {WANDER_OPTION.label.toLowerCase()}
            <span aria-hidden className="ml-1">
              →
            </span>
          </button>
        </div>
      </div>
    </div>
  );
}
