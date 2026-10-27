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
    pool: "forks",
  },
});
