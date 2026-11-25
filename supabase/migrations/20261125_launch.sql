-- Apply after the existing schema; does not delete existing notes or accounts.
begin;
create table if not exists public.site_feedback (
 id uuid primary key default gen_random_uuid(), user_id uuid references auth.users(id) on delete set null,
 rating int not null check(rating between 1 and 5), category text not null check(category in ('review','feature','bug','app')),
 message text not null check(char_length(btrim(message)) between 10 and 1000), platform text not null check(platform in ('website','pwa')),
 status text not null default 'new' check(status in ('new','reviewed','resolved')), created_at timestamptz not null default now());
alter table public.site_feedback enable row level security;
revoke all on public.site_feedback from anon,authenticated;
grant select,update(status) on public.site_feedback to authenticated;
drop policy if exists nh_feedback_admin_read on public.site_feedback;
create policy nh_feedback_admin_read on public.site_feedback for select to authenticated using(public.is_admin());
drop policy if exists nh_feedback_admin_update on public.site_feedback;
create policy nh_feedback_admin_update on public.site_feedback for update to authenticated using(public.is_admin()) with check(public.is_admin());
create index if not exists nh_feedback_user_time on public.site_feedback(user_id,created_at desc);
create or replace function public.submit_site_feedback(p_rating int,p_category text,p_message text,p_platform text) returns void language plpgsql security definer set search_path='' as $$
declare uid uuid:=auth.uid(); begin
 if uid is null then raise exception 'Sign in first'; end if;
 perform pg_catalog.pg_advisory_xact_lock(pg_catalog.hashtextextended(uid::text||'feedback',0));
 if (select count(*) from public.site_feedback where user_id=uid and created_at>now()-interval '24 hours')>=3 then raise exception 'Daily feedback limit reached'; end if;
 insert into public.site_feedback(user_id,rating,category,message,platform) values(uid,p_rating,p_category,btrim(p_message),p_platform);
end; $$;
revoke all on function public.submit_site_feedback(int,text,text,text) from public,anon;
grant execute on function public.submit_site_feedback(int,text,text,text) to authenticated;
create table if not exists public.nh_download_events(note_id uuid not null references public.notes(id) on delete cascade,user_id uuid not null references auth.users(id) on delete cascade,download_day date not null default current_date,primary key(note_id,user_id,download_day));
alter table public.nh_download_events enable row level security;
revoke all on public.nh_download_events from anon,authenticated;
create index if not exists nh_download_day_idx on public.nh_download_events(download_day);
create or replace function public.increment_note_download(target_id uuid) returns void language plpgsql security definer set search_path='' as $$
begin
 if auth.uid() is null then return; end if;
 if not exists(select 1 from public.notes where id=target_id and status='approved') then return; end if;
 insert into public.nh_download_events(note_id,user_id) values(target_id,auth.uid()) on conflict do nothing;
 if found then perform set_config('app.noteshub_download','1',true);update public.notes set downloads=downloads+1 where id=target_id and status='approved';perform set_config('app.noteshub_download','0',true);end if;
end; $$;
revoke all on function public.increment_note_download(uuid) from public,anon;
grant execute on function public.increment_note_download(uuid) to authenticated;
create or replace function public.nh_trending() returns table(note_id uuid,download_count bigint) language sql stable security definer set search_path='' as $$
 select e.note_id,count(*) from public.nh_download_events e join public.notes n on n.id=e.note_id where n.status='approved' and e.download_day>=current_date-6 group by e.note_id order by count(*) desc,e.note_id limit 10;
$$;
revoke all on function public.nh_trending() from public;
grant execute on function public.nh_trending() to anon,authenticated;
create or replace function public.nh_admin_stats() returns jsonb language plpgsql stable security definer set search_path='' as $$ begin
 if not public.is_admin() then raise exception 'Admin access required';end if;
 return jsonb_build_object('approved_notes',(select count(*) from public.notes where status='approved'),'users',(select count(*) from auth.users),'downloads_7d',(select count(*) from public.nh_download_events where download_day>=current_date-6),'avg_rating',(select round(avg(rating),1) from public.site_feedback));end; $$;
revoke all on function public.nh_admin_stats() from public,anon;
grant execute on function public.nh_admin_stats() to authenticated;
-- The UI reads only the signed-in user's full profile; author names are on notes/comments.
drop policy if exists "Profiles visible" on public.profiles;
drop policy if exists nh_profile_self_admin on public.profiles;
create policy nh_profile_self_admin on public.profiles for select to authenticated using(id=auth.uid() or public.is_admin());
revoke select on public.profiles from anon;
commit;
