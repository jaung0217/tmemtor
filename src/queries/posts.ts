/** Post Query Functions (SPEC 11장). No UI here — Server Components call these directly. */
import "server-only";

import { createClient } from "@/lib/supabase/server";
import type { Post } from "@/types/post";
import { logQueryError } from "./_shared";

/** Admin: all posts regardless of publish status, newest first. */
export async function getPosts(): Promise<Post[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("posts")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    logQueryError("getPosts", error);
    throw new Error("게시물 목록을 불러오지 못했습니다.");
  }

  return data ?? [];
}

/** Single post by id (any status) — used by Admin edit screens. */
export async function getPost(id: string): Promise<Post | null> {
  const supabase = await createClient();
  const { data, error } = await supabase.from("posts").select("*").eq("id", id).maybeSingle();

  if (error) {
    logQueryError("getPost", error);
    throw new Error("게시물을 불러오지 못했습니다.");
  }

  return data;
}

/**
 * Public: only `is_published = true` posts. RLS also enforces this for
 * unauthenticated requests; this filter keeps the two layers consistent.
 */
export async function getPublishedPosts(): Promise<Post[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("posts")
    .select("*")
    .eq("is_published", true)
    .order("created_at", { ascending: false });

  if (error) {
    logQueryError("getPublishedPosts", error);
    throw new Error("게시물 목록을 불러오지 못했습니다.");
  }

  return data ?? [];
}
