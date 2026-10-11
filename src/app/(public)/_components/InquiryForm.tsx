"use client";

import { useState, useTransition } from "react";
// SUPABASE-DISABLED: Supabase 미사용 중 — 재연결 시 주석 해제.
// import { createInquiry } from "@/actions/inquiries";

// SUPABASE-DISABLED: 온라인 접수가 막혀 있는 동안 안내할 연락처 (Footer의 placeholder와 동일).
const CONTACT_EMAIL = "contact@tmentor.example";

const initialFormState = {
  name: "",
  email: "",
  phone: "",
  title: "",
  content: "",
  privacy_agreed: false,
};

/**
 * Public 납품 상담 문의 폼.
 *
 * Calls the existing `createInquiry` Server Action (src/actions/inquiries.ts)
 * directly — no new Server Action is introduced here (CLAUDE.md /
 * REFERENCE_SITES.md). Business-rule/validation errors coming back from
 * that action (e.g. `privacy_agreed` not checked) are shown as-is.
 */
export function InquiryForm() {
  const [form, setForm] = useState(initialFormState);
  // SUPABASE-DISABLED: startTransition은 재연결 시 handleSubmit에서 다시 사용.
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [isPending, startTransition] = useTransition();
  const [result, setResult] = useState<
    { type: "success" | "error"; message: string } | null
  >(null);

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setResult(null);

    // SUPABASE-DISABLED: 재연결 시 아래 블록 삭제하고 그 아래 주석 해제.
    setResult({
      type: "error",
      message: `현재 온라인 문의 접수를 준비 중입니다. ${CONTACT_EMAIL}로 문의해 주세요.`,
    });

    // startTransition(async () => {
    //   const response = await createInquiry({
    //     name: form.name,
    //     email: form.email || null,
    //     phone: form.phone || null,
    //     title: form.title,
    //     content: form.content,
    //     privacy_agreed: form.privacy_agreed,
    //   });
    //
    //   if (response.success) {
    //     setResult({
    //       type: "success",
    //       message: "문의가 접수되었습니다. 담당자가 확인 후 연락드리겠습니다.",
    //     });
    //     setForm(initialFormState);
    //   } else {
    //     setResult({ type: "error", message: response.error });
    //   }
    // });
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid gap-6 sm:grid-cols-2">
        <Field label="담당자명" required>
          <input
            type="text"
            required
            value={form.name}
            onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
            className="w-full border border-border-subtle bg-background px-4 py-3 text-sm outline-none focus:border-foreground"
          />
        </Field>

        <Field label="연락처">
          <input
            type="tel"
            value={form.phone}
            onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))}
            placeholder="010-0000-0000"
            className="w-full border border-border-subtle bg-background px-4 py-3 text-sm outline-none focus:border-foreground"
          />
        </Field>
      </div>

      <Field label="이메일">
        <input
          type="email"
          value={form.email}
          onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
          placeholder="name@company.com"
          className="w-full border border-border-subtle bg-background px-4 py-3 text-sm outline-none focus:border-foreground"
        />
      </Field>

      <Field label="상담 제목" required>
        <input
          type="text"
          required
          value={form.title}
          onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
          placeholder="예) 매장 납품 상담 요청"
          className="w-full border border-border-subtle bg-background px-4 py-3 text-sm outline-none focus:border-foreground"
        />
      </Field>

      <Field label="문의 내용" required>
        <textarea
          required
          rows={6}
          value={form.content}
          onChange={(e) => setForm((f) => ({ ...f, content: e.target.value }))}
          placeholder="매장 규모, 희망 품목, 희망 거래 조건 등을 자유롭게 작성해 주세요."
          className="w-full border border-border-subtle bg-background px-4 py-3 text-sm outline-none focus:border-foreground"
        />
      </Field>

      <label className="flex items-start gap-3 text-xs leading-5 text-foreground/70">
        <input
          type="checkbox"
          required
          checked={form.privacy_agreed}
          onChange={(e) =>
            setForm((f) => ({ ...f, privacy_agreed: e.target.checked }))
          }
          className="mt-0.5 h-4 w-4 shrink-0 accent-foreground"
        />
        <span>
          상담 접수를 위해 개인정보(담당자명, 연락처, 이메일)를 수집·이용하는
          것에 동의합니다. (필수)
        </span>
      </label>

      {result && (
        <p
          role="status"
          className={`text-sm ${
            result.type === "success" ? "text-foreground" : "text-red-700"
          }`}
        >
          {result.message}
        </p>
      )}

      <button
        type="submit"
        disabled={isPending}
        className="inline-flex items-center border border-foreground px-7 py-3 text-xs font-medium uppercase tracking-[0.2em] text-foreground transition-colors hover:bg-foreground hover:text-background disabled:cursor-not-allowed disabled:opacity-50"
      >
        {isPending ? "제출 중..." : "납품 상담 신청"}
      </button>
    </form>
  );
}

function Field({
  label,
  required,
  children,
}: {
  label: string;
  required?: boolean;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="mb-2 block text-xs font-medium uppercase tracking-[0.1em] text-foreground/60">
        {label}
        {required && <span className="ml-1 text-foreground/40">*</span>}
      </span>
      {children}
    </label>
  );
}
