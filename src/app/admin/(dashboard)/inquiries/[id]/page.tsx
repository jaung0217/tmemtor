import { notFound } from "next/navigation";
import Link from "next/link";
import { getInquiry } from "@/queries/inquiries";
import { formatDateTime } from "../../_components/format";
import { pageHeaderClass, pageTitleClass } from "../../_components/ui";
import { InquiryStatusForm } from "../InquiryStatusForm";
import { InquiryDeleteButton } from "../InquiryDeleteButton";

export default async function InquiryDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const inquiry = await getInquiry(id);

  if (!inquiry) notFound();

  return (
    <div className="flex flex-col gap-6">
      <div className={pageHeaderClass}>
        <h1 className={pageTitleClass}>문의 상세</h1>
        <Link href="/admin/inquiries" className="text-sm text-zinc-500 underline underline-offset-2">
          목록으로
        </Link>
      </div>

      <div className="flex max-w-2xl flex-col gap-4 rounded-md border border-zinc-200 px-5 py-5">
        <dl className="grid grid-cols-[120px_1fr] gap-y-2 text-sm">
          <dt className="text-zinc-500">이름</dt>
          <dd className="text-zinc-900">{inquiry.name}</dd>

          <dt className="text-zinc-500">이메일</dt>
          <dd className="text-zinc-900">{inquiry.email ?? "-"}</dd>

          <dt className="text-zinc-500">연락처</dt>
          <dd className="text-zinc-900">{inquiry.phone ?? "-"}</dd>

          <dt className="text-zinc-500">제목</dt>
          <dd className="text-zinc-900">{inquiry.title}</dd>

          <dt className="text-zinc-500">등록일</dt>
          <dd className="text-zinc-900">{formatDateTime(inquiry.created_at)}</dd>

          <dt className="text-zinc-500">개인정보 동의</dt>
          <dd className="text-zinc-900">{inquiry.privacy_agreed ? "동의함" : "동의하지 않음"}</dd>
        </dl>

        <div className="flex flex-col gap-1">
          <span className="text-sm text-zinc-500">내용</span>
          <p className="whitespace-pre-wrap rounded-md bg-zinc-50 px-3 py-3 text-sm text-zinc-800">
            {inquiry.content}
          </p>
        </div>
      </div>

      <div className="max-w-2xl rounded-md border border-zinc-200 px-5 py-5">
        <InquiryStatusForm inquiry={inquiry} />
      </div>

      <div>
        <InquiryDeleteButton id={inquiry.id} />
      </div>
    </div>
  );
}
