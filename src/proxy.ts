import { NextResponse, type NextRequest } from "next/server";
// SUPABASE-DISABLED: Supabase 미사용 중 — 재연결 시 아래 import와 proxy 본문 주석 해제.
// import { updateSession } from "@/lib/supabase/middleware";

export function proxy(request: NextRequest) {
  // SUPABASE-DISABLED: 세션 갱신 + /admin 보호. 재연결 시 아래 줄로 교체.
  // return updateSession(request);
  void request;
  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Run on every route except static assets / image optimization files,
     * so session cookies stay fresh across the whole app. `/admin/*`
     * protection itself is scoped inside `updateSession`.
     */
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico)$).*)",
  ],
};
