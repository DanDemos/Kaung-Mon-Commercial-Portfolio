import fs from "node:fs";
import path from "node:path";
import { DatabaseSync } from "node:sqlite";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const dataDir = path.join(__dirname, "..", "data");
const dbPath =
  process.env.ANALYTICS_DB_PATH || path.join(dataDir, "analytics.sqlite");

/** Dwell on one lens (seconds) before we treat it as intentional. */
const STICKY_SECONDS = Number(process.env.ANALYTICS_STICKY_SECONDS || 600);
/** Lens flips that mark someone as exploring. */
const EXPLORER_SWITCHES = Number(process.env.ANALYTICS_EXPLORER_SWITCHES || 2);

fs.mkdirSync(path.dirname(dbPath), { recursive: true });

const db = new DatabaseSync(dbPath);
db.exec("PRAGMA journal_mode = WAL;");
db.exec("PRAGMA foreign_keys = ON;");

db.exec(`
  CREATE TABLE IF NOT EXISTS events (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    visitor_id TEXT NOT NULL,
    type TEXT NOT NULL,
    path TEXT,
    theme TEXT,
    mode TEXT,
    locale TEXT,
    page TEXT,
    meta TEXT,
    created_at TEXT NOT NULL DEFAULT (datetime('now'))
  );

  CREATE INDEX IF NOT EXISTS idx_events_created ON events(created_at);
  CREATE INDEX IF NOT EXISTS idx_events_type ON events(type);
  CREATE INDEX IF NOT EXISTS idx_events_visitor ON events(visitor_id);

  CREATE TABLE IF NOT EXISTS visitors (
    visitor_id TEXT PRIMARY KEY,
    path TEXT,
    theme TEXT,
    mode TEXT,
    locale TEXT,
    first_seen TEXT NOT NULL,
    last_seen TEXT NOT NULL,
    event_count INTEGER NOT NULL DEFAULT 0
  );
`);

function ensureColumn(table, column, ddl) {
  const cols = db.prepare(`PRAGMA table_info(${table})`).all();
  if (cols.some((c) => c.name === column)) return;
  db.exec(`ALTER TABLE ${table} ADD COLUMN ${ddl}`);
}

ensureColumn("visitors", "first_path", "first_path TEXT");
ensureColumn("visitors", "path_switch_count", "path_switch_count INTEGER NOT NULL DEFAULT 0");
ensureColumn("visitors", "chooser_completed", "chooser_completed INTEGER NOT NULL DEFAULT 0");
ensureColumn("visitors", "current_path_since", "current_path_since TEXT");
ensureColumn("visitors", "dwell_seconds", "dwell_seconds INTEGER NOT NULL DEFAULT 0");
ensureColumn("visitors", "engaged", "engaged INTEGER NOT NULL DEFAULT 0");
ensureColumn("visitors", "session_count", "session_count INTEGER NOT NULL DEFAULT 0");
ensureColumn("visitors", "last_session_id", "last_session_id TEXT");

const insertEventStmt = db.prepare(`
  INSERT INTO events (visitor_id, type, path, theme, mode, locale, page, meta)
  VALUES (?, ?, ?, ?, ?, ?, ?, ?)
`);

const getVisitorStmt = db.prepare(
  `SELECT * FROM visitors WHERE visitor_id = ?`,
);

const insertVisitorStmt = db.prepare(`
  INSERT INTO visitors (
    visitor_id, path, theme, mode, locale, first_seen, last_seen, event_count,
    first_path, path_switch_count, chooser_completed, current_path_since,
    dwell_seconds, engaged, session_count, last_session_id
  ) VALUES (?, ?, ?, ?, ?, ?, ?, 1, ?, ?, ?, ?, ?, ?, ?, ?)
`);

const updateVisitorStmt = db.prepare(`
  UPDATE visitors SET
    path = ?,
    theme = ?,
    mode = ?,
    locale = ?,
    last_seen = ?,
    event_count = event_count + 1,
    first_path = ?,
    path_switch_count = ?,
    chooser_completed = ?,
    current_path_since = ?,
    dwell_seconds = ?,
    engaged = ?,
    session_count = ?,
    last_session_id = ?
  WHERE visitor_id = ?
`);

function parseMeta(raw) {
  if (!raw || typeof raw !== "object") return null;
  return raw;
}

