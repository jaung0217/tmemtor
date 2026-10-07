import Image from "next/image";
import type { StaticProduct } from "../products";

export function ProductGrid({ products }: { products: StaticProduct[] }) {
  return (
    <div className="grid grid-cols-2 gap-6 sm:grid-cols-3">
      {products.map((product) => (
        <article key={product.id} className="group">
          <div className="relative aspect-[4/5] overflow-hidden bg-surface">
            {/* TODO: 실제 한섬/LF 공급 제품 촬영 이미지 또는 라이선스 스톡 이미지로 교체 */}
            <Image
              src={`https://picsum.photos/seed/${product.imageSeed}/800/1000`}
              alt={product.name}
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-105"
            />
          </div>
          <h3 className="mt-4 text-sm text-foreground">{product.name}</h3>
          <p className="mt-1 text-xs tracking-wide text-foreground/50">
            {product.priceLabel}
          </p>
        </article>
      ))}
    </div>
  );
}
