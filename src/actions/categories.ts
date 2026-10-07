"use server";

/**
 * Category Server Actions (SPEC 12장). Processing order for every mutation
 * (SPEC 14장): Authentication → Input Validation → Business Rule Validation
 * → Supabase Operation → Cache Revalidation → Result.
 */
import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/supabase/auth";
import { createClient } from "@/lib/supabase/server";
import type { ActionResult } from "@/types/common";
import type { Category } from "@/types/category";
import {
  categoryCreateSchema,
  categoryUpdateSchema,
  type CategoryCreateInput,
  type CategoryUpdateInput,
} from "@/validations/category";
import { errorMessage, firstValidationError, logAndMapDbError } from "./_shared";

export async function createCategory(input: CategoryCreateInput): Promise<ActionResult<Category>> {
  // 1) Authentication
  const auth = await requireAdmin();
  if (!auth.success) return { success: false, error: auth.error };

  // 2) Input Validation
  const parsed = categoryCreateSchema.safeParse(input);
  if (!parsed.success) {
    return { success: false, error: firstValidationError(parsed.error.issues) };
  }

  const supabase = await createClient();

  // 3) Business Rule Validation — slug must be unique (DB unique index is defense-in-depth)
  const { data: existing, error: existingError } = await supabase
    .from("categories")
    .select("id")
    .eq("slug", parsed.data.slug)
    .maybeSingle();

  if (existingError) {
    return { success: false, error: logAndMapDbError("createCategory:checkSlug", existingError) };
  }
  if (existing) {
    return { success: false, error: "이미 사용 중인 슬러그입니다." };
  }

  // 4) Supabase Operation
  const { data, error } = await supabase.from("categories").insert(parsed.data).select("*").single();

  if (error || !data) {
    return { success: false, error: logAndMapDbError("createCategory", error) };
  }

  // 5) Cache Revalidation
  revalidatePath("/admin/categories");

  // 6) Result
  return { success: true, data };
}

export async function updateCategory(
  id: string,
  input: CategoryUpdateInput
): Promise<ActionResult<Category>> {
  const auth = await requireAdmin();
  if (!auth.success) return { success: false, error: auth.error };

  if (!id) return { success: false, error: errorMessage("VALIDATION_ERROR") };

  const parsed = categoryUpdateSchema.safeParse(input);
  if (!parsed.success) {
    return { success: false, error: firstValidationError(parsed.error.issues) };
  }

  const supabase = await createClient();

  if (parsed.data.slug) {
    const { data: existing, error: existingError } = await supabase
      .from("categories")
      .select("id")
      .eq("slug", parsed.data.slug)
      .neq("id", id)
      .maybeSingle();

    if (existingError) {
      return { success: false, error: logAndMapDbError("updateCategory:checkSlug", existingError) };
    }
    if (existing) {
      return { success: false, error: "이미 사용 중인 슬러그입니다." };
    }
  }

  const { data, error } = await supabase
    .from("categories")
    .update(parsed.data)
    .eq("id", id)
    .select("*")
    .maybeSingle();

  if (error) {
    return { success: false, error: logAndMapDbError("updateCategory", error) };
  }
  if (!data) {
    return { success: false, error: errorMessage("NOT_FOUND") };
  }

  revalidatePath("/admin/categories");
  return { success: true, data };
}

export async function deleteCategory(id: string): Promise<ActionResult<null>> {
  const auth = await requireAdmin();
  if (!auth.success) return { success: false, error: auth.error };

  if (!id) return { success: false, error: errorMessage("VALIDATION_ERROR") };

  const supabase = await createClient();
  const { error } = await supabase.from("categories").delete().eq("id", id);

  if (error) {
    return { success: false, error: logAndMapDbError("deleteCategory", error) };
  }

  revalidatePath("/admin/categories");
  return { success: true, data: null };
}
