import Link from "next/link";
import { getInquiries } from "@/queries/inquiries";
import { EmptyState } from "../_components/EmptyState";
import { formatDateTime } from "../_components/format";
import { pageTitleClass, tableClass, tableWrapClass, tdClass, thClass } from "../_components/ui";
import { INQUIRY_STATUS_COLORS, INQUIRY_STATUS_LABELS } from "./statusLabels";

/** No "새 문의" button — inquiries are only created by Public visitors (createInquiry, Phase 7). */
export default async function AdminInquiriesPage() {
  const inquiries = await getInquiries();

  return (
    <div className="flex flex-col gap-6">
      <h1 className={pageTitleClass}>문의</h1>

      {inquiries.length === 0 ? (
        <EmptyState message="접수된 문의가 없습니다." />
      ) : (
        <div className={tableWrapClass}>
          <table className={tableClass}>
            <thead>
              <tr>
                <th className={thClass}>이름</th>
                <th className={thClass}>제목</th>
                <th className={thClass}>상태</th>
                <th className={thClass}>등록일</th>
                <th className={thClass}>관리</th>
              </tr>
            </thead>
            <tbody>
              {inquiries.map((inquiry) => (
                <tr key={inquiry.id}>
                  <td className={tdClass}>{inquiry.name}</td>
                  <td className={tdClass}>{inquiry.title}</td>
                  <td className={tdClass}>
                    <span className={INQUIRY_STATUS_COLORS[inquiry.status]}>
                      {INQUIRY_STATUS_LABELS[inquiry.status]}
                    </span>
                  </td>
                  <td className={tdClass}>{formatDateTime(inquiry.created_at)}</td>
                  <td className={tdClass}>
                    <Link
                      href={`/admin/inquiries/${inquiry.id}`}
                      className="text-sm font-medium text-zinc-700 hover:underline"
                    >
                      상세보기
                    </Link>
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
