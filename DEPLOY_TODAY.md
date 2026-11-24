# NotesHub — deploy today

## Route A: fastest visual launch (about a preview, no live account yet)
- Unzip `NotesHub_DirectUpload.zip`, or open `ready-upload/` in the full project.
- In Cloudflare Pages choose **Direct Upload** and upload the **contents** of the prepared folder.
- You can immediately browse and download original starter PDFs and install the web app.
- Public uploads, sign-in, comments, moderation, and collections need the live Supabase database setup below.
- This pre-transpiled option depends on esm.sh at runtime. Use Route B for the long-term site.

## Route B: actual notes-sharing website (recommended)
- Import the full project into GitHub.
- Create Supabase and run `supabase/schema.sql` using the SQL Editor.
- Connect GitHub to Cloudflare Pages and set `npm run build`, output `dist`.
- Set the three `VITE_...` build variables in Cloudflare as shown in README.
- Create your first user, add that UUID to `public.admin_users` in Supabase SQL Editor.
- Test a second user uploading a PDF and confirm no one else can see it until the admin approves it.
- Replace the placeholder policy contact information and do a security/content-moderation review.
- Set up Google Search Console and submit `/sitemap.xml` from the final production domain.

## Important distinctions
- This is a working starter with original styling inspired by pastel notes, NOT a clone of Peeky Notes' branded assets.
- PWA install works from a compatible HTTPS browser; a downloadable APK must be packaged and signed separately after deployment.
- A unique name, sitemap and good metadata do NOT guarantee instant Google indexing or a specific search ranking.
