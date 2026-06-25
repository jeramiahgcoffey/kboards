import { defineConfig } from "vitest/config";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  resolve: {
    // Mirror the tsconfig `@/*` path alias so tests resolve app imports.
    alias: { "@": root },
  },
  test: {
    environment: "node",
    include: ["**/*.test.ts"],
    exclude: ["legacy/**", "node_modules/**", ".next/**"],
    // Integration tests share one MongoDB database and reset it between cases.
    // Run test files one at a time so their setup/teardown cannot race.
    fileParallelism: false,
    // Integration tests talk to a local MongoDB; default to a throwaway db.
    env: {
      MONGODB_URI:
        process.env.MONGODB_URI ?? "mongodb://localhost:27017/kboards-test",
    },
    passWithNoTests: true,
  },
});
