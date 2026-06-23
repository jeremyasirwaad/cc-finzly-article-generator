---
name: visual-parity-eval
description: How to prove a migrated Angular page is a pixel-exact replica of the legacy Ext JS page using Playwright MCP (screenshots + diff) and Chrome DevTools MCP (computed styles + box model). Load during the EVAL step of any page migration, or when a parity report comes back red and you need to localize the diff. Reads config/parity-thresholds.yaml.
---

# Visual + layout parity eval

Produces, per page per viewport, a **baseline** (legacy) and **candidate** (Angular) capture, a
**pixel diff**, a **box-model/computed-style diff**, and a verdict against
`config/parity-thresholds.yaml`. Artifacts land in `evals/<page_id>/<viewport>/`.

## Tools

- **Playwright MCP** — navigation, deterministic capture, full-page + region screenshots,
  interaction setup. (Installed via `playwright@claude-plugins-official`.)
- **Chrome DevTools MCP** — computed styles, box model / layout metrics, fonts loaded, console,
  and the `chrome-devtools-mcp:*` skills (a11y, troubleshooting). Use it to *explain* a pixel diff
  ("padding is 8px vs 6px on `.toolbar`").

## Determinism first (or every diff is noise)

Before any screenshot, on **both** apps identically:
1. Same viewport (loop over `config.viewports`), same device pixel ratio.
2. **Wait for fonts** (`document.fonts.ready`) and for data to settle (network idle / known row count).
3. **Freeze animations**: inject CSS `*,*::before,*::after{transition:none!important;animation:none!important}`.
4. **Freeze time / dynamic content**: stub clocks; mask regions in `parity.masks` (timestamps,
   session ids, random ads) — masked areas are excluded from the diff.
5. Seed the **same data** (same logged-in user, same fixture/route params). Mismatched data =
   false diff. Prefer a fixture/mock backend shared by both captures.

## The capture → diff loop

```
for viewport in config.viewports:
  # BASELINE (legacy Ext JS)
  playwright: navigate config.source.run.url + page.legacy_route
  apply determinism; wait; screenshot -> evals/<id>/<vp>/baseline.png
  chrome-devtools: dump computed styles + box model for mapped key elements -> baseline.layout.json

  # CANDIDATE (Angular)
  playwright: navigate config.target.run.url + page.angular_route
  apply determinism; wait; screenshot -> evals/<id>/<vp>/candidate.png
  chrome-devtools: dump computed styles + box model -> candidate.layout.json

  # DIFF
  pixel diff baseline vs candidate -> diff.png + diff_ratio
  layout diff baseline.layout.json vs candidate.layout.json -> per-element px deltas
```

- **Pixel diff** (pixelmatch/Playwright `toHaveScreenshot` semantics): `diff_ratio ≤
  visual.max_diff_ratio` (default 0.1%). Save the highlighted `diff.png`.
- **Region diffs**: also diff key sub-regions (header, grid, form, toolbar) so a small but
  important mismatch isn't drowned out by a large matching page.
- **Layout diff** (Chrome DevTools MCP): for each mapped element, compare position/size within
  `layout.position_tolerance_px` / `size_tolerance_px`, and the `enforce_styles` properties
  (color, background, font, border, padding, margin) for exact match.

## Localizing a red diff (what to do when it fails)

1. Open `diff.png` — where are the highlighted pixels?
2. Query both DOMs with Chrome DevTools MCP for that element's **computed styles + box model**;
   the delta tells you the fix (wrong padding, font-size, border, color, row height).
3. Common culprits: Material default control/row heights (taller than Ext), font-family/size,
   missing borders/zebra striping, ripple/elevation shadows, icon glyph differences, scrollbar
   width shifting layout.
4. Fix in the page `.scss` (or `_extjs-parity.scss` if it's systemic), re-run eval.

## Output: `evals/<page_id>/report.md` (visual section)

```
## Visual parity — PASS/FAIL
| viewport | diff_ratio | threshold | regions failing | verdict |
|----------|-----------|-----------|-----------------|---------|
| desktop  | 0.0004    | 0.001     | —               | PASS    |
| laptop   | 0.0021    | 0.001     | grid header     | FAIL    |
Layout deltas (failing elements): .mat-mdc-row height 48px vs 24px → set 24px.
Artifacts: baseline/candidate/diff PNGs per viewport.
```

A page **cannot** be marked DONE while any viewport or enforced region is red, unless the report
documents an explicit, justified threshold exception (migration.md guardrails).
