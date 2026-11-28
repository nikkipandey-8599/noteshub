revoke select on public.comments, public.note_requests from public,anon,authenticated;
grant select(id,note_id,author_name,body,created_at) on public.comments to anon,authenticated;
grant select(id,subject,details,author_name,created_at) on public.note_requests to anon,authenticated;
drop policy if exists "Read public ratings" on public.ratings;
drop policy if exists "Read own rating" on public.ratings;
create policy "Read own rating" on public.ratings for select to authenticated using ((select auth.uid())=user_id);
revoke select on public.ratings from public,anon;
create or replace function nh_private.allow_pdf_upload(path text) returns boolean language plpgsql volatile security definer set search_path='' as $$
declare uid uuid; total bigint;
begin
 uid:=auth.uid();
 if uid is null or split_part(path,'/',1)<>uid::text then return false; end if;
 if public.is_admin() then return true; end if;
 perform pg_catalog.pg_advisory_xact_lock(pg_catalog.hashtextextended(uid::text||':storage',0));
 select count(*) into total from storage.objects where bucket_id='note-pdfs' and split_part(name,'/',1)=uid::text;
 return total<40;
end $$;
revoke all on function nh_private.allow_pdf_upload(text) from public,anon;
grant usage on schema nh_private to authenticated;
grant execute on function nh_private.allow_pdf_upload(text) to authenticated;
drop policy if exists nh_pdf_upload_quota on storage.objects;
create policy nh_pdf_upload_quota on storage.objects as restrictive for insert to authenticated with check (bucket_id<>'note-pdfs' or nh_private.allow_pdf_upload(name));
