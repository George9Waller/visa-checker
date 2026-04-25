import { defineConfig } from "vitest/config";
import path from "path";

export default defineConfig({
  resolve: { alias: { "@": path.resolve(__dirname, ".") } },
  test: {
    environment: "node",
    include: [
      "app/**/*.{test,spec}.ts",
      "tests/**/*.{test,spec}.ts",
      "tests/**/*.spec.cjs",
    ],
    exclude: ["node_modules/**", "tests/**/*.spec.cjs"],
  },
});
