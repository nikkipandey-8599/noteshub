begin;
create table if not exists public.nh_public_identities (
 user_id uuid primary key references auth.users(id) on delete cascade,
 public_name text not null check(char_length(btrim(public_name)) between 1 and 50 and position('@' in public_name)=0)
);
alter table public.nh_public_identities enable row level security;
revoke all on public.nh_public_identities from public, anon;
grant select,insert,update,delete on public.nh_public_identities to authenticated;
drop policy if exists nh_identity_own on public.nh_public_identities;
create policy nh_identity_own on public.nh_public_identities for all to authenticated using (user_id=(select auth.uid())) with check (user_id=(select auth.uid()));
create or replace function public.nh_community_directory()
returns table(contributor_id uuid,public_name text,note_count bigint,download_count bigint,subjects text[])
language sql stable security definer set search_path='' as $$
 select n.owner_id,p.public_name,count(*),coalesce(sum(n.downloads),0),array_agg(distinct n.subject order by n.subject)
 from public.notes n left join public.nh_public_identities p on p.user_id=n.owner_id
 where n.status='approved' group by n.owner_id,p.public_name
 order by count(*) desc,n.owner_id;
$$;
revoke all on function public.nh_community_directory() from public;
grant execute on function public.nh_community_directory() to anon,authenticated;
commit;
