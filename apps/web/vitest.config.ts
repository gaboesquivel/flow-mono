import path from "node:path";
import { defineConfig } from "vitest/config";

export default defineConfig({
  resolve: {
    alias: {
      "@": path.resolve(import.meta.dirname),
    },
  },
  test: {
    environment: "node",
    exclude: ["node_modules/**", ".next/**", "mcp-app/**"],
    include: ["tests/**/*.test.ts", "lib/**/*.test.ts", "../../lib/demo/**/*.test.ts"],
    // One module graph per worker: faster collection; tests restore what they change.
    isolate: false,
    pool: "forks",
    setupFiles: ["tests/setup/reset-env.ts"],
  },
});
