import { getCategories } from "@/queries/categories";
import { PostForm } from "../PostForm";
import { pageTitleClass } from "../../_components/ui";

export default async function NewPostPage() {
  const categories = await getCategories();

  return (
    <div className="flex flex-col gap-6">
      <h1 className={pageTitleClass}>새 게시물</h1>
      <PostForm categories={categories} />
    </div>
  );
}
