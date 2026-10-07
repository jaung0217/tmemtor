-- 008_locations.sql
-- SPEC 5장 Locations
--
-- 절대 금지 (SPEC 5장): type, location_type, branch_type, parent_location_id, is_branch, is_main 등
-- 계층 구조를 나타내는 컬럼을 추가하지 않는다. 장소의 의미는 name으로만 표현한다.

create table if not exists public.locations (
  id                  uuid primary key default gen_random_uuid(),
  name                text not null,
  description         text null,
  address             text not null,
  detail_address      text null,
  zip_code            text null,
  latitude            numeric null,
  longitude           numeric null,
  phone               text null,
  sort_order          integer not null default 0,
  is_active           boolean not null default true,
  created_at          timestamptz not null default now(),
  updated_at          timestamptz not null default now()
);

create index if not exists idx_locations_is_active on public.locations (is_active);
create index if not exists idx_locations_sort_order on public.locations (sort_order);

drop trigger if exists set_locations_updated_at on public.locations;
create trigger set_locations_updated_at
  before update on public.locations
  for each row
  execute function public.set_updated_at();

-- RLS (SPEC 9장)
alter table public.locations enable row level security;

-- Public: 활성화된 Location만 조회 가능
create policy "locations_public_select" on public.locations
  for select
  to anon
  using (is_active = true);

-- Admin: 인증된 사용자는 전체 CRUD 가능
create policy "locations_admin_all" on public.locations
  for all
  to authenticated
  using (true)
  with check (true);
