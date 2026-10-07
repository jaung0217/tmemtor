import Link from "next/link";

/**
 * Public Website footer. Deliberately does not link to `/admin` (CLAUDE.md
 * — the Admin CMS is never surfaced from the Public Website).
 */
export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-border-subtle bg-surface">
      <div className="mx-auto grid max-w-6xl gap-10 px-6 py-16 sm:px-10 md:grid-cols-3">
        <div>
          <p className="font-display text-lg tracking-[0.3em] text-foreground">
            TMENTOR
          </p>
          <p className="mt-4 max-w-xs text-sm leading-6 text-foreground/70">
            국내 브랜드 의류를 소싱해 매장·사업자에 합리적으로 공급하는 B2B
            패션 유통 파트너입니다.
          </p>
        </div>

        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-foreground/50">
            Collections
          </p>
          <ul className="mt-4 space-y-2 text-sm text-foreground/80">
            <li>
              <Link href="/collections/women" className="hover:opacity-60">
                Women
              </Link>
            </li>
            <li>
              <Link href="/collections/men" className="hover:opacity-60">
                Men
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-foreground/50">
            Company
          </p>
          <ul className="mt-4 space-y-2 text-sm text-foreground/80">
            <li>
              <Link href="/about" className="hover:opacity-60">
                About
              </Link>
            </li>
            <li>
              <Link href="/inquiry" className="hover:opacity-60">
                Inquiry
              </Link>
            </li>
            <li>
              <Link href="/contact" className="hover:opacity-60">
                Contact
              </Link>
            </li>
          </ul>
        </div>
      </div>

      <div className="mx-auto max-w-6xl border-t border-border-subtle px-6 py-6 text-xs text-foreground/50 sm:px-10">
        &copy; {year} tmentor. All rights reserved.
      </div>
    </footer>
  );
}
