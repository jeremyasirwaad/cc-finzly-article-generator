---
description: Migrate ONE page end-to-end — analyze -> scaffold -> implement -> eval (loop) -> review -> integrate -> record. The core per-page workflow. Verifies exact parity before marking DONE.
argument-hint: <page_id>
---

Migrate page: $ARGUMENTS — to a parity-passing Angular 20 replica. Follow `.migration/migration.md`.

1. **Baseline**: if `evals/<page_id>/` has no baseline, run the baseline capture first (see
   `/migration:baseline`). The page spec must exist (extjs-analyzer).
2. **Migrate**: launch the **page-migrator** agent with the page spec + baseline. It scaffolds the
   feature folder, implements to match (layout/styles/data/interactions), and loops implement↔eval
   using `visual-parity-eval` + `behavior-parity-eval` until visual + layout + behavior + a11y all
   pass `config/parity-thresholds.yaml`.
3. **Review** (only after the migrator reports green): run the three reviewer agents — 
   **visual-parity-reviewer**, **behavior-parity-reviewer**, **angular-code-reviewer** — in
   parallel. They re-verify adversarially. If any returns FAIL, send the findings back to the
   migrator and loop.
4. **Integrate**: when all three PASS, wire the route into the strangler bridge
   (`strangler-integration`) and smoke-test the live route.
5. **Record**: update `inventory/pages.md` — status DONE, per-viewport diff ratios, behavior PASS,
   PR link, and the `evals/<page_id>/report.md` path.

Report the final verdict, diff ratios per viewport, any threshold exceptions (with justification),
and what (if anything) is blocked. Never mark DONE on a red gate.
