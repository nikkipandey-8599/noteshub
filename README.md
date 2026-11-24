# ✳ NotesHub — College Notes & Study PDFs

A pastel, paper-inspired, responsive **React + Vite + Supabase** student notes-sharing site, with original branding, PDF previews, moderation, and an installable Progressive Web App (PWA).

> **Important:** This ZIP is a complete source project, **not** a pre-hosted community. To make public uploads work, you must create a Supabase project, apply the SQL, and deploy your frontend. Without Supabase values, the site opens in **preview mode** with six original, downloadable starter PDFs. A PWA is installable from the browser; it is not a pre-signed Android APK.

## What's included

- Responsive pastel sticky-note-inspired landing page, paper card grid, subject browsing, sidebar quick deck, FAQ, light/dark toggle and keyboard search (`Ctrl/Cmd + K`).
- Search, subject/course/semester filters, title sorting and original PDF starter guides (2 pages each).
- User registration, email login, optional Google login, password reset, basic profile and private dashboard.
- PDF upload (8 MB limit), metadata, tags, file validation, edit/delete, private storage and moderation queue.
- In-browser PDF preview, controlled downloads, bookmarks, collections, ratings, comments, reports, note requests and personal library exports.
- Admin review and rejection of notes, report queue, database audit logs and Row Level Security (RLS).
- PWA manifest, 192/512 icons, browser installation, offline fallback for the app shell.
- Search-friendly page titles, metadata, Open Graph image, structured data on landing page, crawler fallbacks for static subjects, robots.txt and sitemap.xml.
- Original study handbooks for Data Structures, DBMS, Computer Networks, Python, Web Development and Operating Systems.

**Not included as live production services:** payment integration, advertising, AI summaries/MCQs, antivirus scanning, advanced spam rate-limiting, full account-deletion self-service, dynamic SEO rendering for student-uploaded note URLs, or a signed Android APK. Configure these before launching at large scale.

## Quick start in VS Code

1. Install **Node.js 20.19+ or 22.12+**. Open this folder in VS Code.
2. Open terminal in this folder and run:
   ```bash
   npm install
   npm run dev
   ```
3. Open `http://localhost:5173`. It works immediately in **preview mode** with original downloadable starter notes; real accounts are disabled until Supabase is configured.

## Make uploads + accounts work (required for live sharing)

