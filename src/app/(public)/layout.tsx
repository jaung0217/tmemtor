import { Header } from "./_components/Header";
import { Footer } from "./_components/Footer";

/**
 * Shell (header + footer) for the Public Website, scoped to the `(public)`
 * route group so it never wraps `src/app/admin/*` (CLAUDE.md — Admin CMS
 * and Public Website are kept separate; no Admin link is ever exposed here).
 *
 * `/contact` (src/app/(public)/contact/page.tsx) calls the existing
 * `getSiteSettings()` Query Function, which opens a Supabase server client.
 * This project has no `.env.local` configured yet (intentional, per task
 * scope), so that call must never run during `next build`'s static
 * prerender pass. Forcing the whole `(public)` segment dynamic — the same
 * `export const dynamic = "force-dynamic"` pattern already used by
 * `src/app/admin/(dashboard)/layout.tsx` — keeps the build green regardless
 * of which public page ends up calling Supabase.
 */
export const dynamic = "force-dynamic";

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen flex-1 flex-col">
      <Header />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  );
}
