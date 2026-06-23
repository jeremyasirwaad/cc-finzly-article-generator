# Ext JS → Angular Migration — Master Guide

> This file is to the migration what `CLAUDE.md` is to the repo: the always-loaded source of
> truth. Read it before any migration task. It defines the **mission, the non-negotiable rules,
> the stack mapping, and the per-page workflow** that every skill, agent, and command obeys.

## Mission

Migrate a **150+ page Ext JS (Classic toolkit) application** to **Angular 20** (standalone
components + signals) using **Angular Material + CDK**, such that **each migrated page is an exact
visual and behavioral replica of the original** — verified automatically, page by page, with
**Playwright MCP** and **Chrome DevTools MCP** before it is allowed to be marked done.

"Exact" is not aspirational here. It is a **gate**: a page does not count as migrated until its
parity report passes the thresholds in `config/parity-thresholds.yaml`.

## The 8 non-negotiable rules

1. **Parity is a gate, not a goal.** No page is "done" until visual + layout + behavior +
   a11y parity all pass. Red parity = not done, regardless of how good the code looks.
2. **Replicate first, improve later.** Do **not** redesign, "clean up" UX, or change behavior
   during migration. Match the original — bugs and quirks included — then file improvements as
   separate post-migration work. A faithful replica is the only way the eval can pass.
3. **One page = one unit of work = one PR.** 150 small, independently-verified migrations, not
   one big-bang. This is what makes the strangler-fig safe and reviewable.
4. **Capture the baseline from the *running legacy app*, before touching anything.** The legacy
   UI is the golden master. If you can't capture it, you can't prove parity — stop and fix capture.
5. **Preserve data contracts.** Same API requests, same payload shapes, same field semantics.
   The backend does not change. (See `skills/data-layer-migration`.)
6. **Both apps run during migration.** Legacy Ext JS and new Angular are served side by side and
   stitched route-by-route (strangler-fig). Users are never cut over wholesale.
7. **Angular 20 idioms only.** Standalone components, `signal()`/`computed()`, `inject()`,
   `@if/@for/@switch`, functional guards. No NgModules, no constructor DI for new code.
8. **Accessibility never regresses.** Migrated pages are ≥ the original on a11y (web.dev criteria).

## Stack mapping (summary)

| Layer | Ext JS (Classic) | Angular 20 target |
|---|---|---|
| Component | `Ext.*` widgets | Standalone component + Angular Material |
| Layout | `border/vbox/hbox/anchor/fit` | CSS grid / flexbox (+ CDK) |
| Grid | `Ext.grid.Panel` | `MatTable` + CDK virtual scroll |
| Forms | `Ext.form.Panel` + fields | Reactive forms + `mat-form-field` |
| Data store | `Ext.data.Store` / `Model` | Feature **service** exposing **signals** + RxJS/HttpClient |
| Binding | ViewModel `bind` | signals + `computed` + template bindings |
| Logic | ViewController | component class methods |
| Events | `listeners` / `fireEvent` | `(output)` / host listeners / `Subject` |
| Routing | `Ext.app.route` (hash) | Angular Router (`provideRouter`) |
| Modals | `Ext.window.Window` | `MatDialog` |

Full, edge-case-complete mapping → `skills/extjs-classic-mapping/SKILL.md` and
`config/component-map.yaml`.

## The per-page workflow (the core loop, repeated ~150×)

