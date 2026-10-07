/**
 * `media` row type (supabase/migrations/006_media.sql, SPEC 7장).
 * `storage_path` maps 1:1 to a Supabase Storage object in the `media` bucket
 * (see `src/actions/media.ts` for the bucket name and upload/delete rules).
 */
export interface Media {
  id: string;
  filename: string;
  storage_path: string;
  url: string;
  mime_type: string;
  size: number;
  created_at: string;
  updated_at: string;
}
