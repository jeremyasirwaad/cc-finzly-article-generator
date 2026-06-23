---
description: Scan the Ext JS source, enumerate all ~150 pages, build the dependency graph, score complexity, and split into migration waves. Writes inventory/pages.md + dependency-graph.md.
argument-hint: [optional: feature area or path to scope the scan]
---

Build (or rebuild) the migration backlog. Scope: $ARGUMENTS (if empty, scan the whole app).

Launch the **migration-planner** agent. It applies the `app-inventory` skill against
`config.source.code_path` and writes the ledger. Wait for it, then summarize for the user:

- Total pages found; breakdown by complexity (S/M/L/XL) and feature area.
- The wave plan (Wave 0 foundation → final cutover), each wave's theme + page count + top risks.
- Top reused shared widgets (early Angular shared-component candidates).
- Wave 0 blockers (auth, theme, shell, global services) that must be done before page 1.
- Confirm `inventory/pages.md` and `inventory/dependency-graph.md` were written.

Then recommend the first move: usually Wave 0 foundation, then `/migration:wave 1`. Do not start
migrating pages from this command.
