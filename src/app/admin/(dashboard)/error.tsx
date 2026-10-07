"use client";

/**
 * Catches errors thrown by Query Functions (src/queries/*, Phase 4) used
 * directly in these Server Components. Query Functions already translate raw
 * Supabase/Postgres errors into a safe, Korean message before throwing (see
 * src/queries/_shared.ts), so `error.message` here is already user-facing —
 * this boundary just avoids Next.js's default error screen.
 */
import { useEffect } from "react";
import { buttonPrimaryClass } from "./_components/ui";

export default function AdminDashboardError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("[admin]", error);
  }, [error]);

  return (
    <div className="flex flex-col items-center justify-center gap-4 py-16 text-center">
      <p className="text-sm text-zinc-700">{error.message || "알 수 없는 오류가 발생했습니다."}</p>
      <button type="button" onClick={() => reset()} className={buttonPrimaryClass}>
        다시 시도
      </button>
    </div>
  );
}
