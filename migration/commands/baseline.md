---
description: Capture the legacy Ext JS "golden master" for a page — screenshots (per viewport), DOM/computed styles, interaction trace, and network log — into evals/<page_id>/. The contract the Angular replica must match.
argument-hint: <page_id>
---

Capture the baseline for page: $ARGUMENTS

Apply `visual-parity-eval` + `behavior-parity-eval`. Using Playwright MCP + Chrome DevTools MCP
against `config.source.run.url` + the page's legacy route (from `inventory/pages.md`):

1. Run any required login (per `config.source.run.login`).
2. For each viewport in `config.viewports`: apply determinism (wait for fonts + data, freeze
   animations, mask dynamic regions), then screenshot full page + key regions →
   `evals/<page_id>/<viewport>/baseline.png`. Dump computed styles + box model for mapped elements
   → `baseline.layout.json`.
3. Record the ordered interaction trace + the network log + console → store in the page spec /
   `evals/<page_id>/`.
4. Have the **extjs-analyzer** agent read the source and produce the full PAGE SPEC
   (`templates/page-spec.template.md` shape).

Report: artifacts written, # interactions captured, grid/tree features detected, data endpoints,
and the top parity risks. This must exist before `/migration:page` implements the replica.
