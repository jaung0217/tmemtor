import { notFound } from "next/navigation";
import { getLocation } from "@/queries/locations";
import { LocationForm } from "../LocationForm";
import { pageTitleClass } from "../../_components/ui";

export default async function EditLocationPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const location = await getLocation(id);

  if (!location) notFound();

  return (
    <div className="flex flex-col gap-6">
      <h1 className={pageTitleClass}>장소 수정</h1>
      <LocationForm location={location} />
    </div>
  );
}
