import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

/** React dashboard only — Node API stays in server/ */
export default defineConfig({
  plugins: [react()],
  publicDir: "public",
  build: {
    outDir: "dist",
    emptyOutDir: true,
  },
  server: {
    port: 5174,
    proxy: {
      "/api": "http://localhost:8787",
      "/v1": "http://localhost:8787",
      "/health": "http://localhost:8787",
    },
  },
});
