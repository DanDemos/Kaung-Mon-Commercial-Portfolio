/** Compact day/night control — icons are local SVG, not from frontend/. */

export default function ThemeToggle({ mode, onToggle }) {
  const isDark = mode === "dark";
  const label = isDark ? "Switch to light mode" : "Switch to dark mode";

  return (
    <button
      type="button"
      className="theme-toggle"
      onClick={onToggle}
      aria-label={label}
      title={label}
    >
      <span className="theme-toggle__track" data-mode={mode} aria-hidden>
        <span className="theme-toggle__thumb">
          {isDark ? (
            <svg viewBox="0 0 24 24" width="14" height="14" fill="none">
              <path
                d="M21 14.3A8.5 8.5 0 0 1 9.7 3 7 7 0 1 0 21 14.3Z"
                fill="currentColor"
              />
            </svg>
          ) : (
            <svg viewBox="0 0 24 24" width="14" height="14" fill="none">
              <circle cx="12" cy="12" r="4" fill="currentColor" />
              <path
                d="M12 2v2.5M12 19.5V22M4.2 4.2l1.8 1.8M18 18l1.8 1.8M2 12h2.5M19.5 12H22M4.2 19.8 6 18M18 6l1.8-1.8"
                stroke="currentColor"
                strokeWidth="1.6"
                strokeLinecap="round"
              />
            </svg>
          )}
        </span>
      </span>
    </button>
  );
}
