-- Apply once after previous migrations. No existing notes are deleted.
-- Serialize uploads per contributor to prevent concurrent note spam.
create or replace function public.nh_guard_note_insert() returns trigger
language plpgsql security definer set search_path='' as $$
begin
 if auth.uid() is null or new.owner_id is distinct from auth.uid() then
   raise exception 'Authenticated owner required';
 end if;
 perform pg_advisory_xact_lock(hashtextextended(new.owner_id::text,0));
 if not public.is_admin() and (select count(*) from public.notes where owner_id=new.owner_id and created_at>now()-interval '1 hour') >= 10 then
   raise exception 'Upload limit: 10 notes per hour. Try again later.';
 end if;
 new.created_at:=now(); new.updated_at:=now(); new.owner_name:='NotesHub contributor';
 return new;
end; $$;
drop trigger if exists nh_guard_note_insert on public.notes;
create trigger nh_guard_note_insert before insert on public.notes for each row execute function public.nh_guard_note_insert();
