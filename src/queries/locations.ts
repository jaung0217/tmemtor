/** Location Query Functions (SPEC 11장). No UI here — Server Components call these directly. */
import "server-only";

import { createClient } from "@/lib/supabase/server";
import type { Location } from "@/types/location";
import { logQueryError } from "./_shared";

/** Admin: all locations regardless of visibility, in display order. */
export async function getLocations(): Promise<Location[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("locations")
    .select("*")
    .order("sort_order", { ascending: true })
    .order("created_at", { ascending: false });

  if (error) {
    logQueryError("getLocations", error);
    throw new Error("장소 목록을 불러오지 못했습니다.");
  }

  return data ?? [];
}

/** Single location by id (any status) — used by Admin edit screens. */
export async function getLocation(id: string): Promise<Location | null> {
  const supabase = await createClient();
  const { data, error } = await supabase.from("locations").select("*").eq("id", id).maybeSingle();

  if (error) {
    logQueryError("getLocation", error);
    throw new Error("장소를 불러오지 못했습니다.");
  }

  return data;
}

/**
 * Public: only `is_active = true` locations. RLS also enforces this for
 * unauthenticated requests; this filter keeps the two layers consistent.
 */
export async function getActiveLocations(): Promise<Location[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("locations")
    .select("*")
    .eq("is_active", true)
    .order("sort_order", { ascending: true });

  if (error) {
    logQueryError("getActiveLocations", error);
    throw new Error("장소 목록을 불러오지 못했습니다.");
  }

  return data ?? [];
}
