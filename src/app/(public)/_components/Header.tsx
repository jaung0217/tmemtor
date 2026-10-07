import Link from "next/link";

/**
 * Public Website header (SPEC does not define this — Public UI is never
 * common, see CLAUDE.md). No `/admin` link is exposed here on purpose.
 *
 * One-page layout (REFERENCE_SITES.md "tmentor" v2): every nav item is an
 * in-page anchor to a section on `/`, not a separate route. Smooth
 * scrolling is handled by `scroll-behavior: smooth` in globals.css; each
 * section has `scroll-mt-24` so it lands below this sticky header instead
 * of underneath it.
 */
const NAV_LINKS = [
  { href: "#about", label: "회사소개" },
  { href: "#history", label: "연혁" },
  { href: "#stats", label: "납품량" },
  { href: "#customers", label: "Customers" },
  { href: "#collections", label: "Collections" },
  { href: "#inquiry", label: "Inquiry" },
] as const;

export function Header() {
  return (
    <header className="sticky top-0 z-30 border-b border-border-subtle bg-background/95 backdrop-blur-sm">
      <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-4 px-6 py-5 sm:px-10">
        <Link
          href="/"
          className="font-display text-xl tracking-[0.3em] text-foreground"
        >
          TMENTOR
        </Link>

        <nav aria-label="주요 메뉴">
          <ul className="flex flex-wrap items-center gap-x-7 gap-y-2 text-xs font-medium tracking-[0.15em] text-foreground">
            {NAV_LINKS.map((link) => (
              <li key={link.href}>
                <a
                  href={link.href}
                  className="uppercase transition-opacity hover:opacity-60"
                >
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </header>
  );
}
