/** FAQ Query Functions (SPEC 11장). No UI here — Server Components call these directly. */
import "server-only";

import { createClient } from "@/lib/supabase/server";
import type { Faq } from "@/types/faq";
import { logQueryError } from "./_shared";

/** Admin: all FAQs regardless of publish status. */
export async function getFaqs(): Promise<Faq[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("faqs")
    .select("*")
    .order("sort_order", { ascending: true })
    .order("created_at", { ascending: false });

  if (error) {
    logQueryError("getFaqs", error);
    throw new Error("FAQ 목록을 불러오지 못했습니다.");
  }

  return data ?? [];
}

/** Single FAQ by id (any status) — used by Admin edit screens. */
export async function getFaq(id: string): Promise<Faq | null> {
  const supabase = await createClient();
  const { data, error } = await supabase.from("faqs").select("*").eq("id", id).maybeSingle();

  if (error) {
    logQueryError("getFaq", error);
    throw new Error("FAQ를 불러오지 못했습니다.");
  }

  return data;
}

/**
 * Public: only `is_published = true` FAQs. RLS also enforces this for
 * unauthenticated requests; this filter keeps the two layers consistent.
 */
export async function getPublishedFaqs(): Promise<Faq[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("faqs")
    .select("*")
    .eq("is_published", true)
    .order("sort_order", { ascending: true });

  if (error) {
    logQueryError("getPublishedFaqs", error);
    throw new Error("FAQ 목록을 불러오지 못했습니다.");
  }

  return data ?? [];
}
