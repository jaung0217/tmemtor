-- 003_categories.sql
-- SPEC 4.1 Categories
--
-- OPEN_ISSUES.md #3: posts/faq가 하나의 categories 테이블을 공유하는 구조는
-- 아직 팀 결정 사항이 아니므로, SPEC 4.1에 정의된 단일 categories 테이블 그대로 구현한다.
-- 별도의 scope/type 구분 컬럼을 임의로 추가하지 않는다.

create table if not exists public.categories (
  id             uuid primary key default gen_random_uuid(),
  name           text not null,
  slug           text not null,
  sort_order     integer not null default 0,
  is_active      boolean not null default true,
  created_at     timestamptz not null default now(),
  updated_at     timestamptz not null default now()
);

-- slug는 프로젝트 내에서 unique (SPEC 4.1)
create unique index if not exists uq_categories_slug on public.categories (slug);
create index if not exists idx_categories_is_active on public.categories (is_active);
create index if not exists idx_categories_sort_order on public.categories (sort_order);

drop trigger if exists set_categories_updated_at on public.categories;
create trigger set_categories_updated_at
  before update on public.categories
  for each row
  execute function public.set_updated_at();

-- RLS (SPEC 9장)
alter table public.categories enable row level security;

-- Public: 활성화된 카테고리만 조회 가능
create policy "categories_public_select" on public.categories
  for select
  to anon
  using (is_active = true);

-- Admin: 인증된 사용자는 전체 CRUD 가능
create policy "categories_admin_all" on public.categories
  for all
  to authenticated
  using (true)
  with check (true);

-- 002_posts.sql에서 보류했던 posts.category_id FK를 이제 categories 테이블이 존재하므로 추가한다.
-- Category 삭제 시 posts 데이터가 깨지지 않도록 ON DELETE SET NULL 적용 (SPEC 4.2)
alter table public.posts
  add constraint posts_category_id_fkey
  foreign key (category_id)
  references public.categories (id)
  on delete set null;
