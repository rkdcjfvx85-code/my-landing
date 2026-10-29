-- =========================================================
-- 관리자 전용 신청 목록 보기 권한 설정
-- Supabase 대시보드 > SQL Editor 에 붙여넣고 실행하세요.
-- 맨 아래 '관리자이메일@example.com' 을 실제 관리자 계정 이메일로 바꿔야 합니다.
-- =========================================================

-- 1) 관리자 명단 테이블 (방문자·일반 로그인 사용자는 접근 불가)
create table if not exists public.admin_users (
  user_id uuid primary key references auth.users (id) on delete cascade,
  created_at timestamptz not null default now()
);
alter table public.admin_users enable row level security;
revoke all on public.admin_users from anon, authenticated;

-- 2) 현재 로그인한 사람이 관리자인지 확인하는 함수
create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (select 1 from public.admin_users where user_id = (select auth.uid()));
$$;
revoke all on function public.is_admin() from public, anon;
grant execute on function public.is_admin() to authenticated;

-- 3) 신청서: 관리자만 조회 + 처리 상태(status)만 수정 가능
grant select on public.consultations to authenticated;
grant update (status) on public.consultations to authenticated;

drop policy if exists "admin can read consultations" on public.consultations;
create policy "admin can read consultations"
  on public.consultations for select
  to authenticated
  using ((select public.is_admin()));

drop policy if exists "admin can update consultation status" on public.consultations;
create policy "admin can update consultation status"
  on public.consultations for update
  to authenticated
  using ((select public.is_admin()))
  with check ((select public.is_admin()));

-- 4) 첨부파일: 관리자만 열람 가능 (비공개 버킷 유지)
drop policy if exists "admin can read consultation files" on storage.objects;
create policy "admin can read consultation files"
  on storage.objects for select
  to authenticated
  using (bucket_id = 'post-files' and (select public.is_admin()));

-- 5) 관리자 계정 등록 (Authentication > Users 에서 먼저 계정을 만든 뒤 실행)
insert into public.admin_users (user_id)
select id from auth.users where email = '관리자이메일@example.com'
on conflict do nothing;

-- 등록 확인: 1줄이 나오면 성공
select u.email from public.admin_users a join auth.users u on u.id = a.user_id;
