---
description: Review a Finzly content draft against brand voice + compliance and return a pass/fail verdict with fixes
argument-hint: <draft text, or path to a post.md / file> [channel]
---

Run an adversarial brand + compliance review on a Finzly content draft before it ships.

Input: $ARGUMENTS

## Steps

1. **Resolve the draft.** If the input is a file path (e.g. a `content-output/.../post.md`), it will
   be read by the reviewer; otherwise treat the input as the draft text. Identify the **channel**
   (from the argument, the file's front matter, or infer it — default `linkedin`).

2. **Review.** Launch the **brand-compliance-reviewer** agent with the draft (or path) and the
   channel. It loads `finzly-brand-voice`, `finzly-compliance`, and `channel-templates` and returns
   a PASS/FAIL verdict with blocking compliance issues, brand/quality issues, channel-fit notes,
   and concrete suggested revisions.

3. **Report.** Relay the verdict and issues clearly. If FAIL, show the suggested revisions and offer
   to apply them. If the draft came from a file and the user wants fixes applied, update that file.
