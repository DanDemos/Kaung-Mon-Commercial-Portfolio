/**
 * Server-only spam guards for the contact API.
 * In-memory rate limit is best-effort on serverless (per instance).
 */

const MIN_FILL_MS = 2800;
const MAX_FILL_MS = 1000 * 60 * 60 * 6; // 6h stale token
const RATE_WINDOW_MS = 60 * 60 * 1000;
const RATE_MAX = 4;

type Bucket = { count: number; resetAt: number };

const rateBuckets = new Map<string, Bucket>();

export function isHoneypotTripped(company: string): boolean {
  return company.trim().length > 0;
}

export function isTimingSuspicious(startedAt: number, now = Date.now()): boolean {
  if (!Number.isFinite(startedAt) || startedAt <= 0) return true;
  const elapsed = now - startedAt;
  if (elapsed < MIN_FILL_MS) return true;
  if (elapsed > MAX_FILL_MS) return true;
  return false;
}

export function takeRateLimitSlot(key: string, now = Date.now()): boolean {
  const existing = rateBuckets.get(key);
  if (!existing || existing.resetAt <= now) {
    rateBuckets.set(key, { count: 1, resetAt: now + RATE_WINDOW_MS });
    return true;
  }
  if (existing.count >= RATE_MAX) return false;
  existing.count += 1;
  return true;
}

export async function verifyTurnstile(
  token: string,
  ip: string | undefined,
): Promise<boolean> {
  const secret = process.env.TURNSTILE_SECRET_KEY;
  if (!secret) return true; // Turnstile not configured
  if (!token) return false;

  const body = new URLSearchParams();
  body.set("secret", secret);
  body.set("response", token);
  if (ip) body.set("remoteip", ip);

  const res = await fetch(
    "https://challenges.cloudflare.com/turnstile/v0/siteverify",
    {
      method: "POST",
      headers: { "content-type": "application/x-www-form-urlencoded" },
      body,
    },
  );
  if (!res.ok) return false;
  const data = (await res.json()) as { success?: boolean };
  return data.success === true;
}

export function contactRecipient(): string {
  return (
    process.env.CONTACT_TO_EMAIL?.trim() || "kaungmonsoe14613@gmail.com"
  );
}

export function contactFromAddress(): string {
  return (
    process.env.CONTACT_FROM_EMAIL?.trim() ||
    "Portfolio contact <onboarding@resend.dev>"
  );
}

export async function sendContactEmail(input: {
  name: string;
  phone: string;
  email: string;
  subject: string;
  message: string;
}): Promise<{ ok: true } | { ok: false; reason: string }> {
  const apiKey = process.env.RESEND_API_KEY?.trim();
  if (!apiKey) {
    return {
      ok: false,
      reason: "Email delivery is not configured yet.",
    };
  }

  const phoneLine = input.phone ? `Phone: ${input.phone}\n` : "";
  const text = [
    `From: ${input.name} <${input.email}>`,
    phoneLine.trimEnd(),
    "",
    input.message,
    "",
    "—",
    "Sent via kaungmon portfolio contact form.",
  ]
    .filter((line, i, arr) => !(line === "" && arr[i - 1] === ""))
    .join("\n");

  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: contactFromAddress(),
      to: [contactRecipient()],
      reply_to: input.email,
      subject: `[Portfolio] ${input.subject}`,
      text,
    }),
  });

  if (!res.ok) {
    const detail = await res.text().catch(() => "");
    console.error("[contact] Resend failed", res.status, detail);
    return { ok: false, reason: "Could not send right now. Try again later." };
  }

  return { ok: true };
}

export function clientIp(request: Request): string {
  const forwarded = request.headers.get("x-forwarded-for");
  if (forwarded) {
    const first = forwarded.split(",")[0]?.trim();
    if (first) return first;
  }
  const real = request.headers.get("x-real-ip")?.trim();
  if (real) return real;
  return "unknown";
}
