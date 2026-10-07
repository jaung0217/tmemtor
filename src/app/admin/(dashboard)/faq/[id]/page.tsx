import { notFound } from "next/navigation";
import { getFaq } from "@/queries/faq";
import { getCategories } from "@/queries/categories";
import { FaqForm } from "../FaqForm";
import { pageTitleClass } from "../../_components/ui";

export default async function EditFaqPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const [faq, categories] = await Promise.all([getFaq(id), getCategories()]);

  if (!faq) notFound();

  return (
    <div className="flex flex-col gap-6">
      <h1 className={pageTitleClass}>FAQ 수정</h1>
      <FaqForm categories={categories} faq={faq} />
    </div>
  );
}
