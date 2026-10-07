import "server-only";

/**
 * Logs the raw Supabase/Postgres error server-side only. Query Functions
 * throw a generic, translated Error after calling this so Server Components
 * never render a raw DB error message (SPEC 22장).
 */
export function logQueryError(context: string, error: unknown): void {
  console.error(`[query:${context}]`, error);
}
