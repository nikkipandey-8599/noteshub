create schema if not exists nh_private;
revoke all on schema nh_private from public;
create or replace function nh_private.guard_interaction() returns trigger language plpgsql security definer set search_path = '' as $$
declare uid uuid; n integer; cap integer;
begin
 uid := auth.uid();
 if uid is null then return new; end if;
 perform pg_catalog.pg_advisory_xact_lock(pg_catalog.hashtextextended(uid::text || TG_TABLE_NAME,0));
 if TG_TABLE_NAME='comments' then
   new.author_name := 'Learner'; new.created_at := now();
   select count(*) into n from public.comments where user_id=uid and created_at>now()-interval '1 hour'; cap:=20;
 elsif TG_TABLE_NAME='note_requests' then
   new.author_name := 'Learner'; new.created_at := now();
   select count(*) into n from public.note_requests where user_id=uid and created_at>now()-interval '1 hour'; cap:=5;
 elsif TG_TABLE_NAME='reports' then
   new.created_at := now();
   select count(*) into n from public.reports where reporter_id=uid and created_at>now()-interval '1 hour'; cap:=10;
 elsif TG_TABLE_NAME='ratings' then
   if not exists(select 1 from public.notes where id=new.note_id and status='approved' and owner_id is distinct from uid) then raise exception 'You cannot rate this note'; end if;
   if TG_OP='UPDATE' then
     if new.note_id is distinct from old.note_id or new.user_id is distinct from old.user_id then raise exception 'Rating identity cannot change'; end if;
     new.created_at:=old.created_at; return new;
   end if;
   new.created_at:=now();
   select count(*) into n from public.ratings where user_id=uid and created_at>now()-interval '1 hour'; cap:=40;
 end if;
 if n>=cap then raise exception 'Hourly interaction limit reached'; end if;
 return new;
end $$;
revoke all on function nh_private.guard_interaction() from public,anon,authenticated;
drop trigger if exists nh_guard_comments on public.comments;
create trigger nh_guard_comments before insert on public.comments for each row execute function nh_private.guard_interaction();
drop trigger if exists nh_guard_requests on public.note_requests;
create trigger nh_guard_requests before insert on public.note_requests for each row execute function nh_private.guard_interaction();
drop trigger if exists nh_guard_reports on public.reports;
create trigger nh_guard_reports before insert on public.reports for each row execute function nh_private.guard_interaction();
drop trigger if exists nh_guard_ratings on public.ratings;
create trigger nh_guard_ratings before insert or update on public.ratings for each row execute function nh_private.guard_interaction();
update public.comments set author_name='Learner' where author_name is distinct from 'Learner';
update public.note_requests set author_name='Learner' where author_name is distinct from 'Learner';
create unique index if not exists nh_one_report_per_note on public.reports(note_id,reporter_id);
