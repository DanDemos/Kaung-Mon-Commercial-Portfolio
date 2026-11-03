"use client";

import {
  useEffect,
  useId,
  useRef,
  useState,
  type CSSProperties,
  type PointerEvent as ReactPointerEvent,
} from "react";
import { normalizeHex } from "../lib/color-themes";
import "./color-wheel-picker.css";

type Hsv = { h: number; s: number; v: number };

type ColorWheelPickerProps = {
  open: boolean;
  value: string;
  onChange: (hex: string) => void;
  onClose: () => void;
  anchorRef: React.RefObject<HTMLElement | null>;
};

function clamp01(n: number) {
  return Math.min(1, Math.max(0, n));
}

function hexToRgb(hex: string): [number, number, number] {
  const raw = normalizeHex(hex).slice(1);
  const n = Number.parseInt(raw, 16);
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
}

function rgbToHex(r: number, g: number, b: number) {
  return `#${[r, g, b]
    .map((c) =>
      Math.round(Math.min(255, Math.max(0, c))).toString(16).padStart(2, "0"),
    )
    .join("")}`.toUpperCase();
}

function rgbToHsv(r: number, g: number, b: number): Hsv {
  const rr = r / 255;
  const gg = g / 255;
  const bb = b / 255;
  const max = Math.max(rr, gg, bb);
  const min = Math.min(rr, gg, bb);
  const d = max - min;
  let h = 0;
  if (d !== 0) {
    switch (max) {
      case rr:
        h = ((gg - bb) / d + (gg < bb ? 6 : 0)) / 6;
        break;
      case gg:
        h = ((bb - rr) / d + 2) / 6;
        break;
      default:
        h = ((rr - gg) / d + 4) / 6;
        break;
    }
  }
  return { h: h * 360, s: max === 0 ? 0 : d / max, v: max };
}

function hsvToRgb(h: number, s: number, v: number): [number, number, number] {
  const hh = ((h % 360) + 360) % 360;
  const ss = clamp01(s);
  const vv = clamp01(v);
  const c = vv * ss;
  const x = c * (1 - Math.abs(((hh / 60) % 2) - 1));
  const m = vv - c;
  let rp = 0;
  let gp = 0;
  let bp = 0;
  if (hh < 60) [rp, gp, bp] = [c, x, 0];
  else if (hh < 120) [rp, gp, bp] = [x, c, 0];
  else if (hh < 180) [rp, gp, bp] = [0, c, x];
  else if (hh < 240) [rp, gp, bp] = [0, x, c];
  else if (hh < 300) [rp, gp, bp] = [x, 0, c];
  else [rp, gp, bp] = [c, 0, x];
  return [(rp + m) * 255, (gp + m) * 255, (bp + m) * 255];
}

function hsvToHex(hsv: Hsv) {
  const [r, g, b] = hsvToRgb(hsv.h, hsv.s, hsv.v);
  return rgbToHex(r, g, b);
}

function hexToHsv(hex: string): Hsv {
  const [r, g, b] = hexToRgb(hex);
  return rgbToHsv(r, g, b);
}

/**
 * Disc uses CSS conic-gradient from 0deg at *top*, clockwise (red → yellow → …).
 * atan2(dy, dx) with y-down is 0° at *east*, clockwise. Shift by +90 so they match.
 */
function atanToHue(atanDeg: number) {
  return (atanDeg + 90 + 360) % 360;
}

/** Place a hue on the disc (inverse of atanToHue). */
function hueToScreenRad(hue: number) {
  return ((hue - 90) * Math.PI) / 180;
}

