import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import type { ClientRequest, IncomingMessage } from "node:http";

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
          proxy.on(
            "proxyReq",
            (proxyReq: ClientRequest, req: IncomingMessage) => {
              if (req.method === "POST") {
                // Initialize state
                let bodyChunks: Buffer[] = [];
                let ended = false;

                // Store original end function
                const originalEnd = proxyReq.end;

                // Set base headers immediately
                proxyReq.setHeader("Content-Type", "application/json");
                proxyReq.setHeader("Accept", "application/json");

                // Prevent premature end calls
                proxyReq.end = function (): ClientRequest {
                  if (!ended) {
                    log("End called before body collected, deferring...");
                    return this;
                  }
                  return originalEnd.apply(this, arguments);
                } as any;

                // Collect body chunks as buffers
                req.on("data", (chunk) => {
                  bodyChunks.push(Buffer.from(chunk));
                  log("Received chunk, size:", chunk.length);
                });

                // Handle end of request
                req.on("end", () => {
                  try {
                    // Combine chunks and validate JSON
                    const body = Buffer.concat(bodyChunks).toString();
                    const parsedBody = JSON.parse(body); // Validate JSON
                    log("Valid JSON body:", parsedBody);

                    // Write body in one operation
                    ended = true;
                    proxyReq.end(body);

                    log("Request sent with body length:", body.length);
                  } catch (e) {
                    log("Error processing request:", e);
                    ended = true;
                    proxyReq.end();
                  }
                });

                // Handle potential errors
                req.on("error", (err) => {
                  log("Request error:", err);
                  ended = true;
                  proxyReq.end();
                });
              } else {
                proxyReq.end();
              }
            }
          );

          // Enhanced response logging
          proxy.on("proxyRes", (proxyRes, req) => {
            let responseBody = "";

            proxyRes.on("data", (chunk) => {
              responseBody += chunk;
            });

            proxyRes.on("end", () => {
              log("Complete Proxy Response:", {
                method: req.method,
                path: req.url,
                status: proxyRes.statusCode,
                headers: proxyRes.headers,
                body: responseBody || "(empty)",
              });
            });
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
