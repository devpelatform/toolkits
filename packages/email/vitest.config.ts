import { resolve } from "node:path";

import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    include: ["test/**/*.test.ts"],
    globals: true,
    environment: "node",
    setupFiles: ["./test/setup.ts"],
    coverage: {
      provider: "v8",
      reporter: ["text", "html", "json", "lcov"],
      include: ["src/**/*.{ts,tsx}"],
      thresholds: {
        lines: 90,
        branches: 85,
      },
    },
  },
  resolve: {
    alias: {
      "@": resolve(__dirname, "./src"),
      "@pelatform/email": resolve(__dirname, "./src/index.ts"),
      "@pelatform/email/components": resolve(__dirname, "./src/components.ts"),
      "@pelatform/email/helpers": resolve(__dirname, "./src/helpers.ts"),
    },
  },
});
