import Image from "next/image";
import Link from "next/link";

export default function HomePage() {
  return (
    <>
      <section className="relative h-[85vh] min-h-[560px] w-full overflow-hidden bg-foreground">
        {/* TODO: 실제 한섬/LF 공급 제품 촬영 이미지 또는 라이선스 스톡 이미지로 교체 */}
        <Image
          src="https://picsum.photos/seed/tmentor-hero/2000/1400"
          alt="tmentor B2B 의류 공급 컬렉션 비주얼"
          fill
          priority
          className="object-cover"
        />
        <div className="absolute inset-0 bg-black/35" />

        <div className="relative z-10 flex h-full flex-col items-start justify-end px-6 pb-20 sm:px-10 md:px-16">
          <p className="mb-4 text-xs font-medium uppercase tracking-[0.35em] text-white/80">
            Wholesale Fashion Partner
          </p>
          <h1 className="font-display text-4xl leading-tight text-white sm:text-6xl">
            TMENTOR
          </h1>
          <p className="mt-6 max-w-md text-sm leading-7 text-white/85 sm:text-base">
            한섬, LF 등 국내 브랜드 의류를 합리적인 조건으로 소싱해, 매장과
            사업자에 안정적으로 공급합니다.
          </p>
          <Link
            href="/inquiry"
            className="mt-8 inline-flex items-center border border-white px-7 py-3 text-xs font-medium uppercase tracking-[0.2em] text-white transition-colors hover:bg-white hover:text-foreground"
          >
            납품 상담 신청
          </Link>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 py-20 sm:px-10">
        <div className="mb-12 max-w-2xl">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-foreground/50">
            Collections
          </p>
          <h2 className="mt-3 font-display text-2xl text-foreground sm:text-3xl">
            카테고리별 공급 라인업
          </h2>
        </div>

        <div className="grid gap-6 sm:grid-cols-2">
          <CategoryTile
            href="/collections/women"
            label="Women"
            seed="tmentor-category-women"
            description="여성 아우터·셋업·니트웨어 라인업"
          />
          <CategoryTile
            href="/collections/men"
            label="Men"
            seed="tmentor-category-men"
            description="남성 테일러드·캐주얼·베이식 라인업"
          />
        </div>
      </section>
    </>
  );
}

function CategoryTile({
  href,
  label,
  seed,
  description,
}: {
  href: string;
  label: string;
  seed: string;
  description: string;
}) {
  return (
    <Link
      href={href}
      className="group relative block aspect-[4/5] overflow-hidden bg-surface"
    >
      {/* TODO: 실제 한섬/LF 공급 제품 촬영 이미지 또는 라이선스 스톡 이미지로 교체 */}
      <Image
        src={`https://picsum.photos/seed/${seed}/1000/1250`}
        alt={`${label} 카테고리`}
        fill
        className="object-cover transition-transform duration-500 group-hover:scale-105"
      />
      <div className="absolute inset-0 bg-black/20 transition-colors group-hover:bg-black/30" />
      <div className="absolute inset-x-0 bottom-0 p-6 text-white">
        <p className="font-display text-2xl tracking-wide">{label}</p>
        <p className="mt-1 text-xs text-white/80">{description}</p>
      </div>
    </Link>
  );
}
