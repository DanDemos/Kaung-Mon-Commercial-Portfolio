/** Shared contact form limits + validation (client + server). */

export const CONTACT_FIELD_LIMITS = {
  name: 80,
  phone: 40,
  email: 120,
  subject: 120,
  message: 4000,
} as const;

export type ContactPayload = {
  name: string;
  phone: string;
  email: string;
  subject: string;
  message: string;
  /** Honeypot — must stay empty. */
  company: string;
  /** ms since epoch when the form mounted. */
  startedAt: number;
  /** Cloudflare Turnstile token when enabled. */
  turnstileToken: string;
};

export type ContactFieldErrors = Partial<
  Record<"name" | "phone" | "email" | "subject" | "message" | "form", string>
>;

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function normalizeContactInput(
  raw: Record<string, unknown>,
): ContactPayload {
  const str = (key: string) =>
    typeof raw[key] === "string" ? (raw[key] as string).trim() : "";

  return {
    name: str("name").slice(0, CONTACT_FIELD_LIMITS.name),
    phone: str("phone").slice(0, CONTACT_FIELD_LIMITS.phone),
    email: str("email").slice(0, CONTACT_FIELD_LIMITS.email),
    subject: str("subject").slice(0, CONTACT_FIELD_LIMITS.subject),
    message: str("message").slice(0, CONTACT_FIELD_LIMITS.message),
    company: str("company"),
    startedAt:
      typeof raw.startedAt === "number"
        ? raw.startedAt
        : Number.parseInt(str("startedAt"), 10) || 0,
    turnstileToken: str("turnstileToken"),
  };
}

export function validateContactPayload(
  payload: ContactPayload,
): ContactFieldErrors | null {
  const errors: ContactFieldErrors = {};

  if (!payload.name) errors.name = "Add your name.";
  if (!payload.email) errors.email = "Add your email.";
  else if (!EMAIL_RE.test(payload.email)) {
    errors.email = "That email does not look right.";
  }
  if (!payload.subject) errors.subject = "Add a subject.";
  if (!payload.message) errors.message = "Write a short message.";
  else if (payload.message.length < 12) {
    errors.message = "Give a little more detail (a sentence is enough).";
  }

  return Object.keys(errors).length > 0 ? errors : null;
}
