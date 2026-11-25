begin;
alter table public.site_feedback add column if not exists publish_consent boolean not null default false;
alter table public.site_feedback add column if not exists published boolean not null default false;
alter table public.site_feedback drop constraint if exists nh_review_public_guard;
alter table public.site_feedback add constraint nh_review_public_guard check (not published or (publish_consent and category in ('review','app')));
grant update(published), delete on public.site_feedback to authenticated;
drop policy if exists nh_feedback_admin_delete on public.site_feedback;
create policy nh_feedback_admin_delete on public.site_feedback for delete to authenticated using(public.is_admin());
-- Old feedback remains private. Existing four-argument RPC still works for older clients.
create or replace function public.nh_submit_feedback(p_rating int,p_category text,p_message text,p_platform text,p_publish boolean) returns void language plpgsql security definer set search_path='' as $$
declare uid uuid:=auth.uid(); begin
 if uid is null then raise exception 'Sign in first'; end if;
 perform pg_catalog.pg_advisory_xact_lock(pg_catalog.hashtextextended(uid::text||'feedback',0));
 if (select count(*) from public.site_feedback where user_id=uid and created_at>now()-interval '24 hours')>=3 then raise exception 'Daily feedback limit reached'; end if;
 insert into public.site_feedback(user_id,rating,category,message,platform,publish_consent) values(uid,p_rating,p_category,btrim(p_message),p_platform,coalesce(p_publish,false) and p_category in ('review','app'));
end; $$;
revoke all on function public.nh_submit_feedback(int,text,text,text,boolean) from public,anon;
grant execute on function public.nh_submit_feedback(int,text,text,text,boolean) to authenticated;
-- Deliberately expose only opted-in, approved reviews, never account identifiers or private feedback.
create or replace function public.nh_public_reviews(p_offset int default 0,p_sort text default 'newest') returns table(id uuid,rating int,message text,platform text,created_at timestamptz) language sql stable security definer set search_path='' as $$
 select f.id,f.rating,f.message,f.platform,f.created_at from public.site_feedback f where f.published and f.publish_consent and f.category in ('review','app') order by case when p_sort='highest' then f.rating end desc nulls last,f.created_at desc,f.id limit 20 offset greatest(coalesce(p_offset,0),0);
$$;
revoke all on function public.nh_public_reviews(int,text) from public;
grant execute on function public.nh_public_reviews(int,text) to anon,authenticated;
create or replace function public.nh_public_review_stats() returns jsonb language sql stable security definer set search_path='' as $$
 select jsonb_build_object('count',count(*),'average',round(avg(rating),1),'distribution',jsonb_build_array(count(*) filter(where rating=1),count(*) filter(where rating=2),count(*) filter(where rating=3),count(*) filter(where rating=4),count(*) filter(where rating=5))) from public.site_feedback where published and publish_consent and category in ('review','app');
$$;
revoke all on function public.nh_public_review_stats() from public;
grant execute on function public.nh_public_review_stats() to anon,authenticated;
commit;
