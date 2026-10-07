import { ResetPasswordForm } from "./ResetPasswordForm";

export default function ResetPasswordPage() {
  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-6 px-4 py-16">
      <h1 className="text-xl font-semibold text-zinc-900">새 비밀번호 설정</h1>
      <p className="max-w-sm text-center text-sm text-zinc-500">
        이메일로 받은 재설정 링크를 통해 접속한 경우에만 비밀번호를 변경할 수 있습니다.
      </p>

      <ResetPasswordForm />
    </div>
  );
}
