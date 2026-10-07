import Link from "next/link";
import { getCategories } from "@/queries/categories";
import { deleteCategory } from "@/actions/categories";
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

export default async function AdminCategoriesPage() {
  const categories = await getCategories();

  return (
    <div className="flex flex-col gap-6">
      <div className={pageHeaderClass}>
        <h1 className={pageTitleClass}>카테고리</h1>
        <Link href="/admin/categories/new" className={linkButtonClass}>
          새 카테고리
        </Link>
      </div>

      {categories.length === 0 ? (
        <EmptyState message="등록된 카테고리가 없습니다." />
      ) : (
        <div className={tableWrapClass}>
          <table className={tableClass}>
            <thead>
              <tr>
                <th className={thClass}>이름</th>
                <th className={thClass}>슬러그</th>
                <th className={thClass}>노출 순서</th>
                <th className={thClass}>노출 여부</th>
                <th className={thClass}>관리</th>
              </tr>
            </thead>
            <tbody>
              {categories.map((category) => (
                <tr key={category.id}>
                  <td className={tdClass}>{category.name}</td>
                  <td className={tdClass}>{category.slug}</td>
                  <td className={tdClass}>{category.sort_order}</td>
                  <td className={tdClass}>
                    {category.is_active ? (
                      <span className="text-green-700">노출</span>
                    ) : (
                      <span className="text-zinc-400">숨김</span>
                    )}
                  </td>
                  <td className={tdClass}>
                    <div className="flex items-center gap-3">
                      <Link
                        href={`/admin/categories/${category.id}`}
                        className="text-sm font-medium text-zinc-700 hover:underline"
                      >
                        수정
                      </Link>
                      <ConfirmDeleteButton id={category.id} action={deleteCategory} />
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
