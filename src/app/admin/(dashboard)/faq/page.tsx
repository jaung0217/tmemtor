import Link from "next/link";
import { getFaqs } from "@/queries/faq";
import { getCategories } from "@/queries/categories";
import { deleteFaq } from "@/actions/faq";
import { ConfirmDeleteButton } from "../_components/ConfirmDeleteButton";
import { EmptyState } from "../_components/EmptyState";
import {
  linkButtonClass,
  pageHeaderClass,
  pageTitleClass,
  tableClass,
  tableWrapClass,
  tdClass,
  thClass,
} from "../_components/ui";

export default async function AdminFaqPage() {
  const [faqs, categories] = await Promise.all([getFaqs(), getCategories()]);
  const categoryNameById = new Map(categories.map((category) => [category.id, category.name]));

  return (
    <div className="flex flex-col gap-6">
      <div className={pageHeaderClass}>
        <h1 className={pageTitleClass}>FAQ</h1>
        <Link href="/admin/faq/new" className={linkButtonClass}>
          새 FAQ
        </Link>
      </div>

      {faqs.length === 0 ? (
        <EmptyState message="등록된 FAQ가 없습니다." />
      ) : (
        <div className={tableWrapClass}>
          <table className={tableClass}>
            <thead>
              <tr>
                <th className={thClass}>질문</th>
                <th className={thClass}>카테고리</th>
                <th className={thClass}>노출 순서</th>
                <th className={thClass}>공개 여부</th>
                <th className={thClass}>관리</th>
              </tr>
            </thead>
            <tbody>
              {faqs.map((faq) => (
                <tr key={faq.id}>
                  <td className={tdClass}>{faq.question}</td>
                  <td className={tdClass}>
                    {faq.category_id ? (categoryNameById.get(faq.category_id) ?? "-") : "-"}
                  </td>
                  <td className={tdClass}>{faq.sort_order}</td>
                  <td className={tdClass}>
                    {faq.is_published ? (
                      <span className="text-green-700">공개</span>
                    ) : (
                      <span className="text-zinc-400">비공개</span>
                    )}
                  </td>
                  <td className={tdClass}>
                    <div className="flex items-center gap-3">
                      <Link
                        href={`/admin/faq/${faq.id}`}
                        className="text-sm font-medium text-zinc-700 hover:underline"
                      >
                        수정
                      </Link>
                      <ConfirmDeleteButton id={faq.id} action={deleteFaq} />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
