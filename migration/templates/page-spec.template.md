# Page spec — `<page_id>`

> Produced by the **extjs-analyzer** agent from the Ext source; the contract the Angular replica
> is built and evaluated against. One per page; lives in the page's feature folder.

## Identity
- **page_id:** `<page_id>`
- **Title:** <as users see it>
- **Legacy route:** `<#hash route>`  →  **Angular route:** `<path>`
- **Ext view class:** `App.view.<...>`  (+ ViewController, ViewModel)
- **Wave / complexity:** `<n>` / `<S|M|L|XL>`

## Containment tree  (→ Angular component tree)
```
panel (border layout)
├─ toolbar (north)        → <mat-toolbar>
├─ grid (center, flex:1)  → MatTable + CDK virtual scroll
│   └─ columns: id, name, status(renderer), actions(actioncolumn)
└─ form (east, w:320)     → reactive form, <mat-form-field>×N
```
Record explicit dimensions/flex/region/margins/paddings per node (→ SCSS targets).

## Component map  (Ext → Angular/Material; cite component-map.yaml)
| Ext node (itemId/xtype) | Angular target | Notes / features in use |
|---|---|---|
| grid (`usersGrid`) | MatTable | sort ✓, filter ✓, paging ✓, cell-edit ✗, group ✗, select(checkbox) ✓ |
| ... | ... | ... |

## Data layer
- **Stores/models:** `<Store>` → `<Page>Store` service; `<Model>` → `interface <Model>`.
- **Endpoints (preserve exactly):** `GET /api/... ?start&limit&sort` ; rootProperty=`rows`,
  totalProperty=`total`. create/update/destroy: `<...>`.
- **autoLoad / sync timing / associations:** <...>

## Bindings & logic
- ViewModel data/formulas → signals/computed: `<...>`
- `bind` configs → bindings: `<...>`
- ViewController methods → component methods: `<...>`
- `reference`s → ViewChild: `<...>`

## Interactions  (→ behavior-parity test cases; ordered)
| # | action | target | expected UI outcome | expected network |
|---|--------|--------|--------------------|------------------|
| 1 | click | Add | dialog opens | — |
| 2 | type | firstName=Ada | field shows Ada | — |
| 3 | click | Save | row added, dialog closes | `POST /api/users` |
| 4 | sort | lastName | rows reorder | `GET /api/users?sort=lastName` |

## Visual targets  (exact)
- Theme palette/typography; row height `<px>`; control height `<px>`; borders/zebra; icon glyphs;
  colors `<hex>`; fonts `<family/size>`. Masked dynamic regions: `<selectors>`.

## States to verify
hover · focus · disabled · empty · error · long-content/overflow.

## Quirks to replicate (NOT fix)
- <any legacy behavior that looks like a bug but must be preserved — see migration.md rule #2>

## Parity gate
Thresholds = `config/parity-thresholds.yaml`. Any per-page exception must be justified here.
