/**
 * Session refresh + `/admin/*` route protection, run from the root
 * `middleware.ts` on every request.
 *
 * This is the only place session cookies are refreshed on GET navigations.
 * Server Components cannot write cookies (see `server.ts`'s `setAll` no-op
 * comment), so without this middleware, sessions would eventually go stale.
 *
 * Pattern follows the official `@supabase/ssr` Next.js middleware guide.
 */
import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

/**
 * `/admin` paths that must stay reachable without an authenticated session
 * (login itself, and the password-reset request/confirm pages).
 */
const PUBLIC_ADMIN_PATHS = [
  "/admin/login",
  "/admin/forgot-password",
  "/admin/reset-password",
];

function isPublicAdminPath(pathname: string): boolean {
  return PUBLIC_ADMIN_PATHS.some(
    (path) => pathname === path || pathname.startsWith(`${path}/`)
  );
}

export async function updateSession(request: NextRequest): Promise<NextResponse> {
  let supabaseResponse = NextResponse.next({ request });

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseAnonKey) {
    // No Supabase project connected yet (e.g. local dev before Phase 3's
    // env is provisioned). Don't block all navigation on a config error
    // here; `src/lib/supabase/*` will throw a clear error as soon as a
    // Server Component / Action actually needs Supabase.
    return supabaseResponse;
  }

  const supabase = createServerClient(supabaseUrl, supabaseAnonKey, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value }) =>
          request.cookies.set(name, value)
        );
        supabaseResponse = NextResponse.next({ request });
        cookiesToSet.forEach(({ name, value, options }) =>
          supabaseResponse.cookies.set(name, value, options)
        );
      },
    },
  });

  // Do not add logic between `createServerClient` and `getUser()`. `getUser()`
  // revalidates the token against Supabase Auth (unlike `getSession()`, which
  // only reads the local cookie), so it must run first and unmodified.
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { pathname } = request.nextUrl;
  const isAdminRoute = pathname === "/admin" || pathname.startsWith("/admin/");

  if (isAdminRoute && !isPublicAdminPath(pathname) && !user) {
    const loginUrl = request.nextUrl.clone();
    loginUrl.pathname = "/admin/login";
    loginUrl.search = "";
    loginUrl.searchParams.set("next", pathname);
    return NextResponse.redirect(loginUrl);
  }

  // IMPORTANT: `supabaseResponse` (not a fresh `NextResponse.next()`) must be
  // returned so the refreshed auth cookies set via `setAll` above are kept.
  return supabaseResponse;
}
