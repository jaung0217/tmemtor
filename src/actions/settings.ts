"use server";

/**
 * Site Settings Server Action (SPEC 12장). `site_settings` has no enforced
 * singleton constraint at the DB level (see supabase/migrations/007_settings.sql),
 * so this action treats "the earliest-created row" as the one row and
 * upserts it: updates it if present, otherwise creates it on first save.
 *
 * Processing order (SPEC 14장): Authentication → Input Validation →
 * Business Rule Validation → Supabase Operation → Cache Revalidation → Result.
 */
import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/supabase/auth";
import { createClient } from "@/lib/supabase/server";
import type { ActionResult } from "@/types/common";
import type { SiteSettings } from "@/types/site-settings";
import { siteSettingsUpdateSchema, type SiteSettingsUpdateInput } from "@/validations/site-settings";
import { firstValidationError, logAndMapDbError } from "./_shared";

export async function updateSiteSettings(
  input: SiteSettingsUpdateInput
): Promise<ActionResult<SiteSettings>> {
  const auth = await requireAdmin();
  if (!auth.success) return { success: false, error: auth.error };

  const parsed = siteSettingsUpdateSchema.safeParse(input);
  if (!parsed.success) {
    return { success: false, error: firstValidationError(parsed.error.issues) };
  }

  const supabase = await createClient();

  const { data: existing, error: fetchError } = await supabase
    .from("site_settings")
    .select("id")
    .order("created_at", { ascending: true })
    .limit(1)
    .maybeSingle();

  if (fetchError) {
    return { success: false, error: logAndMapDbError("updateSiteSettings:fetch", fetchError) };
  }

  const { data, error } = existing
    ? await supabase
        .from("site_settings")
        .update(parsed.data)
        .eq("id", existing.id)
        .select("*")
        .single()
    : await supabase.from("site_settings").insert(parsed.data).select("*").single();

  if (error || !data) {
    return { success: false, error: logAndMapDbError("updateSiteSettings", error) };
  }

  revalidatePath("/admin/settings");
  return { success: true, data };
}
