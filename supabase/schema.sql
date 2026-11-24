-- NotesHub schema, version 1.0. Run once in a NEW Supabase project via SQL Editor.
-- WARNING: Never put the service_role key in browser code.
create extension if not exists pgcrypto;

create table if not exists public.profiles (
 id uuid primary key references auth.users(id) on delete cascade,
 display_name text not null default 'Student' check(char_length(display_name) between 1 and 70),
 college text default '' check(char_length(college) <= 100),
 course text default 'B.Sc. IT' check(char_length(course) <= 60),
 semester text default 'Semester 3' check(char_length(semester) <= 40),
 bio text default '' check(char_length(bio) <= 300),
 created_at timestamptz not null default now()
);
create table if not exists public.admin_users (
 user_id uuid primary key references auth.users(id) on delete cascade,
 created_at timestamptz not null default now()
);

create or replace function public.is_admin() returns boolean
 language sql stable security definer set search_path = '' as $$
 select exists(select 1 from public.admin_users where user_id = (select auth.uid()));
 $$;
revoke all on function public.is_admin() from public;
grant execute on function public.is_admin() to authenticated, anon;

create or replace function public.handle_new_user() returns trigger
 language plpgsql security definer set search_path = '' as $$
 begin
  insert into public.profiles (id,display_name)
  values(new.id, left(coalesce(nullif(new.raw_user_meta_data->>'full_name',''),split_part(new.email,'@',1),'Student'),70))
  on conflict (id) do nothing;
  return new;
 end; $$;
drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created after insert on auth.users for each row execute procedure public.handle_new_user();

create table if not exists public.notes (
 id uuid primary key default gen_random_uuid(),
 owner_id uuid not null references auth.users(id) on delete cascade,
 owner_name text not null default 'Student' check(char_length(owner_name) <= 100),
 title text not null check(char_length(btrim(title)) between 5 and 120),
 description text not null check(char_length(btrim(description)) between 10 and 700),
 subject text not null check(char_length(btrim(subject)) between 2 and 80),
 course text not null default 'B.Sc. IT' check(char_length(course) <= 60),
 semester text not null default 'Semester 3' check(char_length(semester) <= 40),
 college text not null default '' check(char_length(college) <= 100),
 tags text[] not null default '{}' check(cardinality(tags) <= 8),
 color text not null default 'lavender' check(color in ('lavender','peach','mint','yellow','blue','pink')),
 file_path text not null unique,
 file_size integer not null check(file_size between 1 and 8388608),
 status text not null default 'pending' check(status in ('pending','approved','rejected')),
 downloads integer not null default 0 check(downloads >= 0),
 created_at timestamptz not null default now(),
 updated_at timestamptz not null default now()
);
create index if not exists notes_status_created_idx on public.notes(status,created_at desc);
create index if not exists notes_owner_idx on public.notes(owner_id);
create index if not exists notes_subject_idx on public.notes(subject);

create or replace function public.protect_note_updates() returns trigger
 language plpgsql set search_path = '' as $$
 begin
  if current_setting('app.noteshub_download', true) = '1' then
   new.updated_at := old.updated_at;
   return new;
  end if;
  if not public.is_admin() then
   if new.owner_id is distinct from old.owner_id or new.file_path is distinct from old.file_path or new.file_size is distinct from old.file_size or new.downloads is distinct from old.downloads or new.created_at is distinct from old.created_at then
    raise exception 'Protected note fields cannot be changed';
   end if;
   new.status := 'pending';
  end if;
  new.updated_at := now();
  return new;
 end; $$;
drop trigger if exists protect_note_updates_trigger on public.notes;
create trigger protect_note_updates_trigger before update on public.notes for each row execute function public.protect_note_updates();

