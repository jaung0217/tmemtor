/**
 * Media Query Functions. Not explicitly listed in SPEC 11장 (which only
 * defines Posts/Categories/FAQ/Inquiries/Locations/Settings queries), but
 * required for the Admin Media Library screen (SPEC 15장 `/admin/media`) to
 * function at all, and for DoD ("모든 엔티티에 대해 Query Function ... 존재") —
 * added as a minimal, same-pattern extension. `media` has no Public RLS
 * policy (SPEC 9장 / 006_media.sql), so this is admin-only by construction.
 */
import "server-only";

import { createClient } from "@/lib/supabase/server";
import type { Media } from "@/types/media";
import { logQueryError } from "./_shared";

/** Admin: all media, newest first. */
export async function getMediaList(): Promise<Media[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("media")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    logQueryError("getMediaList", error);
    throw new Error("미디어 목록을 불러오지 못했습니다.");
  }

  return data ?? [];
}

/** Admin: single media item by id. */
export async function getMedia(id: string): Promise<Media | null> {
  const supabase = await createClient();
  const { data, error } = await supabase.from("media").select("*").eq("id", id).maybeSingle();

  if (error) {
    logQueryError("getMedia", error);
    throw new Error("미디어를 불러오지 못했습니다.");
  }

  return data;
}
