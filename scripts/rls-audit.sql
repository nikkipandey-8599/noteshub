-- Run in SQL editor; checks structural RLS coverage, not behavioral authorization.
begin read only;
select n.nspname,c.relname,c.relrowsecurity
from pg_class c join pg_namespace n on n.oid=c.relnamespace
where n.nspname='public' and c.relkind in ('r','p') order by c.relname;
select schemaname,tablename,policyname,roles,cmd,qual,with_check
from pg_policies where schemaname in ('public','storage') order by schemaname,tablename,policyname;
select p.proname,pg_get_function_identity_arguments(p.oid) as args,
has_function_privilege('anon',p.oid,'EXECUTE') as anon_exec,
has_function_privilege('authenticated',p.oid,'EXECUTE') as authenticated_exec
from pg_proc p join pg_namespace n on n.oid=p.pronamespace
where n.nspname='public' and p.prosecdef order by p.proname;
rollback;
