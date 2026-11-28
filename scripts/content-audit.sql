-- Read-only production inventory. Never deletes files or rows.
begin read only;
select status,count(*) from public.notes group by status;
select subject,count(*) from public.notes group by subject order by count(*) desc;
select id,title,subject,status,char_length(trim(coalesce(description,''))) as description_length
from public.notes where char_length(trim(coalesce(description,'')))<40
or lower(trim(subject)) in ('nddsnd','bulk','iks','cybersecurity fundamental','data structures & algorithms');
select lower(trim(title)) as normalized_title,count(*) from public.notes
group by lower(trim(title)) having count(*)>1;
select o.name,o.created_at from storage.objects o
where o.bucket_id='note-pdfs' and o.created_at<now()-interval '7 days'
and not exists(select 1 from public.notes n where n.file_path=o.name);
rollback;
