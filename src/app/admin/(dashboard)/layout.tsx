import { getAuthUser } from "@/lib/supabase/auth";
import { logout } from "@/actions/auth";
import { AdminNav } from "./_components/AdminNav";

/**
 * Shell (sidebar nav + header) for every authenticated Admin CMS screen
 * (SPEC 15장). Deliberately scoped to the `(dashboard)` route group so it
 * does NOT wrap `/admin/login`, `/admin/forgot-password`, `/admin/reset-password`
 * — those stay outside this group at `src/app/admin/*` and keep their own
 * centered, unauthenticated layout.
 *
 * Route-level protection itself is already handled by `middleware.ts`
 * (Phase 3) for every `/admin/*` path except the three above — this layout
 * only reads the user for display, it does not re-implement auth checks.
 *
 * Every screen under here reads the current session/user-specific data
 * (Supabase cookies), so none of it may ever be statically prerendered or
 * cached across users — force dynamic rendering for this whole segment.
 */
export const dynamic = "force-dynamic";
export default async function AdminDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getAuthUser();

  return (
    <div className="flex min-h-screen flex-1">
      <aside className="hidden w-56 shrink-0 flex-col border-r border-zinc-200 bg-zinc-50 px-4 py-6 sm:flex">
        <p className="mb-6 px-3 text-sm font-semibold text-zinc-900">Admin CMS</p>
        <AdminNav />
      </aside>

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="flex items-center justify-between border-b border-zinc-200 px-6 py-3">
          <span className="truncate text-sm text-zinc-500">{user?.email}</span>
          <form action={logout}>
            <button
              type="submit"
              className="rounded-md border border-zinc-300 px-3 py-1.5 text-sm font-medium text-zinc-700"
            >
              로그아웃
            </button>
          </form>
        </header>

        <main className="min-w-0 flex-1 px-6 py-6">{children}</main>
      </div>
    </div>
  );
}
