---
name: strangler-integration
description: How to run the legacy Ext JS app and the new Angular app side by side and cut over route-by-route (strangler-fig) as pages are migrated, including the route bridge, shared shell/auth/session, and shared-component extraction. Load during the INTEGRATE step of a page migration and when planning Wave 0 foundation work.
---

# Strangler-fig integration

150 pages cannot move in a big bang. The strangler-fig pattern lets migrated Angular pages
**incrementally replace** their Ext JS counterparts while the app stays fully usable the whole time.

## The model

```
            ┌─────────────── Reverse proxy / shell router ───────────────┐
  user ───▶ │  /users        → Angular (migrated)                        │
            │  /users/edit/5 → Angular (migrated)                        │
            │  /billing/*     → Ext JS  (not yet migrated)               │
            │  /reports/*     → Ext JS                                   │
            └────────────────────────────────────────────────────────────┘
                As each page passes the parity gate, flip its route to Angular.
```

Both apps are served; a routing layer decides per-path which app renders. Over time every path
flips to Angular; when the last one flips, the Ext app is deleted.

## Choosing the bridge (`config.integration.route_bridge`)

- **reverse-proxy (recommended)**: nginx/Express in front; path rules route to Angular (`:4200`)
  or legacy (`:1841`). Cleanest separation; one URL space for users. Maintain the path→app table
  as a generated artifact from the ledger (DONE pages → Angular).
- **iframe**: Angular shell hosts legacy pages in an `<iframe>` until migrated. Fast to start;
  watch auth/session sharing and `postMessage` for cross-app nav.
- **micro-frontend** (Module Federation): heavier; only if teams need independent deploys.

## Shared concerns (Wave 0, do once)

- **Auth/session**: single login; share the token/cookie across both apps (same domain, or SSO).
  The Angular `HttpInterceptor` and the Ext proxy must send the same credentials.
- **Shell & nav**: pick which app owns the top nav (`config.integration.shell: angular`
  recommended once the shell is migrated). Until then, the legacy nav can deep-link into Angular
  routes and vice-versa.
- **Deep links / back button**: preserve existing URLs (users have bookmarks). Map legacy hash
  routes (`#users`) to Angular paths (`/users`) at the bridge.
- **Global styles**: ensure the Angular Material theme matches Ext so a half-migrated app looks
  consistent (the parity work already guarantees per-page match).

## Shared-component extraction (avoid 150× duplication)

- Migrate the **page**, not the widget library, first.
- When the **2nd–3rd** page needs the same custom Ext widget, extract a shared standalone Angular
  component into `src/app/shared/` and refactor the earlier page to use it.
- Track shared widgets in `inventory/dependency-graph.md`; high-reuse widgets are scheduled early
  (Wave 2) precisely so the extraction pays off.

## Cutover per page (the INTEGRATE step)

1. Page passes the parity gate (visual + behavior + a11y) and reviewer agents.
2. Add/flip the bridge rule: its route → Angular.
3. Smoke-test the live route through the proxy (Playwright MCP) — same parity captures, now via
   the real entry point.
4. Mark the legacy route **retired** in the ledger (keep the Ext code until the wave closes, in
   case of rollback).
5. When a whole feature area is migrated, delete its Ext views/controllers/stores.

## Final cutover

- All ledger rows DONE + routes flipped → Angular owns the shell.
- Remove the proxy's legacy branch; delete the Ext JS app; drop Sencha build tooling.
- Keep the parity specs (`*.parity.spec.ts`) as regression tests in CI.

## Rollback

Because cutover is per-route, rollback is per-route: flip the bridge rule back to legacy. Nothing
else is touched. This is the safety net that makes 150 incremental migrations low-risk.
