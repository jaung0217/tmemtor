import { ScrollReveal } from "../ScrollReveal";

/**
 * Customers / 거래처 — text wordmark grid.
 *
 * ⚠️ All names below are fictional placeholders invented for this reference
 * site. Real company names/logos (e.g. 한섬, LF) must never be listed here —
 * doing so would imply an actual trade relationship and create legal risk
 * (see CLAUDE.md task scope / REFERENCE_SITES.md "tmentor" 법적 주의).
 */
const PARTNER_WORDMARKS = [
  "OSLO STUDIO",
  "BLANC & CO",
  "NOA FASHION",
  "GREYSTONE",
  "LUMEN WORKS",
  "CEDAR LANE",
  "MONOCHROME",
  "ATELIER NOVE",
  "WESTFIELD CO",
  "HARBOR & HUE",
  "PRIMROSE MKT",
  "STONECROFT",
] as const;

export function Customers() {
  return (
    <section
      id="customers"
      className="mx-auto max-w-6xl scroll-mt-24 px-6 py-24 sm:px-10"
    >
      <ScrollReveal className="mb-16 max-w-2xl">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-foreground/50">
          Customers
        </p>
        <h2 className="mt-3 font-display text-3xl text-foreground sm:text-4xl">
          이미 650+ 매장이 tmentor와 함께합니다
        </h2>
        <p className="mt-4 text-sm leading-6 text-foreground/70">
          {/* TODO: 실제 거래처 목록/로고로 교체 (가상 플레이스홀더 명단) */}
          전국 멀티숍·편집숍 거래처와 장기적인 공급 관계를 이어가고
          있습니다.
        </p>
      </ScrollReveal>

      <div className="grid grid-cols-2 gap-px border border-border-subtle bg-border-subtle sm:grid-cols-3 lg:grid-cols-4">
        {PARTNER_WORDMARKS.map((name, index) => (
          <ScrollReveal key={name} delay={(index % 4) * 80}>
            <div className="flex aspect-[3/2] items-center justify-center bg-surface px-4 text-center">
              <span className="text-xs font-medium uppercase tracking-[0.1em] text-foreground/60 sm:text-sm">
                {name}
              </span>
            </div>
          </ScrollReveal>
        ))}
      </div>
    </section>
  );
}
