import Link from "next/link";
import { ForgotPasswordForm } from "./ForgotPasswordForm";

type ForgotPasswordPageProps = {
  searchParams: Promise<{ error?: string }>;
};

export default async function ForgotPasswordPage({ searchParams }: ForgotPasswordPageProps) {
  const { error } = await searchParams;

  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-6 px-4 py-16">
      <h1 className="text-xl font-semibold text-zinc-900">비밀번호 재설정</h1>
      <p className="max-w-sm text-center text-sm text-zinc-500">
        가입한 관리자 이메일을 입력하시면 비밀번호 재설정 링크를 보내드립니다.
      </p>

      {error === "invalid_link" && (
        <p className="w-full max-w-sm rounded-md bg-red-50 px-3 py-2 text-center text-sm text-red-600">
          재설정 링크가 만료되었거나 올바르지 않습니다. 다시 요청해 주세요.
        </p>
      )}

      <ForgotPasswordForm />

      <Link href="/admin/login" className="text-sm text-zinc-500 underline underline-offset-2">
        로그인으로 돌아가기
      </Link>
    </div>
  );
}
