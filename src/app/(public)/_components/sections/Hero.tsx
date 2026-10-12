import Image from "next/image";
import { CountUpNumber } from "../CountUpNumber";

const PROOF_POINTS = [
  {
    value: "650+",
    title: "전국 650개 이상",
    detail: "도매 파트너 스토어",
    accent: true,
  },
  {
    value: "입고 상품",
    title: "시즌별 다양한 재고",
    detail: "합리적인 조건으로 빠르게",
    accent: false,
  },
  {
    value: "서울",
    title: "서울 기반 물류 시스템",
    detail: "더 빠르고, 더 안정적인 공급",
    accent: false,
  },
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
        <div className="flex flex-1 items-end pb-24 pt-24 sm:pb-32">
          <div className="max-w-2xl animate-hero-fade">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-white/70">
              Wholesale fashion partner
            </p>
            <p className="mt-6 text-5xl font-semibold leading-none tracking-[0.01em] sm:text-7xl lg:text-8xl">
              TMENTOR
            </p>
            <h1 className="mt-4 text-3xl font-semibold leading-[1.15] tracking-[0.01em] sm:text-4xl lg:text-5xl">
              브랜드 재고,
              <br />
              더 명확하게 연결합니다.
            </h1>
            <p className="mt-7 max-w-lg text-base leading-7 text-white/80 sm:text-lg">
              좋은 상품이 더 많은 브랜드와 만날 수 있도록, TMENTOR가 도매 파트너의
              성장을 돕습니다.
            </p>
            <a
              href="#inquiry"
              className="mt-9 inline-flex bg-white px-5 py-3 text-sm font-semibold text-foreground transition-colors hover:bg-[#2459d7] hover:text-white"
            >
              상담 요청하기
            </a>
          </div>
        </div>

        <div className="grid border-t border-white/30 bg-black/65 lg:grid-cols-3">
          {PROOF_POINTS.map((point) => (
            <div
              key={point.value}
              className="flex items-center gap-5 border-b border-white/20 px-5 py-6 last:border-b-0 sm:px-7 lg:border-b-0 lg:border-r lg:first:pl-7 lg:last:border-r-0"
            >
              <p
                className={`shrink-0 text-3xl font-semibold leading-none sm:text-4xl ${
                  point.accent ? "text-[#3f72ff]" : "text-white"
                }`}
              >
                {point.accent ? <CountUpNumber value={point.value} /> : point.value}
              </p>
              <div>
                <p className="text-sm font-semibold text-white">{point.title}</p>
                <p className="mt-1 text-sm text-white/65">{point.detail}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
