"use client";

import { useEffect, useId, useRef } from "react";
import { PATH_OPTIONS, type VisitorPath } from "../lib/visitor-paths";

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
        <div className="flex items-start justify-between gap-4">
          <p className="text-[0.75rem] font-medium uppercase tracking-[0.16em] text-[var(--color-fg-muted)]">
            Optional
          </p>
          <button
            ref={closeRef}
            type="button"
            aria-label="Close"
            onClick={onDismiss}
            className="-mr-2 -mt-1 rounded-md px-2 py-1 text-[0.9rem] text-[var(--color-fg-muted)] transition-colors hover:bg-[color-mix(in_oklab,var(--color-fg)_6%,transparent)] hover:text-[var(--color-fg)]"
          >
            Close
          </button>
        </div>
        <h2
          id={titleId}
          className="mt-3 text-[1.55rem] font-semibold tracking-[-0.035em] text-[var(--color-fg)]"
        >
          Who are you here as?
        </h2>
        <p
          id={descriptionId}
          className="mt-2 text-[0.98rem] leading-relaxed text-[var(--color-fg-muted)]"
        >
          Wonderer is the default. Pick any of the four. You can change later from
          Lens.
        </p>

        <div
          role="group"
          aria-label="Visitor type"
          className="mt-7 flex flex-col"
        >
          {PATH_OPTIONS.map((option) => {
            const active = currentPath === option.id;
            return (
              <button
                key={option.id}
                type="button"
                aria-pressed={active}
                onClick={() => onChoose(option.id)}
                className={[
                  "-mx-3 flex items-baseline justify-between gap-4 border-t border-[var(--color-line)] px-3 py-3.5 text-left transition-[background-color,color] duration-150 last:border-b",
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
      </div>
    </div>
  );
}
