-- 004_faq.sql
-- SPEC 4.3 FAQ
--
-- 이 시점에는 categories 테이블이 이미 003_categories.sql에서 생성되어 있으므로
-- category_id FK를 테이블 생성과 함께 바로 선언할 수 있다.
--
-- OPEN_ISSUES.md #4: SPEC 4.3에는 category_id 삭제 정책이 명시되어 있지 않지만,
-- Posts(SPEC 4.2)와 동일하게 Category 삭제 시 NULL 처리(ON DELETE SET NULL)로 일관성을 유지한다.
-- (categories 테이블 자체의 posts/faq 공유 구조 분리는 OPEN_ISSUES.md #3에 따라 별도 결정 사항이며
-- 이 마이그레이션에서 임의로 손대지 않는다.)

create table if not exists public.faqs (
  id             uuid primary key default gen_random_uuid(),
  question       text not null,
  answer         text not null,
  category_id    uuid null references public.categories (id) on delete set null,
  is_published   boolean not null default false,
  sort_order     integer not null default 0,
  created_at     timestamptz not null default now(),
  updated_at     timestamptz not null default now()
);

create index if not exists idx_faqs_category_id on public.faqs (category_id);
create index if not exists idx_faqs_is_published on public.faqs (is_published);
create index if not exists idx_faqs_sort_order on public.faqs (sort_order);

drop trigger if exists set_faqs_updated_at on public.faqs;
create trigger set_faqs_updated_at
  before update on public.faqs
  for each row
  execute function public.set_updated_at();

-- RLS (SPEC 9장)
alter table public.faqs enable row level security;

-- Public: 공개된 FAQ만 조회 가능
create policy "faqs_public_select" on public.faqs
  for select
  to anon
  using (is_published = true);

-- Admin: 인증된 사용자는 전체 CRUD 가능
create policy "faqs_admin_all" on public.faqs
  for all
  to authenticated
  using (true)
  with check (true);
