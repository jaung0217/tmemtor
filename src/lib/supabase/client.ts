/**
 * Supabase client for Browser / Client Components.
 *
 * Only uses public, non-secret environment variables
 * (NEXT_PUBLIC_SUPABASE_URL / NEXT_PUBLIC_SUPABASE_ANON_KEY).
 * Never import a service-role key or other secret into this file.
 */
import { createBrowserClient } from "@supabase/ssr";

export function createClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error(
      "Missing NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_ANON_KEY. " +
        "Set them in .env.local (see .env.local.example)."
    );
  }

  return createBrowserClient(supabaseUrl, supabaseAnonKey);
}
