import Link from "next/link";
import { getPosts } from "@/queries/posts";
import { getCategories } from "@/queries/categories";
import { deletePost } from "@/actions/posts";
import { ConfirmDeleteButton } from "../_components/ConfirmDeleteButton";
import { EmptyState } from "../_components/EmptyState";
import { formatDateTime } from "../_components/format";
import {
  linkButtonClass,
  pageHeaderClass,
  pageTitleClass,
  tableClass,
  tableWrapClass,
  tdClass,
  thClass,
} from "../_components/ui";

export default async function AdminPostsPage() {
  const [posts, categories] = await Promise.all([getPosts(), getCategories()]);
  const categoryNameById = new Map(categories.map((category) => [category.id, category.name]));

  return (
    <div className="flex flex-col gap-6">
      <div className={pageHeaderClass}>
        <h1 className={pageTitleClass}>게시물</h1>
        <Link href="/admin/posts/new" className={linkButtonClass}>
          새 게시물
        </Link>
      </div>

      {posts.length === 0 ? (
        <EmptyState message="등록된 게시물이 없습니다." />
      ) : (
        <div className={tableWrapClass}>
          <table className={tableClass}>
            <thead>
              <tr>
                <th className={thClass}>제목</th>
                <th className={thClass}>카테고리</th>
                <th className={thClass}>공개 여부</th>
                <th className={thClass}>수정일</th>
                <th className={thClass}>관리</th>
              </tr>
            </thead>
            <tbody>
              {posts.map((post) => (
                <tr key={post.id}>
                  <td className={tdClass}>{post.title}</td>
                  <td className={tdClass}>
                    {post.category_id ? (categoryNameById.get(post.category_id) ?? "-") : "-"}
                  </td>
                  <td className={tdClass}>
                    {post.is_published ? (
                      <span className="text-green-700">공개</span>
                    ) : (
                      <span className="text-zinc-400">비공개</span>
                    )}
                  </td>
                  <td className={tdClass}>{formatDateTime(post.updated_at)}</td>
                  <td className={tdClass}>
                    <div className="flex items-center gap-3">
                      <Link
                        href={`/admin/posts/${post.id}`}
                        className="text-sm font-medium text-zinc-700 hover:underline"
                      >
                        수정
                      </Link>
                      <ConfirmDeleteButton id={post.id} action={deletePost} />
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
