-- 005_inquiries.sql
-- SPEC 4.4 Inquiries

do $$
begin
  if not exists (select 1 from pg_type where typname = 'inquiry_status') then
    create type public.inquiry_status as enum ('NEW', 'IN_PROGRESS', 'ANSWERED', 'CLOSED');
  end if;
end;
$$;

create table if not exists public.inquiries (
  id                  uuid primary key default gen_random_uuid(),
  name                text not null,
  email               text null,
  phone               text null,
  title               text not null,
  content             text not null,
  privacy_agreed      boolean not null,
  status              public.inquiry_status not null default 'NEW',
  created_at          timestamptz not null default now(),
  updated_at          timestamptz not null default now()
);

create index if not exists idx_inquiries_status on public.inquiries (status);
create index if not exists idx_inquiries_created_at on public.inquiries (created_at desc);

drop trigger if exists set_inquiries_updated_at on public.inquiries;
create trigger set_inquiries_updated_at
  before update on public.inquiries
  for each row
  execute function public.set_updated_at();

-- RLS (SPEC 9장)
-- Public은 문의 생성만 가능하며, 목록/상세는 절대 노출되지 않는다.
-- Admin(authenticated)만 조회/수정/삭제할 수 있다.
alter table public.inquiries enable row level security;

-- Public: INSERT만 허용. privacy_agreed = true인 경우에만 등록 가능 (SPEC 4.4, DB 레벨 방어)
-- Server Action 단에서도 동일 검증을 수행해야 한다 (SPEC 13장) — 이 제약은 defense-in-depth 목적.
create policy "inquiries_public_insert" on public.inquiries
  for insert
  to anon
  with check (privacy_agreed = true);

-- Admin: 인증된 사용자는 전체 CRUD 가능 (조회/수정/삭제 포함)
create policy "inquiries_admin_all" on public.inquiries
  for all
  to authenticated
  using (true)
  with check (true);

-- 주의: anon role에는 SELECT/UPDATE/DELETE 정책이 전혀 없으므로
-- RLS가 활성화된 상태에서 Public은 기존 문의를 조회/수정/삭제할 수 없다.
