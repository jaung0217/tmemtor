/**
 * `categories` row type (supabase/migrations/003_categories.sql, SPEC 4.1).
 * `posts` and `faqs` both reference this single shared table
 * (see OPEN_ISSUES.md #3 — no separate scope/type split).
 */
export interface Category {
  id: string;
  name: string;
  slug: string;
  sort_order: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}
