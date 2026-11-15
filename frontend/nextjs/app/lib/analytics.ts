/**
 * Preference + intent telemetry → admin backend.
 * Distinguishes first lens choice vs later switches, dwell, and key pages.
 * No-ops when NEXT_PUBLIC_ANALYTICS_URL is unset.
 */

import { MODE_STORAGE_KEY, THEME_STORAGE_KEY } from "./color-themes";
import { LOCALE_STORAGE_KEY, LOCALE_CHANGE_EVENT } from "./locale";
import {
  CHOOSER_SEEN_KEY,
  PATH_CHANGE_EVENT,
  PATH_STORAGE_KEY,
} from "./visitor-paths";

export const VISITOR_ID_KEY = "km-visitor-id";
const SESSION_ID_KEY = "km-analytics-session-id";
const FIRST_PATH_SENT_KEY = "km-analytics-first-path-sent";

export type AnalyticsEventType =
  | "session_start"
  | "path_first"
  | "path_switch"
  | "path" // legacy alias accepted by backend
  | "theme"
  | "mode"
  | "locale"
  | "chooser_seen"
  | "page_view"
  | "heartbeat";

type Snapshot = {
  path?: string | null;
  theme?: string | null;
  mode?: string | null;
  locale?: string | null;
};

type Meta = Record<string, string | number | boolean | null | undefined>;

function endpoint(): string | null {
  const base = process.env.NEXT_PUBLIC_ANALYTICS_URL?.trim();
  if (!base) return null;
  return `${base.replace(/\/$/, "")}/v1/events`;
}

function ingestKey(): string | undefined {
  return process.env.NEXT_PUBLIC_ANALYTICS_KEY?.trim() || undefined;
}

function read(key: string): string | null {
  try {
    return window.localStorage.getItem(key);
  } catch {
    return null;
  }
}

function write(key: string, value: string) {
  try {
    window.localStorage.setItem(key, value);
  } catch {
    /* private mode */
  }
}

export function getOrCreateVisitorId(): string {
  try {
    const existing = window.localStorage.getItem(VISITOR_ID_KEY);
    if (existing) return existing;
    const id =
      typeof crypto !== "undefined" && "randomUUID" in crypto
        ? crypto.randomUUID()
        : `v_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 10)}`;
    window.localStorage.setItem(VISITOR_ID_KEY, id);
    return id;
  } catch {
    return `ephemeral_${Date.now()}`;
  }
}

function getOrCreateSessionId(): string {
  try {
    const existing = sessionStorage.getItem(SESSION_ID_KEY);
    if (existing) return existing;
    const id =
      typeof crypto !== "undefined" && "randomUUID" in crypto
        ? crypto.randomUUID()
        : `s_${Date.now().toString(36)}`;
    sessionStorage.setItem(SESSION_ID_KEY, id);
    return id;
  } catch {
    return `s_${Date.now()}`;
  }
}

function currentSnapshot(): Snapshot {
  return {
    path: read(PATH_STORAGE_KEY),
    theme: read(THEME_STORAGE_KEY),
    mode: read(MODE_STORAGE_KEY),
    locale: read(LOCALE_STORAGE_KEY),
  };
}

export function trackAnalytics(
  type: AnalyticsEventType,
  partial: Snapshot = {},
  meta: Meta = {},
): void {
  if (typeof window === "undefined") return;
  const url = endpoint();
  if (!url) return;

  const snap = { ...currentSnapshot(), ...partial };
  const body = JSON.stringify({
    visitorId: getOrCreateVisitorId(),
    type,
    path: snap.path || undefined,
    theme: snap.theme || undefined,
    mode: snap.mode || undefined,
    locale: snap.locale || undefined,
    page: `${window.location.pathname}${window.location.search}`,
    meta: {
      sessionId: getOrCreateSessionId(),
      ...meta,
    },
  });

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };
  const key = ingestKey();
  if (key) headers["X-KM-Key"] = key;

  try {
    if (navigator.sendBeacon && !key) {
      const blob = new Blob([body], { type: "application/json" });
      if (navigator.sendBeacon(url, blob)) return;
    }
    void fetch(url, {
      method: "POST",
      headers,
      body,
      keepalive: true,
      mode: "cors",
    }).catch(() => {
      /* swallow */
    });
  } catch {
    /* private mode / offline */
  }
}

