---
name: app-inventory
description: How to scan a large Ext JS Classic codebase, enumerate every page/view, build the dependency graph, score each page's complexity, and split ~150 pages into migration waves (leaf-first, shared-widget aware). Load at the start (during /migration:plan) and whenever the ledger needs rebuilding. Produces inventory/pages.md and inventory/dependency-graph.md.
---

# App inventory & wave planning (for 150+ pages)

You cannot migrate 150 pages safely without knowing what they are, how they depend on each other,
and in what order to do them. This skill turns the Ext source into a **prioritized, dependency-aware
backlog**.

## 1. Enumerate pages

Sources of truth in an Ext Classic app:
- `app.json` / `Ext.app.Application` — `views`, `controllers`, `stores`, `routes`.
- `Ext.app.route(...)` definitions → the user-facing routes (often 1 route ≈ 1 page).
- View classes (`extend: 'Ext.panel.Panel'`/`Ext.window.Window`/`Ext.form.Panel`) under `app/view/`.
- Navigation: menu/tree/treelist config, viewport regions → the page list users actually see.

Define a **"page"** as a top-level navigable view (a route target or a primary window/panel). Sub-
panels are *parts* of a page, not pages. Record each with a stable `page_id` (e.g. `users-grid`).

## 2. Build the dependency graph

For each page capture what it `requires`/uses:
- child views / shared widgets (a custom `Ext.define` reused across pages),
- stores/models (shared data services),
- mixins, base classes, plugins,
- ViewController/ViewModel.

Write `inventory/dependency-graph.md` (adjacency list + the list of **shared widgets** and how
many pages use each — these become extracted Angular shared components).

## 3. Score complexity (drives effort + order)

Score each page 1–5 on:
- **Widget risk**: grids (esp. with editing/grouping/locking) and trees score high; static forms low.
- **Data complexity**: number of stores, remote ops, associations, batch sync.
- **Logic**: ViewController size, custom events, cross-component coordination.
- **Layout**: nested border/card layouts, dynamic show/hide.
- **Reuse**: pages built from many shared widgets (migrate the widget once, reuse after).

`complexity = round(avg(scores))`. Tag `S/M/L/XL`.

## 4. Split into waves

Order by **dependency + learning curve + risk burn-down**:

- **Wave 0 — Foundation**: app shell/viewport, theme (Material theme matching Ext), auth/login,
  global services (HttpClient interceptors, error handling), the strangler bridge. Not "pages" but
  unblock everything.
- **Wave 1 — Leaf + representative**: simplest standalone pages (a few static forms, a simple
  read-only grid). Goal: prove the pipeline end-to-end and the eval gate on easy targets.
- **Wave 2 — Shared-widget pages**: pages that introduce the most-reused widgets, so extracting
  them as shared Angular components pays off across later waves.
- **Wave 3..N — The bulk**: cluster by feature area; within a cluster, leaf pages before composite
  ("dashboard"-style) pages that embed others. Highest-risk XL grids get their own slot.
- **Final wave — Composites & cutover**: pages that aggregate many migrated pages; retire legacy.

Aim for waves of ~10–20 pages so `/migration:status` shows steady burn-down.

## 5. Emit the ledger

Write/append `inventory/pages.md` with one row per page (see the template already in that file).
Columns: `page_id | title | legacy route | Ext view class | wave | complexity | shared widgets |
status | visual% | behavior | PR | report`. Status starts `TODO`. The planner agent owns this;
`/migration:status` reads it.

## Practical scanning tips

- Use `Explore`/grep for `Ext.define`, `extend:`, `xtype:`, `requires:`, `Ext.app.route`,
  `stores:`, `viewModel`, `controller`.
- Count `xtype:'grid'|'gridpanel'|'treepanel'` to find the high-risk pages early.
- Group by top-level folder under `app/view/` — usually mirrors feature areas → natural clusters.
- Don't try to be perfect on pass 1; the ledger is living. Re-run as you learn the codebase.
