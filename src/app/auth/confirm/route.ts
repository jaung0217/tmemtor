/**
 * Supabase email-link confirmation endpoint.
 *
 * Supabase Auth emails (password recovery in this Phase) link here with
 * `token_hash` + `type` query params instead of a session directly. This
 * route exchanges them for a real session (cookies set via the shared
 * server Supabase client) and then redirects to `next`.
 *
 * Only used for the admin password-reset flow in Phase 3 scope; not a
 * general-purpose auth callback for user signup/social login (out of scope).
 */
import { type EmailOtpType } from "@supabase/supabase-js";
import { redirect } from "next/navigation";
import { NextResponse, type NextRequest } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url);
  const tokenHash = searchParams.get("token_hash");
  const type = searchParams.get("type") as EmailOtpType | null;
  const next = searchParams.get("next") ?? "/admin";

  const redirectPath = next.startsWith("/admin") && !next.startsWith("//") ? next : "/admin";

  if (tokenHash && type) {
    const supabase = await createClient();
    const { error } = await supabase.auth.verifyOtp({
      type,
      token_hash: tokenHash,
    });

    if (!error) {
      redirect(redirectPath);
    }
  }

  // Invalid/expired link: send back to the request-a-reset page with an
  // error flag instead of a broken authenticated-only page.
  return NextResponse.redirect(`${origin}/admin/forgot-password?error=invalid_link`);
}
