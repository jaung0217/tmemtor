import type { Metadata } from "next";
import Image from "next/image";

export const metadata: Metadata = {
  title: "About",
  description: "tmentor 소개 — 국내 브랜드 의류를 매장에 합리적으로 공급하는 B2B 유통 파트너.",
};

const VALUES = [
  {
    title: "안정적인 소싱",
    body: "한섬, LF 등 국내 주요 브랜드와의 공급 네트워크를 통해 시즌별로 안정적인 물량을 확보합니다.",
  },
  {
    title: "합리적인 공급가",
    body: "유통 단계를 단순화해 매장·사업자가 합리적인 조건으로 상품을 매입할 수 있도록 돕습니다.",
  },
  {
    title: "신속한 상담·대응",
    body: "문의 접수부터 조건 안내까지, 담당자가 빠르게 응답하는 것을 원칙으로 합니다.",
  },
];

export default function AboutPage() {
  return (
    <div>
      <section className="relative h-[46vh] min-h-[360px] w-full overflow-hidden bg-foreground">
        {/* TODO: 실제 한섬/LF 공급 제품 촬영 이미지 또는 라이선스 스톡 이미지로 교체 */}
        <Image
          src="https://picsum.photos/seed/tmentor-about/2000/900"
          alt="tmentor 소개 비주얼"
          fill
          className="object-cover opacity-80"
        />
        <div className="absolute inset-0 bg-black/40" />
        <div className="relative z-10 flex h-full flex-col items-start justify-end px-6 pb-14 sm:px-10 md:px-16">
          <p className="text-xs font-medium uppercase tracking-[0.35em] text-white/80">
            About tmentor
          </p>
          <h1 className="mt-4 font-display text-3xl text-white sm:text-5xl">
            합리적인 공급, 신뢰할 수 있는 파트너
          </h1>
        </div>
      </section>

      <section className="mx-auto max-w-3xl px-6 py-20 sm:px-10">
        <p className="text-sm leading-7 text-foreground/80">
          tmentor는 한섬, LF 등 국내 브랜드 의류를 소싱해 타 사업자와 매장에
          공급하는 B2B 패션 유통 회사입니다. 시즌별 트렌드와 매장별 수요를
          고려해 상품 라인업을 구성하고, 안정적인 물량과 합리적인 조건으로
          거래처가 지속적으로 사업을 운영할 수 있도록 돕습니다.
        </p>
        <p className="mt-6 text-sm leading-7 text-foreground/80">
          복잡한 유통 단계를 줄이고 투명한 거래 조건을 제시하는 것을
          원칙으로 하며, 신규 거래처와의 첫 상담부터 장기적인 공급 관계까지
          책임감 있게 대응합니다.
        </p>
      </section>

      <section className="mx-auto max-w-6xl px-6 py-16 sm:px-10">
        <div className="grid gap-10 border-t border-border-subtle pt-16 sm:grid-cols-3">
          {VALUES.map((value) => (
            <div key={value.title}>
              <h2 className="font-display text-lg text-foreground">
                {value.title}
              </h2>
              <p className="mt-3 text-sm leading-6 text-foreground/70">
                {value.body}
              </p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
