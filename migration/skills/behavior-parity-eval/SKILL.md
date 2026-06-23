---
name: behavior-parity-eval
description: How to prove a migrated Angular page behaves identically to the legacy Ext JS page — every interaction, the same network requests, the same resulting state — using Playwright MCP for interaction replay and Chrome DevTools MCP for network/console inspection. Load during the EVAL step alongside visual-parity-eval. Reads the page spec's "interactions" list and config/parity-thresholds.yaml.
---

# Behavior parity eval

Exact UI match is necessary but not sufficient — the page must *do* the same things. This skill
replays every interaction from the page spec against both apps and asserts the outcomes match.

## What "behavior" covers

1. **Interactions**: clicks, typing, selection, sort/filter/page on grids, expand/collapse,
   drag, dialog open/confirm/cancel, form submit/validation, menu/tab switches.
2. **Network parity**: the same API requests fire (method + path + key params + body shape),
   in the same situations. (URLs/hosts may differ between apps; the *contract* must match.)
3. **Resulting UI state**: after an interaction, the visible result matches (often a follow-up
   screenshot diff via visual-parity-eval, or a DOM/text assertion).
4. **Console health**: no new errors/warnings on the Angular side.
5. **Validation behavior**: same fields flagged, same messages, same enable/disable of actions.

## The interaction trace (golden master)

During `/migration:baseline`, Playwright MCP records, on the legacy page, an ordered trace:
```
[
  { step: 1, action: "click", target: "Add button", expect: "dialog opens" },
  { step: 2, action: "type", target: "firstName", value: "Ada", expect: "field shows Ada" },
  { step: 3, action: "click", target: "Save", expect: "POST /api/users {firstName:'Ada',...}; grid gains a row; dialog closes" },
  { step: 4, action: "sort", target: "lastName col", expect: "rows reorder; GET /api/users?sort=lastName" }
]
```
Chrome DevTools MCP captures the **network log** and **console** during the same run. This trace
+ network log is stored in the page spec and is the contract the candidate must satisfy.

## Replay against the candidate

For each step:
- Drive the equivalent Angular control (Playwright MCP).
- Assert the **expected UI outcome** (DOM/text/visibility; or a region screenshot diff).
- Capture the **network requests** triggered (Chrome DevTools MCP) and compare to the baseline's
  for that step: same method, same path template, same key params/body fields (`assert_request_parity`).
- Check the **console** stayed clean.

## Mapping Ext interactions → Angular drivers (examples)

| Ext behavior | How to drive/assert on Angular |
|---|---|
| grid row dblclick → edit window | dblclick `mat-row`; assert MatDialog opens with same fields |
| combo remote query | type into autocomplete; assert debounced GET with same query param |
| form submit invalid | submit; assert same fields show `mat-error`, Save disabled, no network call |
| paging next | click `mat-paginator` next; assert GET with next page params |
| toolbar action enable/disable | select/deselect row; assert button `disabled` toggles same as Ext |
| `Ext.Msg.confirm` → yes | click action; confirm dialog; assert DELETE fires only after confirm |
| tab change lazy-loads | switch tab; assert the same lazy GET fires once |

## Verdict & report (`evals/<page_id>/report.md`, behavior section)

```
## Behavior parity — PASS/FAIL   (require_all_pass: true)
| step | action            | UI outcome | network parity | console | verdict |
|------|-------------------|------------|----------------|---------|---------|
| 1    | click Add         | dialog ✓   | n/a            | clean   | PASS    |
| 3    | Save new user     | row+close ✓| POST /users ✓  | clean   | PASS    |
| 4    | sort lastName     | reorder ✓  | GET sort ✗ (param 'sortBy' vs 'sort') | clean | FAIL |
Fix: store.load() must send `sort=` (Ext param name), not `sortBy=`.
```

All steps must pass (`require_all_pass`). A network-param mismatch is a real fail — it means the
backend contract drifted (migration.md rule #5). Fix in the store service, re-run.
