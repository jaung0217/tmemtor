import { ScrollReveal } from "../ScrollReveal";

/**
 * 연혁 — fictional milestones (설립 ~ 2026), entirely invented content for
 * this reference site. Not real statistics or verified history
 * (see REFERENCE_SITES.md "tmentor" 메모).
 */
const MILESTONES = [
  {
    year: "2006",
    title: "tmentor 설립",
    body: "서울 동대문 기반으로 국내 브랜드 의류 소싱·유통 사업을 시작했습니다.",
  },
  {
    year: "2010",
    title: "첫 대형 거래처 확보",
    body: "수도권 멀티숍 10개 매장에 정기 납품 계약을 체결하며 사업을 확장했습니다.",
  },
  {
    year: "2014",
    title: "통합 물류센터 구축",
    body: "경기 이천에 통합 물류센터를 열어 검수·출고 체계를 일원화했습니다.",
  },
  {
    year: "2018",
    title: "거래처 300개 매장 돌파",
    body: "전국 단위 유통망으로 확장하며 거래처가 300개 매장을 넘어섰습니다.",
  },
  {
    year: "2022",
    title: "연간 120만 장 납품 달성",
    body: "품질관리팀을 신설하고 연간 납품량 120만 장을 달성했습니다.",
  },
  {
    year: "2026",
    title: "거래처 650개 매장",
    body: "브랜드 플랫폼을 리뉴얼하고 거래처 650개 매장과 함께하고 있습니다.",
  },
] as const;

export function History() {
  return (
    <section
      id="history"
      className="mx-auto max-w-5xl scroll-mt-24 px-6 py-24 sm:px-10"
    >
      <ScrollReveal className="mb-16 max-w-2xl">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-foreground/50">
          History
        </p>
        <h2 className="mt-3 font-display text-3xl text-foreground sm:text-4xl">
          tmentor의 발자취
        </h2>
      </ScrollReveal>

      <ol className="relative space-y-12 border-l border-border-subtle pl-8 sm:pl-10">
        {MILESTONES.map((milestone, index) => (
          <li key={milestone.year} className="relative">
            <ScrollReveal delay={index * 80}>
              <span className="absolute -left-[41px] top-1 h-3 w-3 rounded-full border border-foreground bg-background sm:-left-[49px]" />
              <p className="font-display text-xl text-foreground sm:text-2xl">
                {milestone.year}
              </p>
              <p className="mt-2 text-sm font-medium text-foreground">
                {milestone.title}
              </p>
              <p className="mt-1 text-sm leading-6 text-foreground/70">
                {milestone.body}
              </p>
            </ScrollReveal>
          </li>
        ))}
      </ol>
    </section>
  );
}
