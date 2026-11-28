create or replace function public.nh_rating_summary() returns table(note_id uuid,rating_count bigint,rating_average numeric) language sql stable security definer set search_path='' as $$ select r.note_id,count(*),avg(r.value) from public.ratings r join public.notes n on n.id=r.note_id where n.status='approved' group by r.note_id $$;
revoke all on function public.nh_rating_summary() from public;
grant execute on function public.nh_rating_summary() to anon,authenticated;
revoke truncate,references,trigger on public.comments,public.note_requests,public.ratings from anon,authenticated;