export default function ColorWheelPicker({
  open,
  value,
  onChange,
  onClose,
  anchorRef,
}: ColorWheelPickerProps) {
  const titleId = useId();
  const panelRef = useRef<HTMLDivElement>(null);
  const discRef = useRef<HTMLDivElement>(null);
  const dragging = useRef<"disc" | "value" | null>(null);
  const hsvRef = useRef(hexToHsv(value));
  const lastSentHex = useRef(normalizeHex(value));
  const rafRef = useRef<number | null>(null);
  const pendingHex = useRef<string | null>(null);

  const [hsv, setHsv] = useState(() => hexToHsv(value));
  const [hexDraft, setHexDraft] = useState(normalizeHex(value));

  // Seed local state when the popover opens. While open, drag owns HSV —
  // do not mirror parent `value` (theme updates would fight the pointer).
  useEffect(() => {
    if (!open) return;
    const nextHex = normalizeHex(value);
    const next = hexToHsv(nextHex);
    hsvRef.current = next;
    lastSentHex.current = nextHex;
    setHsv(next);
    setHexDraft(nextHex);
    // intentionally only when `open` flips true; `value` is read at that moment
    // eslint-disable-next-line react-hooks/exhaustive-deps -- see above
  }, [open]);

  useEffect(() => {
    if (!open) return;

    function onPointerDown(event: PointerEvent) {
      const target = event.target as Node;
      if (panelRef.current?.contains(target)) return;
      if (anchorRef.current?.contains(target)) return;
      onClose();
    }

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        event.preventDefault();
        onClose();
      }
    }

    window.addEventListener("pointerdown", onPointerDown);
    window.addEventListener("keydown", onKeyDown);
    return () => {
      window.removeEventListener("pointerdown", onPointerDown);
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [open, onClose, anchorRef]);

  useEffect(() => {
    return () => {
      if (rafRef.current != null) cancelAnimationFrame(rafRef.current);
    };
  }, []);

  if (!open) return null;

  const hex = hsvToHex(hsv);
  const pureHue = hsvToHex({ h: hsv.h, s: 1, v: 1 });

  function flushParent(nextHex: string) {
    if (nextHex === lastSentHex.current) return;
    lastSentHex.current = nextHex;
    onChange(nextHex);
  }

  function scheduleParent(nextHex: string) {
    pendingHex.current = nextHex;
    if (rafRef.current != null) return;
    rafRef.current = requestAnimationFrame(() => {
      rafRef.current = null;
      const pending = pendingHex.current;
      pendingHex.current = null;
      if (pending) flushParent(pending);
    });
  }

  function commit(next: Hsv) {
    hsvRef.current = next;
    const nextHex = hsvToHex(next);
    setHsv(next);
    setHexDraft(nextHex);
    scheduleParent(nextHex);
  }

  function readDisc(clientX: number, clientY: number) {
    const el = discRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    const dx = clientX - cx;
    const dy = clientY - cy;
    const radius = rect.width / 2;
    const dist = Math.min(Math.hypot(dx, dy), radius);
    const atan = (Math.atan2(dy, dx) * 180) / Math.PI;
    const h = atanToHue(atan);
    const s = dist / radius;
    commit({ h, s, v: hsvRef.current.v });
  }

  function endDrag(event: ReactPointerEvent<HTMLElement>) {
    if (!dragging.current) return;
    dragging.current = null;
    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId);
    }
    // Ensure parent gets the final hex even if rAF was skipped.
    flushParent(hsvToHex(hsvRef.current));
  }

  function onDiscPointerDown(event: ReactPointerEvent<HTMLDivElement>) {
    event.preventDefault();
    dragging.current = "disc";
    event.currentTarget.setPointerCapture(event.pointerId);
    readDisc(event.clientX, event.clientY);
  }

  function onDiscPointerMove(event: ReactPointerEvent<HTMLDivElement>) {
    if (dragging.current !== "disc") return;
    readDisc(event.clientX, event.clientY);
  }

  function onValuePointer(event: ReactPointerEvent<HTMLDivElement>) {
    const rect = event.currentTarget.getBoundingClientRect();
    const t = clamp01(1 - (event.clientY - rect.top) / rect.height);
    commit({ ...hsvRef.current, v: t });
  }

  function onValuePointerDown(event: ReactPointerEvent<HTMLDivElement>) {
    event.preventDefault();
    dragging.current = "value";
    event.currentTarget.setPointerCapture(event.pointerId);
    onValuePointer(event);
  }

  function onValuePointerMove(event: ReactPointerEvent<HTMLDivElement>) {
    if (dragging.current !== "value") return;
    onValuePointer(event);
  }

  const markerRad = hueToScreenRad(hsv.h);
  const markerRadius = hsv.s * 50;

  return (
    <div
      ref={panelRef}
      role="dialog"
      aria-modal="false"
      aria-labelledby={titleId}
      className="color-wheel-picker"
    >
      <p id={titleId} className="color-wheel-picker__label">
        Custom seed
      </p>

      <div className="color-wheel-picker__body">
        <div
          ref={discRef}
          className="color-wheel-picker__disc"
          style={{ "--wheel-v": String(hsv.v) } as CSSProperties}
          onPointerDown={onDiscPointerDown}
          onPointerMove={onDiscPointerMove}
          onPointerUp={endDrag}
          onPointerCancel={endDrag}
          role="slider"
          aria-label="Hue and saturation"
          aria-valuetext={`${Math.round(hsv.h)}°, ${Math.round(hsv.s * 100)}%`}
          tabIndex={0}
        >
          <span
            className="color-wheel-picker__marker"
            style={{
              left: `calc(50% + ${markerRadius * Math.cos(markerRad)}%)`,
              top: `calc(50% + ${markerRadius * Math.sin(markerRad)}%)`,
              backgroundColor: hex,
            }}
          />
        </div>

        <div
          className="color-wheel-picker__value"
          style={{
            background: `linear-gradient(to bottom, ${pureHue}, #000000)`,
          }}
          onPointerDown={onValuePointerDown}
          onPointerMove={onValuePointerMove}
          onPointerUp={endDrag}
          onPointerCancel={endDrag}
          role="slider"
          aria-label="Brightness"
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={Math.round(hsv.v * 100)}
          tabIndex={0}
        >
          <span
            className="color-wheel-picker__value-thumb"
            style={{ top: `${(1 - hsv.v) * 100}%` }}
          />
        </div>
      </div>

      <div className="color-wheel-picker__meta">
        <span
          className="color-wheel-picker__swatch"
          style={{ backgroundColor: hex }}
          aria-hidden
        />
        <label className="color-wheel-picker__hex">
          <span className="sr-only">Hex color</span>
          <input
            value={hexDraft}
            spellCheck={false}
            autoCapitalize="characters"
            onChange={(event) => {
              const raw = event.target.value;
              setHexDraft(raw.startsWith("#") ? raw : `#${raw}`);
            }}
            onBlur={() => {
              const next = normalizeHex(hexDraft);
              const nextHsv = hexToHsv(next);
              hsvRef.current = nextHsv;
              setHexDraft(next);
              setHsv(nextHsv);
              flushParent(next);
            }}
            onKeyDown={(event) => {
              if (event.key === "Enter") {
                (event.target as HTMLInputElement).blur();
              }
            }}
          />
        </label>
      </div>
    </div>
  );
}
