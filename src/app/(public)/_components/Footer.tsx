import { getSiteSettings } from "@/queries/settings";

/**
 * Public Website footer. Deliberately does not link to `/admin` (CLAUDE.md
 * — the Admin CMS is never surfaced from the Public Website).
 *
 * One-page layout (REFERENCE_SITES.md "tmentor" v2): the former `/contact`
 * route is gone — its `getSiteSettings()` Query Function call and its
 * null-fallback placeholder logic move here unchanged. `getSiteSettings()`
 * can return `null` even once Site Settings has been filled in from the
 * Admin CMS — RLS currently has no `anon` SELECT policy on `site_settings`
 * (see src/queries/settings.ts module doc, OPEN_ISSUES.md #9 in
 * site-factory). This footer always falls back to placeholder copy in that
 * case rather than erroring.
 */
export async function Footer() {
  // getSiteSettings() throws if Supabase env vars aren't configured yet
  // (no project connected) and can also throw on a real DB/network error.
  // The footer renders on every page, so it must never take the whole
  // page down -- fall back to placeholder copy exactly like the `null`
  // case (RLS has no anon SELECT policy on site_settings) rather than
  // letting the error bubble up.
  const settings = await getSiteSettings().catch(() => null);

  const siteName = settings?.site_name ?? "tmentor";
  const email = settings?.contact_email ?? "contact@tmentor.example";
  const phone = settings?.contact_phone ?? "02-0000-0000";
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-border-subtle bg-surface">
      <div className="mx-auto grid max-w-6xl gap-10 px-6 py-16 sm:px-10 md:grid-cols-3">
        <div>
          <p className="font-display text-lg tracking-[0.3em] text-foreground">
            {siteName.toUpperCase()}
          </p>
          <p className="mt-4 max-w-xs text-sm leading-6 text-foreground/70">
            국내 브랜드 의류를 소싱해 매장·사업자에 합리적으로 공급하는 B2B
            패션 유통 파트너입니다.
          </p>
        </div>

        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-foreground/50">
            Menu
          </p>
          <ul className="mt-4 space-y-2 text-sm text-foreground/80">
            <li>
              <a href="#about" className="hover:opacity-60">
                회사소개
              </a>
            </li>
            <li>
              <a href="#collections" className="hover:opacity-60">
                Collections
              </a>
            </li>
            <li>
              <a href="#inquiry" className="hover:opacity-60">
                Inquiry
              </a>
            </li>
          </ul>
        </div>

        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-foreground/50">
            Contact
          </p>
          <dl className="mt-4 space-y-2 text-sm text-foreground/80">
            <div className="flex gap-2">
              <dt className="text-foreground/50">이메일</dt>
              <dd>{email}</dd>
            </div>
            <div className="flex gap-2">
              <dt className="text-foreground/50">전화</dt>
              <dd>{phone}</dd>
            </div>
          </dl>
          <p className="mt-4 text-xs leading-5 text-foreground/50">
            {/* TODO: 실제 사업자등록번호/대표자/주소 등록 — Admin > Settings에서 입력 가능해지면 자동 반영됩니다. */}
            사업자 정보는 등록 준비 중입니다. 상담 신청 시 담당자가 함께
            안내드립니다.
          </p>
        </div>
      </div>

      <div className="mx-auto max-w-6xl border-t border-border-subtle px-6 py-6 text-xs text-foreground/50 sm:px-10">
        &copy; {year} {siteName}. All rights reserved.
      </div>
    </footer>
  );
}
