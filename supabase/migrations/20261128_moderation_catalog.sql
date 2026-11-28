create table if not exists public.nh_comment_reports (
 id uuid primary key default gen_random_uuid(),
 comment_id uuid not null references public.comments(id) on delete cascade,
 reporter_id uuid not null default auth.uid() references auth.users(id) on delete cascade,
 reason text not null check (char_length(trim(reason)) between 10 and 500),
 created_at timestamptz not null default now(),
 resolved boolean not null default false,
 unique(comment_id,reporter_id)
);
alter table public.nh_comment_reports enable row level security;
revoke all on public.nh_comment_reports from public,anon,authenticated;
grant select,insert,update on public.nh_comment_reports to authenticated;
drop policy if exists nh_comment_report_insert on public.nh_comment_reports;
create policy nh_comment_report_insert on public.nh_comment_reports for insert to authenticated with check (reporter_id=(select auth.uid()) and not resolved and exists(select 1 from public.comments c where c.id=comment_id));
drop policy if exists nh_comment_report_read on public.nh_comment_reports;
create policy nh_comment_report_read on public.nh_comment_reports for select to authenticated using ((select public.is_admin()));
drop policy if exists nh_comment_report_update on public.nh_comment_reports;
create policy nh_comment_report_update on public.nh_comment_reports for update to authenticated using ((select public.is_admin())) with check ((select public.is_admin()));
create or replace function nh_private.guard_comment_report() returns trigger language plpgsql security definer set search_path='' as $$
declare uid uuid:=auth.uid();
begin
 if uid is null then raise exception 'Sign in first'; end if;
 perform pg_catalog.pg_advisory_xact_lock(pg_catalog.hashtextextended(uid::text||':comment-report',0));
 if (select count(*) from public.nh_comment_reports where reporter_id=uid and created_at>now()-interval '1 hour')>=10 then raise exception 'Hourly report limit reached'; end if;
 new.reporter_id:=uid; new.created_at:=now(); new.resolved:=false; return new;
end $$;
revoke all on function nh_private.guard_comment_report() from public,anon,authenticated;
drop trigger if exists nh_guard_comment_report on public.nh_comment_reports;
create trigger nh_guard_comment_report before insert on public.nh_comment_reports for each row execute function nh_private.guard_comment_report();
alter table public.notes add column if not exists rejection_reason text not null default '';
create or replace function nh_private.guard_rejection_reason() returns trigger language plpgsql set search_path='' as $$
begin
 if not public.is_admin() and auth.uid() is not null then
  if TG_OP='INSERT' then new.rejection_reason:=''; else new.rejection_reason:=old.rejection_reason; end if;
 end if;
 if new.status='approved' then new.rejection_reason:=''; end if;
 return new;
end $$;
revoke all on function nh_private.guard_rejection_reason() from public,anon,authenticated;
drop trigger if exists nh_guard_rejection_reason on public.notes;
create trigger nh_guard_rejection_reason before insert or update on public.notes for each row execute function nh_private.guard_rejection_reason();
create table if not exists public.nh_subject_catalog (
 name text primary key check (char_length(trim(name)) between 1 and 100),
 created_at timestamptz not null default now()
);
alter table public.nh_subject_catalog enable row level security;
revoke all on public.nh_subject_catalog from public,anon,authenticated;
grant select on public.nh_subject_catalog to anon,authenticated;
grant insert,delete on public.nh_subject_catalog to authenticated;
drop policy if exists nh_subject_read on public.nh_subject_catalog;
create policy nh_subject_read on public.nh_subject_catalog for select to anon,authenticated using (true);
drop policy if exists nh_subject_admin_insert on public.nh_subject_catalog;
create policy nh_subject_admin_insert on public.nh_subject_catalog for insert to authenticated with check ((select public.is_admin()));
drop policy if exists nh_subject_admin_delete on public.nh_subject_catalog;
create policy nh_subject_admin_delete on public.nh_subject_catalog for delete to authenticated using ((select public.is_admin()));
insert into public.nh_subject_catalog(name) values ('Data Structures'),('Database Management'),('Computer Networks'),('Python Programming'),('Web Development'),('Operating Systems'),('Java Programming'),('Cybersecurity'),('Cloud Computing'),('Software Engineering'),('Indian Knowledge Systems') on conflict do nothing;
