# Changelog

## Unreleased — v2.3.0

- Connect administrator-managed subject suggestions with normalized aliases.
- Self-host existing DM Sans and Manrope fonts.
- Add ESLint, Prettier, Playwright and live HTTP verification scripts.
- Remove unused imports and state, preserve safe download filename sanitization.
- Add read-only content, storage and RLS audits and correct report-only CSP for PDF previews.
- Previously verified 11 unit tests, 7 browser tests, clean lint and production dependency audit; latest changes require repeat verification.
- Automatic storage deletion, behavioral RLS tests, enforced CSP and production dashboard settings remain release gates.


## v2.2.0 — 2026-11-27

Initial public launch preparation.

### Added
- Community contributor directory and optional public nicknames.
- Admin starter library importer with 50 original introductory revision sheets in ten IT subjects.
- Community landing page metadata and live approved-note sitemap configuration.
- Regression checks for starter PDF generation and community SEO output.

### Improved
- Responsive typography, footer navigation and analytics preference control.
- Account transition isolation, bookmark synchronization and recorded download counts.
- PDF previews using object URLs rather than expiring signed links; clean sharing URLs and reset note-page state.
- Canonical URLs use noteshub.tech.

### Launch verification
- Production database contained 58 approved community notes, including all 50 imported starter sheets, as of November 27, 2026.
- User reported successful functional tests and Bing live inspection passed.
- Final version build and deployment checks, actual search indexing and independent security verification remain outstanding.

No additional database migration or dependency upgrade is required for this release preparation commit.
