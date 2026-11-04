"use client";

import {
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
import Btn from "./btn";
import TextLink from "./text-link";
import "./contact-dock.css";

type ContactDockProps = {
  title: string;
  support: string;
  email: string;
  mailto: string;
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
 * Contact surface — path copy + protected form, mailto as quiet fallback.
 */
export default function ContactDock({
  title,
  support,
  email,
  mailto,
}: ContactDockProps) {
  const formId = useId();
  const turnstileHost = useRef<HTMLDivElement>(null);
  const widgetId = useRef<string | null>(null);
  const startedAt = useRef(Date.now());

  const [copied, setCopied] = useState(false);
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
      script.src = "https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit";
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

  async function copyEmail() {
    try {
      await navigator.clipboard.writeText(email);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1600);
    } catch {
      window.location.href = mailto;
    }
  }

  function updateField(key: keyof typeof fields, value: string) {
    setFields((prev) => ({ ...prev, [key]: value }));
    setFieldErrors((prev) => {
      if (!prev[key as keyof ContactFieldErrors]) return prev;
      const next = { ...prev };
      delete next[key as keyof ContactFieldErrors];
      return next;
    });
  }

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
          message: data.error || "Could not send. Try again.",
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
    <div className="km-contact-dock">
      <div className="km-contact-dock__glow" aria-hidden />

      <div className="km-contact-dock__intro">
        <h2 className="km-contact-dock__title">{title}</h2>
        <p className="km-contact-dock__support">{support}</p>
        <p className="km-contact-dock__alt">
          Prefer your own mail app?{" "}
          <TextLink href={mailto}>{email}</TextLink>
          <span aria-hidden> · </span>
          <TextLink type="button" onClick={copyEmail}>
            {copied ? "Copied" : "Copy"}
          </TextLink>
        </p>
      </div>

      {status.kind === "sent" ? (
        <div className="km-contact-dock__success" role="status">
          <p className="km-contact-dock__success-title">Message sent</p>
          <p className="km-contact-dock__success-body">
            Thanks — I will read it and reply from my work inbox.
          </p>
          <TextLink
            type="button"
            onClick={() => setStatus({ kind: "idle" })}
          >
            Send another
          </TextLink>
        </div>
      ) : (
        <form
          className="km-contact-form"
          onSubmit={onSubmit}
          noValidate
          aria-describedby={
            status.kind === "error" ? `${formId}-status` : undefined
          }
        >
          {/* Honeypot — hidden from people, tempting for bots */}
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

          <div className="km-contact-form__row">
            <Field
              id={`${formId}-name`}
              label="Name"
              required
              error={fieldErrors.name}
            >
              <input
                id={`${formId}-name`}
                name="name"
                type="text"
                autoComplete="name"
                maxLength={CONTACT_FIELD_LIMITS.name}
                value={fields.name}
                disabled={busy}
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
                maxLength={CONTACT_FIELD_LIMITS.phone}
                value={fields.phone}
                disabled={busy}
                onChange={(e) => updateField("phone", e.target.value)}
              />
            </Field>
          </div>

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
              maxLength={CONTACT_FIELD_LIMITS.email}
              value={fields.email}
              disabled={busy}
              onChange={(e) => updateField("email", e.target.value)}
            />
          </Field>

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
              maxLength={CONTACT_FIELD_LIMITS.subject}
              value={fields.subject}
              disabled={busy}
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
              maxLength={CONTACT_FIELD_LIMITS.message}
              value={fields.message}
              disabled={busy}
              onChange={(e) => updateField("message", e.target.value)}
            />
          </Field>

          {TURNSTILE_SITE_KEY ? (
            <div
              ref={turnstileHost}
              className="km-contact-form__turnstile"
            />
          ) : null}

          {status.kind === "error" ? (
            <p
              id={`${formId}-status`}
              className="km-contact-form__banner"
              role="alert"
            >
              {status.message}
            </p>
          ) : null}

          <div className="km-contact-form__actions">
            <Btn type="submit" disabled={busy}>
              {busy ? "Sending…" : "Send message"}
            </Btn>
          </div>
        </form>
      )}
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
  const errorId = error ? `${id}-error` : undefined;
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
      {error ? (
        <p id={errorId} className="km-contact-form__error" role="alert">
          {error}
        </p>
      ) : null}
    </div>
  );
}
