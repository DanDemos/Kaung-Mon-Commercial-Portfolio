import crypto from "node:crypto";

const SESSION_COOKIE = "km_dash_session";
const SESSION_TTL_MS = 1000 * 60 * 60 * 12; // 12h

/** @type {Map<string, number>} */
const sessions = new Map();

function cleanSessions() {
  const now = Date.now();
  for (const [token, exp] of sessions) {
    if (exp <= now) sessions.delete(token);
  }
}

export function getDashboardPassword() {
  return process.env.DASHBOARD_PASSWORD || "";
}

export function createSession() {
  cleanSessions();
  const token = crypto.randomBytes(24).toString("hex");
  sessions.set(token, Date.now() + SESSION_TTL_MS);
  return token;
}

export function destroySession(token) {
  if (token) sessions.delete(token);
}

export function isAuthed(req) {
  cleanSessions();
  const token = req.cookies?.[SESSION_COOKIE];
  if (!token) return false;
  const exp = sessions.get(token);
  if (!exp || exp <= Date.now()) {
    sessions.delete(token);
    return false;
  }
  return true;
}

export function requireAuth(req, res, next) {
  if (isAuthed(req)) return next();
  // React SPA handles the login screen — APIs only return JSON 401.
  return res.status(401).json({ error: "Unauthorized" });
}

export function setSessionCookie(res, token) {
  res.cookie(SESSION_COOKIE, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    maxAge: SESSION_TTL_MS,
  });
}

export function clearSessionCookie(res) {
  res.clearCookie(SESSION_COOKIE);
}

export { SESSION_COOKIE };
