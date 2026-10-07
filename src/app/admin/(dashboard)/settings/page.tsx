import { getSiteSettings } from "@/queries/settings";
import { pageTitleClass } from "../_components/ui";
import { SettingsForm } from "./SettingsForm";

export default async function AdminSettingsPage() {
  const settings = await getSiteSettings();

  return (
    <div className="flex flex-col gap-6">
      <h1 className={pageTitleClass}>사이트 설정</h1>
      <SettingsForm settings={settings} />
    </div>
  );
}
