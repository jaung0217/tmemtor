/**
 * Inquiry Query Functions (SPEC 11장). Admin-only by nature — RLS has no
 * `anon` SELECT policy on `inquiries` (SPEC 9장), so these will return no
 * rows unless called with an authenticated (admin) session.
 */
import "server-only";

import { createClient } from "@/lib/supabase/server";
import type { Inquiry } from "@/types/inquiry";
import { logQueryError } from "./_shared";

/** Admin: all inquiries, newest first. */
export async function getInquiries(): Promise<Inquiry[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("inquiries")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    logQueryError("getInquiries", error);
    throw new Error("문의 목록을 불러오지 못했습니다.");
  }

  return data ?? [];
}

/** Admin: single inquiry by id. */
export async function getInquiry(id: string): Promise<Inquiry | null> {
  const supabase = await createClient();
  const { data, error } = await supabase.from("inquiries").select("*").eq("id", id).maybeSingle();

  if (error) {
    logQueryError("getInquiry", error);
    throw new Error("문의를 불러오지 못했습니다.");
  }

  return data;
}
