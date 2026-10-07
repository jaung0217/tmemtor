import type { Metadata } from "next";
import { MEN_PRODUCTS } from "../products";
import { ProductGrid } from "../_components/ProductGrid";

export const metadata: Metadata = {
  title: "Men",
  description: "tmentor가 공급하는 남성 의류 라인업 — 테일러드, 캐주얼, 베이식.",
};

export default function MenCollectionPage() {
  return (
    <div className="mx-auto max-w-6xl px-6 py-16 sm:px-10">
      <div className="mb-12 max-w-2xl">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-foreground/50">
          Collections
        </p>
        <h1 className="mt-3 font-display text-3xl text-foreground sm:text-4xl">
          Men
        </h1>
        <p className="mt-4 text-sm leading-6 text-foreground/70">
          국내 브랜드에서 소싱한 남성 의류 라인업입니다. 상세 공급 조건은
          상담을 통해 안내드립니다.
        </p>
      </div>

      <ProductGrid products={MEN_PRODUCTS} />
    </div>
  );
}
