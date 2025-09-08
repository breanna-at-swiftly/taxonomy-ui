import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import type { ClientRequest, IncomingMessage } from "node:http";
import HttpsProxyAgent from "https-proxy-agent"; // Simplified import

// eslint-disable-next-line no-console
const log = console.log.bind(console);

// Add proxy test function
const testProxyConnection = async () => {
  try {
    const agent = new HttpsProxyAgent.HttpsProxyAgent("http://127.0.0.1:8888"); // Updated constructor
    log("[Proxy Test] Initializing...");

    const response = await fetch(
      "https://swiftly-data-api-prod.azure-api.net/v1.0/health",
      {
        agent,
        headers: {
          "api-key": "520ec25092c54b7db747908ef65c86ec",
        },
      }
    );

    log("[Proxy Test] Response:", {
      status: response.status,
      headers: Object.fromEntries(response.headers),
    });
  } catch (error) {
    log("[Proxy Test] Failed:", error);
  }
};

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      "/api": {
        target: "https://swiftly-data-api-prod.azure-api.net/v1.0",
        changeOrigin: true,
        secure: false,
        agent: new HttpsProxyAgent.HttpsProxyAgent("http://127.0.0.1:8888"),
        rewrite: (path) => {
          log("[Proxy] Rewriting path:", {
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
        configure: (proxy) => {
          // Run proxy test on startup
          testProxyConnection();

          // Add proxy configuration logging
          proxy.options.proxy = "http://127.0.0.1:8888";
          log("[Proxy] Configuration:", {
            proxy: proxy.options.proxy,
            target: proxy.options.target,
            agent: proxy.options.agent ? "yes" : "no",
          });

          proxy.on(
            "proxyReq",
            (proxyReq: ClientRequest, req: IncomingMessage) => {
              log("[Proxy] Forwarding request:", {
                method: req.method,
                from: req.url,
                to: proxyReq.path,
                headers: proxyReq.getHeaders(),
                agent: proxyReq.agent ? "yes" : "no",
              });

              if (req.method === "POST") {
                let bodyChunks: Buffer[] = [];
                let ended = false;
                const originalEnd = proxyReq.end;

                proxyReq.end = function (): ClientRequest {
                  if (!ended) {
                    log("End called before body collected, deferring...");
                    return this;
                  }
                  return originalEnd.apply(this, arguments);
                } as any;

                req.on("data", (chunk) => {
                  bodyChunks.push(Buffer.from(chunk));
                  log("Received chunk, size:", chunk.length);
                });

                req.on("end", () => {
                  try {
                    const body = Buffer.concat(bodyChunks).toString();
                    const parsedBody = JSON.parse(body);
                    log("Valid JSON body:", parsedBody);
                    ended = true;
                    proxyReq.end(body);
                    log("Request sent with body length:", body.length);
                  } catch (e) {
                    log("Error processing request:", e);
                    ended = true;
                    proxyReq.end();
                  }
                });

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

          // Add error logging
          proxy.on("error", (err, req) => {
            log("[Proxy] Error:", {
              message: err.message,
              method: req.method,
              url: req.url,
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
