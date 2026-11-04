"use client";

import { useEffect, useState } from "react";

function whenIdle(task: () => void) {
  const ric = window.requestIdleCallback?.bind(window);
  if (ric) {
    return ric(() => task(), { timeout: 2500 });
  }
  return window.setTimeout(task, 400);
}

/**
 * Opens after JS has painted once.
 * `priority` skips the idle wait (logo); otherwise media waits for idle
 * so HTML/CSS/JS settle before image/video bytes start.
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
