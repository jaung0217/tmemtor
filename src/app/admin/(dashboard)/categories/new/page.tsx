import { CategoryForm } from "../CategoryForm";
import { pageTitleClass } from "../../_components/ui";

export default function NewCategoryPage() {
  return (
    <div className="flex flex-col gap-6">
      <h1 className={pageTitleClass}>새 카테고리</h1>
      <CategoryForm />
    </div>
  );
}
