import { CountUpNumber } from "../CountUpNumber";
import { ScrollReveal } from "../ScrollReveal";

/**
 * 완성품 납품량 / 실적 — dark-background stat tiles (유라클류 B2B 소개
 * 사이트의 "WHY" 섹션 패턴 참고). All figures are invented for this
 * reference site, not verified statistics (REFERENCE_SITES.md "tmentor").
 */
const STATS = [
  { value: "20년", label: "업력" },
  { value: "650+", label: "파트너 매장" },
  { value: "120만+", label: "연간 납품량 (장)" },
  { value: "92%", label: "거래처 재계약률" },
] as const;

export function Stats() {
  return (
    <section
      id="stats"
      className="scroll-mt-24 bg-foreground px-6 py-24 text-background sm:px-10"
    >
      <div className="mx-auto max-w-6xl">
        <ScrollReveal className="mb-16 max-w-2xl">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-background/60">
            Why tmentor
          </p>
          <h2 className="mt-3 font-display text-3xl sm:text-4xl">
            숫자로 보는 tmentor
          </h2>
        </ScrollReveal>

        <div className="grid border-t border-background/15 sm:grid-cols-2 lg:grid-cols-4">
          {STATS.map((stat, index) => (
            <ScrollReveal key={stat.label} delay={index * 100}>
              <div className="flex h-full flex-col items-start justify-center gap-3 border-b border-background/15 px-2 py-12 sm:border-r sm:px-8">
                <p className="font-display text-4xl sm:text-5xl">
                  <CountUpNumber value={stat.value} />
                </p>
                <p className="text-xs uppercase tracking-[0.2em] text-background/60">
                  {stat.label}
                </p>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
}