create table if not exists public.bookmarks (
 user_id uuid not null references auth.users(id) on delete cascade,
 note_id uuid not null references public.notes(id) on delete cascade,
 created_at timestamptz not null default now(),
 primary key(user_id,note_id)
);
create table if not exists public.ratings (
 user_id uuid not null references auth.users(id) on delete cascade,
 note_id uuid not null references public.notes(id) on delete cascade,
 value integer not null check(value between 1 and 5),
 created_at timestamptz not null default now(),
 primary key(user_id,note_id)
);
create table if not exists public.reports (
 id uuid primary key default gen_random_uuid(),
 note_id uuid not null references public.notes(id) on delete cascade,
 reporter_id uuid not null references auth.users(id) on delete cascade,
 reason text not null check(char_length(btrim(reason)) between 10 and 1000),
 resolved boolean not null default false,
 created_at timestamptz not null default now()
);
create table if not exists public.comments (
 id uuid primary key default gen_random_uuid(),
 note_id uuid not null references public.notes(id) on delete cascade,
 user_id uuid not null references auth.users(id) on delete cascade,
 author_name text not null check(char_length(author_name) between 1 and 100),
 body text not null check(char_length(btrim(body)) between 2 and 900),
 created_at timestamptz not null default now()
);
create table if not exists public.collections (
 id uuid primary key default gen_random_uuid(),
 user_id uuid not null references auth.users(id) on delete cascade,
 name text not null check(char_length(btrim(name)) between 2 and 60),
 created_at timestamptz not null default now()
);
create table if not exists public.collection_items (
 collection_id uuid not null references public.collections(id) on delete cascade,
 note_id uuid not null references public.notes(id) on delete cascade,
 created_at timestamptz not null default now(),
 primary key(collection_id,note_id)
);
create table if not exists public.note_requests (
 id uuid primary key default gen_random_uuid(),
 user_id uuid not null references auth.users(id) on delete cascade,
 author_name text not null check(char_length(author_name) between 1 and 100),
 subject text not null check(char_length(btrim(subject)) between 3 and 100),
 details text not null check(char_length(btrim(details)) between 10 and 700),
 created_at timestamptz not null default now()
);
create table if not exists public.moderation_logs (
 id uuid primary key default gen_random_uuid(),
 note_id uuid references public.notes(id) on delete set null,
 moderator_id uuid references auth.users(id) on delete set null,
 previous_status text,
 new_status text,
 created_at timestamptz not null default now()
);
create or replace function public.log_note_moderation() returns trigger
 language plpgsql security definer set search_path = '' as $$
 begin
  if old.status is distinct from new.status and public.is_admin() then
   insert into public.moderation_logs(note_id,moderator_id,previous_status,new_status)
   values(new.id,(select auth.uid()),old.status,new.status);
  end if;
  return new;
 end; $$;
drop trigger if exists on_note_moderation on public.notes;
create trigger on_note_moderation after update on public.notes for each row execute procedure public.log_note_moderation();

alter table public.profiles enable row level security;
alter table public.admin_users enable row level security;
alter table public.notes enable row level security;
alter table public.bookmarks enable row level security;
alter table public.ratings enable row level security;
alter table public.reports enable row level security;
alter table public.comments enable row level security;
alter table public.collections enable row level security;
alter table public.collection_items enable row level security;
alter table public.note_requests enable row level security;
alter table public.moderation_logs enable row level security;

create policy "Profiles visible" on public.profiles for select to anon,authenticated using(true);
create policy "Users edit own profile" on public.profiles for update to authenticated using(id=auth.uid()) with check(id=auth.uid());
create policy "Read own admin membership" on public.admin_users for select to authenticated using(user_id=auth.uid());
create policy "Read approved, own or mod notes" on public.notes for select to anon,authenticated using(status='approved' or owner_id=auth.uid() or public.is_admin());
create policy "Upload own pending notes" on public.notes for insert to authenticated with check(owner_id=auth.uid() and status='pending' and downloads=0 and split_part(file_path,'/',1)=auth.uid()::text);
create policy "Edit own or mod notes" on public.notes for update to authenticated using(owner_id=auth.uid() or public.is_admin()) with check(owner_id=auth.uid() or public.is_admin());
create policy "Delete own or mod notes" on public.notes for delete to authenticated using(owner_id=auth.uid() or public.is_admin());
create policy "Read own bookmarks" on public.bookmarks for select to authenticated using(user_id=auth.uid());
create policy "Save public or own notes" on public.bookmarks for insert to authenticated with check(user_id=auth.uid() and exists(select 1 from public.notes n where n.id=note_id and (n.status='approved' or n.owner_id=auth.uid())));
create policy "Remove own bookmarks" on public.bookmarks for delete to authenticated using(user_id=auth.uid());
create policy "Read public ratings" on public.ratings for select to anon,authenticated using(exists(select 1 from public.notes n where n.id=note_id and n.status='approved'));
create policy "Add own rating" on public.ratings for insert to authenticated with check(user_id=auth.uid() and exists(select 1 from public.notes n where n.id=note_id and n.status='approved'));
create policy "Edit own rating" on public.ratings for update to authenticated using(user_id=auth.uid()) with check(user_id=auth.uid());
create policy "Remove own rating" on public.ratings for delete to authenticated using(user_id=auth.uid());
create policy "Read own reports or mod" on public.reports for select to authenticated using(reporter_id=auth.uid() or public.is_admin());
create policy "Report approved notes" on public.reports for insert to authenticated with check(reporter_id=auth.uid() and resolved=false and exists(select 1 from public.notes n where n.id=note_id and n.status='approved'));
create policy "Mods resolve reports" on public.reports for update to authenticated using(public.is_admin()) with check(public.is_admin());
create policy "Read comments on approved notes" on public.comments for select to anon,authenticated using(exists(select 1 from public.notes n where n.id=note_id and n.status='approved'));
create policy "Comment on approved notes" on public.comments for insert to authenticated with check(user_id=auth.uid() and exists(select 1 from public.notes n where n.id=note_id and n.status='approved'));
create policy "Delete own or moderator comments" on public.comments for delete to authenticated using(user_id=auth.uid() or public.is_admin());
create policy "Read own collections" on public.collections for select to authenticated using(user_id=auth.uid());
create policy "Create own collections" on public.collections for insert to authenticated with check(user_id=auth.uid());
create policy "Edit own collections" on public.collections for update to authenticated using(user_id=auth.uid()) with check(user_id=auth.uid());
create policy "Delete own collections" on public.collections for delete to authenticated using(user_id=auth.uid());
create policy "Read own collection items" on public.collection_items for select to authenticated using(exists(select 1 from public.collections c where c.id=collection_id and c.user_id=auth.uid()));
create policy "Add own collection items" on public.collection_items for insert to authenticated with check(exists(select 1 from public.collections c where c.id=collection_id and c.user_id=auth.uid()) and exists(select 1 from public.notes n where n.id=note_id and n.status='approved'));
create policy "Delete own collection items" on public.collection_items for delete to authenticated using(exists(select 1 from public.collections c where c.id=collection_id and c.user_id=auth.uid()));
create policy "Read community requests" on public.note_requests for select to anon,authenticated using(true);
create policy "Create own note requests" on public.note_requests for insert to authenticated with check(user_id=auth.uid());
create policy "Delete own requests" on public.note_requests for delete to authenticated using(user_id=auth.uid() or public.is_admin());
create policy "Admin reads moderation logs" on public.moderation_logs for select to authenticated using(public.is_admin());