function trackPathChange() {
  const path = read(PATH_STORAGE_KEY);
  if (!path) return;
  const alreadyFirst = read(FIRST_PATH_SENT_KEY) === "1";
  if (!alreadyFirst) {
    write(FIRST_PATH_SENT_KEY, "1");
    trackAnalytics("path_first", { path }, { source: "lens_or_chooser" });
    return;
  }
  trackAnalytics("path_switch", { path }, { source: "lens" });
}

/**
 * Mount once. Call with current pathname from the App Router when available.
 */
export function startAnalyticsListeners(pathname?: string): () => void {
  if (typeof window === "undefined") return () => {};

  // Create visitor id before measuring "returning".
  const before = (() => {
    try {
      return Boolean(window.localStorage.getItem(VISITOR_ID_KEY));
    } catch {
      return false;
    }
  })();
  getOrCreateVisitorId();
  trackAnalytics(
    "session_start",
    {},
    { returning: before, landing: pathname || window.location.pathname },
  );

  if (pathname) {
    trackAnalytics("page_view", {}, { route: pathname });
  }

  const onPath = () => trackPathChange();
  const onLocale = () => trackAnalytics("locale");

  window.addEventListener(PATH_CHANGE_EVENT, onPath);
  window.addEventListener(LOCALE_CHANGE_EVENT, onLocale);

  const onStorage = (ev: StorageEvent) => {
    if (!ev.key) return;
    if (ev.key === PATH_STORAGE_KEY) trackPathChange();
    else if (ev.key === THEME_STORAGE_KEY) trackAnalytics("theme");
    else if (ev.key === MODE_STORAGE_KEY) trackAnalytics("mode");
    else if (ev.key === LOCALE_STORAGE_KEY) trackAnalytics("locale");
    else if (ev.key === CHOOSER_SEEN_KEY && ev.newValue) {
      trackAnalytics("chooser_seen");
    }
  };
  window.addEventListener("storage", onStorage);

  let lastTheme = read(THEME_STORAGE_KEY);
  let lastMode = read(MODE_STORAGE_KEY);
  let lastChooser = read(CHOOSER_SEEN_KEY);
  let lastPathname = window.location.pathname;

  const poll = window.setInterval(() => {
    const theme = read(THEME_STORAGE_KEY);
    const mode = read(MODE_STORAGE_KEY);
    const chooser = read(CHOOSER_SEEN_KEY);
    if (theme && theme !== lastTheme) {
      lastTheme = theme;
      trackAnalytics("theme", { theme });
    }
    if (mode && mode !== lastMode) {
      lastMode = mode;
      trackAnalytics("mode", { mode });
    }
    if (chooser && chooser !== lastChooser) {
      lastChooser = chooser;
      trackAnalytics("chooser_seen");
    }
    if (window.location.pathname !== lastPathname) {
      lastPathname = window.location.pathname;
      trackAnalytics("page_view", {}, { route: lastPathname });
    }
  }, 2000);

  // Active time on the current lens (only while the tab is visible).
  const heartbeat = window.setInterval(() => {
    if (document.visibilityState !== "visible") return;
    trackAnalytics("heartbeat", {}, { seconds: 60 });
  }, 60_000);

  return () => {
    window.removeEventListener(PATH_CHANGE_EVENT, onPath);
    window.removeEventListener(LOCALE_CHANGE_EVENT, onLocale);
    window.removeEventListener("storage", onStorage);
    window.clearInterval(poll);
    window.clearInterval(heartbeat);
  };
}
