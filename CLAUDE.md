# tmentor — 프로젝트 가이드

tmentor는 한섬·LF 등 국내 브랜드 의류를 매장/사업자에 납품하는 **가상의 B2B 패션 유통 회사** 레퍼런스 사이트다.

이 프로젝트는 `site-factory`(`C:\project\salt_project` — Next.js + Supabase 공통 Factory 템플릿)에서 DB 스키마, Admin CMS, Query Function, Server Action, Validation, Supabase 연결 코드를 그대로 복사해 시작했다. **지금부터는 이 프로젝트 자체에서 독립적으로 기획·개발을 관리한다** (site-factory는 더 이상 수정하지 않음, 참고가 필요하면 읽기 전용으로만 본다).

## 문서 우선순위

1. `PLANNING.md` — 이 프로젝트의 기획 (사이트맵, 디자인 방향, 콘텐츠 규칙). 최우선.
2. 이 문서(`CLAUDE.md`) — 아키텍처 규칙 및 AI Agent 개발 원칙.
3. 기존 코드 (특히 `src/queries/`, `src/actions/`에 이미 구현된 패턴).
4. 일반적인 Next.js / Supabase 권장 방식.

## 상속받은 공통 기반 (site-factory에서 그대로 복사됨)

아래는 Factory 템플릿에서 가져온 것이며, **임의로 구조를 바꾸지 않는다.** 새 고객 요구사항 때문에 꼭 바꿔야 한다면 먼저 왜 바뀌어야 하는지 명확히 하고 최소한으로 수정한다.

| 영역 | 위치 |
|---|---|
| DB Schema / Migration | `supabase/migrations/001~009` |
| Admin CMS | `src/app/admin/` |
| Query Functions | `src/queries/` |
| Server Actions | `src/actions/` |
| Validation (Zod) | `src/validations/` |
| Types | `src/types/` |
| Supabase 연결 / 인증 | `src/lib/supabase/` (`client.ts`, `server.ts`, `auth.ts`, `middleware.ts`), `src/proxy.ts` |

아키텍처 규칙(상속):
- REST API Layer를 기본으로 만들지 않는다 — 조회는 Query Functions, 변경은 Server Actions.
- 모든 Admin Server Action은 `requireAdmin()` 인증 검증을 첫 단계로 호출하고, 처리 순서는 `Auth → Input Validation → Business Rule Validation → Supabase Operation → Cache Revalidation`을 따른다.
- Action 결과는 `{ success, data?, error? }` 형태로 통일.
- `middleware.ts`가 아니라 **`src/proxy.ts`**를 쓴다 (Next.js 16 컨벤션 — site-factory에서 겪은 치명적 버그, 파일 위치가 `src/` 안이어야 함을 반드시 기억).
- Supabase 호출이 있는 레이아웃/페이지는 `export const dynamic = "force-dynamic"`을 유지한다 (env 없이도 build가 깨지지 않게, 그리고 세션 쿠키가 매 요청 최신 상태를 유지하게).

## 이 프로젝트 고유 영역: Public Website

`src/app/(public)/`가 tmentor만의 영역이다. 원페이지 스크롤 구조(Hero → 회사소개 → 연혁 → Stats → Customers → Collections → Inquiry → Footer)로 되어 있다. 섹션 컴포넌트는 `src/app/(public)/_components/sections/`에 있다. 자세한 사이트맵/디자인 결정은 `PLANNING.md` 참고.

### 확립된 디자인/콘텐츠 규칙

- **톤**: Louis Vuitton류 럭셔리 플래그십 사이트의 레이아웃 패턴(풀블리드, 넉넉한 여백, 절제된 그리드, 저채도 뉴트럴 톤) + 유라클류 B2B 기업소개 사이트의 구조(연혁/실적 통계/거래처 로고).
- **이미지 소싱**: `https://picsum.photos/seed/<키워드>/<w>/<h>` placeholder만 사용한다. 실제 브랜드(LV, 한섬, LF 등)의 사진·로고·카피를 그대로 쓰지 않는다 (저작권/상표권 문제). placeholder 자리에는 `{/* TODO: 실제 ... 교체 */}` 주석을 남긴다.
- **거래처(Customers) 표기**: 실제 회사명/로고를 쓰지 않는다 — 가상의 플레이스홀더 브랜드명만 사용한다 (허위 거래관계 암시로 법적 리스크).
- **애니메이션**: 전부 dependency-free로 구현한다 (framer-motion 등 새 라이브러리 추가 금지). `ScrollReveal.tsx`(IntersectionObserver 기반 fade/slide), `CountUpNumber.tsx`(스크롤 시 숫자 카운트업), Hero의 Ken Burns 줌(CSS `@keyframes`), Customers의 marquee(CSS `@keyframes` + `translateX` 무한 루프)가 이미 구현되어 있다. 새 인터랙션도 같은 방식(순수 CSS/JS, 새 패키지 없이)으로 만든다.
- **접근성**: 모든 애니메이션은 `prefers-reduced-motion: reduce`에서 정적 상태로 fallback한다.

