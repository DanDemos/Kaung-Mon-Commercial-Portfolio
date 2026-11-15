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
 * Stays mounted through a leave animation so dismiss isn't a hard cut.
 */
export default function SiteAlert({
  open,
  message,
  onClose,
  dismissMs = 6000,
}: SiteAlertProps) {
  const [mounted, setMounted] = useState(false);
  const [visible, setVisible] = useState(false);
  const [leaving, setLeaving] = useState(false);
  const [shownMessage, setShownMessage] = useState("");

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (open && message) {
      setShownMessage(message);
      setLeaving(false);
      setVisible(true);
      return;
    }
    if (visible) setLeaving(true);
  }, [open, message, visible]);

  useEffect(() => {
    if (!open || dismissMs <= 0) return;
    const timer = window.setTimeout(onClose, dismissMs);
    return () => window.clearTimeout(timer);
  }, [open, message, dismissMs, onClose]);

  function finishLeave() {
    if (!leaving) return;
    setVisible(false);
    setLeaving(false);
    setShownMessage("");
  }

  if (!mounted || !visible || !shownMessage) return null;

  return createPortal(
    <div
      className={[
        "km-site-alert",
        leaving ? "km-site-alert--leave" : "km-site-alert--enter",
      ].join(" ")}
      role="alert"
      aria-live="assertive"
      aria-hidden={leaving || undefined}
      onAnimationEnd={finishLeave}
    >
      <p className="km-site-alert__message">{shownMessage}</p>
      <button
        type="button"
        className="km-site-alert__close"
        aria-label="Dismiss"
        disabled={leaving}
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
