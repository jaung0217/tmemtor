import Link from "next/link";
import { getLocations } from "@/queries/locations";
import { deleteLocation } from "@/actions/locations";
import { ConfirmDeleteButton } from "../_components/ConfirmDeleteButton";
import { EmptyState } from "../_components/EmptyState";
import {
  linkButtonClass,
  pageHeaderClass,
  pageTitleClass,
  tableClass,
  tableWrapClass,
  tdClass,
  thClass,
} from "../_components/ui";

/** Location list (SPEC 16장): 이름/주소/노출 여부/노출 순서/수정/삭제. */
export default async function AdminLocationsPage() {
  const locations = await getLocations();

  return (
    <div className="flex flex-col gap-6">
      <div className={pageHeaderClass}>
        <h1 className={pageTitleClass}>장소</h1>
        <Link href="/admin/locations/new" className={linkButtonClass}>
          새 장소
        </Link>
      </div>

      {locations.length === 0 ? (
        <EmptyState message="등록된 장소가 없습니다." />
      ) : (
        <div className={tableWrapClass}>
          <table className={tableClass}>
            <thead>
              <tr>
                <th className={thClass}>이름</th>
                <th className={thClass}>주소</th>
                <th className={thClass}>노출 여부</th>
                <th className={thClass}>노출 순서</th>
                <th className={thClass}>관리</th>
              </tr>
            </thead>
            <tbody>
              {locations.map((location) => (
                <tr key={location.id}>
                  <td className={tdClass}>{location.name}</td>
                  <td className={tdClass}>
                    {location.address}
                    {location.detail_address ? ` ${location.detail_address}` : ""}
                  </td>
                  <td className={tdClass}>
                    {location.is_active ? (
                      <span className="text-green-700">노출</span>
                    ) : (
                      <span className="text-zinc-400">숨김</span>
                    )}
                  </td>
                  <td className={tdClass}>{location.sort_order}</td>
                  <td className={tdClass}>
                    <div className="flex items-center gap-3">
                      <Link
                        href={`/admin/locations/${location.id}`}
                        className="text-sm font-medium text-zinc-700 hover:underline"
                      >
                        수정
                      </Link>
                      <ConfirmDeleteButton id={location.id} action={deleteLocation} />
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
