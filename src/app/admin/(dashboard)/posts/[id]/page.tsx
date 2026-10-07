import { notFound } from "next/navigation";
import { getPost } from "@/queries/posts";
import { getCategories } from "@/queries/categories";
import { PostForm } from "../PostForm";
import { pageTitleClass } from "../../_components/ui";

export default async function EditPostPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const [post, categories] = await Promise.all([getPost(id), getCategories()]);

  if (!post) notFound();

  return (
    <div className="flex flex-col gap-6">
      <h1 className={pageTitleClass}>게시물 수정</h1>
      <PostForm categories={categories} post={post} />
    </div>
  );
}
