# Supabase setup and security

1. Create a new Supabase project and open **SQL Editor**.
2. Run `schema.sql` one time. It creates `note-pdfs` as a **private** bucket, tables, RLS policies, and auth triggers.
3. In **Authentication > URL Configuration**, set your website URL and add `https://your-domain.example/**` under allowed redirect URLs (for development include `http://localhost:5173/**`).
4. Email sign-up is enabled by default on most projects; review email confirmation and SMTP limitations. Enable Google under **Authentication > Providers** only after configuring Google OAuth credentials.
5. Register an account on your website. In SQL Editor execute:
   ```sql
   select id, email from auth.users order by created_at desc;
   insert into public.admin_users(user_id) values ('YOUR-ACCOUNT-UUID');
   ```
6. Sign out and back in. `/admin` now allows approval and rejection.
7. Perform a full test: upload a small PDF, verify it is **not visible publicly**, approve it, open in a signed URL, bookmark, comment and report it.

## Security notes

- Never use a Supabase `service_role` or secret key in client env vars.
- Client keys are **publishable**; database Row Level Security (RLS) handles authorization.
- Owner edits reset the note to `pending` via a trigger. Owners cannot self-approve.
- File reads go through storage RLS with signed, short-lived URLs.
- This starter implements per-file MIME and size limits, but **does not scan PDFs for malware**. Add an upload scanner or stricter processing before scaling to open public uploads.
- Some social actions lack rate limits. Add CAPTCHA, anti-spam throttling and abuse monitoring before public promotion.
- Ratings' aggregated values are calculated client-side from public rating rows. For high traffic, aggregate server-side.
- Moderators can reject files but do not automatically delete them; owners can delete their own uploads.
- Database logs do not substitute for security monitoring or backups.
