import { ScrollReveal } from "../ScrollReveal";

type GarmentType = "outerwear" | "knitwear" | "shirts";

const CATEGORIES: {
  label: string;
  description: string;
  type: GarmentType;
}[] = [
  { label: "Outerwear", description: "코트 · 패딩 · 재킷", type: "outerwear" },
  { label: "Knitwear", description: "니트 · 스웨터 · 가디건", type: "knitwear" },
  { label: "Shirts", description: "셔츠 · 블라우스", type: "shirts" },
];

function GarmentIllustration({ type }: { type: GarmentType }) {
  if (type === "outerwear") {
    return (
      <svg viewBox="0 0 320 360" className="h-full w-full" role="img" aria-label="아우터 실루엣">
        <path
          d="M116 74 78 92 34 158l31 19 22-31-9 142h164l-9-142 22 31 31-19-44-66-38-18"
          fill="none"
          stroke="currentColor"
          strokeWidth="3"
          strokeLinejoin="round"
        />
        <path d="m116 74 44 54 44-54" fill="none" stroke="currentColor" strokeWidth="3" />
        <path d="m132 91 28 37 28-37" fill="none" stroke="currentColor" strokeWidth="2" />
        <path d="M160 128v160M121 172h25M174 172h25M121 215h25M174 215h25" fill="none" stroke="currentColor" strokeWidth="2" />
        <path d="M78 288h164" stroke="currentColor" strokeWidth="3" />
        <circle cx="160" cy="155" r="3" fill="currentColor" />
        <circle cx="160" cy="181" r="3" fill="currentColor" />
        <circle cx="160" cy="207" r="3" fill="currentColor" />
      </svg>
    );
  }

  if (type === "knitwear") {
    return (
      <svg viewBox="0 0 320 360" className="h-full w-full" role="img" aria-label="니트웨어 실루엣">
        <path
          d="M112 78 58 104 23 171l38 19 20-32-10 130h178l-10-130 20 32 38-19-35-67-54-26"
          fill="none"
          stroke="currentColor"
          strokeWidth="3"
          strokeLinejoin="round"
        />
        <path d="M112 78c6 38 90 38 96 0M112 78c14 16 27 25 48 25s34-9 48-25" fill="none" stroke="currentColor" strokeWidth="3" />
        <path d="M71 288h178M82 274h156M93 260h134" fill="none" stroke="currentColor" strokeWidth="2" />
        <path d="M119 135v112M142 135v112M165 135v112M188 135v112" fill="none" stroke="currentColor" strokeWidth="1.5" opacity="0.7" />
        <path d="M58 104 88 160M262 104l-30 56" fill="none" stroke="currentColor" strokeWidth="2" opacity="0.8" />
      </svg>
    );
  }

  return (
    <svg viewBox="0 0 320 360" className="h-full w-full" role="img" aria-label="셔츠 실루엣">
      <path
        d="m119 76-42 24-42 55 30 20 21-27 3 131h142l3-131 21 27 30-20-42-55-42-24"
        fill="none"
        stroke="currentColor"
        strokeWidth="3"
        strokeLinejoin="round"
      />
      <path d="m119 76 41 48 41-48M128 88l32 36 32-36" fill="none" stroke="currentColor" strokeWidth="3" />
      <path d="M160 124v155M145 151h30M145 180h30M145 209h30M145 238h30" fill="none" stroke="currentColor" strokeWidth="2" />
      <circle cx="160" cy="151" r="2.5" fill="currentColor" />
      <circle cx="160" cy="180" r="2.5" fill="currentColor" />
      <circle cx="160" cy="209" r="2.5" fill="currentColor" />
      <path d="M74 278h172" stroke="currentColor" strokeWidth="3" />
    </svg>
  );
}

export function Collections() {
  return (
    <section id="collections" className="scroll-mt-16 bg-surface px-6 py-20 sm:px-10 lg:py-28">
      <div className="mx-auto max-w-7xl">
        <ScrollReveal className="mb-12 grid gap-5 md:grid-cols-[1fr_2fr] md:items-end">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-foreground/55">
            Collections
          </p>
          <div>
            <h2 className="text-3xl font-semibold tracking-[0.01em] text-foreground sm:text-4xl">
              매장에 맞는 품목을 빠르게 검토합니다.
            </h2>
            <p className="mt-4 max-w-xl text-sm leading-6 text-foreground/70">
              대표 취급 카테고리입니다. 세부 재고와 공급 조건은 상담을 통해 안내합니다.
            </p>
          </div>
        </ScrollReveal>

        <div className="grid gap-3 sm:grid-cols-3">
          {CATEGORIES.map((category, index) => (
            <ScrollReveal key={category.label} delay={index * 100}>
              <article className="group relative overflow-hidden border border-foreground/10 bg-foreground text-white">
                <div className="flex aspect-[4/5] items-center justify-center px-10 py-8 text-[#dce3ec] transition-transform duration-500 group-hover:scale-[1.04]">
                  <GarmentIllustration type={category.type} />
                </div>
                <div className="flex items-end justify-between border-t border-white/15 px-5 py-5 sm:px-6">
                  <div>
                    <p className="text-xl font-semibold tracking-[0.01em]">{category.label}</p>
                    <p className="mt-1 text-sm text-white/60">{category.description}</p>
                  </div>
                  <span className="text-sm font-semibold text-[#3f72ff]">0{index + 1}</span>
                </div>
              </article>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
}
