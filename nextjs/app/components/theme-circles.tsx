"use client";

import type { CSSProperties } from "react";
import type { ColorTheme } from "../lib/color-themes";
import "./theme-circles.css";

type ThemeCirclesProps = {
  themes: ColorTheme[];
  activeId: string;
  onChange: (id: string) => void;
};

export default function ThemeCircles({
  themes,
  activeId,
  onChange,
}: ThemeCirclesProps) {
  return (
    <div
      role="radiogroup"
      aria-label="Color theme"
      className="flex items-center gap-1.5 rounded-full border border-[var(--color-line)] bg-[color-mix(in_oklab,var(--color-bg-elevated)_88%,transparent)] px-2 py-1.5"
    >
      {themes.map((theme) => {
        const active = theme.id === activeId;
        return (
          <button
            key={theme.id}
            type="button"
            role="radio"
            aria-checked={active}
            aria-label={theme.label}
            title={theme.label}
            onClick={() => onChange(theme.id)}
            className={[
              "theme-circle h-6 w-6 rounded-full border",
              active
                ? "theme-circle--active scale-110 border-[var(--color-fg)] shadow-[0_0_0_2px_var(--color-bg),0_0_0_3px_var(--color-fg)]"
                : "border-[color-mix(in_oklab,var(--color-fg)_28%,transparent)] transition-[transform,box-shadow,border-color] duration-150 hover:scale-105 hover:border-[var(--color-fg)]",
            ].join(" ")}
            style={
              {
                backgroundColor: theme.swatch,
                "--swatch": theme.swatch,
              } as CSSProperties
            }
          />
        );
      })}
    </div>
  );
}
