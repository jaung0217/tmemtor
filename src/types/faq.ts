/** `faqs` row type (supabase/migrations/004_faq.sql, SPEC 4.3). */
export interface Faq {
  id: string;
  question: string;
  answer: string;
  category_id: string | null;
  is_published: boolean;
  sort_order: number;
  created_at: string;
  updated_at: string;
}
