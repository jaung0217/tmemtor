"use server";

/**
 * Media Server Actions (SPEC 12장, 19장, 7장).
 *
 * Storage bucket: "media" (Supabase Storage). This name is not specified by
 * SPEC 7/19장 — chosen here and must be created in the Supabase project
 * (Dashboard → Storage → New bucket "media") before this action can be used.
 *
 * Upload order mandated by SPEC 19장:
 *   MIME Type 검증 → 확장자 검증 → 파일 크기 검증 → Storage 업로드 → DB 기록
 * (the first three live in `src/validations/media.ts`).
 *
 * Storage/DB consistency (SPEC 7장 "Storage와 DB 데이터의 삭제 상태가
 * 불일치하지 않도록 처리"):
 *  - upload: if the DB insert fails after a successful Storage upload, the
 *    uploaded object is rolled back (removed) so no orphaned file is left
 *    without a DB record.
 *  - delete: the DB record is deleted first (this is what Admin/Public
 *    actually see), then the Storage object. If the Storage removal then
 *    fails, we log it server-side and still report success — a leftover
 *    Storage blob with no DB reference is preferred over a DB record that
 *    points at a file which no longer displays correctly.
 */
import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/supabase/auth";
import { createClient } from "@/lib/supabase/server";
import type { ActionResult } from "@/types/common";
import type { Media } from "@/types/media";
import { getFileExtension, validateMediaFile } from "@/validations/media";
import { errorMessage, logAndMapDbError } from "./_shared";

// Not exported: a `"use server"` file may only export async functions
// (Next.js build-time restriction) — this constant is only used internally
// within this module. (Phase 5 fix: this previously broke the build because
// the whole `src/actions/media.ts` module failed to compile.)
const MEDIA_BUCKET = "media";

export interface UploadMediaInput {
  file: File;
}

export async function uploadMedia(input: UploadMediaInput): Promise<ActionResult<Media>> {
  const auth = await requireAdmin();
  if (!auth.success) return { success: false, error: auth.error };

  const file = input?.file;

  // Input Validation — MIME Type → 확장자 → 파일 크기, in that order (SPEC 19장)
  const validationError = validateMediaFile(
    file ? { name: file.name, type: file.type, size: file.size } : null
  );
  if (validationError) {
    return { success: false, error: validationError.message };
  }

  const supabase = await createClient();
  const extension = getFileExtension(file.name);
  const storagePath = `${auth.user.id}/${crypto.randomUUID()}.${extension}`;

  // Storage 업로드
  const { error: uploadError } = await supabase.storage
    .from(MEDIA_BUCKET)
    .upload(storagePath, file, { contentType: file.type, upsert: false });

  if (uploadError) {
    console.error("[action:uploadMedia:storage]", uploadError);
    return { success: false, error: errorMessage("STORAGE_ERROR") };
  }

  const {
    data: { publicUrl },
  } = supabase.storage.from(MEDIA_BUCKET).getPublicUrl(storagePath);

  // DB 기록
  const { data, error } = await supabase
    .from("media")
    .insert({
      filename: file.name,
      storage_path: storagePath,
      url: publicUrl,
      mime_type: file.type,
      size: file.size,
    })
    .select("*")
    .single();

  if (error || !data) {
    // Roll back the Storage upload so it doesn't become an orphaned object
    // with no matching DB record.
    await supabase.storage.from(MEDIA_BUCKET).remove([storagePath]);
    return { success: false, error: logAndMapDbError("uploadMedia:db", error) };
  }

  revalidatePath("/admin/media");
  return { success: true, data };
}

export async function deleteMedia(id: string): Promise<ActionResult<null>> {
  const auth = await requireAdmin();
  if (!auth.success) return { success: false, error: auth.error };

  if (!id) return { success: false, error: errorMessage("VALIDATION_ERROR") };

  const supabase = await createClient();

  const { data: media, error: fetchError } = await supabase
    .from("media")
    .select("id, storage_path")
    .eq("id", id)
    .maybeSingle();

  if (fetchError) {
    return { success: false, error: logAndMapDbError("deleteMedia:fetch", fetchError) };
  }
  if (!media) {
    return { success: false, error: errorMessage("NOT_FOUND") };
  }

  const { error: dbError } = await supabase.from("media").delete().eq("id", id);

  if (dbError) {
    return { success: false, error: logAndMapDbError("deleteMedia:db", dbError) };
  }

  const { error: storageError } = await supabase.storage
    .from(MEDIA_BUCKET)
    .remove([media.storage_path]);

  if (storageError) {
    // DB record is already gone (no dangling reference visible to users);
    // log the leftover Storage object for manual/periodic cleanup.
    console.error("[action:deleteMedia:storage]", storageError);
  }

  revalidatePath("/admin/media");
  return { success: true, data: null };
}