function isEngagingPage(page, pathValue) {
  if (!page) return false;
  const p = page.split("?")[0];
  if (p === "/work" || p === "/contact" || p.startsWith("/courses")) return true;
  if (p === "/resume" && pathValue === "hire") return true;
  return false;
}

function classifyVisitor(v) {
  const switches = Number(v.path_switch_count || 0);
  const dwell = Number(v.dwell_seconds || 0);
  const engaged = Number(v.engaged || 0) === 1;
  const sessions = Number(v.session_count || 0);
  const stableReturn =
    sessions >= 2 &&
    v.first_path &&
    v.path &&
    v.first_path === v.path &&
    switches <= 1;

  const likely = engaged || dwell >= STICKY_SECONDS || stableReturn;
  if (likely) return "likely";
  if (switches >= EXPLORER_SWITCHES) return "explorer";
  return "unclear";
}

export function recordEvent(input) {
  const now = new Date().toISOString();
  const type = String(input.type).slice(0, 40);
  const visitorId = String(input.visitorId).slice(0, 80);
  const pathValue = input.path ? String(input.path).slice(0, 40) : null;
  const theme = input.theme ? String(input.theme).slice(0, 80) : null;
  const mode = input.mode ? String(input.mode).slice(0, 20) : null;
  const locale = input.locale ? String(input.locale).slice(0, 12) : null;
  const page = input.page ? String(input.page).slice(0, 200) : null;
  const metaObj = parseMeta(input.meta);
  const meta = metaObj ? JSON.stringify(metaObj).slice(0, 2000) : null;
  const sessionId =
    metaObj?.sessionId != null
      ? String(metaObj.sessionId).slice(0, 80)
      : null;
  const dwellDelta = Math.min(
    300,
    Math.max(0, Number(metaObj?.seconds || metaObj?.dwellDelta || 0) || 0),
  );

  db.exec("BEGIN IMMEDIATE");
  try {
    insertEventStmt.run(
      visitorId,
      type,
      pathValue,
      theme,
      mode,
      locale,
      page,
      meta,
    );

    const existing = getVisitorStmt.get(visitorId);
    if (!existing) {
      const firstPath = type === "path_first" || type === "path" ? pathValue : null;
      const switches = type === "path_switch" ? 1 : 0;
      const chooser = type === "chooser_seen" ? 1 : 0;
      const dwell = type === "heartbeat" ? dwellDelta : 0;
      const engaged = isEngagingPage(page, pathValue) ? 1 : 0;
      const sessions = type === "session_start" ? 1 : 0;
      insertVisitorStmt.run(
        visitorId,
        pathValue,
        theme,
        mode,
        locale,
        now,
        now,
        firstPath,
        switches,
        chooser,
        pathValue ? now : null,
        dwell,
        engaged,
        sessions,
        sessionId,
      );
    } else {
      let nextPath = pathValue ?? existing.path;
      let nextTheme = theme ?? existing.theme;
      let nextMode = mode ?? existing.mode;
      let nextLocale = locale ?? existing.locale;
      let firstPath = existing.first_path;
      let switches = Number(existing.path_switch_count || 0);
      let chooser = Number(existing.chooser_completed || 0);
      let pathSince = existing.current_path_since;
      let dwell = Number(existing.dwell_seconds || 0);
      let engaged = Number(existing.engaged || 0);
      let sessions = Number(existing.session_count || 0);
      let lastSession = existing.last_session_id;

      if (type === "chooser_seen") chooser = 1;

      if (type === "path_first" || (type === "path" && !firstPath)) {
        if (pathValue) {
          firstPath = firstPath || pathValue;
          nextPath = pathValue;
          pathSince = now;
          dwell = 0;
        }
      }

      if (type === "path_switch" || (type === "path" && firstPath)) {
        if (pathValue && pathValue !== existing.path) {
          switches += 1;
          nextPath = pathValue;
          pathSince = now;
          dwell = 0;
        } else if (pathValue) {
          nextPath = pathValue;
        }
      }

      if (type === "session_start") {
        if (sessionId && sessionId !== lastSession) {
          sessions += 1;
          lastSession = sessionId;
        } else if (!sessionId) {
          sessions += 1;
        }
      }

      if (type === "heartbeat" && dwellDelta > 0) {
        // Only count dwell while still on the same lens.
        if (!pathValue || pathValue === existing.path) {
          dwell += dwellDelta;
        }
      }

      if (isEngagingPage(page, nextPath)) engaged = 1;

      updateVisitorStmt.run(
        nextPath,
        nextTheme,
        nextMode,
        nextLocale,
        now,
        firstPath,
        switches,
        chooser,
        pathSince,
        dwell,
        engaged,
        sessions,
        lastSession,
        visitorId,
      );
    }

    db.exec("COMMIT");
  } catch (err) {
    db.exec("ROLLBACK");
    throw err;
  }

  return { visitor_id: visitorId, type };
}

