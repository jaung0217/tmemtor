import Image from "next/image";
import { ScrollReveal } from "../ScrollReveal";

/**
 * 회사소개 — short brand story (fictional B2B fashion wholesale company
 * copy, written for this reference site; see REFERENCE_SITES.md "tmentor").
 */
export function About() {
  return (
    <section
      id="about"
      className="mx-auto max-w-6xl scroll-mt-24 px-6 py-24 sm:px-10"
    >
      <div className="grid gap-12 md:grid-cols-2 md:items-center">
        <ScrollReveal>
          <div className="relative aspect-[4/5] overflow-hidden bg-surface">
            {/* TODO: 실제 한섬/LF 공급 제품 촬영 이미지 또는 라이선스 스톡 이미지로 교체 */}
            <Image
              src="https://picsum.photos/seed/tmentor-about/1000/1250"
              alt="tmentor 소개 비주얼"
              fill
              className="object-cover"
            />
          </div>
        </ScrollReveal>

        <ScrollReveal delay={150}>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-foreground/50">
            About tmentor
          </p>
          <h2 className="mt-3 font-display text-3xl text-foreground sm:text-4xl">
            합리적인 공급, 신뢰할 수 있는 파트너
          </h2>
          <p className="mt-6 text-sm leading-7 text-foreground/80">
            tmentor는 한섬, LF 등 국내 브랜드 의류를 소싱해 타 사업자와
            매장에 공급하는 B2B 패션 유통 회사입니다. 시즌별 트렌드와
            매장별 수요를 고려해 상품 라인업을 구성하고, 안정적인 물량과
            합리적인 조건으로 거래처가 지속적으로 사업을 운영할 수 있도록
            돕습니다.
          </p>
          <p className="mt-4 text-sm leading-7 text-foreground/80">
            복잡한 유통 단계를 줄이고 투명한 거래 조건을 제시하는 것을
            원칙으로 하며, 신규 거래처와의 첫 상담부터 장기적인 공급
            관계까지 책임감 있게 대응합니다.
          </p>
        </ScrollReveal>
      </div>
    </section>
  );
}
