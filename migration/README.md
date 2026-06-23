# `.migration/` — Ext JS → Angular migration framework

A `.claude`-style toolkit that drives an **exact, page-by-page** migration of a 150+ page
**Ext JS Classic** app to **Angular 20** (standalone + signals + Angular Material), with automated
**visual + behavior parity** verification via **Playwright MCP** and **Chrome DevTools MCP**.

Start with **[`migration.md`](./migration.md)** — it holds the rules and the workflow. This README
is the operational runbook.

---

## 0. One-time setup

1. **Install the browser MCPs** (see [`commands/setup-mcp.md`](./commands/setup-mcp.md)):
   ```bash
   # Playwright MCP via the official Claude plugin:
   claude plugin install playwright@claude-plugins-official
   # Chrome DevTools MCP (https://github.com/ChromeDevTools/chrome-devtools-mcp):
   #   already wired in the project-root .mcp.json — restart Claude Code to load it.
   ```
   Verify both are connected (`/mcp`). A project-root `.mcp.json` is included.

2. **Edit [`config/migration.config.yaml`](./config/migration.config.yaml)** — point `source.code_path`
   at your Ext JS source, `source.run.url` at the running legacy app, and `target.code_path` at the
   Angular workspace. Set viewports and login steps.

3. **Stand up both apps** so parity capture can reach them:
   - Legacy: `sencha app watch` (or serve your build) → `http://localhost:1841`
   - Angular: `ng serve` → `http://localhost:4200`

---

## 1. Plan the migration (once)

```
/migration:plan
```
Runs the **`migration-planner`** agent + **`app-inventory`** skill to scan the Ext JS source,
enumerate all ~150 pages, build a dependency graph, score complexity, and split the work into
**waves** (leaf pages first, shared widgets extracted as they recur). Writes
[`inventory/pages.md`](./inventory/pages.md) (the ledger) and `inventory/dependency-graph.md`.

---

## 2. Migrate a page (the core loop, ~150×)

```
/migration:baseline <page_id>     # capture the legacy golden master (or let :page do it)
/migration:page <page_id>         # analyze → scaffold → implement → eval → review → record
/migration:eval <page_id>         # re-run parity any time (visual + behavior + a11y)
```
`/migration:page` orchestrates the whole loop for one page via the **`page-migrator`** agent,
calling the analyzer, the scaffolding/mapping skills, the eval skills, and the three reviewer
agents. It loops implement↔eval until the parity gate is green, then records DONE.

Batch a whole wave (sequential, each fully verified):
```
/migration:wave 1
```

---

## 3. Track progress

```
/migration:status
```
Renders the ledger: per-page status, parity %, wave, blockers. Your burn-down across 150 pages.

---

## The eval, concretely

For each page, at each configured viewport:

- **Baseline** (legacy): Playwright MCP navigates the Ext JS page, waits for fonts/data, freezes
  animations, screenshots the page (and key sub-regions), dumps DOM + computed styles (Chrome
  DevTools MCP), records the interaction trace + network log.
- **Candidate** (Angular): the same script runs against the Angular route.
- **Diff**: pixel diff (ratio vs `max_diff_ratio`), box-model/computed-style diff for mapped
  elements, interaction-by-interaction behavior comparison, a11y audit, console check.
- **Report**: `evals/<page_id>/report.md` + `baseline|candidate|diff.png` per viewport. Green =
  page may be marked DONE.

See [`skills/visual-parity-eval`](./skills/visual-parity-eval/SKILL.md) and
[`skills/behavior-parity-eval`](./skills/behavior-parity-eval/SKILL.md).

---

## Contents

| Path | What |
|---|---|
| `migration.md` | Rules + workflow (read first) |
| `config/*.yaml` | Paths, component map, parity thresholds |
| `skills/` | 7 skills — the "how" for each migration step |
| `agents/` | 6 sub-agents — analyzer, migrator, 3 reviewers, planner |
| `commands/` | 7 commands — setup/plan/baseline/page/wave/eval/status |
| `templates/` | Component/service/spec stubs + page-spec template |
| `inventory/` | The 150-page ledger + dependency graph |
| `evals/` | Per-page parity artifacts |

## How `.migration/` maps to `.claude/`

| `.claude/` | `.migration/` |
|---|---|
| `CLAUDE.md` | `migration.md` |
| `skills/` | `skills/` (migration skills) |
| `agents/` | `agents/` (migration sub-agents) |
| `commands/` | `commands/` (`/migration:*`) |
| — | `config/`, `templates/`, `inventory/`, `evals/` (migration-specific) |

> **Wiring it into Claude Code:** sub-agents and commands here are templates. To make them
> first-class, copy/symlink `agents/*` → `.claude/agents/` and `commands/*` → `.claude/commands/`
> (or point your harness at `.migration/`). The skills are usable as reference docs today and can
> be promoted to `.claude/skills/` the same way. `/migration:setup` does this wiring for you.
