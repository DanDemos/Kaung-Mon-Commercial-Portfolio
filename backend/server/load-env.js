import dotenv from "dotenv";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const backendRoot = path.join(__dirname, "..");

// Self-contained — only this package's `.env` (never frontend / repo root).
dotenv.config({ path: path.join(backendRoot, ".env") });