## 현재 상태

- **Supabase 프로젝트: 아직 미연결** (`.env.local`에 실제 값 없음 — 의도적으로 나중으로 미룸). `/admin`, Footer의 연락처 등 Supabase를 호출하는 부분은 연결 전까지 placeholder로 안전하게 fallback하도록 이미 처리되어 있다 (`Footer.tsx`의 `getSiteSettings().catch(() => null)` 패턴 참고 — Supabase 미설정으로 인한 에러가 페이지 전체를 500으로 떨어뜨리지 않게 항상 이 패턴을 유지한다).
- **Supabase 호출 주석 처리 (2026-10-11)**: CRUD가 필요 없는 정적 회사소개 사이트로 운영하기로 해서, Public Website 경로의 Supabase 호출을 지우지 않고 주석 처리했다 — `src/proxy.ts`(세션 갱신/`/admin` 보호 → pass-through), `Footer.tsx`(`getSiteSettings` → 항상 placeholder), `InquiryForm.tsx`(`createInquiry` → 이메일 안내 메시지). 재연결 시 `SUPABASE-DISABLED`로 grep해서 주석을 해제한다. Admin CMS·`src/actions/`·`src/queries/`·`src/lib/supabase/`·migrations는 그대로 남아 있다 (`/admin`은 Supabase 없이는 동작하지 않음).
- **Vercel: 연결됨 (2026-10-11)** — https://tmentor.vercel.app/ . 배포용 GitHub 저장소는 `jaung0217/tmemtor`(git remote `deploy`, `main` 브랜치 push 시 production 배포). 평소 push는 `origin`(`janggoni/tmentor`)으로 하고, 배포할 때만 `git push deploy master:main`.
- Collections(취급 카테고리)는 정적 데이터(`src/app/(public)/_components/sections/Collections.tsx` 내 배열)로만 구현되어 있고 DB 연동이 없다. 실제 Products 카탈로그를 DB로 관리할지는 아직 결정되지 않았다 (`PLANNING.md` 참고).

## AI Agent 개발 원칙

1. 기존 요구사항을 임의로 확장하지 않는다.
2. `src/queries/`, `src/actions/`에 이미 있는 함수를 최우선으로 재사용한다. 새 Query/Server Action은 정말 필요할 때만, 기존 패턴(에러 처리, `requireAdmin()`, Zod validation)을 그대로 따라 추가한다.
3. Database/마이그레이션을 임의로 복잡하게 만들지 않는다.
4. REST API를 기본적으로 만들지 않는다.
5. Business Logic을 UI에 넣지 않는다.
6. 보안을 Client에 의존하지 않는다 — 인증/권한은 서버에서 검증.
7. 새 npm 패키지(특히 애니메이션/UI 라이브러리)는 꼭 필요한 경우가 아니면 추가하지 않는다.
8. 이미지/브랜드명 관련 법적 제약(위 "확립된 디자인/콘텐츠 규칙")을 절대 어기지 않는다.

## 서브에이전트

`.claude/agents/`에 이 프로젝트에 남은 작업 단위별 서브에이전트가 정의되어 있다.

| 서브에이전트 | 용도 |
|---|---|
| `public-site` | Public Website(원페이지) 섹션 추가/수정 — 디자인, 카피, 인터랙션 |
| `supabase-connect` | 새 Supabase 프로젝트 연결, 마이그레이션 적용, Storage/관리자 계정 설정 |
| `vercel-deploy` | Vercel 프로젝트 연결 및 배포 |

## 프로젝트 구조

```text
src/
├── app/
│   ├── (public)/       # tmentor Public Website (이 프로젝트 고유 영역)
│   │   └── _components/sections/
│   └── admin/          # Admin CMS (site-factory에서 상속)
├── actions/            # Server Actions (상속)
├── queries/             # Query Functions (상속)
├── validations/         # (상속)
├── types/                # (상속)
└── lib/supabase/         # (상속)

supabase/
└── migrations/          # 001~009 (상속, site-factory와 동일)
```
