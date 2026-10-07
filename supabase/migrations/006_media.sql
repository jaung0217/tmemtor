-- 006_media.sql
-- SPEC 7장 Media
--
-- SPEC 7장은 필드명만 나열하고 타입/제약은 명시하지 않았으므로, Storage Object와의 1:1 매핑을
-- 보장할 수 있는 최소한의 타입/제약만 부여한다 (필요 이상의 컬럼을 추가하지 않는다).
--
-- 참고: SPEC 9장 Public RLS 목록(posts/faqs/locations/categories)에 media는 포함되어 있지 않고,
-- SPEC 11장 Query Functions 목록에도 Public용 getMedia()가 없다.
-- 따라서 media는 Admin(authenticated) 전용 테이블로 취급하고 Public(anon) 조회 정책을 추가하지 않는다.

create table if not exists public.media (
  id             uuid primary key default gen_random_uuid(),
  filename       text not null,
  storage_path   text not null,
  url            text not null,
  mime_type      text not null,
  size           bigint not null,
  created_at     timestamptz not null default now(),
  updated_at     timestamptz not null default now()
);

-- Storage Object와 DB 레코드가 1:1로 매핑되도록 storage_path unique 제약
create unique index if not exists uq_media_storage_path on public.media (storage_path);

drop trigger if exists set_media_updated_at on public.media;
create trigger set_media_updated_at
  before update on public.media
  for each row
  execute function public.set_updated_at();

-- RLS (SPEC 9장)
alter table public.media enable row level security;

-- Admin: 인증된 사용자만 전체 CRUD 가능. Public(anon) 정책은 없음 (조회 포함 전면 차단)
create policy "media_admin_all" on public.media
  for all
  to authenticated
  using (true)
  with check (true);
