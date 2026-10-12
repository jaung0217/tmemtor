import Image from "next/image";

const PROOF_POINTS = [
  { label: "Seasonal stock", detail: "시즌별 취급 품목" },
  { label: "Store-focused sourcing", detail: "매장별 수요를 고려한 구성" },
  { label: "Seoul logistics", detail: "서울 기반 유통 운영" },
] as const;

export function Hero() {
  return (
    <section className="relative flex min-h-[720px] overflow-hidden bg-foreground text-white lg:min-h-[calc(100svh-4rem)]">
      <Image
        src="/images/tmentor/showroom-hero.png"
        alt="의류가 전시된 tmentor 쇼룸"
        fill
        preload
        sizes="100vw"
        className="object-cover object-[62%_center]"
      />
      <div className="absolute inset-0 bg-black/35" />
      <div className="absolute inset-y-0 left-0 w-full bg-black/45 md:w-3/5 lg:w-[46%]" />

      <div className="relative z-10 mx-auto flex w-full max-w-7xl flex-1 flex-col px-6 sm:px-10">
        <div className="flex flex-1 items-end pb-40 pt-24 sm:pb-48">
          <div className="max-w-2xl animate-hero-fade">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-white/70">
              Wholesale fashion partner
            </p>
            <h1 className="mt-6 text-5xl font-semibold leading-[1.08] tracking-[0.01em] sm:text-6xl lg:text-7xl">
              브랜드 재고,
              <br />
              더 명확하게 연결합니다.
            </h1>
            <p className="mt-7 max-w-lg text-base leading-7 text-white/80 sm:text-lg">
              매장과 사업자를 위한 의류 공급 파트너. 시즌과 수요에 맞는 취급 품목을
              함께 검토합니다.
            </p>
            <a
              href="#inquiry"
              className="mt-9 inline-flex bg-white px-5 py-3 text-sm font-semibold text-foreground transition-colors hover:bg-[#2459d7] hover:text-white"
            >
              상담 요청하기
            </a>
          </div>
        </div>

        <div className="grid border-t border-white/30 lg:grid-cols-3">
          {PROOF_POINTS.map((point) => (
            <div
              key={point.label}
              className="border-b border-white/20 py-5 last:border-b-0 lg:border-b-0 lg:border-r lg:px-7 lg:first:pl-0 lg:last:border-r-0"
            >
              <p className="text-sm font-semibold text-white">{point.label}</p>
              <p className="mt-1 text-sm text-white/65">{point.detail}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
