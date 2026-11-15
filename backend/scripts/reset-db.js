import "../server/load-env.js";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const dbPath =
  process.env.ANALYTICS_DB_PATH ||
  path.join(__dirname, "..", "data", "analytics.sqlite");

for (const p of [dbPath, `${dbPath}-wal`, `${dbPath}-shm`]) {
  if (fs.existsSync(p)) fs.unlinkSync(p);
}

console.log(`Removed ${dbPath}`);
