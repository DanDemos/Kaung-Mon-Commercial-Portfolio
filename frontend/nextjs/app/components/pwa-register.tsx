"use client";

import { useEffect } from "react";

/**
 * Registers `/sw.js` so Chromium can offer install.
 * SW is network-first (no shell cache), so HMR stays usable in dev.
 */
export default function PwaRegister() {
  useEffect(() => {
    if (!("serviceWorker" in navigator)) return;

    const register = () => {
      navigator.serviceWorker.register("/sw.js").catch(() => {
        /* Install is best-effort. */
      });
    };

    if (document.readyState === "complete") register();
    else window.addEventListener("load", register, { once: true });
  }, []);

  return null;
}
