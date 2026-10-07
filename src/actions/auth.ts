"use server";

/**
 * Admin authentication Server Actions (Phase 3 scope only): login, logout,
 * and the two password-reset steps. CRUD Server Actions for Posts/FAQ/... are
 * Phase 4/5 scope and live elsewhere.
 *
 * Each action follows the project-wide result shape `{ success, data?, error? }`.
 * Login/logout/reset-confirm redirect on success instead of returning, since
 * they are only ever called from a <form action={...}> in this Phase.
 */
import { redirect } from "next/navigation";
import { headers } from "next/headers";
import { createClient } from "@/lib/supabase/server";

export type AuthActionResult = { success: boolean; error?: string };

const MIN_PASSWORD_LENGTH = 8;

/** Only ever redirect back into `/admin/*`, never to an arbitrary external URL. */
function safeAdminRedirectPath(next: FormDataEntryValue | null): string {
  const value = typeof next === "string" ? next : "";
  if (value.startsWith("/admin") && !value.startsWith("//")) {
    return value;
  }
  return "/admin";
}

export async function login(
  _prevState: AuthActionResult | undefined,
  formData: FormData
): Promise<AuthActionResult> {
  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "");
  const next = safeAdminRedirectPath(formData.get("next"));

  if (!email || !password) {
    return { success: false, error: "이메일과 비밀번호를 입력해 주세요." };
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword({ email, password });

  if (error) {
    return { success: false, error: "이메일 또는 비밀번호가 올바르지 않습니다." };
  }

  redirect(next);
}

export async function logout(): Promise<void> {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/admin/login");
}

export async function requestPasswordReset(
  _prevState: AuthActionResult | undefined,
  formData: FormData
): Promise<AuthActionResult> {
  const email = String(formData.get("email") ?? "").trim();

  if (!email) {
    return { success: false, error: "이메일을 입력해 주세요." };
  }

  const origin = (await headers()).get("origin");
  const supabase = await createClient();
  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${origin}/auth/confirm?type=recovery&next=/admin/reset-password`,
  });

  if (error) {
    // Do not leak whether the email exists in the system.
    return { success: false, error: "재설정 이메일을 보내지 못했습니다. 잠시 후 다시 시도해 주세요." };
  }

  return { success: true };
}

export async function resetPassword(
  _prevState: AuthActionResult | undefined,
  formData: FormData
): Promise<AuthActionResult> {
  const password = String(formData.get("password") ?? "");
  const passwordConfirm = String(formData.get("passwordConfirm") ?? "");

  if (password.length < MIN_PASSWORD_LENGTH) {
    return { success: false, error: `비밀번호는 ${MIN_PASSWORD_LENGTH}자 이상이어야 합니다.` };
  }
  if (password !== passwordConfirm) {
    return { success: false, error: "비밀번호가 서로 일치하지 않습니다." };
  }

  const supabase = await createClient();

  // updateUser() requires the recovery session established by
  // `src/app/auth/confirm/route.ts` after the user clicked the email link.
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return {
      success: false,
      error: "재설정 세션이 만료되었습니다. 비밀번호 재설정을 다시 요청해 주세요.",
    };
  }

  const { error } = await supabase.auth.updateUser({ password });

  if (error) {
    return { success: false, error: "비밀번호를 변경하지 못했습니다. 다시 시도해 주세요." };
  }

  redirect("/admin/login?resetSuccess=1");
}
