import { LoginForm } from "./LoginForm";

type LoginPageProps = {
  searchParams: Promise<{ next?: string; resetSuccess?: string }>;
};

export default async function AdminLoginPage({ searchParams }: LoginPageProps) {
  const { next, resetSuccess } = await searchParams;
  const safeNext = next && next.startsWith("/admin") && !next.startsWith("//") ? next : "/admin";

  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-6 px-4 py-16">
      <h1 className="text-xl font-semibold text-zinc-900">관리자 로그인</h1>

      {resetSuccess && (
        <p className="w-full max-w-sm rounded-md bg-green-50 px-3 py-2 text-center text-sm text-green-700">
          비밀번호가 변경되었습니다. 새 비밀번호로 로그인해 주세요.
        </p>
      )}

      <LoginForm next={safeNext} />
    </div>
  );
}
