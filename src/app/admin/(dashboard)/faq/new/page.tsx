import { getCategories } from "@/queries/categories";
import { FaqForm } from "../FaqForm";
import { pageTitleClass } from "../../_components/ui";

export default async function NewFaqPage() {
  const categories = await getCategories();

  return (
    <div className="flex flex-col gap-6">
      <h1 className={pageTitleClass}>새 FAQ</h1>
      <FaqForm categories={categories} />
    </div>
  );
}
