"use client";

import type { Locale } from "../lib/locale";
import { useLocale } from "./locale-provider";
import "./header-well.css";
import "./locale-toggle.css";

/**
 * Compact EN | မြ segmented control — lives in the preferences cluster,
 * not as a fifth peer header button.
 */
export default function LocaleToggle() {
  const { locale, setLocale, messages, ready } = useLocale();

  if (!ready) {
    return (
      <span className="km-locale-toggle km-well" aria-hidden>
        <span className="km-locale-toggle__opt">··</span>
      </span>
    );
  }

  function select(next: Locale) {
    if (next !== locale) setLocale(next);
  }

  return (
    <div
      className="km-locale-toggle km-well"
      role="group"
      aria-label={messages.locale.groupAria}
    >
      <button
        type="button"
        className={[
          "km-locale-toggle__opt",
          locale === "en" ? "km-locale-toggle__opt--active" : "",
        ].join(" ")}
        aria-pressed={locale === "en"}
        aria-label={messages.locale.switchToEn}
        onClick={() => select("en")}
      >
        {messages.locale.en}
      </button>
      <button
        type="button"
        className={[
          "km-locale-toggle__opt",
          locale === "my" ? "km-locale-toggle__opt--active" : "",
        ].join(" ")}
        aria-pressed={locale === "my"}
        aria-label={messages.locale.switchToMy}
        onClick={() => select("my")}
      >
        {messages.locale.my}
      </button>
    </div>
  );
}
