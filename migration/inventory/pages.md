# Migration ledger — pages

> The living backlog + burn-down for all ~150 pages. Generated/maintained by the
> **migration-planner** agent (`/migration:plan`) and updated after every page (`/migration:page`).
> `/migration:status` reads this file. **Status values:** TODO · IN-PROGRESS · BLOCKED · DONE.

**Stack:** Ext JS Classic → Angular 20 (standalone + signals) + Angular Material · **Exactness:** pixel
**Gate:** visual + layout + behavior + a11y (see `config/parity-thresholds.yaml`)

| page_id | title | legacy route | Ext view class | wave | cx | shared widgets | status | visual% (worst) | behavior | PR | report |
|---|---|---|---|---|---|---|---|---|---|---|---|
| _example-users-grid_ | Users | `#users` | `App.view.users.Users` | 1 | M | userFormPanel | TODO | — | — | — | `evals/users-grid/report.md` |
| _example-user-edit_ | Edit User | `#users/edit/:id` | `App.view.users.UserWindow` | 1 | S | userFormPanel | TODO | — | — | — | — |
| _example-dashboard_ | Dashboard | `#dashboard` | `App.view.dash.Dashboard` | N | XL | chartPanel, kpiTile | TODO | — | — | — | — |

<!--
ROW FORMAT (one per page; planner fills these in):
| <page_id> | <title> | <#hash route> | <Ext class> | <wave#> | <S|M|L|XL> | <reused widgets> | <TODO|IN-PROGRESS|BLOCKED|DONE> | <worst diff ratio across viewports, e.g. 0.0004> | <PASS|FAIL|—> | <PR link> | <evals/<id>/report.md> |
Replace the three _example-_ rows once /migration:plan runs.
-->

## Summary (update on each /migration:status)
- Total pages: **TBD** (run `/migration:plan`)
- DONE: 0 · IN-PROGRESS: 0 · BLOCKED: 0 · TODO: TBD
- Routes flipped to Angular (strangler bridge): 0
- Pages carrying threshold exceptions: 0
