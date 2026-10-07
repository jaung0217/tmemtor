/** `posts` row type (supabase/migrations/002_posts.sql, SPEC 4.2). */
export interface Post {
  id: string;
  title: string;
  content: string;
  thumbnail: string | null;
  category_id: string | null;
  is_published: boolean;
  created_at: string;
  updated_at: string;
}
