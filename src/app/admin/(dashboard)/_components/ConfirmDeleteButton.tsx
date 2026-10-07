"use client";

/**
 * Generic delete trigger reused by every Admin list screen. Calls whichever
 * `delete*` Server Action the caller passes in (Phase 4) and follows the
 * shared pattern: confirm → Server Action → Success/Error → Refresh
 * (SPEC 15장). Errors from `ActionResult.error` are shown as-is (already
 * user-friendly — see src/actions/_shared.ts), never a raw server error.
 */
import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import type { ActionResult } from "@/types/common";
import { errorTextClass } from "./ui";

interface ConfirmDeleteButtonProps {
  id: string;
  action: (id: string) => Promise<ActionResult<null>>;
  confirmMessage?: string;
  label?: string;
  /** Called after a successful delete, in addition to `router.refresh()` (e.g. to navigate away from a detail page). */
  onDeleted?: () => void;
}

export function ConfirmDeleteButton({
  id,
  action,
  confirmMessage = "정말 삭제하시겠습니까? 이 작업은 되돌릴 수 없습니다.",
  label = "삭제",
  onDeleted,
}: ConfirmDeleteButtonProps) {
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  function handleClick() {
    if (typeof window !== "undefined" && !window.confirm(confirmMessage)) return;

    setError(null);
    startTransition(async () => {
      const result = await action(id);
      if (!result.success) {
        setError(result.error);
        return;
      }
      if (onDeleted) {
        onDeleted();
      } else {
        router.refresh();
      }
    });
  }

  return (
    <div className="inline-flex flex-col items-start gap-1">
      <button
        type="button"
        onClick={handleClick}
        disabled={pending}
        className="text-sm font-medium text-red-600 hover:underline disabled:opacity-50"
      >
        {pending ? "삭제 중..." : label}
      </button>
      {error && <p className={errorTextClass}>{error}</p>}
    </div>
  );
}
