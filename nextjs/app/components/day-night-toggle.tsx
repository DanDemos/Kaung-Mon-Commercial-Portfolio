"use client";

import type { ColorMode } from "../lib/color-themes";
import "./day-night-toggle.css";

type DayNightToggleProps = {
  mode: ColorMode;
  onChange: (mode: ColorMode) => void;
};

/**
 * Compact Day/Night switch adapted from Day-Night-Toggle-Switch
 * (checkbox + label, sun/moon, clouds/stars). Visual scale ~30%.
 */
export default function DayNightToggle({ mode, onChange }: DayNightToggleProps) {
  const isNight = mode === "dark";
  const inputId = "km-day-night";

  return (
    <div className="day-night-switch">
      <input
        id={inputId}
        className="day-night-switch__input"
        type="checkbox"
        checked={isNight}
        onChange={(event) => onChange(event.target.checked ? "dark" : "light")}
        aria-label={isNight ? "Switch to light mode" : "Switch to dark mode"}
      />
      <label className="day-night-switch__track" htmlFor={inputId}>
        <i className="day-night-switch__sun" aria-hidden>
          <i className="day-night-switch__moon">
            <span className="day-night-switch__crater day-night-switch__crater--1" />
            <span className="day-night-switch__crater day-night-switch__crater--2" />
            <span className="day-night-switch__crater day-night-switch__crater--3" />
          </i>
        </i>

        <span className="day-night-switch__cloud" aria-hidden>
          <span className="day-night-switch__blob day-night-switch__blob--c1" />
          <span className="day-night-switch__blob day-night-switch__blob--c2" />
          <span className="day-night-switch__blob day-night-switch__blob--c3" />
          <span className="day-night-switch__blob day-night-switch__blob--c4" />
          <span className="day-night-switch__blob day-night-switch__blob--c5" />
        </span>

        <span className="day-night-switch__cloud-shadow" aria-hidden>
          <span className="day-night-switch__blob day-night-switch__blob--s1" />
          <span className="day-night-switch__blob day-night-switch__blob--s2" />
          <span className="day-night-switch__blob day-night-switch__blob--s3" />
          <span className="day-night-switch__blob day-night-switch__blob--s4" />
          <span className="day-night-switch__blob day-night-switch__blob--s5" />
          <span className="day-night-switch__blob day-night-switch__blob--s6" />
          <span className="day-night-switch__blob day-night-switch__blob--s7" />
        </span>

        <span className="day-night-switch__stars" aria-hidden>
          {Array.from({ length: 11 }, (_, index) => (
            <span
              key={index}
              className={`day-night-switch__star day-night-switch__star--${index + 1}`}
            />
          ))}
        </span>
      </label>
    </div>
  );
}
