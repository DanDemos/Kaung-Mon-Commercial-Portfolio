"use client";

import { useEffect, useState } from "react";

function whenIdle(task: () => void) {
  const ric = window.requestIdleCallback?.bind(window);
  if (ric) {
    // Prefer a settled shell; media is allowed to start later.
    return ric(() => task(), { timeout: 1800 });
  }
  return window.setTimeout(task, 500);
}

/**
 * Opens after the first paint so HTML/CSS/JS can settle before heavy media bytes.
 * `priority` skips the idle wait (header logo only).
 */
export function useMediaGate(options?: { priority?: boolean }) {
  const priority = options?.priority ?? false;
  const [open, setOpen] = useState(false);

  useEffect(() => {
    let idleHandle: number | null = null;
    let cancelled = false;

    const frame = window.requestAnimationFrame(() => {
      if (cancelled) return;
      if (priority) {
        setOpen(true);
        return;
      }
      idleHandle = whenIdle(() => {
        if (!cancelled) setOpen(true);
      }) as number;
    });

    return () => {
      cancelled = true;
      window.cancelAnimationFrame(frame);
      if (idleHandle != null) {
        window.cancelIdleCallback?.(idleHandle);
        window.clearTimeout(idleHandle);
      }
    };
  }, [priority]);

  return open;
}
