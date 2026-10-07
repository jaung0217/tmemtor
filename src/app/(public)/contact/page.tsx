import type { Metadata } from "next";
import Link from "next/link";
import { getSiteSettings } from "@/queries/settings";

export const metadata: Metadata = {
  title: "Contact",
  description: "tmentor 연락처 및 사업자 정보.",
};

/**
 * `getSiteSettings()` can return `null` even once Site Settings has been
 * filled in from the Admin CMS — RLS currently has no `anon` SELECT policy
 * on `site_settings` (see src/queries/settings.ts module doc,
 * OPEN_ISSUES.md #9 in site-factory). This page always falls back to
 * placeholder copy in that case rather than erroring.
 */
export default async function ContactPage() {
  const settings = await getSiteSettings();

  const siteName = settings?.site_name ?? "tmentor";
  const email = settings?.contact_email ?? "contact@tmentor.example";
  const phone = settings?.contact_phone ?? "02-0000-0000";

  return (
    <div className="mx-auto max-w-3xl px-6 py-20 sm:px-10">
      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-foreground/50">
        Contact
      </p>
      <h1 className="mt-3 font-display text-3xl text-foreground sm:text-4xl">
        {siteName}
      </h1>
      <p className="mt-4 text-sm leading-6 text-foreground/70">
        매장·사업자 납품 관련 문의는 아래 연락처로 안내해 드리며, 상담 신청은{" "}
        <Link href="/inquiry" className="underline hover:opacity-70">
          Inquiry 페이지
        </Link>
        를 이용해 주세요.
      </p>

      <dl className="mt-12 grid gap-8 border-t border-border-subtle pt-12 sm:grid-cols-2">
        <div>
          <dt className="text-xs font-semibold uppercase tracking-[0.2em] text-foreground/50">
            대표 이메일
          </dt>
          <dd className="mt-2 text-sm text-foreground">{email}</dd>
        </div>
        <div>
          <dt className="text-xs font-semibold uppercase tracking-[0.2em] text-foreground/50">
            대표 전화
          </dt>
          <dd className="mt-2 text-sm text-foreground">{phone}</dd>
        </div>
        <div className="sm:col-span-2">
          <dt className="text-xs font-semibold uppercase tracking-[0.2em] text-foreground/50">
            사업자 정보
          </dt>
          <dd className="mt-2 text-sm leading-6 text-foreground/70">
            {/* TODO: 실제 사업자등록번호/대표자/주소 등록 — Admin > Settings에서 입력 가능해지면 자동 반영됩니다. */}
            사업자 정보는 등록 준비 중입니다. 상담 신청 시 담당자가 함께
            안내드립니다.
          </dd>
        </div>
      </dl>
    </div>
  );
}
