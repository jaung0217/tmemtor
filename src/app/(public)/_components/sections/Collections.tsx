import Image from "next/image";
import { ScrollReveal } from "../ScrollReveal";

const CATEGORIES = [
  {
    label: "Outerwear",
    description: "코트 · 패딩 · 재킷",
    image: "/images/tmentor/outerwear.png",
    alt: "차콜 컬러 코트",
  },
  {
    label: "Knitwear",
    description: "니트 · 스웨터 · 가디건",
    image: "/images/tmentor/knitwear.png",
    alt: "다양한 색상의 니트웨어",
  },
  {
    label: "Shirts",
    description: "셔츠 · 블라우스",
    image: "/images/tmentor/shirts.png",
    alt: "화이트와 블루 컬러의 셔츠",
  },
] as const;

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
              <article className="group relative aspect-[2/3] overflow-hidden bg-foreground">
                <Image
                  src={category.image}
                  alt={category.alt}
                  fill
                  sizes="(max-width: 640px) 100vw, 33vw"
                  className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                />
                <div className="absolute inset-0 bg-black/15 transition-colors group-hover:bg-black/30" />
                <div className="absolute inset-x-0 bottom-0 bg-black/55 p-5 text-white sm:p-6">
                  <p className="text-xl font-semibold tracking-[0.01em]">{category.label}</p>
                  <p className="mt-1 text-sm text-white/75">{category.description}</p>
                </div>
              </article>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
}
