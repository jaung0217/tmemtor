"use client";

import Link from "next/link";
import { useState } from "react";

const NAV_LINKS = [
  { href: "#about", label: "서비스 소개" },
  { href: "#collections", label: "입고 상품" },
  { href: "#history", label: "거래 프로세스" },
  { href: "#customers", label: "파트너사례" },
  { href: "#inquiry", label: "문의하기" },
] as const;

export function Header() {
  const [menuOpen, setMenuOpen] = useState(false);

  function closeMenu() {
    setMenuOpen(false);
  }

  return (
    <header className="sticky top-0 z-30 border-b border-border-subtle bg-background/95 backdrop-blur-sm">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6 sm:px-10">
        <Link
          href="/"
          className="text-lg font-semibold tracking-[0.02em] text-foreground"
          onClick={closeMenu}
        >
          TMENTOR
        </Link>

        <nav className="hidden md:block" aria-label="주요 메뉴">
          <ul className="flex items-center gap-9 text-sm font-medium text-foreground/80">
            {NAV_LINKS.map((link) => (
              <li key={link.href}>
                <a href={link.href} className="transition-colors hover:text-foreground">
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <div className="flex items-center gap-3">
          <a
            href="#inquiry"
            className="hidden bg-foreground px-4 py-2 text-xs font-semibold text-background transition-colors hover:bg-[#2459d7] sm:inline-flex"
          >
            상담 요청
          </a>
          <button
            type="button"
            aria-expanded={menuOpen}
            aria-controls="mobile-navigation"
            aria-label={menuOpen ? "메뉴 닫기" : "메뉴 열기"}
            onClick={() => setMenuOpen((open) => !open)}
            className="grid h-10 w-10 place-items-center border border-border-subtle md:hidden"
          >
            <span className="flex w-4 flex-col gap-1.5" aria-hidden="true">
              <span className="h-px w-full bg-foreground" />
              <span className="h-px w-full bg-foreground" />
              <span className="h-px w-full bg-foreground" />
            </span>
          </button>
        </div>
      </div>

      {menuOpen && (
        <nav
          id="mobile-navigation"
          className="border-t border-border-subtle bg-background px-6 py-5 md:hidden"
          aria-label="모바일 주요 메뉴"
        >
          <ul className="space-y-4 text-sm font-medium">
            {NAV_LINKS.map((link) => (
              <li key={link.href}>
                <a href={link.href} onClick={closeMenu} className="block">
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
          <a
            href="#inquiry"
            onClick={closeMenu}
            className="mt-6 inline-flex bg-foreground px-4 py-2.5 text-xs font-semibold text-background"
          >
            상담 요청
          </a>
        </nav>
      )}
    </header>
  );
}
