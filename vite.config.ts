import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      "/api": {
        target: "https://swiftly-data-api-prod.azure-api.net/v1.0",
        changeOrigin: true,
        secure: false,
        rewrite: (path) => {
          return path.replace(/^\/api/, "");
        },
        headers: {
          "api-key": "520ec25092c54b7db747908ef65c86ec",
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
