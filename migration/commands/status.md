---
description: Show the migration burn-down — per-page status, parity numbers, waves, blockers — from the ledger.
argument-hint: [optional: wave number or feature area to filter]
---

Render migration progress from `inventory/pages.md`. Filter: $ARGUMENTS (if empty, show all).

Produce:
- **Headline**: X / total pages DONE (%); pages IN-PROGRESS; BLOCKED; TODO.
- **By wave**: a table — wave | total | done | in-progress | blocked | todo.
- **Blocked pages**: page_id + reason + what's needed to unblock (surface these prominently).
- **Quality**: count of pages carrying threshold exceptions; worst current diff ratio among DONE.
- **Bridge**: how many routes are flipped to Angular vs still legacy.
- **Next up**: the next 3–5 pages to tackle (lowest-risk unblocked in the active wave).

Read-only — do not change the ledger or any code. Keep it scannable.
