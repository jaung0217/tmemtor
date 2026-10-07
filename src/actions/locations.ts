"use server";

/**
 * Location Server Actions (SPEC 12장). Processing order for every mutation
 * (SPEC 14장): Authentication → Input Validation → Business Rule Validation
 * → Supabase Operation → Cache Revalidation → Result.
 *
 * No hierarchy fields are introduced here (SPEC 5장) — Geocoding of
 * `address` into `latitude`/`longitude` is Phase 6 scope; this layer only
 * persists whatever coordinates are passed in.
 */
import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/supabase/auth";
import { createClient } from "@/lib/supabase/server";
import type { ActionResult } from "@/types/common";
import type { Location } from "@/types/location";
import {
  locationCreateSchema,
  locationUpdateSchema,
  type LocationCreateInput,
  type LocationUpdateInput,
} from "@/validations/location";
import { errorMessage, firstValidationError, logAndMapDbError } from "./_shared";

export async function createLocation(input: LocationCreateInput): Promise<ActionResult<Location>> {
  const auth = await requireAdmin();
  if (!auth.success) return { success: false, error: auth.error };

  const parsed = locationCreateSchema.safeParse(input);
  if (!parsed.success) {
    return { success: false, error: firstValidationError(parsed.error.issues) };
  }

  const supabase = await createClient();
  const { data, error } = await supabase.from("locations").insert(parsed.data).select("*").single();

  if (error || !data) {
    return { success: false, error: logAndMapDbError("createLocation", error) };
  }

  revalidatePath("/admin/locations");
  return { success: true, data };
}

export async function updateLocation(
  id: string,
  input: LocationUpdateInput
): Promise<ActionResult<Location>> {
  const auth = await requireAdmin();
  if (!auth.success) return { success: false, error: auth.error };

  if (!id) return { success: false, error: errorMessage("VALIDATION_ERROR") };

  const parsed = locationUpdateSchema.safeParse(input);
  if (!parsed.success) {
    return { success: false, error: firstValidationError(parsed.error.issues) };
  }

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("locations")
    .update(parsed.data)
    .eq("id", id)
    .select("*")
    .maybeSingle();

  if (error) {
    return { success: false, error: logAndMapDbError("updateLocation", error) };
  }
  if (!data) {
    return { success: false, error: errorMessage("NOT_FOUND") };
  }

  revalidatePath("/admin/locations");
  revalidatePath(`/admin/locations/${id}`);
  return { success: true, data };
}

export async function deleteLocation(id: string): Promise<ActionResult<null>> {
  const auth = await requireAdmin();
  if (!auth.success) return { success: false, error: auth.error };

  if (!id) return { success: false, error: errorMessage("VALIDATION_ERROR") };

  const supabase = await createClient();
  const { error } = await supabase.from("locations").delete().eq("id", id);

  if (error) {
    return { success: false, error: logAndMapDbError("deleteLocation", error) };
  }

  revalidatePath("/admin/locations");
  return { success: true, data: null };
}
