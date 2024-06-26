import { defineConfig } from "tsup";

export default defineConfig({
  format: ["cjs", "esm"],
  entry: ["./src/**/*.ts"],
  dts: true,
  shims: true,
  skipNodeModulesBundle: true,
  clean: true,
  treeshake: true,
  splitting: true,
});
