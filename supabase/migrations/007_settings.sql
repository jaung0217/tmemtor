-- 007_settings.sql
-- SPEC 6장 Site Settings
--
-- SPEC 6장은 필드명만 나열하고 타입/제약은 명시하지 않았으므로 아래와 같이 타입을 정한다.
-- - business_info, social_links: 구조가 SPEC/PRD에 정의되어 있지 않음 (OPEN_ISSUES.md #9) → jsonb로 보관.
--   세부 필드 스키마는 팀 결정 후 Phase 4 Validation/Types에서 확정한다.
-- - 그 외 필드는 text, id/created_at/updated_at 외에는 필수 여부가 명시되지 않아 전부 nullable로 둔다
--   (Admin UI에서 값을 채워 넣기 전에도 행이 존재할 수 있어야 하므로).
--
-- 절대 금지 (SPEC 6장): 사업장 주소를 여기에 저장하지 않는다. 주소는 locations 테이블 소관이다.

create table if not exists public.site_settings (
  id                  uuid primary key default gen_random_uuid(),
  site_name           text null,
  logo_url            text null,
  favicon_url         text null,
  contact_email       text null,
  contact_phone       text null,
  business_info       jsonb null,
  social_links        jsonb null,
  seo_title           text null,
  seo_description     text null,
  default_og_image    text null,
  created_at          timestamptz not null default now(),
  updated_at          timestamptz not null default now()
);

drop trigger if exists set_site_settings_updated_at on public.site_settings;
create trigger set_site_settings_updated_at
  before update on public.site_settings
  for each row
  execute function public.set_updated_at();

-- RLS (SPEC 9장)
-- 참고: SPEC 9장 Public RLS 목록(posts/faqs/locations/categories)에 site_settings는 포함되어 있지 않다.
-- 따라서 이 Phase에서는 Public(anon) 조회 정책을 추가하지 않고 Admin(authenticated) 전용으로 둔다.
-- TODO(Phase 4): Public Website가 getSiteSettings()로 사이트명/로고/SEO 정보를 노출해야 한다면
-- Public에 필요한 컬럼만 조회 가능한 정책 추가를 SPEC 담당자와 논의 후 진행한다.
alter table public.site_settings enable row level security;

create policy "site_settings_admin_all" on public.site_settings
  for all
  to authenticated
  using (true)
  with check (true);
