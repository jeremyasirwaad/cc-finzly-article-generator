---
description: Plan and generate a multi-day Finzly content calendar (copy + branded images) grounded in current trends
argument-hint: <N days, e.g. "a week"> [theme] [channels: linkedin,x,instagram,...]
---

Plan and generate a multi-day Finzly content calendar: research current trends, map them to a
posting schedule, then produce a publish-ready bundle (copy + branded image) for each slot. Apply
Finzly's brand and compliance rules to every piece.

Request: $ARGUMENTS

## Steps

1. **Parse the request.** Determine the **timeframe** (e.g. "a week" = 5 weekday posts unless told
   otherwise), the optional **theme**, and the **channels** (default: LinkedIn-primary, optionally
   add X/Instagram). If the cadence is ambiguous, state your assumption and proceed (don't block).

2. **Research trends.** Launch the **trend-researcher** agent with the timeframe + theme. It returns
   a source-backed digest of 6–10 Finzly-tied angles. This is the backbone of the calendar.

3. **Load the rules.** `finzly-brand-voice`, `finzly-compliance`, `channel-templates`.

4. **Plan the calendar.** Map the strongest angles to dated slots (vary topic and Galaxy module
   across the week; balance thought-leadership, product, and timely/news posts). Produce a plan
   table: date → channel → angle → which product hook → source.

5. **Generate each piece.** For every slot, follow the same pipeline as `/social-post`:
   draft copy (channel template + voice) → **brand-compliance-reviewer** until PASS → generate the
   branded image at the channel's aspect ratio via `nano-banana-image-gen` (logo placed, correct
   light/dark variant) → confirm. Reuse cited facts from the digest. You may generate slots in
   sequence; keep each bundle self-contained.

6. **Save everything.** Create a calendar folder `content-output/<today>-calendar-<theme-or-week>/`
   containing:
   - `calendar.md` — the plan table + a one-line summary/status per slot + links to each bundle
     folder and the digest sources.
   - One subfolder per post: `<date>-<channel>-<slug>/` with `post.md` + `image.png`
     (same structure as `/social-post`).
   Use today's date (YYYY-MM-DD) and absolute, consistent slugs.

7. **Report.** Show the calendar table, where everything was saved, any pieces flagged for human
   sign-off, and the reviewer status per piece. Offer to regenerate or tweak any single slot.

Note: this can produce many images and run the researcher — it's a heavier command by design.
Generate thoughtfully and keep the user informed of progress between slots.
