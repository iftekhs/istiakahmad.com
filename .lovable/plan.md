## Goal

Act as a QA engineer: walk through every route + every admin function, catalogue bugs, then fix them all in one pass so the site is production-ready.

## Surface to test

**Public site (12 routes)**
`/`, `/about`, `/services`, `/portfolio`, `/playbook`, `/products`, `/products/$slug`, `/deals`, `/contact`, `/privacy`, `/terms`, `/ia-login`
Plus generated endpoints: `/sitemap.xml`, `/llms.txt`, `/robots.txt`.

**Admin dashboard (10 screens)**
`/admin` (overview), `/admin/products`, `/admin/deals`, `/admin/launches`, `/admin/media`, `/admin/pages`, `/admin/pages/$key`, `/admin/seo`, `/admin/site-settings`, `/admin/tracking`, `/admin/audit`.

## QA checklist (applied to every screen)

1. **Render** — page loads, no blank screen, no console/runtime errors, no hydration mismatch.
2. **Links & nav** — header, footer, breadcrumbs, CTAs all resolve to real routes (no `to="/foo"` for routes that don't exist).
3. **SEO head** — unique title, description, canonical, og:image present on every leaf route.
4. **Data loading** — loader uses `ensureQueryData` + `useSuspenseQuery` pattern, error/notFound boundaries set, empty states render.
5. **Forms** — required-field validation, disabled state during submit, success toast, error toast, optimistic refresh.
6. **Admin CRUD** — create / edit / delete / reorder / toggle-active / toggle-featured all round-trip to Supabase and re-fetch list. Audit log gets a row.
7. **RLS / auth** — every admin route is gated by `_authenticated` + admin role check; non-admin gets redirected. Tracking + admin pages never leak the service-role client.
8. **Image / media** — uploads to `site-media` bucket, public URL returned, alt text saved, deletes remove storage object.
9. **Mobile** — header menu, product cards, admin tables usable at 375px.
10. **Tracking** — admin/login routes do NOT fire pixels (regex guard in `__root.tsx`); custom snippets respect `include:` / `exclude:` filters.

## Process

Step 1 — **Audit** (read-only, ~30 min of tool calls):
   - Read each route + component file, note bugs in a running list.
   - Hit the live preview with the browser tool for the public pages and a quick admin smoke test (after you confirm you're logged in as admin).
   - Pull console + network logs, check runtime errors panel, run `supabase--linter` and `security--run_security_scan`.

Step 2 — **Fix** (one consolidated edit batch):
   - Group fixes by file, use parallel `line_replace` calls.
   - High-priority categories: broken links, missing error boundaries, missing SEO meta, mutation handlers that don't invalidate queries, forms without validation, admin routes missing role guard, accessibility (alt text, button labels), mobile overflow.

Step 3 — **Verify**:
   - Re-run the browser smoke test on the changed screens.
   - Re-run security scan + linter.
   - Re-check runtime-errors panel is clean.

Step 4 — **Report**:
   - Deliver a single summary: "X bugs found, Y fixed, Z deferred (with reason)".

## What's out of scope (unless you say otherwise)

- New features or redesigns — fixes only.
- Performance refactors beyond obvious wins (missing keys, N+1 queries).
- Writing automated tests (Vitest/Playwright) — manual QA pass only.
- Content/copy rewrites.
- Payment integration, email sending, or any new third-party connector.

## Before I start — two quick confirmations

1. **Admin login**: I'll need the preview to be logged in as an admin user for me to test admin CRUD end-to-end. Are you logged in at `/ia-login` in the preview right now? If not, log in before approving so the browser session can reach `/admin/*`.
2. **Destructive actions**: During admin testing I'll create test rows (a throwaway product / deal / launch) and delete them after. OK to do that against the live Cloud DB, or do you want me to skip writes and only verify reads + UI behavior?

Approve this plan and I'll start the audit pass.