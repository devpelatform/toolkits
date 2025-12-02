import { defineConfig } from "tsup";

export default defineConfig(() => {
  return {
    clean: true,
    dts: true,
    entry: ["./src/index.ts", "./src/server.ts"],
    format: "esm",
    target: "ES2022",
  };
});