1. Create a free account and a new project at [Supabase](https://supabase.com/).
2. Wait for the project database to become ready. In **SQL Editor**, create a query and paste **the entire `supabase/schema.sql`**. Run it once in a **new** project.
3. In Supabase, open **Project Settings → Data API** for the project URL and **API Keys** for the publishable/anon key (the labels may change). Do **not** use a secret/service-role key.
4. Copy `.env.example` to `.env.local` and replace the placeholders:
   ```env
   VITE_SUPABASE_URL=https://YOUR_PROJECT.supabase.co
   VITE_SUPABASE_ANON_KEY=YOUR_PUBLISHABLE_OR_ANON_KEY
   VITE_SITE_URL=https://your-domain.example
   ```
   For local preview, the last line can be left blank until you deploy.
5. Restart `npm run dev`. In **Authentication → URL Configuration** in Supabase, set site URL `http://localhost:5173` and allow redirect URLs for local and deployed domains. Configure email confirmation to fit your use case.
6. Email registration works with Supabase Auth. **Google login requires extra Google OAuth setup** in Supabase Authentication → Providers.
7. **Create your own account first.** In Supabase SQL Editor, run:
   ```sql
   select id, email from auth.users order by created_at desc;
   insert into public.admin_users (user_id) values ('COPY-YOUR-USER-UUID');
   ```
   Sign out, sign back in, then open `/admin`. Test upload → review → approve → public preview/download.

## Deploy today using GitHub + Cloudflare Pages

1. Create an empty repository in your GitHub account called `noteshub` (or another name).
2. From the VS Code terminal:
   ```bash
   git init
   git add .
   git commit -m "Launch NotesHub"
   git branch -M main
   git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPOSITORY.git
   git push -u origin main
   ```
   You may have to authenticate with GitHub. **Never commit `.env.local`** — it's ignored by Git.
3. Open [Cloudflare Dashboard](https://dash.cloudflare.com/) → **Workers & Pages** → **Create** → **Pages** → **Connect to Git** → select the repo. For a React Vite site choose:
   - **Build command:** `npm run build`
   - **Build output directory:** `dist`
   - **Root directory:** `/` (repository root)
   - **Node.js:** current supported Node 20+ (or Node 22)
4. Set Cloudflare build environment variables **before the production build**:
   ```text
   VITE_SUPABASE_URL      https://YOUR_PROJECT.supabase.co
   VITE_SUPABASE_ANON_KEY YOUR_PUBLISHABLE_KEY
   VITE_SITE_URL          https://YOUR-SITE.pages.dev
   ```
   Add these in **Settings → Variables and Secrets / Environment Variables** (UI label varies). Variables prefixed `VITE_` are **public**, so never put private keys there.
5. Deploy. In Supabase add the new HTTPS site as an allowed redirect URL. After connecting a custom domain, change `VITE_SITE_URL` to your custom domain and redeploy.
6. Update `/policies` with your real contact email and review the terms/privacy policy. Test public upload protection and admin moderation before sharing the site widely.
7. Optionally submit your real `/sitemap.xml` using Google Search Console. **No naming or metadata trick can guarantee fast indexing or rankings.** Good original course pages, incoming links, useful content and technical crawlability matter.

**Recommended:** deploy a preview first, connect Supabase, then make the site public. The site has genuine publishing/moderation infrastructure, but it is a starter product that needs real testing against your Supabase account.

## PWA and Android APK

- Open your deployed HTTPS site in Android Chrome → browser menu → **Install app** / **Add to Home screen**. On iPhone Safari use Share → Add to Home Screen. The included manifest and 192/512px icons support install prompts.
- Browser installation can create an app-like home-screen experience and, on some Android devices, browser-managed WebAPK integration. It **does not provide your visitors a separate downloadable APK file** on your website.
- To offer a downloadable signed APK, first deploy the site on a stable HTTPS domain, then use [PWABuilder](https://www.pwabuilder.com/) or [Bubblewrap](https://github.com/GoogleChromeLabs/bubblewrap) for a Trusted Web Activity. Signing, Digital Asset Links and Android testing are required. Never ship a private keystore in the ZIP/repository.
- PWA offline mode caches the app shell and some static assets; it does **not** offline-cache other users' private PDFs or promise offline access to the live database.

## SEO and brand setup

- **NotesHub** is a working product name. Perform separate trademark and domain availability checks before buying a domain. Search results do not prove trademark availability.
- The `scripts/seo-pages.mjs` script generates **12 static crawlable subject/general page HTML shells**, plus sitemap/robots. Server-rendered user-uploaded notes are **not** included; add that later if note-page search indexing becomes a primary growth channel.
- Set `VITE_SITE_URL` **during build** for correct canonical URLs. On Cloudflare this is an environment variable; otherwise the script falls back to the `CF_PAGES_URL` automatic build variable.
- After changing your domain, redeploy. Update the policy contact address and ensure the Google Search Console property matches.
- Do not make exaggerated SEO promises or manufacture fake reviews, installs, student uploads, or engagement counts.

## Storage + security

- Uploaded PDFs live in a **private** Supabase Storage bucket (`note-pdfs`) and are accessed through short-lived signed URLs.
- PDF filename, MIME, signature and size are checked in the browser; bucket-level MIME/size limits and RLS provide additional enforcement.
- Supabase database Row Level Security controls content visibility, editing and moderation permissions. Owners can edit notes but their changes force re-review.
- There is **no PDF malware scanning or upload CAPTCHA** in this starter. Before scaling to unrestricted public uploads, add file sanitization, malware scanning, abuse limits and account deletion tools.
- Preview mode bookmarks are stored locally in this browser. In live mode, bookmarks for community notes use Supabase, while bundled starter guides are stored locally.
- Use free-tier quotas wisely: PDFs cost storage and download bandwidth. Keep file limits low and review Supabase usage regularly.

## Roadmap coverage

| Phase | Implementation |
|---|---|
| 1 — Setup & UI | ✅ Source code, original design, full responsive interface |
| 2 — Authentication | ✅ Supabase email auth & Google OAuth hook (requires provider setup) |
| 3 — Uploads | ✅ PDF submission, ownership, edit/delete, private bucket |
| 4 — Discovery | ✅ Search, filters, subject pages, reader and downloads |
| 5 — Community | ✅ Bookmarks, collections, ratings, comments, requests, reports |
| 6 — Admin & safety | ✅ Admin approval/rejection, RLS, audit logs (requires real testing) |
| 7 — Public launch | ✅ SEO starter pages, PWA, icons, Cloudflare configuration; owner must deploy and test |
| 8 — Growth | ◐ Basic requests/collections included; AI, monetization and advanced anti-abuse are not implemented |

## Branding

- Brand assets: `public/icons/icon-192.png`, `public/icons/icon-512.png`, `public/icons/logo-transparent.png`, `public/og-cover.png`.
- Core styles: `src/styles/main.css` with custom light/dark colors.
- Key UI inspirations: pastel note paper, a compact right-edge 'quick deck', friendly editorial landing page. This is **original NotesHub branding**, not PeekyNotes' logo, text, or source code.

## Developer commands

```bash
npm install       # install dependencies
npm run dev       # start local app
npm run build     # create production build + subject SEO shells
npm run preview   # preview production build
npm run check     # verify key build files
```

### Known deployment/testing notes

- Requires a working network to install npm dependencies. If a restricted development environment cannot contact the npm registry, use your own machine or Cloudflare's Git build environment.
- Check the browser console and Supabase logs if any RLS permissions fail; policies cannot be verified without a live Supabase instance.
- A complete user-generated-content platform also needs active moderation, an updated legal policy, security monitoring and backup procedures.

---

NotesHub v1.0 · Original sample notes and art · Built for learning.

## Optional: upload immediately without npm (preview/direct-upload variant)

The project also includes `ready-upload/`, a pre-transpiled web version for **Cloudflare Pages Direct Upload**.

1. Open `ready-upload/config.js`. Keep the two values blank for a public demonstration with bundled starter PDFs, or enter your Supabase **project URL** and **public publishable/anon key** after running `supabase/schema.sql`.
2. Upload the **contents of `ready-upload/`**, not the entire source ZIP, using Cloudflare Pages **Direct Upload**. Alternatively, use the separately provided `NotesHub_DirectUpload.zip` archive.
3. Once deployed, update Supabase authentication redirect URLs and test the site.

**Trade-offs:** This convenience version fetches React, Supabase, router and icons from `esm.sh` in visitors' browsers, so it depends on a CDN and is **not the recommended production deployment** for performance, privacy review, offline functionality or SEO. Use the Git-connected Vite build above for the proper production site. The full source is included so you can migrate without rebuilding from scratch.