-- Create a private bucket restricted by MIME and file size. Run with SQL Editor owner privileges.
insert into storage.buckets(id,name,public,file_size_limit,allowed_mime_types)
values('note-pdfs','note-pdfs',false,8388608,array['application/pdf'])
on conflict(id) do update set public=false,file_size_limit=8388608,allowed_mime_types=array['application/pdf'];

-- Security definer helper checks whether a signed URL may be created for a file.
create or replace function public.can_read_note_file(p_path text) returns boolean
 language sql stable security definer set search_path = '' as $$
 select exists(select 1 from public.notes n where n.file_path=p_path and (n.status='approved' or n.owner_id=(select auth.uid()) or public.is_admin()));
 $$;
revoke all on function public.can_read_note_file(text) from public;
grant execute on function public.can_read_note_file(text) to anon,authenticated;
create policy "Allow own PDF uploads" on storage.objects for insert to authenticated with check(bucket_id='note-pdfs' and split_part(name,'/',1)=auth.uid()::text and lower(storage.extension(name))='pdf');
create policy "Allow authorized PDF reads" on storage.objects for select to anon,authenticated using(bucket_id='note-pdfs' and (public.can_read_note_file(name) or split_part(name,'/',1)=auth.uid()::text));
create policy "Allow own or admin PDF deletes" on storage.objects for delete to authenticated using(bucket_id='note-pdfs' and (split_part(name,'/',1)=auth.uid()::text or public.is_admin()));

-- Download count RPC. Called only when user explicitly clicks Download.
create or replace function public.increment_note_download(target_id uuid) returns void
 language plpgsql security definer set search_path = '' as $$
 begin
  perform set_config('app.noteshub_download','1',true);
  update public.notes set downloads = downloads + 1 where id = target_id and status='approved';
 end; $$;
revoke all on function public.increment_note_download(uuid) from public;
grant execute on function public.increment_note_download(uuid) to anon,authenticated;

-- IMPORTANT: The downloads RPC can be spammed; production sites should rate-limit it
-- at the edge or remove public counters if abuse becomes a concern.

-- AFTER YOU CREATE YOUR FIRST USER, add admin access manually in Supabase SQL Editor:
-- select id,email from auth.users order by created_at desc;
-- insert into public.admin_users(user_id) values('PASTE-YOUR-USER-UUID-HERE');

-- Explicit table grants; RLS policies above still control every row.
grant select on public.profiles,public.notes,public.ratings,public.comments,public.note_requests to anon,authenticated;
grant select on public.admin_users,public.bookmarks,public.reports,public.collections,public.collection_items,public.moderation_logs to authenticated;
grant insert,update,delete on public.profiles,public.notes,public.bookmarks,public.ratings,public.reports,public.comments,public.collections,public.collection_items,public.note_requests to authenticated;
