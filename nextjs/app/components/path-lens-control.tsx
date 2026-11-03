"use client";

type PathLensControlProps = {
  label: string;
  ready: boolean;
  open: boolean;
  onOpen: () => void;
};

/**
 * Compact header control for the visitor path.
 * Same pill chrome as ThemeCircles — single-line label + chevron.
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
        className="inline-flex items-center rounded-full border border-[var(--color-line)] bg-[color-mix(in_oklab,var(--color-bg-elevated)_88%,transparent)] px-2.5 py-1.5 text-[0.8rem] leading-none text-[var(--color-fg-muted)]"
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
      className={[
        "group inline-flex items-center gap-1 rounded-full border border-[var(--color-line)]",
        "bg-[color-mix(in_oklab,var(--color-bg-elevated)_88%,transparent)] px-2.5 py-1.5",
        "text-[0.8rem] leading-none transition-[border-color,background-color,color] duration-150",
        "hover:border-[color-mix(in_oklab,var(--color-fg)_40%,transparent)] hover:bg-[var(--color-bg-elevated)]",
        open
          ? "border-[color-mix(in_oklab,var(--color-fg)_40%,transparent)] bg-[var(--color-bg-elevated)]"
          : "",
      ].join(" ")}
    >
      <span className="font-medium tracking-[-0.02em] text-[var(--color-fg)]">
        {label}
      </span>
      <svg
        aria-hidden
        width="10"
        height="10"
        viewBox="0 0 10 10"
        className={[
          "shrink-0 text-[var(--color-fg-muted)] transition-[transform,color] duration-200",
          "group-hover:text-[var(--color-fg)]",
          open ? "translate-y-px rotate-180 text-[var(--color-fg)]" : "",
        ].join(" ")}
        fill="none"
      >
        <path
          d="M2.25 3.75L5 6.5L7.75 3.75"
          stroke="currentColor"
          strokeWidth="1.4"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </button>
  );
}
