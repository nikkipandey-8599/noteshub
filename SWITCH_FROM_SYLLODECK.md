# Switch your existing local SylloDeck project to NotesHub

This is the complete renamed version of your existing site. Its design, features, and Supabase database schema are otherwise unchanged.

1. In VS Code, stop the old Vite server by pressing Ctrl+C in its terminal.
2. Extract `NotesHub_Complete_Source.zip` in `C:\Users\nikki\` (or any project folder). The top-level folder is `NotesHub`.
3. Open the NEW `NotesHub` folder in VS Code (File -> Open Folder).
4. If you already created `.env.local` in your OLD folder, manually copy it into the NEW `NotesHub` folder. If not, skip this step and configure Supabase later.
5. In the new folder terminal run: `npm install`, then `npm run dev`.
6. Visit http://localhost:5173/ and confirm the header reads `NotesHub`.
7. After testing the new site, you can remove the old SylloDeck folder. Keep it until everything works.

When creating a GitHub repository and a Supabase project, use `noteshub` / `NotesHub` as the project name. The Supabase project name can be changed independently of the frontend branding; no existing database migration is required if Supabase was not set up yet.

The Cloudflare direct-upload preview is a separate ZIP: `NotesHub_DirectUpload.zip`. For production with real user uploads, use the full source project and a Git-connected Vite build.
