---
description: Run (or re-run) the parity eval for a migrated page — visual + layout + behavior + a11y — against its captured baseline. Writes evals/<page_id>/report.md and returns PASS/FAIL.
argument-hint: <page_id>
---

Evaluate parity for page: $ARGUMENTS against its baseline in `evals/<page_id>/`.

Apply `visual-parity-eval` + `behavior-parity-eval` with `config/parity-thresholds.yaml`, using
Playwright MCP + Chrome DevTools MCP against the Angular route (`config.target.run.url`).

1. **Visual + layout**: per viewport, re-capture the candidate, pixel-diff vs baseline (full page +
   key regions), and compare computed styles/box model for mapped elements. Save
   `candidate.png` + `diff.png` per viewport.
2. **Behavior**: replay every interaction in the page spec; assert UI outcome, network parity
   (`assert_request_parity`), and clean console.
3. **a11y**: audit (chrome-devtools-mcp:a11y-debugging); must be ≥ legacy.
4. Write `evals/<page_id>/report.md` (visual table + layout deltas + behavior step table + a11y) and
   return the overall verdict per `gate.require`.

If FAIL: localize each failure (which element/property or which step + network param) and give the
exact fix. This command does not change code — it diagnoses; the migrator fixes.
