import { LocationForm } from "../LocationForm";
import { pageTitleClass } from "../../_components/ui";

export default function NewLocationPage() {
  return (
    <div className="flex flex-col gap-6">
      <h1 className={pageTitleClass}>새 장소</h1>
      <LocationForm />
    </div>
  );
}
