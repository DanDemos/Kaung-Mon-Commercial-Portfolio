"use client";

import "./header-well.css";

type PathLensControlProps = {
  label: string;
  ready: boolean;
  open: boolean;
  onOpen: () => void;
};

/**
 * Compact header control for the visitor path.
 * Recessed well chrome (shared with ThemeCircles) — curved-in, not raised.
 */
export default function PathLensControl({
  label,
  ready,
  open,
  onOpen,
}: PathLensControlProps) {
  if (!ready) {
    return (
      <span
        className="km-path-lens km-well inline-flex items-center rounded-full px-3 py-1.5 text-[0.8rem] leading-none text-[var(--color-fg-muted)]"
        aria-hidden
      >
        ···
      </span>
    );
  }

  return (
    <button
      type="button"
      onClick={onOpen}
      aria-haspopup="dialog"
      aria-expanded={open}
      aria-label={`Lens: ${label}. Change`}
      title="Change lens"
      className="km-path-lens km-well group inline-flex items-center gap-2.5 rounded-full px-3 py-1.5 text-left"
    >
      <span className="km-path-lens__copy min-w-0">
        <span className="km-path-lens__eyebrow block text-[0.62rem] font-medium uppercase leading-none tracking-[0.12em] text-[var(--color-fg-muted)]">
          Lens
        </span>
        <span className="km-lens-path mt-[3px] inline-block max-w-full truncate text-[0.8rem] font-semibold leading-none tracking-[-0.02em]">
          {label}
        </span>
      </span>
      <span
        aria-hidden
        className={[
          "km-well__slot flex h-6 w-6 shrink-0 items-center justify-center rounded-full",
          "text-[var(--color-fg-muted)] group-hover:text-[var(--color-fg)]",
          open ? "text-[var(--color-fg)]" : "",
        ].join(" ")}
      >
        <svg width="11" height="11" viewBox="0 0 12 12" fill="none">
          <path
            d="M3.5 2.25V8.25M3.5 8.25L1.75 6.5M3.5 8.25L5.25 6.5"
            stroke="currentColor"
            strokeWidth="1.35"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M8.5 9.75V3.75M8.5 3.75L6.75 5.5M8.5 3.75L10.25 5.5"
            stroke="currentColor"
            strokeWidth="1.35"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </span>
    </button>
  );
}
