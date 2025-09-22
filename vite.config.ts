import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
// import { log } from "./src/utils/logger"; // No longer needed
// import { testProxyConnection } from "./src/utils/proxyTest"; // No longer needed

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      "/api": {
        target: "https://swiftly-data-api-prod.azure-api.net/v1.0", // Changed back from /proxy/v1.0
        changeOrigin: true,
        secure: false,
        rewrite: (path) => {
          console.log("[Proxy] Rewriting path:", {
            from: path,
            to: path.replace(/^\/api/, ""),
          });
          return path.replace(/^\/api/, "");
        },
        headers: {
          "api-key": "520ec25092c54b7db747908ef65c86ec",
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        configure: (proxy, options) => {
          console.log("[Proxy] Configuration:", {
            target: options.target, // Use the 'options' argument directly
          });
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
