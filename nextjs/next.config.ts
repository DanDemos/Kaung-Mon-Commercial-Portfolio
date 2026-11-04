import type { NextConfig } from "next";
import path from "path";

/** Repo root (shared/ + assets/ live next to nextjs/). */
const repoRoot = path.join(__dirname, "..");

const nextConfig: NextConfig = {
  // Dev/bundler + production file tracing both need the monorepo root so
  // imports like `../../shared/...` and `../../assets/...` resolve and ship.
  turbopack: {
    root: repoRoot,
  },
  outputFileTracingRoot: repoRoot,
};

export default nextConfig;
