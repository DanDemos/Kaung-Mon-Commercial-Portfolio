"use client";

import { useRef, useState, type CSSProperties } from "react";
import {
  CUSTOM_THEME_ID,
  type ColorTheme,
} from "../lib/color-themes";
import ColorWheelPicker from "./color-wheel-picker";
import "./header-well.css";
import "./theme-circles.css";

type ThemeCirclesProps = {
  themes: ColorTheme[];
  activeId: string;
  customSeed: string;
  onChange: (id: string) => void;
  onCustomSeedChange: (hex: string) => void;
};

export default function ThemeCircles({
  themes,
  activeId,
  customSeed,
  onChange,
  onCustomSeedChange,
}: ThemeCirclesProps) {
  const customButtonRef = useRef<HTMLButtonElement>(null);
  const [wheelOpen, setWheelOpen] = useState(false);
  const customActive = activeId === CUSTOM_THEME_ID;

  function openCustomPicker() {
    if (wheelOpen) {
      setWheelOpen(false);
      return;
    }
    if (!customActive) {
      onCustomSeedChange(customSeed);
    }
    setWheelOpen(true);
  }

  return (
    <div className="relative">
      <div
        role="radiogroup"
        aria-label="Color theme"
        className="km-well flex items-center gap-1.5 rounded-full px-2 py-1.5"
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
              onClick={() => {
                setWheelOpen(false);
                onChange(theme.id);
              }}
              className={[
                "theme-circle h-6 w-6 rounded-full border",
                active
                  ? "theme-circle--active scale-110 border-[var(--color-fg)] shadow-[0_0_0_2px_var(--color-bg),0_0_0_3px_var(--color-fg),inset_0_1px_2px_rgba(0,0,0,0.22)]"
                  : "border-[color-mix(in_oklab,var(--color-fg)_28%,transparent)] shadow-[inset_0_1px_1px_rgba(0,0,0,0.18)] transition-[transform,box-shadow,border-color] duration-150 hover:scale-105 hover:border-[var(--color-fg)]",
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

        <button
          ref={customButtonRef}
          type="button"
          role="radio"
          aria-checked={customActive}
          aria-expanded={wheelOpen}
          aria-haspopup="dialog"
          aria-label="Custom color"
          title="Custom color"
          onClick={openCustomPicker}
          className={[
            "theme-circle theme-circle--custom h-6 w-6 rounded-full border",
            customActive
              ? "theme-circle--active scale-110 border-[var(--color-fg)] shadow-[0_0_0_2px_var(--color-bg),0_0_0_3px_var(--color-fg),inset_0_1px_2px_rgba(0,0,0,0.22)]"
              : "border-[color-mix(in_oklab,var(--color-fg)_28%,transparent)] shadow-[inset_0_1px_1px_rgba(0,0,0,0.18)] transition-[transform,box-shadow,border-color] duration-150 hover:scale-105 hover:border-[var(--color-fg)]",
          ].join(" ")}
          style={
            {
              backgroundColor: customActive ? customSeed : undefined,
              "--swatch": customSeed,
            } as CSSProperties
          }
        />
      </div>

      <ColorWheelPicker
        open={wheelOpen}
        value={customSeed}
        anchorRef={customButtonRef}
        onChange={onCustomSeedChange}
        onClose={() => setWheelOpen(false)}
      />
    </div>
  );
}
