---
description: Create one publish-ready Finzly content piece (copy + branded image) for a channel, end-to-end
argument-hint: <idea or topic> [channel: linkedin|x|instagram|blog|press] [--research]
---

Produce ONE publish-ready Finzly content bundle (copy + matching branded image) for the requested
idea and channel, then save it. Apply Finzly's brand and compliance rules throughout.

Request: $ARGUMENTS

## Steps

1. **Parse the request.** Identify the topic, the **channel** (default `linkedin` if unspecified),
   and whether current-events grounding is needed (explicit `--research`, or the topic references
   "this week"/recent news/trends).

2. **Load the rules.** Apply these skills before writing:
   - `finzly-brand-voice` — voice, vocabulary, product names, visual identity.
   - `finzly-compliance` — guardrails + the pre-publish checklist.
   - `channel-templates` — format + image aspect ratio for the chosen channel.

3. **Research (only if needed).** If grounding is required, launch the **trend-researcher** agent
   with the topic to get a source-backed digest; use a real, cited fact in the copy. Skip for
   evergreen ideas.

4. **Draft the copy** in Finzly's voice, following the channel template (hook → insight → Finzly
   POV → CTA + link). Use exact product names; include sourced stats if any.

5. **Compliance review.** Launch the **brand-compliance-reviewer** agent on the draft (pass the
   channel). If it returns FAIL, apply the fixes and re-check until PASS. Press releases always need
   a human sign-off note.

6. **Generate the branded image.** Write a vivid prompt in Finzly's visual style (black + violet
   purple, clean modern fintech) at the channel's aspect ratio, and brand it with the Finzly logo
   via the `nano-banana-image-gen` script — pass the logo as the input image and describe placement
   (default top-right; pick the dark logo for light scenes, light logo for dark scenes). Save the
   image with a bare filename so it lands in `image-output/`, then move/copy it into the bundle
   folder (next step). Read the image back to confirm.

7. **Save the bundle.** Create `content-output/<today>-<channel>-<slug>/` (use today's date
   YYYY-MM-DD; short kebab-case slug from the topic) containing:
   - `post.md` — front matter (channel, date, status: draft|needs-signoff, topic) + the final copy
     + hashtags + any source links + the image prompt used.
   - `image.png` — the branded image.
   Create directories as needed.

8. **Report.** Show the final copy, the image, the bundle path, the reviewer verdict, and any
   human-signoff flag. Note next steps (e.g. "ready to post" or "needs legal sign-off").
