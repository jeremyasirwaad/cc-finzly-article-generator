---
description: Migrate a whole wave of pages from the ledger, each fully verified before the next. Batch driver over /migration:page.
argument-hint: <wave number>
---

Migrate every page in wave: $ARGUMENTS (from `inventory/pages.md`). Follow `.migration/migration.md`.

1. Read `inventory/pages.md`; select pages where `wave == $ARGUMENTS` and status != DONE. List them
   with complexity, in dependency order (leaf/shared widgets first).
2. For each page, run the full `/migration:page` workflow. A page must reach DONE (parity gate +
   all three reviewers PASS) before starting the next, so the ledger stays trustworthy.
   - When a page introduces a widget reused ≥2 more times in the wave, extract a shared standalone
     Angular component (`strangler-integration`) and reuse it in the rest of the wave.
   - You MAY run independent leaf pages in parallel via `page-migrator` with `isolation: worktree`;
     keep shared-component extraction serialized to avoid conflicts.
3. After each page, update the ledger and emit a one-line progress note.
4. At wave end: summarize pages done, average/worst diff ratios, shared components extracted, any
   pages blocked or carrying threshold exceptions, and the bridge routes flipped to Angular.

If a page can't reach green after a reasonable number of loops, mark it BLOCKED with the reason and
continue; surface all blocked pages at the end. Do not silently skip pages.
