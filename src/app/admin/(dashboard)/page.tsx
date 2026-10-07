import Link from "next/link";
import { getPosts } from "@/queries/posts";
import { getCategories } from "@/queries/categories";
import { getFaqs } from "@/queries/faq";
import { getInquiries } from "@/queries/inquiries";
import { getLocations } from "@/queries/locations";
import { getMediaList } from "@/queries/media";
import { getSiteSettings } from "@/queries/settings";
import { pageTitleClass } from "./_components/ui";

/**
 * Admin Dashboard (SPEC 15장 `/admin`). A simple overview/shortcut screen —
 * counts + quick links per entity, no charts/analytics (out of MVP scope).
 */
export default async function AdminDashboardPage() {
  const [posts, categories, faqs, inquiries, locations, media, settings] = await Promise.all([
    getPosts(),
    getCategories(),
    getFaqs(),
    getInquiries(),
    getLocations(),
    getMediaList(),
    getSiteSettings(),
  ]);

  const newInquiryCount = inquiries.filter((inquiry) => inquiry.status === "NEW").length;

  const cards = [
    { href: "/admin/posts", label: "게시물", count: posts.length },
    { href: "/admin/categories", label: "카테고리", count: categories.length },
    { href: "/admin/faq", label: "FAQ", count: faqs.length },
    {
      href: "/admin/inquiries",
      label: "문의",
      count: inquiries.length,
      badge: newInquiryCount > 0 ? `신규 ${newInquiryCount}` : undefined,
    },
    { href: "/admin/locations", label: "장소", count: locations.length },
    { href: "/admin/media", label: "미디어", count: media.length },
  ];

  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className={pageTitleClass}>대시보드</h1>
        <p className="mt-1 text-sm text-zinc-500">엔티티별 현황과 바로가기입니다.</p>
      </div>

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
        {cards.map((card) => (
          <Link
            key={card.href}
            href={card.href}
            className="flex flex-col gap-1 rounded-md border border-zinc-200 px-4 py-4 hover:border-zinc-400"
          >
            <span className="text-sm text-zinc-500">{card.label}</span>
            <span className="text-2xl font-semibold text-zinc-900">{card.count}</span>
            {card.badge && <span className="text-xs font-medium text-red-600">{card.badge}</span>}
          </Link>
        ))}
      </div>

      <div className="rounded-md border border-zinc-200 px-4 py-4">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-medium text-zinc-900">사이트 설정</h2>
          <Link href="/admin/settings" className="text-sm text-zinc-500 underline underline-offset-2">
            설정으로 이동
          </Link>
        </div>
        <p className="mt-2 text-sm text-zinc-500">
          {settings?.site_name ? `사이트 이름: ${settings.site_name}` : "아직 사이트 설정이 입력되지 않았습니다."}
        </p>
      </div>
    </div>
  );
}
