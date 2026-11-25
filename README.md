# NotesHub 📒

**Free notes and study PDFs for everyone.** A pastel, paper-inspired education site where people can browse, upload, preview and save responsibly shared study PDFs across subjects and learning levels.

**Live site:** https://noteshub.nikkipan848.workers.dev  
**Developer:** [Nikki Pandey](https://github.com/nikkipandey-8599)  
**Support & copyright requests:** [nikkipandey392@gmail.com](mailto:nikkipandey392@gmail.com)

## Features

- Public search, topics and original sample PDFs.
- Accounts using email/password; Google, GitHub and Discord OAuth after administrator setup.
- Upload PDFs (8 MB max), edit submissions, moderate before publication.
- Browser PDF preview, bookmarks, collections, recently viewed, ratings, comments and note requests.
- School, university, professional or independent learning: free-text course, subject and learning level.
- Pastel light/dark design, responsive navigation and profile-menu logout.
- Installable PWA, using the same `vite-plugin-pwa` approach as ExamBrain, with offline app shell and an install banner.
- Admin dashboard and Supabase Row Level Security (RLS).

## Technology

React 18 · Vite 6 · Supabase Auth, Postgres and Storage · Cloudflare Workers Static Assets · `vite-plugin-pwa` · Lucide React.

## Run locally

```bash
npm install
cp .env.example .env.local
npm run dev