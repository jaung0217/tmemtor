import { notFound } from "next/navigation";
import { getCategory } from "@/queries/categories";
import { CategoryForm } from "../CategoryForm";
import { pageTitleClass } from "../../_components/ui";

export default async function EditCategoryPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const category = await getCategory(id);

  if (!category) notFound();

  return (
    <div className="flex flex-col gap-6">
      <h1 className={pageTitleClass}>카테고리 수정</h1>
      <CategoryForm category={category} />
    </div>
  );
}
