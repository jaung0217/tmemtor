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

const ROW_1 = PARTNER_WORDMARKS.slice(0, 6);
const ROW_2 = PARTNER_WORDMARKS.slice(6, 12);

/**
 * One marquee row: the item list is rendered twice back-to-back and the
 * track animates exactly `-50%` (one copy's width) so the loop is seamless.
 * Pure CSS (`animate-marquee-left` / `-right` in globals.css) — no JS timer.
 *
 * `prefers-reduced-motion: reduce` fallback: the animation itself is turned
 * off via a media query in globals.css, and here the duplicated second copy
 * is hidden (`motion-reduce:hidden`) while the track switches to a wrapping
 * flex row (`motion-reduce:flex-wrap` + `motion-reduce:w-full`), so it reads
 * as a static grid of the 6 unique names instead of a frozen mid-scroll
 * strip.
 */
function MarqueeRow({
  items,
  direction,
}: {
  items: readonly string[];
  direction: "left" | "right";
}) {
  const duplicated = [...items, ...items];
  return (
    <div className="overflow-hidden">
      <div
        className={`flex w-max gap-px motion-reduce:w-full motion-reduce:flex-wrap ${
          direction === "left" ? "animate-marquee-left" : "animate-marquee-right"
        }`}
      >
        {duplicated.map((name, index) => (
          <div
            key={`${name}-${index}`}
            className={`flex aspect-[3/2] w-44 shrink-0 items-center justify-center border border-border-subtle bg-surface px-4 text-center sm:w-52 ${
              index >= items.length ? "motion-reduce:hidden" : ""
            }`}
          >
            <span className="text-xs font-medium uppercase tracking-[0.1em] text-foreground/60 sm:text-sm">
              {name}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

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

      <ScrollReveal className="space-y-4">
        <MarqueeRow items={ROW_1} direction="left" />
        <MarqueeRow items={ROW_2} direction="right" />
      </ScrollReveal>
    </section>
  );
}
