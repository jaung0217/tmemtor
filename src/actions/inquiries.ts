"use server";

/**
 * Inquiry Server Actions (SPEC 12장).
 *
 * `createInquiry` is intentionally Public (no `requireAdmin()` call) — SPEC
 * 9/12장 require anonymous visitors to be able to submit an inquiry. Its
 * business-rule gate is `privacy_agreed === true`, enforced both here
 * (Validation) and by the DB (`inquiries_public_insert` RLS policy,
 * defense-in-depth — see supabase/migrations/005_inquiries.sql).
 *
 * `updateInquiryStatus` / `deleteInquiry` are Admin-only and follow the
 * standard SPEC 14장 order: Authentication → Input Validation → Business
 * Rule Validation → Supabase Operation → Cache Revalidation → Result.
 */
import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/supabase/auth";
import { createClient } from "@/lib/supabase/server";
import type { ActionResult } from "@/types/common";
import type { Inquiry, InquiryStatus } from "@/types/inquiry";
import { inquiryCreateSchema, inquiryStatusSchema, type InquiryCreateInput } from "@/validations/inquiry";
import { errorMessage, firstValidationError, logAndMapDbError } from "./_shared";

export async function createInquiry(input: InquiryCreateInput): Promise<ActionResult<Inquiry>> {
  // Input Validation (includes the privacy_agreed === true business rule)
  const parsed = inquiryCreateSchema.safeParse(input);
  if (!parsed.success) {
    return { success: false, error: firstValidationError(parsed.error.issues) };
  }

  // Business Rule Validation (explicit, even though the schema already
  // enforces this — keeps the mandated SPEC 14장 step visible/auditable).
  if (parsed.data.privacy_agreed !== true) {
    return { success: false, error: "개인정보 수집·이용에 동의해야 문의를 등록할 수 있습니다." };
  }

  // `anon` has no SELECT policy on `inquiries` (by design -- Public must never
  // read back existing/other inquiries, see 005_inquiries.sql). A plain
  // `.insert(...).select()` would ask PostgREST to read the row back after
  // insert, which RLS rejects with a 42501 error even though the INSERT
  // itself is allowed -- the insert looks like it "failed" when it didn't.
  // So we generate the id/timestamps ourselves and skip the read-back.
  const id = crypto.randomUUID();
  const now = new Date().toISOString();
  const row: Inquiry = {
    id,
    ...parsed.data,
    email: parsed.data.email ?? null,
    phone: parsed.data.phone ?? null,
    status: "NEW",
    created_at: now,
    updated_at: now,
  };

  const supabase = await createClient();
  const { error } = await supabase.from("inquiries").insert(row);

  if (error) {
    return { success: false, error: logAndMapDbError("createInquiry", error) };
  }

  revalidatePath("/admin/inquiries");
  return { success: true, data: row };
}

export async function updateInquiryStatus(
  id: string,
  status: InquiryStatus
): Promise<ActionResult<Inquiry>> {
  const auth = await requireAdmin();
  if (!auth.success) return { success: false, error: auth.error };

  if (!id) return { success: false, error: errorMessage("VALIDATION_ERROR") };

  const parsedStatus = inquiryStatusSchema.safeParse(status);
  if (!parsedStatus.success) {
    return { success: false, error: "올바르지 않은 상태값입니다." };
  }

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("inquiries")
    .update({ status: parsedStatus.data })
    .eq("id", id)
    .select("*")
    .maybeSingle();

  if (error) {
    return { success: false, error: logAndMapDbError("updateInquiryStatus", error) };
  }
  if (!data) {
    return { success: false, error: errorMessage("NOT_FOUND") };
  }

  revalidatePath("/admin/inquiries");
  revalidatePath(`/admin/inquiries/${id}`);
  return { success: true, data };
}

export async function deleteInquiry(id: string): Promise<ActionResult<null>> {
  const auth = await requireAdmin();
  if (!auth.success) return { success: false, error: auth.error };

  if (!id) return { success: false, error: errorMessage("VALIDATION_ERROR") };

  const supabase = await createClient();
  const { error } = await supabase.from("inquiries").delete().eq("id", id);

  if (error) {
    return { success: false, error: logAndMapDbError("deleteInquiry", error) };
  }

  revalidatePath("/admin/inquiries");
  return { success: true, data: null };
}
