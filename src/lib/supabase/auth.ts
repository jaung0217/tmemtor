/**
 * Server-side authentication helpers.
 *
 * MVP has no separate admin/role table (see `supabase/migrations/001_admin.sql`):
 * any authenticated Supabase Auth user IS the admin. Do not extend this into
 * a bigger role/permission system (SPEC 27.3 / CLAUDE.md).
 *
 * Every Admin Server Action (Phase 4+) MUST call `requireAdmin()` as its
 * first step, per the mandated order:
 *   Auth → Input Validation → Business Rule Validation → Supabase Operation
 *   → Cache Revalidation
 *
 * Usage in a Server Action:
 *
 *   "use server";
 *   import { requireAdmin } from "@/lib/supabase/auth";
 *
 *   export async function createPost(input: CreatePostInput): Promise<ActionResult<Post>> {
 *     const auth = await requireAdmin();
 *     if (!auth.success) return { success: false, error: auth.error };
 *
 *     // ... validation, then Supabase operation using auth.user / a fresh client
 *   }
 */
import "server-only";

import type { User } from "@supabase/supabase-js";
import { createClient } from "./server";

export type RequireAdminResult =
  | { success: true; user: User }
  | { success: false; error: string };

/**
 * Verifies the current request has a valid, server-revalidated Supabase Auth
 * session. Returns a discriminated union so callers can compose it directly
 * into the project-wide `{ success, data?, error? }` Server Action result
 * shape (see CLAUDE.md / SPEC 14장).
 *
 * Uses `supabase.auth.getUser()` (not `getSession()`) because it revalidates
 * the token against the Supabase Auth server instead of trusting the local
 * cookie, which is required since authorization decisions happen here.
 */
export async function requireAdmin(): Promise<RequireAdminResult> {
  const supabase = await createClient();
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error || !user) {
    return { success: false, error: "로그인이 필요합니다." };
  }

  return { success: true, user };
}

/**
 * Convenience helper for Server Components that just need to know whether
 * someone is logged in (e.g. to show an email in a header), without the
 * Server Action result shape. Returns `null` when not authenticated.
 */
export async function getAuthUser(): Promise<User | null> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return user;
}
