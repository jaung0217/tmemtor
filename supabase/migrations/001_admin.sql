-- 001_admin.sql
-- 목적: 이후 모든 마이그레이션이 공통으로 사용하는 기반(확장, 공용 트리거 함수)을 준비한다.
--
-- 이 프로젝트에는 SPEC 4~7장에 별도의 "admin" 테이블이 정의되어 있지 않다.
-- PRD/SPEC 10장에 따라 MVP에서는 일반 사용자 계정을 만들지 않으므로,
-- Supabase Auth로 인증된 사용자(authenticated role) = 관리자로 취급한다.
--
-- TODO(Phase 3 - Auth): 관리자가 여러 명이거나 역할 구분이 필요해지면
-- 별도의 admin 식별 테이블/claim 체계를 이 시점에 추가로 설계한다.
-- 현재 Phase에서는 임의로 admin role 테이블을 만들지 않는다 (SPEC 27.3 불필요한 추상화 금지).

-- gen_random_uuid() 사용을 위한 확장 (Supabase 프로젝트에는 기본 포함되어 있는 경우가 많으나 명시적으로 보장한다)
create extension if not exists pgcrypto;

-- 모든 테이블이 공통으로 사용할 updated_at 자동 갱신 트리거 함수
create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

comment on function public.set_updated_at() is
  '테이블의 updated_at 컬럼을 UPDATE 시점의 now()로 자동 갱신하는 공용 트리거 함수';
