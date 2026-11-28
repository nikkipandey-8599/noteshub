# NotesHub 2.3 release gate

This branch is not a verified release. Do not merge before the following checks.

## Local tooling
Run npm ci, then npm audit and npm audit --omit=dev. Inspect npm audit --json and npm explain for affected packages. Avoid npm audit fix --force.
Install free development tools: npm install -D --save-exact eslint@9 @eslint/js@9 globals@16 eslint-plugin-react@7 prettier@3 @playwright/test@1
Run npx eslint src, npx prettier --check src, node --test scripts/*.test.mjs, npm run build, npm run check, npx playwright install chromium, npx playwright test --browser=chromium (or npx playwright test), node scripts/live-audit.mjs. Commit package.json and package-lock.json together. Formatting warnings are not a reason to rewrite unrelated UI.

## Database and storage
Run scripts/content-audit.sql and scripts/rls-audit.sql in SQL editor. Do not delete orphan candidates until all references are checked, including pending/rejected notes, active uploads and backups. Use Storage API remove, never SQL DELETE on storage.objects. Automated deletion requires a coordinated upload reservation/deletion protocol or other race-safe design. Do not enable a destructive cron until tested.
Test two disposable users and an admin in a separate test database: private profiles, pending notes and signed files, cross-owner writes, role escalation, comments/reports, rating uniqueness, rejection reason integrity, catalog admin-only writes, moderation, anonymous public reads. Verify rejected operations and unchanged rows. Roll back test fixtures.

## Browser / security
Test signed PDF preview, analytics consent, OAuth callbacks, login, upload and rejection, PWA installation and offline behavior. Review CSP console violations before switching report-only to enforced. Ensure worker responses and static assets use the same policy. Validate unknown routes return 404 with noindex, including service-worker-controlled navigation.
Self-host DM Sans and Manrope with licensed Fontsource packages, retaining all original weights and verifying layout. Remove external font links only after local font assets work. Verify mobile layouts and PDF previews.

## Production dashboards
Supabase Auth: configure SMTP using a free provider where available; verify sender domain and DNS, test confirmation and password recovery. Enable TOTP MFA for administrators and require AAL2 server-side only after enrollment and recovery testing. Configure Cloudflare Turnstile in Supabase Auth and pass captcha tokens through all applicable client auth requests before enabling enforcement. Review password minimum length and rate limits. Do not assume leaked-password protection is included in the free plan.
Cloudflare Email Routing: set up an inbound alias, verify destination mailbox and MX records. Routing is not outbound SMTP. Avoid overwriting existing mail records.
Review current provider limits and legal requirements before enabling these settings.

## Content and privacy
Manually review flagged PDFs for rights, attribution, personal information and educational usefulness. Do not assume a PDF is licensed from its title. Keep a takedown contact and documented response procedure. Review children's privacy obligations for intended jurisdictions, age/consent flows, public contributor identities, analytics, data retention and account deletion with qualified advice. Do not collect identity documents merely to guess age.

## Release
After all required gates pass, update README and CHANGELOG, npm version 2.3.0 --no-git-tag-version, rerun build and tests, commit and merge. Confirm deployment, HTTP smoke checks and rollback to prior known-good commit if necessary.
