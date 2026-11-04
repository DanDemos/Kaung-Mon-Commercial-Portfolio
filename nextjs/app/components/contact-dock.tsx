"use client";

import {
  useCallback,
  useEffect,
  useId,
  useRef,
  useState,
  type FormEvent,
  type ReactNode,
} from "react";
import {
  CONTACT_FIELD_LIMITS,
  type ContactFieldErrors,
} from "../lib/contact";
import {
  CONTACT_ADDRESS,
  CONTACT_EMAIL,
  CONTACT_MAILTO,
  CONTACT_PHONE,
  CONTACT_PHONE_TEL,
  SOCIAL_LINKS,
} from "../lib/visitor-paths";
import Btn from "./btn";
import SectionTitle from "./section-title";
import SiteAlert from "./site-alert";
import TextLink from "./text-link";
import "./contact-dock.css";

function alertMessageFromFields(
  fields: ContactFieldErrors,
  fallback: string,
): string {
  const parts = (
    ["name", "email", "subject", "message", "phone", "form"] as const
  )
    .map((key) => fields[key])
    .filter((msg): msg is string => Boolean(msg));
  return parts.length > 0 ? parts.join(" ") : fallback;
}

type ContactDockProps = {
  /** Quiet line under “Contact Me”. */
  support?: string;
};

type Status =
  | { kind: "idle" }
  | { kind: "sending" }
  | { kind: "sent" }
  | { kind: "error"; message: string };

const TURNSTILE_SITE_KEY =
  process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY?.trim() || "";

declare global {
  interface Window {
    turnstile?: {
      render: (
        el: HTMLElement,
        options: {
          sitekey: string;
          callback: (token: string) => void;
          "expired-callback"?: () => void;
          "error-callback"?: () => void;
          theme?: "auto" | "light" | "dark";
          size?: "normal" | "compact" | "flexible";
        },
      ) => string;
      remove: (widgetId: string) => void;
      reset: (widgetId: string) => void;
    };
  }
}

/**
 * Contact page body — Portfilio-style info cards + full-width form.
 */
