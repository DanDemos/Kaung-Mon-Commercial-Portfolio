import {
  normalizeContactInput,
  validateContactPayload,
} from "../../lib/contact";
import {
  clientIp,
  isHoneypotTripped,
  isTimingSuspicious,
  sendContactEmail,
  takeRateLimitSlot,
  verifyTurnstile,
} from "../../lib/contact-guard";

export const runtime = "nodejs";

type JsonBody = Record<string, unknown>;

export async function POST(request: Request) {
  let raw: JsonBody;
  try {
    raw = (await request.json()) as JsonBody;
  } catch {
    return Response.json(
      { ok: false, error: "Could not read that submission." },
      { status: 400 },
    );
  }

  const payload = normalizeContactInput(raw);

  // Silent success for bots that fill the honeypot — do not tip them off.
  if (isHoneypotTripped(payload.company)) {
    return Response.json({ ok: true });
  }

  if (isTimingSuspicious(payload.startedAt)) {
    return Response.json(
      { ok: false, error: "That went too fast. Try again in a moment." },
      { status: 400 },
    );
  }

  const ip = clientIp(request);
  if (!takeRateLimitSlot(ip)) {
    return Response.json(
      {
        ok: false,
        error: "Too many messages from this network. Try again later.",
      },
      { status: 429 },
    );
  }

  const turnstileOk = await verifyTurnstile(payload.turnstileToken, ip);
  if (!turnstileOk) {
    return Response.json(
      { ok: false, error: "Spam check failed. Refresh and try again." },
      { status: 400 },
    );
  }

  const fieldErrors = validateContactPayload(payload);
  if (fieldErrors) {
    return Response.json(
      { ok: false, error: "Check the highlighted fields.", fields: fieldErrors },
      { status: 400 },
    );
  }

  const sent = await sendContactEmail({
    name: payload.name,
    phone: payload.phone,
    email: payload.email,
    subject: payload.subject,
    message: payload.message,
  });

  if (!sent.ok) {
    return Response.json({ ok: false, error: sent.reason }, { status: 503 });
  }

  return Response.json({ ok: true });
}
