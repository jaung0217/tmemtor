/**
 * Supabase client for Server Components / Server Actions / Route Handlers.
 *
 * `server-only` guarantees this module (and any cookie/session handling
 * inside it) can never be bundled into Client Component code.
 *
 * Only uses public, non-secret environment variables
 * (NEXT_PUBLIC_SUPABASE_URL / NEXT_PUBLIC_SUPABASE_ANON_KEY).
 * A service-role key is not introduced in Phase 1; if a future phase needs
 * one, it must stay server-only and must never be prefixed with NEXT_PUBLIC_.
 */
import "server-only";

import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

export async function createClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error(
      "Missing NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_ANON_KEY. " +
        "Set them in .env.local (see .env.local.example)."
    );
  }

  const cookieStore = await cookies();

  return createServerClient(supabaseUrl, supabaseAnonKey, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet) {
        try {
          cookiesToSet.forEach(({ name, value, options }) =>
            cookieStore.set(name, value, options)
          );
        } catch {
          // `setAll` was called from a Server Component (not a Server
          // Action / Route Handler). This is safe to ignore as long as
          // session refresh is handled elsewhere (Phase 3: middleware).
        }
      },
    },
  });
}