export default function ContactDock({ support }: ContactDockProps) {
  const formId = useId();
  const turnstileHost = useRef<HTMLDivElement>(null);
  const widgetId = useRef<string | null>(null);
  const startedAt = useRef(Date.now());

  const [status, setStatus] = useState<Status>({ kind: "idle" });
  const [fields, setFields] = useState({
    name: "",
    phone: "",
    email: "",
    subject: "",
    message: "",
    company: "",
  });
  const [fieldErrors, setFieldErrors] = useState<ContactFieldErrors>({});
  const [turnstileToken, setTurnstileToken] = useState("");

  useEffect(() => {
    startedAt.current = Date.now();
  }, []);

  useEffect(() => {
    if (!TURNSTILE_SITE_KEY || !turnstileHost.current) return;

    let cancelled = false;

    function mountWidget() {
      if (cancelled || !turnstileHost.current || !window.turnstile) return;
      if (widgetId.current) return;
      widgetId.current = window.turnstile.render(turnstileHost.current, {
        sitekey: TURNSTILE_SITE_KEY,
        theme: "auto",
        size: "flexible",
        callback: (token) => setTurnstileToken(token),
        "expired-callback": () => setTurnstileToken(""),
        "error-callback": () => setTurnstileToken(""),
      });
    }

    const existing = document.querySelector<HTMLScriptElement>(
      'script[data-km-turnstile="1"]',
    );
    if (existing) {
      if (window.turnstile) mountWidget();
      else existing.addEventListener("load", mountWidget);
    } else {
      const script = document.createElement("script");
      script.src =
        "https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit";
      script.async = true;
      script.dataset.kmTurnstile = "1";
      script.addEventListener("load", mountWidget);
      document.head.appendChild(script);
    }

    return () => {
      cancelled = true;
      if (widgetId.current && window.turnstile) {
        window.turnstile.remove(widgetId.current);
        widgetId.current = null;
      }
    };
  }, []);

  function updateField(key: keyof typeof fields, value: string) {
    setFields((prev) => ({ ...prev, [key]: value }));
    setFieldErrors((prev) => {
      if (!prev[key as keyof ContactFieldErrors]) return prev;
      const next = { ...prev };
      delete next[key as keyof ContactFieldErrors];
      return next;
    });
  }

  const dismissAlert = useCallback(() => {
    setStatus((prev) => (prev.kind === "error" ? { kind: "idle" } : prev));
  }, []);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (status.kind === "sending") return;

    if (TURNSTILE_SITE_KEY && !turnstileToken) {
      setStatus({
        kind: "error",
        message: "Finish the spam check, then send again.",
      });
      return;
    }

    setStatus({ kind: "sending" });
    setFieldErrors({});

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...fields,
          startedAt: startedAt.current,
          turnstileToken,
        }),
      });
      const data = (await res.json()) as {
        ok?: boolean;
        error?: string;
        fields?: ContactFieldErrors;
      };

      if (!res.ok || !data.ok) {
        if (data.fields) setFieldErrors(data.fields);
        setStatus({
          kind: "error",
          message: data.fields
            ? alertMessageFromFields(
                data.fields,
                data.error || "Could not send. Try again.",
              )
            : data.error || "Could not send. Try again.",
        });
        if (widgetId.current && window.turnstile) {
          window.turnstile.reset(widgetId.current);
          setTurnstileToken("");
        }
        return;
      }

      setStatus({ kind: "sent" });
      setFields({
        name: "",
        phone: "",
        email: "",
        subject: "",
        message: "",
        company: "",
      });
      startedAt.current = Date.now();
      if (widgetId.current && window.turnstile) {
        window.turnstile.reset(widgetId.current);
        setTurnstileToken("");
      }
    } catch {
      setStatus({
        kind: "error",
        message: "Network issue. Check your connection and try again.",
      });
    }
  }

  const busy = status.kind === "sending";

  return (
    <div className="km-contact-page">
      <SiteAlert
        open={status.kind === "error"}
        message={status.kind === "error" ? status.message : ""}
        onClose={dismissAlert}
      />

      <header className="km-contact-page__head">
        <SectionTitle label="Contact" title="Contact Me" as="h1" />
        {support ? (
          <p className="km-contact-page__support">{support}</p>
        ) : null}
      </header>

      <ul className="km-contact-info">
        <li className="km-contact-info__card">
          <span className="km-contact-info__icon" aria-hidden>
            <MapIcon />
          </span>
          <div className="km-contact-info__body">
            <p className="km-contact-info__label">My Address</p>
            <p className="km-contact-info__value">{CONTACT_ADDRESS}</p>
          </div>
        </li>
        <li className="km-contact-info__card">
          <span className="km-contact-info__icon" aria-hidden>
            <ShareIcon />
          </span>
          <div className="km-contact-info__body">
            <p className="km-contact-info__label">Social Profiles</p>
            <div className="km-contact-info__social">
              <a
                href={SOCIAL_LINKS.youtube}
                target="_blank"
                rel="noreferrer"
                aria-label="YouTube"
              >
                <YouTubeIcon />
              </a>
              <a
                href={SOCIAL_LINKS.linkedin}
                target="_blank"
                rel="noreferrer"
                aria-label="LinkedIn"
              >
                <LinkedInIcon />
              </a>
            </div>
          </div>
        </li>
        <li className="km-contact-info__card">
          <span className="km-contact-info__icon" aria-hidden>
            <MailIcon />
          </span>
          <div className="km-contact-info__body">
            <p className="km-contact-info__label">Email Me</p>
            <p className="km-contact-info__value">
              <a href={CONTACT_MAILTO}>{CONTACT_EMAIL}</a>
            </p>
          </div>
        </li>
        <li className="km-contact-info__card">
          <span className="km-contact-info__icon" aria-hidden>
            <PhoneIcon />
          </span>
          <div className="km-contact-info__body">
            <p className="km-contact-info__label">Call Me</p>
            <p className="km-contact-info__value">
              <a href={CONTACT_PHONE_TEL}>{CONTACT_PHONE}</a>
            </p>
          </div>
        </li>
      </ul>

      <div className="km-contact-form-shell">
        {status.kind === "sent" ? (
          <div className="km-contact-dock__success" role="status">
            <p className="km-contact-dock__success-title">Message sent</p>
            <p className="km-contact-dock__success-body">
              Thanks. I will read it and reply from my work inbox.
            </p>
            <TextLink
              type="button"
              onClick={() => setStatus({ kind: "idle" })}
            >
              Send another
            </TextLink>
          </div>
        ) : (
          <form className="km-contact-form" onSubmit={onSubmit} noValidate>
            <div className="km-contact-form__honeypot" aria-hidden>
              <label htmlFor={`${formId}-company`}>Company</label>
              <input
                id={`${formId}-company`}
                name="company"
                type="text"
                tabIndex={-1}
                autoComplete="off"
                value={fields.company}
                onChange={(e) => updateField("company", e.target.value)}
              />
            </div>

            <div className="km-contact-form__row km-contact-form__row--triple">
              <Field
                id={`${formId}-name`}
                label="Your Name"
                required
                error={fieldErrors.name}
              >
                <input
                  id={`${formId}-name`}
                  name="name"
                  type="text"
                  autoComplete="name"
                  placeholder="Your Name"
                  maxLength={CONTACT_FIELD_LIMITS.name}
                  value={fields.name}
                  disabled={busy}
                  aria-invalid={fieldErrors.name ? true : undefined}
                  onChange={(e) => updateField("name", e.target.value)}
                />
              </Field>
              <Field
                id={`${formId}-phone`}
                label="Phone"
                hint="Optional"
                error={fieldErrors.phone}
              >
                <input
                  id={`${formId}-phone`}
                  name="phone"
                  type="tel"
                  autoComplete="tel"
                  placeholder="Your Phone Number"
                  maxLength={CONTACT_FIELD_LIMITS.phone}
                  value={fields.phone}
                  disabled={busy}
                  aria-invalid={fieldErrors.phone ? true : undefined}
                  onChange={(e) => updateField("phone", e.target.value)}
                />
              </Field>
              <Field
                id={`${formId}-email`}
                label="Email"
                required
                error={fieldErrors.email}
              >
                <input
                  id={`${formId}-email`}
                  name="email"
                  type="email"
                  autoComplete="email"
                  inputMode="email"
                  placeholder="Your Email"
                  maxLength={CONTACT_FIELD_LIMITS.email}
                  value={fields.email}
                  disabled={busy}
                  aria-invalid={fieldErrors.email ? true : undefined}
                  onChange={(e) => updateField("email", e.target.value)}
                />
              </Field>
            </div>

            <Field
              id={`${formId}-subject`}
              label="Subject"
              required
              error={fieldErrors.subject}
            >
              <input
                id={`${formId}-subject`}
                name="subject"
                type="text"
                placeholder="Subject"
                maxLength={CONTACT_FIELD_LIMITS.subject}
                value={fields.subject}
                disabled={busy}
                aria-invalid={fieldErrors.subject ? true : undefined}
                onChange={(e) => updateField("subject", e.target.value)}
              />
            </Field>

            <Field
              id={`${formId}-message`}
              label="Message"
              required
              error={fieldErrors.message}
            >
              <textarea
                id={`${formId}-message`}
                name="message"
                rows={5}
                placeholder="Message"
                maxLength={CONTACT_FIELD_LIMITS.message}
                value={fields.message}
                disabled={busy}
                aria-invalid={fieldErrors.message ? true : undefined}
                onChange={(e) => updateField("message", e.target.value)}
              />
            </Field>

            {TURNSTILE_SITE_KEY ? (
              <div
                ref={turnstileHost}
                className="km-contact-form__turnstile"
              />
            ) : null}

            <div className="km-contact-form__actions">
              <Btn
                type="submit"
                disabled={busy}
                busy={busy}
                aria-label={busy ? "Sending message" : undefined}
              >
                Send Message
              </Btn>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}

function Field({
  id,
  label,
  required,
  hint,
  error,
  children,
}: {
  id: string;
  label: string;
  required?: boolean;
  hint?: string;
  error?: string;
  children: ReactNode;
}) {
  return (
    <div
      className={[
        "km-contact-form__field",
        error ? "km-contact-form__field--error" : "",
      ].join(" ")}
    >
      <div className="km-contact-form__label-row">
        <label htmlFor={id} className="km-contact-form__label">
          {label}
          {required ? (
            <span className="km-contact-form__req" aria-hidden>
              *
            </span>
          ) : null}
        </label>
        {hint ? (
          <span className="km-contact-form__hint">{hint}</span>
        ) : null}
      </div>
      <div
        className="km-contact-form__control"
        data-invalid={error ? "true" : undefined}
      >
        {children}
      </div>
    </div>
  );
}

function MapIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M12 21s7-4.5 7-11a7 7 0 1 0-14 0c0 6.5 7 11 7 11z"
        stroke="currentColor"
        strokeWidth="1.8"
      />
      <circle cx="12" cy="10" r="2.2" stroke="currentColor" strokeWidth="1.8" />
    </svg>
  );
}

function ShareIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden>
      <circle cx="18" cy="5" r="2.5" stroke="currentColor" strokeWidth="1.8" />
      <circle cx="6" cy="12" r="2.5" stroke="currentColor" strokeWidth="1.8" />
      <circle cx="18" cy="19" r="2.5" stroke="currentColor" strokeWidth="1.8" />
      <path
        d="M8.4 13.2l7.2 4.1M15.6 6.7l-7.2 4.1"
        stroke="currentColor"
        strokeWidth="1.8"
      />
    </svg>
  );
}

function MailIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden>
      <rect
        x="3.5"
        y="5.5"
        width="17"
        height="13"
        rx="1.5"
        stroke="currentColor"
        strokeWidth="1.8"
      />
      <path
        d="M4.5 7.5L12 13l7.5-5.5"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function PhoneIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M8.5 4.5h3l1.2 4.2-2 1.2a12.5 12.5 0 0 0 5.4 5.4l1.2-2 4.2 1.2v3A2 2 0 0 1 19.5 19 15.5 15.5 0 0 1 5 4.5a2 2 0 0 1 3.5 0z"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function YouTubeIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden>
      <path
        fill="currentColor"
        d="M23.5 6.2a3 3 0 0 0-2.1-2.1C19.5 3.5 12 3.5 12 3.5s-7.5 0-9.4.6A3 3 0 0 0 .5 6.2 31.5 31.5 0 0 0 0 12a31.5 31.5 0 0 0 .5 5.8 3 3 0 0 0 2.1 2.1c1.9.6 9.4.6 9.4.6s7.5 0 9.4-.6a3 3 0 0 0 2.1-2.1A31.5 31.5 0 0 0 24 12a31.5 31.5 0 0 0-.5-5.8zM9.8 15.5v-7l6.3 3.5-6.3 3.5z"
      />
    </svg>
  );
}

function LinkedInIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" aria-hidden>
      <path
        fill="currentColor"
        d="M4.98 3.5C4.98 4.88 3.87 6 2.5 6S0 4.88 0 3.5 1.12 1 2.5 1s2.48 1.12 2.48 2.5zM.5 8.5h4V23h-4V8.5zM8.5 8.5h3.8v2h.05c.53-1 1.84-2.05 3.8-2.05 4.06 0 4.8 2.67 4.8 6.15V23h-4v-6.6c0-1.57-.03-3.6-2.2-3.6-2.2 0-2.54 1.72-2.54 3.5V23h-4V8.5z"
      />
    </svg>
  );
}
