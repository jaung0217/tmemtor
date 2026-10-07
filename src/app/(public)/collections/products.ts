/**
 * Static placeholder product catalog for `/collections/women` and
 * `/collections/men`.
 *
 * CLAUDE.md / REFERENCE_SITES.md "tmentor" 고객별 요구사항: Products는
 * Factory 공통 모듈이 아니라 고객 프로젝트 전용 확장이고, 1차 범위("외관만")는
 * DB 연동 없는 정적 랜딩으로 구현한다 — 아래 배열은 의도적으로 DB/Query를
 * 거치지 않는다. 이름/가격대는 임의 placeholder이며 실제 한섬/LF 공급 제품
 * 정보가 아니다.
 */
export interface StaticProduct {
  id: string;
  name: string;
  priceLabel: string;
  imageSeed: string;
}

export const WOMEN_PRODUCTS: StaticProduct[] = [
  { id: "w-01", name: "울 블렌드 더블 코트", priceLabel: "₩320,000대", imageSeed: "tmentor-women-01" },
  { id: "w-02", name: "하이넥 캐시미어 니트", priceLabel: "₩180,000대", imageSeed: "tmentor-women-02" },
  { id: "w-03", name: "테일러드 셋업 재킷", priceLabel: "₩260,000대", imageSeed: "tmentor-women-03" },
  { id: "w-04", name: "스트레이트 핏 울 슬랙스", priceLabel: "₩150,000대", imageSeed: "tmentor-women-04" },
  { id: "w-05", name: "실크 블렌드 블라우스", priceLabel: "₩140,000대", imageSeed: "tmentor-women-05" },
  { id: "w-06", name: "플리츠 미디 스커트", priceLabel: "₩160,000대", imageSeed: "tmentor-women-06" },
  { id: "w-07", name: "경량 패딩 롱 베스트", priceLabel: "₩210,000대", imageSeed: "tmentor-women-07" },
  { id: "w-08", name: "트렌치 레인 코트", priceLabel: "₩290,000대", imageSeed: "tmentor-women-08" },
  { id: "w-09", name: "와이드 데님 팬츠", priceLabel: "₩130,000대", imageSeed: "tmentor-women-09" },
];

export const MEN_PRODUCTS: StaticProduct[] = [
  { id: "m-01", name: "싱글 브레스트 울 코트", priceLabel: "₩340,000대", imageSeed: "tmentor-men-01" },
  { id: "m-02", name: "크루넥 메리노 니트", priceLabel: "₩170,000대", imageSeed: "tmentor-men-02" },
  { id: "m-03", name: "세미 테일러드 블레이저", priceLabel: "₩280,000대", imageSeed: "tmentor-men-03" },
  { id: "m-04", name: "스트레이트 슬랙스", priceLabel: "₩140,000대", imageSeed: "tmentor-men-04" },
  { id: "m-05", name: "옥스포드 셔츠", priceLabel: "₩110,000대", imageSeed: "tmentor-men-05" },
  { id: "m-06", name: "퀄팅 경량 재킷", priceLabel: "₩230,000대", imageSeed: "tmentor-men-06" },
  { id: "m-07", name: "울 블렌드 머플러", priceLabel: "₩80,000대", imageSeed: "tmentor-men-07" },
  { id: "m-08", name: "스트레이트 데님", priceLabel: "₩120,000대", imageSeed: "tmentor-men-08" },
  { id: "m-09", name: "하프 짚업 니트", priceLabel: "₩160,000대", imageSeed: "tmentor-men-09" },
];
