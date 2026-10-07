import { defineConfig } from "vitest/config";
import path from "node:path";

/**
 * Phase 8 Testing config.
 *
 * Scope (see MANUAL_QA_CHECKLIST.md for what is intentionally NOT covered
 * here): only pure, DB/network-free logic is unit tested — Zod validation
 * schemas (src/validations/*) and framework-agnostic helpers
 * (src/actions/_shared.ts). Anything that talks to Supabase (queries,
 * the Supabase-operation half of Server Actions), Storage, Auth, or the
 * Geocoding providers is out of scope for automated tests until a real
 * Supabase project exists, per CLAUDE.md's "no mocking the backend" rule.
 */
export default defineConfig({
  test: {
    environment: "node",
    include: ["src/**/*.test.ts"],
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
      // Server Action modules import the "server-only" marker package,
      // which throws unless the bundler sets the "react-server" export
      // condition (Next.js does this at build time). Vitest runs in plain
      // Node, so point it at the package's own empty stub for the
      // "react-server" condition -- this does not mock any project logic,
      // it only satisfies the same marker Next.js itself no-ops.
      "server-only": path.resolve(__dirname, "./node_modules/server-only/empty.js"),
    },
  },
});
