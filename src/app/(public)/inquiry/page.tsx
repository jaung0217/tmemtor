import type { Metadata } from "next";
import { InquiryForm } from "./InquiryForm";

export const metadata: Metadata = {
  title: "Inquiry",
  description: "tmentor 매장 납품·바이어 상담 문의.",
};

export default function InquiryPage() {
  return (
    <div className="mx-auto max-w-2xl px-6 py-20 sm:px-10">
      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-foreground/50">
        Inquiry
      </p>
      <h1 className="mt-3 font-display text-3xl text-foreground sm:text-4xl">
        납품 상담 신청
      </h1>
      <p className="mt-4 text-sm leading-6 text-foreground/70">
        매장·사업자 납품 상담을 원하시면 아래 양식을 작성해 주세요. 담당자가
        확인 후 영업일 기준 1~2일 내에 연락드립니다.
      </p>

      <div className="mt-12">
        <InquiryForm />
      </div>
    </div>
  );
}
