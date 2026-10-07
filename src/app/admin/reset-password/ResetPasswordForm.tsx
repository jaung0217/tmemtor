"use client";

import { useActionState } from "react";
import { resetPassword, type AuthActionResult } from "@/actions/auth";

const initialState: AuthActionResult = { success: false };

export function ResetPasswordForm() {
  const [state, formAction, pending] = useActionState(resetPassword, initialState);

  return (
    <form action={formAction} className="flex w-full max-w-sm flex-col gap-4">
      <div className="flex flex-col gap-1">
        <label htmlFor="password" className="text-sm font-medium text-zinc-700">
          새 비밀번호
        </label>
        <input
          id="password"
          name="password"
          type="password"
          autoComplete="new-password"
          minLength={8}
          required
          className="rounded-md border border-zinc-300 px-3 py-2 text-sm outline-none focus:border-zinc-500"
        />
      </div>

      <div className="flex flex-col gap-1">
        <label htmlFor="passwordConfirm" className="text-sm font-medium text-zinc-700">
          새 비밀번호 확인
        </label>
        <input
          id="passwordConfirm"
          name="passwordConfirm"
          type="password"
          autoComplete="new-password"
          minLength={8}
          required
          className="rounded-md border border-zinc-300 px-3 py-2 text-sm outline-none focus:border-zinc-500"
        />
      </div>

      {state?.error && (
        <p className="text-sm text-red-600" role="alert">
          {state.error}
        </p>
      )}

      <button
        type="submit"
        disabled={pending}
        className="rounded-md bg-zinc-900 px-3 py-2 text-sm font-medium text-white disabled:opacity-60"
      >
        {pending ? "변경 중..." : "비밀번호 변경"}
      </button>
    </form>
  );
}
