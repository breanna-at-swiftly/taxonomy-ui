import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      "/api": {
        // 1. Target the new dev proxy endpoint
        target: "https://swiftly-data-api-dev.azure-api.net/proxy/v1.0",
        changeOrigin: true,
        secure: false,
        rewrite: (path) => {
          return path.replace(/^\/api/, "");
        },
        headers: {
          // 2. REMOVED api-key, as the proxy uses JWT authentication
          "Content-Type": "application/json",
          Accept: "application/json",
        },
      },
    },
  },
  test: {
    globals: true,
    environment: "jsdom",
    setupFiles: ["./src/test/setup.ts"],
  },
});
