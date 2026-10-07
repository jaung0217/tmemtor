/**
 * Site Settings Query Function (SPEC 11장).
 *
 * KNOWN LIMITATION (see OPEN_ISSUES.md #9, reconfirmed for Phase 4): RLS on
 * `site_settings` currently only has an `authenticated` (admin) policy — there
 * is no `anon` SELECT policy (supabase/migrations/007_settings.sql). That is a
 * deliberate Phase 2 decision pending a team call on which columns (if any)
 * are safe to expose publicly, and is intentionally NOT changed here.
 *
 * Practical effect: calling `getSiteSettings()` from a Public (unauthenticated)
 * Server Component will get `data: null` back (RLS silently filters the row),
 * not an error. Callers must handle a `null` result. Once Phase 2/product
 * decides on public exposure, a follow-up migration should add a scoped
 * `anon` SELECT policy (e.g. limited to non-sensitive columns) and this
 * comment should be removed.
 */
import "server-only";

import { createClient } from "@/lib/supabase/server";
import type { SiteSettings } from "@/types/site-settings";
import { logQueryError } from "./_shared";

/**
 * Returns the single Site Settings row, or `null` if none exists yet
 * (or — for unauthenticated callers — because RLS hides it; see module doc).
 */
export async function getSiteSettings(): Promise<SiteSettings | null> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("site_settings")
    .select("*")
    .order("created_at", { ascending: true })
    .limit(1)
    .maybeSingle();

  if (error) {
    logQueryError("getSiteSettings", error);
    throw new Error("사이트 설정을 불러오지 못했습니다.");
  }

  return data;
}
