"use client";

import { useActionState } from "react";
import { requestPasswordReset, type AuthActionResult } from "@/actions/auth";

const initialState: AuthActionResult = { success: false };

export function ForgotPasswordForm() {
  const [state, formAction, pending] = useActionState(requestPasswordReset, initialState);

  if (state?.success) {
    return (
      <p className="w-full max-w-sm rounded-md bg-green-50 px-3 py-2 text-center text-sm text-green-700">
        입력하신 이메일로 재설정 링크를 보냈습니다. 메일함을 확인해 주세요.
      </p>
    );
  }

  return (
    <form action={formAction} className="flex w-full max-w-sm flex-col gap-4">
      <div className="flex flex-col gap-1">
        <label htmlFor="email" className="text-sm font-medium text-zinc-700">
          이메일
        </label>
        <input
          id="email"
          name="email"
          type="email"
          autoComplete="email"
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
        {pending ? "전송 중..." : "재설정 링크 보내기"}
      </button>
    </form>
  );
}
