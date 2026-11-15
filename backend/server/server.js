import "./load-env.js";

import cookieParser from "cookie-parser";
import cors from "cors";
import express from "express";
import helmet from "helmet";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import {
  clearSessionCookie,
  createSession,
  destroySession,
  getDashboardPassword,
  isAuthed,
  requireAuth,
  SESSION_COOKIE,
  setSessionCookie,
} from "./auth.js";
import { getDbPath, getSummary, recordEvent } from "./db.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const backendRoot = path.join(__dirname, "..");
const distDir = path.join(backendRoot, "dist");
// Railway injects PORT; local uses ANALYTICS_PORT or 8787.
const port = Number(process.env.PORT || process.env.ANALYTICS_PORT || 8787);

const allowedOrigins = String(process.env.ANALYTICS_CORS_ORIGINS || "")
  .split(",")
  .map((s) => s.trim())
  .filter(Boolean);

if (allowedOrigins.length === 0) {
  allowedOrigins.push(
    "http://localhost:3000",
    "http://127.0.0.1:3000",
    "http://localhost:5174",
    "http://127.0.0.1:5174",
  );
}

const VALID_TYPES = new Set([
  "session_start",
  "path",
  "path_first",
  "path_switch",
  "theme",
  "mode",
  "locale",
  "chooser_seen",
  "page_view",
  "heartbeat",
]);
const VALID_PATHS = new Set(["hire", "craft", "build", "wander"]);
const VALID_MODES = new Set(["light", "dark"]);
const VALID_LOCALES = new Set(["en", "my"]);

const app = express();
app.disable("x-powered-by");
// Railway / reverse proxies terminate TLS — needed for secure cookies.
app.set("trust proxy", 1);
app.use(helmet({ contentSecurityPolicy: false }));
app.use(express.json({ limit: "32kb" }));
app.use(cookieParser());
app.use(
  cors({
    origin(origin, cb) {
      if (!origin) return cb(null, true);
      if (allowedOrigins.includes(origin)) return cb(null, true);
      return cb(null, false);
    },
    credentials: true,
  }),
);

app.get("/health", (_req, res) => {
  res.json({ ok: true, db: getDbPath() });
});

app.post("/v1/events", (req, res) => {
  const expectedKey = process.env.ANALYTICS_INGEST_KEY;
  if (expectedKey) {
    const got = req.get("x-km-key") || "";
    if (got !== expectedKey) {
      return res.status(401).json({ error: "Invalid ingest key" });
    }
  }

  const body = req.body || {};
  if (!body.visitorId || typeof body.visitorId !== "string") {
    return res.status(400).json({ error: "visitorId required" });
  }
  if (!body.type || !VALID_TYPES.has(body.type)) {
    return res.status(400).json({ error: "invalid type" });
  }
  if (body.path != null && !VALID_PATHS.has(body.path)) {
    return res.status(400).json({ error: "invalid path" });
  }
  if (body.mode != null && !VALID_MODES.has(body.mode)) {
    return res.status(400).json({ error: "invalid mode" });
  }
  if (body.locale != null && !VALID_LOCALES.has(body.locale)) {
    return res.status(400).json({ error: "invalid locale" });
  }

  try {
    recordEvent({
      visitorId: body.visitorId,
      type: body.type,
      path: body.path,
      theme: body.theme,
      mode: body.mode,
      locale: body.locale,
      page: body.page,
      meta: body.meta,
    });
    return res.status(204).end();
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Failed to record event" });
  }
});

app.get("/api/session", (req, res) => {
  res.json({ authenticated: isAuthed(req) });
});

app.post("/api/login", (req, res) => {
  const password = getDashboardPassword();
  if (!password) {
    return res.status(503).json({
      error: "Set DASHBOARD_PASSWORD in backend/.env before using the dashboard.",
    });
  }
  if (String(req.body?.password || "") !== password) {
    return res.status(401).json({ error: "Invalid password" });
  }
  const token = createSession();
  setSessionCookie(res, token);
  return res.json({ ok: true });
});

app.post("/api/logout", (req, res) => {
  destroySession(req.cookies?.[SESSION_COOKIE]);
  clearSessionCookie(res);
  return res.json({ ok: true });
});

app.get("/api/summary", requireAuth, (_req, res) => {
  res.json(getSummary());
});

/** Production: serve the Vite React build. Dev uses Vite on :5174. */
if (fs.existsSync(distDir)) {
  app.use(express.static(distDir));
  app.get(/^(?!\/api\/|\/v1\/|\/health).*/, (_req, res) => {
    res.sendFile(path.join(distDir, "index.html"));
  });
}

if (!getDashboardPassword()) {
  console.warn(
    "[km-backend] DASHBOARD_PASSWORD is empty — login will refuse until you set it.",
  );
}

app.listen(port, () => {
  console.log(`[km-backend] api        http://localhost:${port}`);
  console.log(`[km-backend] ingest     POST http://localhost:${port}/v1/events`);
  if (fs.existsSync(distDir)) {
    console.log(`[km-backend] dashboard  http://localhost:${port} (React dist)`);
  } else {
    console.log(
      `[km-backend] dashboard  run yarn dev:client → http://localhost:5174`,
    );
  }
  console.log(`[km-backend] db         ${getDbPath()}`);
});
