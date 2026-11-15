"use client";

import {
  createContext,
  useCallback,
  useContext,
  useLayoutEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import {
  DEFAULT_LOCALE,
  applyDocumentLocale,
  persistLocale,
  readStoredLocale,
  type Locale,
} from "../lib/locale";
import { messagesFor, type Messages } from "../lib/messages";

type LocaleContextValue = {
  locale: Locale;
  ready: boolean;
  messages: Messages;
  setLocale: (locale: Locale) => void;
  toggleLocale: () => void;
};

const LocaleContext = createContext<LocaleContextValue | null>(null);

export function LocaleProvider({ children }: { children: ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>(DEFAULT_LOCALE);
  const [ready, setReady] = useState(false);

  useLayoutEffect(() => {
    const stored = readStoredLocale();
    setLocaleState(stored);
    applyDocumentLocale(stored);
    setReady(true);
  }, []);

  const setLocale = useCallback((next: Locale) => {
    setLocaleState(next);
    persistLocale(next);
  }, []);

  const toggleLocale = useCallback(() => {
    setLocaleState((prev) => {
      const next: Locale = prev === "en" ? "my" : "en";
      persistLocale(next);
      return next;
    });
  }, []);

  const value = useMemo<LocaleContextValue>(
    () => ({
      locale,
      ready,
      messages: messagesFor(locale),
      setLocale,
      toggleLocale,
    }),
    [locale, ready, setLocale, toggleLocale],
  );

  return (
    <LocaleContext.Provider value={value}>{children}</LocaleContext.Provider>
  );
}

export function useLocale(): LocaleContextValue {
  const ctx = useContext(LocaleContext);
  if (!ctx) {
    throw new Error("useLocale must be used within LocaleProvider");
  }
  return ctx;
}
