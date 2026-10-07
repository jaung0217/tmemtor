-- 002_posts.sql
-- SPEC 4.2 Posts
--
-- 주의: 파일명 순서상 posts(002)가 categories(003)보다 먼저 실행된다.
-- category_id는 categories(id)를 참조해야 하지만 이 시점에는 categories 테이블이 아직 없으므로,
-- 여기서는 category_id 컬럼만 생성(NULL 허용, FK 제약 없음)하고,
-- FK 제약(ON DELETE SET NULL)은 003_categories.sql에서 categories 테이블 생성 직후 ALTER TABLE로 추가한다.
-- 이렇게 하면 001~008을 순서대로 적용할 때 002 시점에도 독립적으로 에러 없이 실행되고,
-- 003 적용 후에는 정상적으로 FK 무결성이 보장된다.

create table if not exists public.posts (
  id             uuid primary key default gen_random_uuid(),
  title          text not null,
  content        text not null,
  thumbnail      text null,
  category_id    uuid null,
  is_published   boolean not null default false,
  created_at     timestamptz not null default now(),
  updated_at     timestamptz not null default now()
);

comment on column public.posts.category_id is
  'FK to categories(id) ON DELETE SET NULL — 제약은 003_categories.sql에서 categories 테이블 생성 후 추가됨';

create index if not exists idx_posts_category_id on public.posts (category_id);
create index if not exists idx_posts_is_published on public.posts (is_published);
create index if not exists idx_posts_created_at on public.posts (created_at desc);

drop trigger if exists set_posts_updated_at on public.posts;
create trigger set_posts_updated_at
  before update on public.posts
  for each row
  execute function public.set_updated_at();

-- RLS (SPEC 9장)
alter table public.posts enable row level security;

-- Public: 공개된 게시물만 조회 가능
create policy "posts_public_select" on public.posts
  for select
  to anon
  using (is_published = true);

-- Admin: 인증된 사용자는 전체 CRUD 가능
create policy "posts_admin_all" on public.posts
  for all
  to authenticated
  using (true)
  with check (true);
