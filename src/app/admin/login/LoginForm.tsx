"use client";

import { useActionState } from "react";
import Link from "next/link";
import { login, type AuthActionResult } from "@/actions/auth";

const initialState: AuthActionResult = { success: true };

export function LoginForm({ next }: { next: string }) {
  const [state, formAction, pending] = useActionState(login, initialState);

  return (
    <form action={formAction} className="flex w-full max-w-sm flex-col gap-4">
      <input type="hidden" name="next" value={next} />

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

      <div className="flex flex-col gap-1">
        <label htmlFor="password" className="text-sm font-medium text-zinc-700">
          비밀번호
        </label>
        <input
          id="password"
          name="password"
          type="password"
          autoComplete="current-password"
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
        {pending ? "로그인 중..." : "로그인"}
      </button>

      <Link
        href="/admin/forgot-password"
        className="text-center text-sm text-zinc-500 underline underline-offset-2"
      >
        비밀번호를 잊으셨나요?
      </Link>
    </form>
  );
}
