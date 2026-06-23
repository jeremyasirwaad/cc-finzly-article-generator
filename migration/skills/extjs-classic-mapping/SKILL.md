---
name: extjs-classic-mapping
description: The source-of-truth reference for translating Ext JS Classic toolkit widgets, layouts, events, and binding into Angular 20 (standalone + signals) using Angular Material + CDK. Load this whenever scaffolding or implementing the Angular replica of an Ext JS page, or when an agent must decide which Angular construct replaces a given Ext class. Pairs with config/component-map.yaml (machine-readable) and data-layer-migration (stores/models).
---

# Ext JS Classic → Angular 20 + Material mapping

The goal is **exact replication**, so this skill is about matching *look and behavior*, not about
writing idiomatic Material from scratch. When Material's default styling differs from Ext's, you
**override CSS to match Ext** — parity beats idiom (see migration.md rule #2).

`config/component-map.yaml` is the quick lookup; this file explains the *how* and the traps.

## Global translation rules

1. **Every Ext component → one Angular standalone component or one Material element.** Big views
   decompose into a page component that hosts child components (mirror the Ext containment tree).
2. **`itemId`/`reference` → `@ViewChild`/template ref**; `xtype` → the mapped Angular element.
3. **`config` block** splits into: template attributes, `signal()` inputs, and SCSS.
4. **`listeners` → Angular event bindings** (`(click)`, `(selectedTabChange)`, host listeners);
   custom `fireEvent` → `@Output()` / `Subject`.
5. **Match exact dimensions.** Ext sets explicit `width/height/flex/margin/padding`. Carry these
   into SCSS verbatim (px), not "close enough" Material spacing. The visual eval will catch drift.
6. **Disable Material ripple/elevation** where Ext has none; add Ext's borders/backgrounds.

## Containers & layout

| Ext | Angular | Notes |
|---|---|---|
| `Ext.panel.Panel` | `<mat-card>` or `<section class="panel">` | `title`→header; `tools`→header buttons; `collapsible`→`mat-expansion-panel` |
| `Ext.container.Container` | `<div>` (flex/grid host) | pure layout |
| `Ext.tab.Panel` | `<mat-tab-group>` | `activeTab`→`[selectedIndex]`; `tabchange`→`(selectedTabChange)` |
| `Ext.window.Window` | `MatDialog` (open component, `MatDialogRef`) | draggable→`cdkDrag`; modal→`{disableClose, hasBackdrop}` |
| `Ext.toolbar.Toolbar` | `<mat-toolbar>` | `'->'` fill → flex `margin-left:auto`/spacer |
| `Ext.viewport.Viewport` | `AppShell` + `<router-outlet>` | the strangler shell |

### Layout configs (the parity-critical part)

| Ext `layout` | Angular CSS |
|---|---|
| `border` (N/S/E/W/center) | CSS grid `grid-template-areas: "north north" "west center" "south south"` |
| `fit` | child `height:100%; flex:1` |
| `vbox` | `display:flex; flex-direction:column` (`align`/`pack`→`align-items`/`justify-content`) |
| `hbox` | `display:flex; flex-direction:row` |
| `anchor` | percentage widths / `flex-basis` |
| `card` | `@switch` / `*ngTemplateOutlet` — one child visible (wizards, tab bodies) |
| `column` | CSS grid columns or `flex-wrap` |
| `accordion` | `<mat-accordion><mat-expansion-panel>` |

> **`flex` numbers map directly:** Ext `flex:1 / flex:2` → CSS `flex:1 / flex:2`. `region` →
> grid-area. `split:true` resizers → CDK `cdkDrag` handle or `<mat-divider>` + resize logic.

## Grid — `Ext.grid.Panel` (HIGHEST RISK — walk the whole matrix)

Map to **`MatTable` + CDK virtual scroll** (`cdk-virtual-scroll-viewport` for large stores).
Check **every** feature the source grid uses; each has a required Angular counterpart:

| Ext grid feature | Angular implementation |
|---|---|
| columns / `dataIndex` | `matColumnDef` per column; `<td mat-cell>{{row.field}}</td>` |
| `renderer` | cell template (`*matCellDef`) + a pure pipe for the formatting logic |
| sorting | `matSort` + `mat-sort-header`; server sort → emit sort to the store service |
| filtering / filterbar | filter row template + `MatTableDataSource.filter` or server params |
| `Ext.toolbar.Paging` | `<mat-paginator>` (server paging → page event → store) |
| grouping (`feature.Grouping`) | groupBy pattern: group header rows + sticky |
| cell editing (`plugin.CellEditing`) | editable cell template w/ `FormControl`, commit on blur/enter |
| row editing | inline row form or dialog |
| selection (`CheckboxModel`) | CDK `SelectionModel` + checkbox column |
| `Ext.grid.column.Action` | cell with `mat-icon-button`s |
| locked columns | two synced tables or `sticky`/`stickyEnd` columns |
| `Ext.grid.property.Grid` | 2-column MatTable (name/value) |
| summary row | `<tr mat-footer-row>` with computed signals |
| `viewConfig` row classes | `[ngClass]` on `mat-row` |
| `bufferedrenderer` | CDK virtual scroll |

**Pixel traps:** Ext grid row height (default ~21–28px) is tighter than Material's 48px default →
override `.mat-mdc-row { height: <ext>px }`. Match header background, grid lines, zebra striping,
font-size exactly.

## Trees — `Ext.tree.Panel`

`MatTree` (flat or nested datasource). Checkbox tree → `SelectionModel` with parent/child
cascade. `TreeStore` → tree datasource service (see data-layer-migration). Expand/collapse icons:
match Ext's glyphs/indent or restyle Material's `matTreeNodeToggle`.

## Forms — `Ext.form.Panel` + fields

Use **Reactive Forms** (`FormBuilder` → `FormGroup`). One `mat-form-field` per Ext field.

| Ext field | Angular |
|---|---|
| `textfield` | `<mat-form-field><input matInput>` |
| `numberfield` | `<input matInput type="number">` (or mask directive for spinners/format) |
| `combobox` (local) | `<mat-select>` |
| `combobox` (remote/typeahead) | `matAutocomplete` + async options from the store service |
| `datefield` | `<mat-datepicker>` (match Ext `format`) |
| `checkbox` / `radio` | `<mat-checkbox>` / `<mat-radio-group>` |
| `textarea` | `<textarea matInput cdkTextareaAutosize>` |
| `displayfield` | static binding |
| `fieldset` / `fieldcontainer` | `<fieldset>` / grouped row |
| `filefield` | `<input type="file">` + custom CVA |

**Validators:** `allowBlank:false`→`Validators.required`; `vtype:'email'`→`Validators.email`;
`minLength`/`maxLength`/`regex`/`minValue`/`maxValue`→corresponding `Validators.*`. Custom `vtype`
→ custom validator fn. **Field labels, `labelWidth`, `labelAlign`, and `msgTarget`** affect layout
— replicate via `mat-form-field` appearance + SCSS so the form lines up pixel-for-pixel.

## Buttons, menus, feedback

| Ext | Angular |
|---|---|
| `Ext.button.Button` | `<button mat-button / mat-raised-button / mat-icon-button>` (match Ext UI: `text`→raised, plain→button) |
| `Ext.button.Split` | button + `mat-menu` |
| `Ext.menu.Menu` | `<mat-menu>` + `matMenuTriggerFor` |
| `Ext.Msg.confirm/alert/prompt` | `MatDialog` (confirm/alert) / `MatSnackBar` (toast) |
| `Ext.LoadMask` | CDK overlay + `<mat-progress-spinner>` |
| `Ext.ProgressBar` | `<mat-progress-bar>` |
| `Ext.tip.ToolTip` | `matTooltip` |

## Events & binding (ViewModel / ViewController)

- **ViewController methods** → component class methods. Keep names where reasonable for traceability.
- **ViewModel `data` + `formulas`** → `signal()` + `computed()`.
- **`bind: { value: '{foo}' }`** → `[value]="foo()"`; two-way (`{bar}` on a field) → `[(ngModel)]`
  or signal + `(change)`.
- **stores in ViewModel** → injected feature service (signals).
- **`reference`/`lookupReference`** → `@ViewChild` / template ref.
- **component events via `listeners`** → `(event)` bindings; **custom events** (`fireEvent('saved')`)
  → `@Output() saved = output<...>()`.

## Icons & theming

- Ext glyphs/`iconCls` (Font Awesome / Ext theme) → `mat-icon` (matched icon font) or inline SVG.
  Keep the **same glyph and color**; the eval compares pixels.
- Build an Angular Material theme whose palette/typography reproduces the Ext theme
  (`theme-triton`/`crisp`/custom): primary/accent/warn colors, font family, base font-size.
- Global SCSS layer `_extjs-parity.scss` carries the overrides that pull Material onto Ext metrics
  (row heights, paddings, borders, focus styles).

## Decomposition recipe (per page)

1. Read the Ext view class + its ViewController + ViewModel + referenced stores/models.
2. Draw the containment tree → that becomes the Angular component tree.
3. Map each node via the tables above / `component-map.yaml`.
4. List every interaction (buttons, grid actions, form submit, events) → these become the
   behavior-parity test cases.
5. Note every explicit dimension/style → these become SCSS to hit visual parity.
6. Hand the resulting **page spec** to scaffolding + implementation. (The `extjs-analyzer` agent
   produces this spec; `templates/page-spec.template.md` is its shape.)
