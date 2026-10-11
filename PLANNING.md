# PLANNING.md — tmentor 기획

이 문서는 tmentor 프로젝트의 기획을 관리한다. 원래 `site-factory/REFERENCE_SITES.md`에서 시작된 기획을 이 프로젝트로 옮겨와 계속 관리한다 (site-factory 쪽 기록은 과거 이력으로 남아있다).

작성/최신화: 2026-10-11

---

## 컨셉

- **업종**: B2B 패션 유통/공급업 — 한섬, LF 등 국내 기업 브랜드 의류를 타 사업자/매장에 납품하는 가상 회사
- **목적**: Louis Vuitton 플래그립 사이트의 럭셔리 비주얼 톤 + "유라클"류 B2B 기업소개 사이트의 구조(연혁/실적/거래처)를 결합한 레퍼런스 사이트
- **사이트명**: tmentor (확정)

## 사용하는 공통 모듈 (site-factory Factory 기반)

- [x] Inquiry — 납품/바이어 문의 폼 (`createInquiry()` Server Action 그대로 재사용)
- [x] Site Settings — Footer의 연락처 정보 (`getSiteSettings()` 그대로 재사용)
- [ ] Posts, Categories, FAQ, Locations, Media — 현재 미사용 (필요해지면 추가 검토)

## Products/Collection 카탈로그에 대한 결정

Products는 site-factory 공통 모듈이 아니다 (PRD "고객별 확장" — 고객 프로젝트 전용). 현재는 **정적 데이터**(`src/app/(public)/_components/sections/Collections.tsx`)로만 구현되어 있고 DB 연동이 없다. 실제 DB로 관리할지 여부는 아직 미결정 — 필요해지면 별도 마이그레이션 + Query/Action을 새로 설계한다.

---

## 사이트 구조 (v2 — 원페이지, 완료)

`/` 한 페이지 안의 섹션 (헤더 앵커 내비게이션으로 이동):

| 섹션 | 앵커 | 내용 | 상태 |
|---|---|---|---|
| Hero | — | 풀블리드 이미지 + 워드마크 + 태그라인, Ken Burns 줌 애니메이션 | ✅ 완료 |
| 회사소개 | `#about` | 브랜드 스토리 | ✅ 완료 |
| 연혁 | `#history` | 2006~2026 가상 마일스톤 타임라인 | ✅ 완료 |
| 숫자로 보는 tmentor | `#stats` | 실적 스탯 타일(업력/파트너 매장/납품량/재계약률), 스크롤 시 count-up 애니메이션 | ✅ 완료 |
| Customers | `#customers` | 가상 거래처 브랜드명, 두 줄 반대방향 marquee 애니메이션 | ✅ 완료 |
| 취급 카테고리 | `#collections` | Outerwear / Knitwear / Shirts 3개, 세로로 긴(2:3) 이미지 타일 | ✅ 완료 |
| Inquiry | `#inquiry` | 납품 상담 문의 폼 (`createInquiry()` 재사용) | ✅ 완료 |
| Footer | — | 연락처 (`getSiteSettings()` 재사용, Supabase 미연결 시 placeholder fallback) | ✅ 완료 |

과거 v1(멀티 페이지: `/about`, `/collections/women`, `/collections/men`, `/inquiry`, `/contact` 분리)은 전부 제거되고 위 원페이지 구조로 대체되었다.

## 인터랙션 (완료)

- **Hero**: CSS `@keyframes` Ken Burns 줌/패닝 루프 (18s, 무한반복). 실제 영상/움짤은 라이선스 문제로 사용하지 않고 CSS 애니메이션으로 "영상 같은 느낌"을 대신함.
- **Stats**: `CountUpNumber.tsx` — 스크롤 진입 시 0 → 목표값 카운트업 (IntersectionObserver + requestAnimationFrame, ease-out, 1.3s).
- **Customers**: 두 줄 marquee, 각 줄 반대 방향으로 무한 스크롤 (CSS `translateX` 루프).
- **공통**: 모든 섹션은 `ScrollReveal.tsx`로 스크롤 시 fade-in/slide-up. 전부 `prefers-reduced-motion: reduce`에서 정적 상태로 fallback.
- 새 npm 패키지 추가 없이 전부 구현됨 (dependency-free 원칙 유지 중).

## 디자인 레퍼런스

- Louis Vuitton 코리아 플래그십 사이트 — 레이아웃 패턴만 참고 (실제 자산 사용 금지)
- "유라클" 스타일 B2B 기업 소개 사이트 — 스탯 섹션, 고객사 로고 그리드, 원페이지 구조

### ⚠️ 법적 주의 (계속 유지)

- LV 등 실제 브랜드의 제품 사진·로고·카피 사용 금지. 레이아웃/UX 패턴만 참고.
- Customers 섹션에 실제 한섬/LF 등 회사명·로고 노출 금지 — 허위 거래관계 암시 리스크. 가상 플레이스홀더만 사용.
- 연혁 마일스톤, 실적 숫자, 거래처명은 전부 가상 콘텐츠 (실존 인증/통계 아님).

---

## 남은 작업

1. **Supabase 프로젝트 연결** — 아직 미연결. 연결 시 `supabase-connect` 서브에이전트로 진행 (새 프로젝트 생성은 대시보드에서 수동, 이후 마이그레이션/Storage/관리자 계정은 CLI로).
2. **Vercel 배포** — 아직 미연결. `vercel-deploy` 서브에이전트로 진행.
3. **Products 카탈로그 DB 연동 여부 결정** — 위 "Products/Collection 카탈로그에 대한 결정" 참고.
4. **실제 콘텐츠 교체** — 현재 picsum placeholder 이미지, 가상 연혁/실적 숫자는 전부 실제 데이터로 교체 필요 (언제 할지는 미정).
