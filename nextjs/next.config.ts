import type { NextConfig } from "next";
import { loadEnvConfig } from "@next/env";
import path from "path";

/** Repo root (shared/ + assets/ + shared `.env` live next to nextjs/). */
const repoRoot = path.join(__dirname, "..");

// One env file for the whole monorepo — not nextjs/.env.local.
loadEnvConfig(repoRoot);

const nextConfig: NextConfig = {
  // Dev/bundler + production file tracing both need the monorepo root so
  // imports like `../../shared/...` and `../../assets/...` resolve and ship.
  turbopack: {
    root: repoRoot,
  },
  outputFileTracingRoot: repoRoot,
  experimental: {
    // Corrupted turbopack FS cache has aborted `next dev` (Restore of Data /
    // TaskId panic) and dropped the HMR WebSocket — Firefox then logs
    // ws://localhost:3000/_next/hmr failures. Skip persistent restore in dev.
    turbopackFileSystemCacheForDev: false,
  },
  images: {
    // Prefer modern codecs; keep high qualities available to MediaImage.
    formats: ["image/avif", "image/webp"],
    qualities: [75, 85, 92, 95, 100],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920],
    imageSizes: [32, 48, 64, 96, 128, 256, 384, 512],
  },
};

export default nextConfig;
