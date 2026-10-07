"use server";

/**
 * Post Server Actions (SPEC 12장). Processing order for every mutation
 * (SPEC 14장): Authentication → Input Validation → Business Rule Validation
 * → Supabase Operation → Cache Revalidation → Result.
 */
import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/supabase/auth";
import { createClient } from "@/lib/supabase/server";
import type { ActionResult } from "@/types/common";
import type { Post } from "@/types/post";
import {
  postCreateSchema,
  postUpdateSchema,
  type PostCreateInput,
  type PostUpdateInput,
} from "@/validations/post";
import { errorMessage, firstValidationError, logAndMapDbError } from "./_shared";

type SupabaseServerClient = Awaited<ReturnType<typeof createClient>>;

/** Business rule: a provided `category_id` must reference an existing category. */
async function assertCategoryExists(
  supabase: SupabaseServerClient,
  categoryId: string | null | undefined
): Promise<string | null> {
  if (!categoryId) return null;

  const { data, error } = await supabase
    .from("categories")
    .select("id")
    .eq("id", categoryId)
    .maybeSingle();

  if (error) return logAndMapDbError("assertCategoryExists", error);
  if (!data) return "선택한 카테고리를 찾을 수 없습니다.";
  return null;
}

export async function createPost(input: PostCreateInput): Promise<ActionResult<Post>> {
  const auth = await requireAdmin();
  if (!auth.success) return { success: false, error: auth.error };

  const parsed = postCreateSchema.safeParse(input);
  if (!parsed.success) {
    return { success: false, error: firstValidationError(parsed.error.issues) };
  }

  const supabase = await createClient();

  const categoryError = await assertCategoryExists(supabase, parsed.data.category_id);
  if (categoryError) return { success: false, error: categoryError };

  const { data, error } = await supabase.from("posts").insert(parsed.data).select("*").single();

  if (error || !data) {
    return { success: false, error: logAndMapDbError("createPost", error) };
  }

  revalidatePath("/admin/posts");
  return { success: true, data };
}

export async function updatePost(id: string, input: PostUpdateInput): Promise<ActionResult<Post>> {
  const auth = await requireAdmin();
  if (!auth.success) return { success: false, error: auth.error };

  if (!id) return { success: false, error: errorMessage("VALIDATION_ERROR") };

  const parsed = postUpdateSchema.safeParse(input);
  if (!parsed.success) {
    return { success: false, error: firstValidationError(parsed.error.issues) };
  }

  const supabase = await createClient();

  if (parsed.data.category_id !== undefined) {
    const categoryError = await assertCategoryExists(supabase, parsed.data.category_id);
    if (categoryError) return { success: false, error: categoryError };
  }

  const { data, error } = await supabase
    .from("posts")
    .update(parsed.data)
    .eq("id", id)
    .select("*")
    .maybeSingle();

  if (error) {
    return { success: false, error: logAndMapDbError("updatePost", error) };
  }
  if (!data) {
    return { success: false, error: errorMessage("NOT_FOUND") };
  }

  revalidatePath("/admin/posts");
  revalidatePath(`/admin/posts/${id}`);
  return { success: true, data };
}

export async function deletePost(id: string): Promise<ActionResult<null>> {
  const auth = await requireAdmin();
  if (!auth.success) return { success: false, error: auth.error };

  if (!id) return { success: false, error: errorMessage("VALIDATION_ERROR") };

  const supabase = await createClient();
  const { error } = await supabase.from("posts").delete().eq("id", id);

  if (error) {
    return { success: false, error: logAndMapDbError("deletePost", error) };
  }

  revalidatePath("/admin/posts");
  return { success: true, data: null };
}
