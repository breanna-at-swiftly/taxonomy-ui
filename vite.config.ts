import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// eslint-disable-next-line no-console
const log = console.log.bind(console);

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      "/api": {
        target: "https://swiftly-data-api-prod.azure-api.net/v1.0",
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ""),
        headers: {
          "api-key": "520ec25092c54b7db747908ef65c86ec",
        },
        configure: (proxy) => {
          proxy.on("error", (err) => {
            log("proxy error", err);
          });
          proxy.on("proxyReq", (_proxyReq, req) => {
            log("Sending Request to:", req.url);
          });
          proxy.on("proxyRes", (proxyRes, req) => {
            log(
              "Received Response from:",
              req.url,
              "Status:",
              proxyRes.statusCode
            );
          });
        },
      },
    },
  },
});
