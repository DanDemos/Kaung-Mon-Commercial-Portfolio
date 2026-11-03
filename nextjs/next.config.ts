import type { NextConfig } from "next";
import path from "path";

const nextConfig: NextConfig = {
  // Allow importing shared assets from the monorepo root (e.g. shared/colors.css)
  turbopack: {
    root: path.join(__dirname, ".."),
  },
};

export default nextConfig;
