"use client";

import dynamic from "next/dynamic";
import {
  useRef,
  useState,
  type CSSProperties,
  type FocusEvent,
  type KeyboardEvent,
  type PointerEvent,
} from "react";
import {
  CUSTOM_THEME_ID,
  type ColorTheme,
} from "../lib/color-themes";
import "./header-well.css";
import "./theme-circles.css";

const ColorWheelPicker = dynamic(() => import("./color-wheel-picker"), {
  ssr: false,
});

type ThemeCirclesProps = {
  themes: ColorTheme[];
  activeId: string;
  customSeed: string;
  onChange: (id: string) => void;
  onCustomSeedChange: (hex: string) => void;
};

type TipState = {
  label: string;
  x: number;
};

export default function ThemeCircles({
  themes,
  activeId,
  customSeed,
  onChange,
  onCustomSeedChange,
}: ThemeCirclesProps) {
  const customButtonRef = useRef<HTMLButtonElement>(null);
  const shellRef = useRef<HTMLDivElement>(null);
  const [wheelOpen, setWheelOpen] = useState(false);
  const [tip, setTip] = useState<TipState | null>(null);
  const customActive = activeId === CUSTOM_THEME_ID;

  function hideTip() {
    setTip(null);
  }

  function showTipFor(label: string, button: HTMLElement) {
    const shell = shellRef.current;
    if (!shell) return;
    const shellRect = shell.getBoundingClientRect();
    const btnRect = button.getBoundingClientRect();
    const raw = btnRect.left + btnRect.width / 2 - shellRect.left;
    const x = Math.min(Math.max(raw, 14), shellRect.width - 14);
    setTip({ label, x });
  }

  function onCirclePointerEnter(
    event: PointerEvent<HTMLButtonElement>,
    label: string,
  ) {
    if (event.pointerType === "touch") return;
    showTipFor(label, event.currentTarget);
  }

  function onCircleFocus(event: FocusEvent<HTMLButtonElement>, label: string) {
    showTipFor(label, event.currentTarget);
  }

  function onShellPointerLeave() {
    hideTip();
  }

  function onShellBlur(event: FocusEvent<HTMLDivElement>) {
    if (!event.currentTarget.contains(event.relatedTarget as Node | null)) {
      hideTip();
    }
  }

  function openCustomPicker() {
    if (wheelOpen) {
      setWheelOpen(false);
      return;
    }
    if (!customActive) {
      onCustomSeedChange(customSeed);
    }
    hideTip();
    setWheelOpen(true);
  }

  return (
    <div
      ref={shellRef}
      className="theme-circles"
      onPointerLeave={onShellPointerLeave}
      onBlur={onShellBlur}
    >
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
              onPointerEnter={(event) =>
                onCirclePointerEnter(event, theme.label)
              }
              onFocus={(event) => onCircleFocus(event, theme.label)}
              onClick={() => {
                setWheelOpen(false);
                onChange(theme.id);
              }}
              onKeyDown={(event: KeyboardEvent<HTMLButtonElement>) => {
                if (event.key === "Escape") hideTip();
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
          onPointerEnter={(event) =>
            onCirclePointerEnter(event, "Custom color")
          }
          onFocus={(event) => onCircleFocus(event, "Custom color")}
          onClick={openCustomPicker}
          onKeyDown={(event: KeyboardEvent<HTMLButtonElement>) => {
            if (event.key === "Escape") hideTip();
          }}
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

      {tip ? (
        <p
          className="theme-circles__tip"
          role="tooltip"
          style={{ left: tip.x }}
        >
          {tip.label}
        </p>
      ) : null}

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
