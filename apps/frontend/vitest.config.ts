import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  test: {
    environment: "jsdom",
    setupFiles: ["./test/setupTests.ts"],
    exclude: ["**/node_modules/**", "**/dist/**", "**/e2e/**", "**/live/**"],
  },
});
