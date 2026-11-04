"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import "./site-alert.css";

type SiteAlertProps = {
  open: boolean;
  message: string;
  onClose: () => void;
  /** Auto-dismiss after ms; 0 = stay until closed. */
  dismissMs?: number;
};

/**
 * Fixed top-center page alert — form / network errors, not field captions.
 */
export default function SiteAlert({
  open,
  message,
  onClose,
  dismissMs = 6000,
}: SiteAlertProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!open || dismissMs <= 0) return;
    const timer = window.setTimeout(onClose, dismissMs);
    return () => window.clearTimeout(timer);
  }, [open, message, dismissMs, onClose]);

  if (!mounted || !open || !message) return null;

  return createPortal(
    <div className="km-site-alert" role="alert" aria-live="assertive">
      <p className="km-site-alert__message">{message}</p>
      <button
        type="button"
        className="km-site-alert__close"
        aria-label="Dismiss"
        onClick={onClose}
      >
        <svg width="12" height="12" viewBox="0 0 14 14" fill="none" aria-hidden>
          <path
            d="M3 3l8 8M11 3L3 11"
            stroke="currentColor"
            strokeWidth="1.6"
            strokeLinecap="round"
          />
        </svg>
      </button>
    </div>,
    document.body,
  );
}
