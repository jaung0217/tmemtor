"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const NAV_ITEMS: { href: string; label: string; exact?: boolean }[] = [
  { href: "/admin", label: "대시보드", exact: true },
  { href: "/admin/posts", label: "게시물" },
  { href: "/admin/categories", label: "카테고리" },
  { href: "/admin/faq", label: "FAQ" },
  { href: "/admin/inquiries", label: "문의" },
  { href: "/admin/locations", label: "장소" },
  { href: "/admin/media", label: "미디어" },
  { href: "/admin/settings", label: "사이트 설정" },
];

export function AdminNav() {
  const pathname = usePathname();

  return (
    <nav className="flex flex-col gap-1">
      {NAV_ITEMS.map((item) => {
        const isActive = item.exact
          ? pathname === item.href
          : pathname === item.href || pathname.startsWith(`${item.href}/`);

        return (
          <Link
            key={item.href}
            href={item.href}
            className={
              isActive
                ? "rounded-md bg-zinc-900 px-3 py-2 text-sm font-medium text-white"
                : "rounded-md px-3 py-2 text-sm text-zinc-700 hover:bg-zinc-200"
            }
          >
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}
