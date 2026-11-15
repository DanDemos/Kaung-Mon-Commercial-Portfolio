import type { NextConfig } from "next";
import { loadEnvConfig } from "@next/env";
import path from "path";

/** This Next app’s root (`frontend/nextjs`) — fonts, assets, `.env` stay here. */
const appRoot = __dirname;

loadEnvConfig(appRoot);

const nextConfig: NextConfig = {
  // Keep bundler + tracing scoped to this package (no repo-root deps).
  turbopack: {
    root: appRoot,
  },
  outputFileTracingRoot: appRoot,
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
