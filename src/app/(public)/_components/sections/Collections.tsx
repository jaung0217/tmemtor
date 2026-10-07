import Image from "next/image";
import { ScrollReveal } from "../ScrollReveal";

/**
 * 취급 카테고리 — visual category tiles.
 *
 * v1에서 가격이 표시된 Women/Men 상품 그리드(정적 catalog, `products.ts`)를
 * 이 섹션으로 대체한다. B2B 납품업 특성상 개별 상품/가격 노출은 맞지 않아
 * 삭제했고, 대신 취급 카테고리만 비주얼로 소개한다 (REFERENCE_SITES.md
 * "tmentor" v2 변경 사항).
 */
const CATEGORIES = [
  { label: "Outerwear", seed: "tmentor-cat-outerwear", description: "코트·패딩·자켓 아우터 라인업" },
  { label: "Knitwear", seed: "tmentor-cat-knitwear", description: "니트·스웨터·가디건" },
  { label: "Shirts", seed: "tmentor-cat-shirts", description: "셔츠·블라우스" },
] as const;

export function Collections() {
  return (
    <section
      id="collections"
      className="mx-auto max-w-6xl scroll-mt-24 px-6 py-24 sm:px-10"
    >
      <ScrollReveal className="mb-12 max-w-2xl">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-foreground/50">
          Collections
        </p>
        <h2 className="mt-3 font-display text-3xl text-foreground sm:text-4xl">
          취급 카테고리
        </h2>
        <p className="mt-4 text-sm leading-6 text-foreground/70">
          국내 브랜드에서 소싱한 카테고리별 라인업입니다. 상세 공급 조건은
          상담을 통해 안내드립니다.
        </p>
      </ScrollReveal>

      <div className="grid gap-6 sm:grid-cols-3">
        {CATEGORIES.map((category, index) => (
          <ScrollReveal key={category.label} delay={(index % 3) * 100}>
            <div className="group relative block aspect-[2/3] overflow-hidden bg-surface">
              {/* TODO: 실제 한섬/LF 공급 제품 촬영 이미지 또는 라이선스 스톡 이미지로 교체 */}
              <Image
                src={`https://picsum.photos/seed/${category.seed}/600/900`}
                alt={`${category.label} 카테고리`}
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-black/20 transition-colors group-hover:bg-black/30" />
              <div className="absolute inset-x-0 bottom-0 p-6 text-white">
                <p className="font-display text-2xl tracking-wide">
                  {category.label}
                </p>
                <p className="mt-1 text-xs text-white/80">
                  {category.description}
                </p>
              </div>
            </div>
          </ScrollReveal>
        ))}
      </div>
    </section>
  );
}
