/// <reference types="vitest" />
import { defineConfig } from "vite";

export default defineConfig({
  test: {
    globals: true,
    environment: "node", // Changed from 'jsdom' since we're testing API calls
    include: ["src/**/*.{test,spec}.{js,jsx,ts,tsx}"],
  },
});
