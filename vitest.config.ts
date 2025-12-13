import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    coverage: {
      provider: "v8",
    },
    projects: [
      {
        test: {
          include: ["packages/email/test/**/*.test.ts"],
          globals: true,
          environment: "node",
          setupFiles: ["packages/email/test/setup.ts"],
        },
      },
      {
        test: {
          include: ["packages/storage/test/**/*.test.ts"],
          globals: true,
          environment: "node",
          setupFiles: ["packages/storage/test/setup.ts"],
        },
      },
      {
        test: {
          include: ["packages/utils/test/**/*.test.ts"],
          globals: true,
          environment: "node",
          setupFiles: ["packages/utils/test/setup.ts"],
        },
      },
    ],
  },
});
