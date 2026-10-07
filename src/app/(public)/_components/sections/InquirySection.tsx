import { InquiryForm } from "../InquiryForm";
import { ScrollReveal } from "../ScrollReveal";

/**
 * 문의/Inquiry section — wraps the existing `InquiryForm` component
 * (moved from the former `/inquiry` route; still calls the existing
 * `createInquiry()` Server Action, unchanged). No new Server Action or
 * Query Function is introduced here.
 */
export function InquirySection() {
  return (
    <section
      id="inquiry"
      className="mx-auto max-w-2xl scroll-mt-24 px-6 py-24 sm:px-10"
    >
      <ScrollReveal>
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-foreground/50">
          Inquiry
        </p>
        <h2 className="mt-3 font-display text-3xl text-foreground sm:text-4xl">
          납품 상담 신청
        </h2>
        <p className="mt-4 text-sm leading-6 text-foreground/70">
          매장·사업자 납품 상담을 원하시면 아래 양식을 작성해 주세요.
          담당자가 확인 후 영업일 기준 1~2일 내에 연락드립니다.
        </p>
      </ScrollReveal>

      <ScrollReveal delay={150} className="mt-12">
        <InquiryForm />
      </ScrollReveal>
    </section>
  );
}
