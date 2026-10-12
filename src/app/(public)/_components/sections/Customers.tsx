import { ScrollReveal } from "../ScrollReveal";

const NETWORK_TYPES = [
  "SELECT SHOP",
  "RETAIL STORE",
  "ONLINE STORE",
  "MULTI BRAND",
  "SHOWROOM",
  "FASHION BUSINESS",
] as const;

const ROW_1 = NETWORK_TYPES;
const ROW_2 = [...NETWORK_TYPES].reverse();

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
        className={`flex w-max gap-3 motion-reduce:w-full motion-reduce:flex-wrap ${
          direction === "left" ? "animate-marquee-left" : "animate-marquee-right"
        }`}
      >
        {duplicated.map((name, index) => (
          <div
            key={`${name}-${index}`}
            className={`flex h-20 w-52 shrink-0 items-center justify-between border border-white/20 px-5 sm:w-64 ${
              index >= items.length ? "motion-reduce:hidden" : ""
            }`}
          >
            <span className="text-xs font-semibold tracking-[0.12em] text-white/90">
              {name}
            </span>
            <span className="text-sm text-[#3f72ff]" aria-hidden="true">
              / /
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

export function Customers() {
  return (
    <section id="customers" className="scroll-mt-16 bg-foreground py-20 text-white lg:py-28">
      <div className="mx-auto max-w-7xl px-6 sm:px-10">
        <ScrollReveal className="grid gap-8 border-b border-white/20 pb-12 md:grid-cols-[1fr_2fr] md:items-end">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-white/55">
            Partner network
          </p>
          <div>
            <h2 className="max-w-2xl text-3xl font-semibold leading-tight tracking-[0.01em] sm:text-4xl">
              다양한 판매 채널과 연결되는 공급 네트워크.
            </h2>
            <p className="mt-4 max-w-xl text-sm leading-6 text-white/65">
              매장과 사업자의 운영 방식에 맞춰 상담부터 입고 품목 검토까지 함께합니다.
            </p>
          </div>
        </ScrollReveal>
      </div>

      <ScrollReveal className="mt-12 space-y-3" delay={100}>
        <MarqueeRow items={ROW_1} direction="left" />
        <MarqueeRow items={ROW_2} direction="right" />
      </ScrollReveal>

      <div className="mx-auto mt-8 flex max-w-7xl justify-end px-6 sm:px-10">
        <p className="text-xs tracking-[0.1em] text-white/45">TMENTOR NETWORK / SEOUL</p>
      </div>
    </section>
  );
}
