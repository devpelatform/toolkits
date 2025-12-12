import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    coverage: {
      provider: "v8",
    },
    projects: [
      {
        test: {
          include: ["packages/**/test/**/*.test.ts"],
          globals: true,
          environment: "node",
        },
      },
    ],
  },
});
