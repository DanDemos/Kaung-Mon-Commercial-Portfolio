export type Locale = "en" | "my";

export const LOCALE_STORAGE_KEY = "km-locale";
export const LOCALE_CHANGE_EVENT = "km-locale-change";
export const DEFAULT_LOCALE: Locale = "en";

export function isLocale(value: string | null | undefined): value is Locale {
  return value === "en" || value === "my";
}

export function readStoredLocale(): Locale {
  if (typeof window === "undefined") return DEFAULT_LOCALE;
  try {
    const raw = window.localStorage.getItem(LOCALE_STORAGE_KEY);
    if (isLocale(raw)) return raw;
  } catch {
    /* private mode */
  }
  return DEFAULT_LOCALE;
}

export function applyDocumentLocale(locale: Locale) {
  if (typeof document === "undefined") return;
  document.documentElement.lang = locale;
  document.documentElement.dataset.locale = locale;
}

export function notifyLocaleChange() {
  if (typeof window === "undefined") return;
  window.dispatchEvent(new Event(LOCALE_CHANGE_EVENT));
}

export function persistLocale(locale: Locale) {
  try {
    window.localStorage.setItem(LOCALE_STORAGE_KEY, locale);
  } catch {
    /* private mode */
  }
  applyDocumentLocale(locale);
  notifyLocaleChange();
}