```
┌─ /migration:plan  (once)  ── inventory 150+ pages → dependency graph → waves
│
└─ per page  (/migration:page <id>):
   1. BASELINE   capture legacy page with Playwright/CDT MCP → screenshots + DOM + computed
                 styles + interaction trace + network log   (golden master)
                 → agent: extjs-analyzer produces the PAGE SPEC
   2. SCAFFOLD   generate Angular 20 standalone component/service/route from the spec
                 (skills: angular-scaffolding, extjs-classic-mapping, data-layer-migration)
   3. IMPLEMENT  build to match the spec exactly — layout, styles, data, interactions
   4. EVAL       /migration:eval <id> → run candidate through the SAME captures; diff vs baseline
                 (skills: visual-parity-eval, behavior-parity-eval)  ── LOOP 2-4 until green
   5. REVIEW     adversarial agents: visual-parity-reviewer, behavior-parity-reviewer,
                 angular-code-reviewer  ── must all PASS
   6. INTEGRATE  wire the route into the strangler-fig bridge (skill: strangler-integration)
   7. RECORD     update inventory/pages.md ledger → status DONE, parity %, PR link
```

A page only advances when the prior step is green. Steps 2–4 are a tight loop owned by the
`page-migrator` agent.

## How the pieces fit (`.migration/` map)

```
.migration/
  migration.md            ← you are here (the rules)
  README.md               ← how to drive the framework
  config/
    migration.config.yaml ← paths, URLs, viewports, target stack  (EDIT FIRST)
    component-map.yaml     ← machine-readable Ext→Angular map
    parity-thresholds.yaml ← the "exact" bar (gate)
  skills/                  ← reusable know-how (the "how to" for each step)
    extjs-classic-mapping/   data-layer-migration/   angular-scaffolding/
    visual-parity-eval/      behavior-parity-eval/   app-inventory/
    strangler-integration/
  agents/                  ← sub-agents invoked during the loop (see list below)
  commands/                ← the verbs you type (/migration:plan, :page, :eval, :status, ...)
  templates/               ← code stubs (component/service/spec) and the page-spec template
  inventory/               ← pages.md (the 150-page ledger) + dependency-graph.md
  evals/<page_id>/         ← baseline/candidate/diff PNGs + report.md per page
```

## Definition of Done (per page)

- [ ] Page spec captured from legacy (baseline screenshots + DOM + interactions + network).
- [ ] Angular 20 standalone component + service + route implemented; Angular Material; signals.
- [ ] **Visual parity** ≤ `max_diff_ratio` at every configured viewport.
- [ ] **Layout parity** (box model / computed styles) within tolerance (Chrome DevTools MCP).
- [ ] **Behavior parity** — every interaction in the spec reproduces; network requests match.
- [ ] **a11y** ≥ legacy; console clean (no errors).
- [ ] All three reviewer agents PASS.
- [ ] Route wired into strangler bridge; legacy route retired (or flagged for retirement).
- [ ] `inventory/pages.md` updated: status DONE + parity numbers + PR link + `evals/<id>/report.md`.

## Guardrails / anti-patterns

- ❌ Migrating without a captured baseline ("I'll eyeball it"). The eval needs the golden master.
- ❌ Improving UX mid-migration. Replicate; improvements are separate, later work.
- ❌ Big-bang rewrites of shared widgets. Migrate the *page*; extract shared components only when
  the 2nd or 3rd page needs the same widget (see strangler-integration).
- ❌ Hand-waving the grid. `Ext.grid.Panel` is the highest-risk widget — its feature matrix
  (sort/filter/group/page/edit/select/lock) is enumerated in the mapping skill; check each.
- ❌ Changing API calls to "be cleaner." Preserve request/response contracts exactly.
- ❌ Marking DONE on a loosened threshold without a written, per-page justification in the report.

## Sub-agents, skills, commands — index

**Skills (7):** `extjs-classic-mapping`, `data-layer-migration`, `angular-scaffolding`,
`visual-parity-eval`, `behavior-parity-eval`, `app-inventory`, `strangler-integration`.

**Sub-agents (6):** `migration-planner`, `extjs-analyzer`, `page-migrator`,
`visual-parity-reviewer`, `behavior-parity-reviewer`, `angular-code-reviewer`.

**Commands (7):** `/migration:setup`, `/migration:plan`, `/migration:baseline`,
`/migration:page`, `/migration:wave`, `/migration:eval`, `/migration:status`.

See `README.md` for the end-to-end runbook.