function countBy(rows, keyFn) {
  const map = new Map();
  for (const row of rows) {
    const key = keyFn(row);
    map.set(key, (map.get(key) || 0) + 1);
  }
  return [...map.entries()]
    .map(([key, count]) => ({ key, count }))
    .sort((a, b) => b.count - a.count);
}

export function getSummary() {
  const totals = db
    .prepare(
      `
    SELECT
      (SELECT COUNT(*) FROM visitors) AS visitors,
      (SELECT COUNT(*) FROM events) AS events,
      (SELECT COUNT(*) FROM events WHERE created_at >= datetime('now', '-1 day')) AS events_24h,
      (SELECT COUNT(*) FROM events WHERE created_at >= datetime('now', '-7 day')) AS events_7d
  `,
    )
    .get();

  const visitors = db.prepare(`SELECT * FROM visitors`).all();
  const classified = visitors.map((v) => ({
    ...v,
    intent: classifyVisitor(v),
  }));

  const likely = classified.filter((v) => v.intent === "likely");
  const explorers = classified.filter((v) => v.intent === "explorer");
  const unclear = classified.filter((v) => v.intent === "unclear");

  const intentTotals = {
    likely: likely.length,
    explorer: explorers.length,
    unclear: unclear.length,
  };

  const byPath = countBy(visitors, (v) => v.path || "(unset)");
  const byTheme = countBy(visitors, (v) => v.theme || "(unset)");
  const byMode = countBy(visitors, (v) => v.mode || "(unset)");
  const byLocale = countBy(visitors, (v) => v.locale || "(unset)");

  const firstPathAll = countBy(
    visitors.filter((v) => v.first_path),
    (v) => v.first_path,
  );
  const likelyByPath = countBy(
    likely.filter((v) => v.path),
    (v) => v.path,
  );
  const explorerByPath = countBy(
    explorers.filter((v) => v.path),
    (v) => v.path,
  );

  const pathEvents = db
    .prepare(
      `
    SELECT COALESCE(path, '(unset)') AS key, COUNT(*) AS count
    FROM events
    WHERE type IN ('path', 'path_first', 'path_switch')
    GROUP BY path
    ORDER BY count DESC
  `,
    )
    .all();

  const pathFirstEvents = db
    .prepare(
      `
    SELECT COALESCE(path, '(unset)') AS key, COUNT(*) AS count
    FROM events
    WHERE type = 'path_first'
    GROUP BY path
    ORDER BY count DESC
  `,
    )
    .all();

  const pathSwitchEvents = db
    .prepare(
      `
    SELECT COALESCE(path, '(unset)') AS key, COUNT(*) AS count
    FROM events
    WHERE type = 'path_switch'
    GROUP BY path
    ORDER BY count DESC
  `,
    )
    .all();

  const daily = db
    .prepare(
      `
    SELECT date(created_at) AS day, COUNT(*) AS count
    FROM events
    WHERE created_at >= datetime('now', '-30 day')
    GROUP BY date(created_at)
    ORDER BY day ASC
  `,
    )
    .all();

  const recent = db
    .prepare(
      `
    SELECT id, visitor_id, type, path, theme, mode, locale, page, created_at
    FROM events
    ORDER BY id DESC
    LIMIT 100
  `,
    )
    .all();

  return {
    totals,
    intentTotals,
    thresholds: {
      stickySeconds: STICKY_SECONDS,
      explorerSwitches: EXPLORER_SWITCHES,
    },
    byPath,
    byTheme,
    byMode,
    byLocale,
    firstPathAll,
    likelyByPath,
    explorerByPath,
    pathEvents,
    pathFirstEvents,
    pathSwitchEvents,
    daily,
    recent,
  };
}

export function getDbPath() {
  return dbPath;
}

export default db;
