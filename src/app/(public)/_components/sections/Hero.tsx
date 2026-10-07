import Image from "next/image";

/**
 * Hero section — full-bleed visual + wordmark + tagline.
 *
 * Fade-in on load (not scroll-reveal, since it is visible immediately):
 * a plain CSS animation defined in globals.css (`animate-hero-fade`),
 * staggered per element via `animationDelay`. No JS/IntersectionObserver
 * needed here — that is reserved for below-the-fold sections.
 */
export function Hero() {
  return (
    <section className="relative h-[100vh] min-h-[560px] w-full overflow-hidden bg-foreground">
      {/* TODO: 실제 한섬/LF 공급 제품 촬영 이미지 또는 라이선스 스톡 이미지로 교체 */}
      <Image
        src="https://picsum.photos/seed/tmentor-hero/2000/1400"
        alt="tmentor B2B 의류 공급 컬렉션 비주얼"
        fill
        priority
        className="object-cover"
      />
      <div className="absolute inset-0 bg-black/35" />

      <div className="relative z-10 flex h-full flex-col items-start justify-end px-6 pb-24 sm:px-10 md:px-16">
        <p
          className="animate-hero-fade mb-4 text-xs font-medium uppercase tracking-[0.35em] text-white/80"
          style={{ animationDelay: "0.1s" }}
        >
          Wholesale Fashion Partner
        </p>
        <h1
          className="animate-hero-fade font-display text-5xl leading-tight text-white sm:text-7xl"
          style={{ animationDelay: "0.3s" }}
        >
          TMENTOR
        </h1>
        <p
          className="animate-hero-fade mt-6 max-w-md text-sm leading-7 text-white/85 sm:text-base"
          style={{ animationDelay: "0.5s" }}
        >
          한섬, LF 등 국내 브랜드 의류를 합리적인 조건으로 소싱해, 매장과
          사업자에 안정적으로 공급합니다.
        </p>
        <a
          href="#inquiry"
          className="animate-hero-fade mt-8 inline-flex items-center border border-white px-7 py-3 text-xs font-medium uppercase tracking-[0.2em] text-white transition-colors hover:bg-white hover:text-foreground"
          style={{ animationDelay: "0.7s" }}
        >
          납품 상담 신청
        </a>
      </div>

      <div
        className="animate-hero-fade absolute bottom-8 left-1/2 z-10 -translate-x-1/2 text-[10px] uppercase tracking-[0.3em] text-white/70"
        style={{ animationDelay: "1s" }}
      >
        Scroll
      </div>
    </section>
  );
}
