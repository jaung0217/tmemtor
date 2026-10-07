/**
 * Category Query Functions (SPEC 11장). No UI here — Server Components call
 * these directly.
 */
import "server-only";

import { createClient } from "@/lib/supabase/server";
import type { Category } from "@/types/category";
import { logQueryError } from "./_shared";

/** Admin: all categories, ordered for management screens. */
export async function getCategories(): Promise<Category[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("categories")
    .select("*")
    .order("sort_order", { ascending: true })
    .order("created_at", { ascending: false });

  if (error) {
    logQueryError("getCategories", error);
    throw new Error("카테고리 목록을 불러오지 못했습니다.");
  }

  return data ?? [];
}

/** Single category by id (any status) — used by Admin edit screens. */
export async function getCategory(id: string): Promise<Category | null> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("categories")
    .select("*")
    .eq("id", id)
    .maybeSingle();

  if (error) {
    logQueryError("getCategory", error);
    throw new Error("카테고리를 불러오지 못했습니다.");
  }

  return data;
}

/**
 * Public: only `is_active = true` categories. RLS also enforces this for
 * unauthenticated requests; this filter keeps the two layers consistent.
 */
export async function getActiveCategories(): Promise<Category[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("categories")
    .select("*")
    .eq("is_active", true)
    .order("sort_order", { ascending: true });

  if (error) {
    logQueryError("getActiveCategories", error);
    throw new Error("카테고리 목록을 불러오지 못했습니다.");
  }

  return data ?? [];
}
