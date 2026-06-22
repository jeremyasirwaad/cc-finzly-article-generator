---
description: Turn a vague image idea into a detailed, reusable image prompt saved as a .md file
argument-hint: <rough image idea, e.g. "cat">
---

Your job is to turn the user's rough image idea into a single, detailed, ready-to-render image
prompt and save it to a markdown file for later use with the **nano-banana-image-gen** skill
(`/create-image`). Do NOT generate the image in this command — only produce and save the prompt.

User's idea: $ARGUMENTS

## Steps

1. **Assess vagueness.** A good image prompt specifies most of: subject & details, setting/background,
   style (photorealistic / illustration / 3D / etc.), composition & camera angle, lighting, mood,
   color palette, aspect ratio, and whether the Finzly logo/branding should appear. If the idea
   already contains most of these, skip straight to step 3.

2. **Ask clarifying questions.** If the idea is vague (e.g. just "cat"), use the `AskUserQuestion`
   tool to fill the most important gaps. Group related questions, offer sensible concrete options,
   and don't over-ask — focus on the few choices that most change the result (e.g. subject specifics,
   style, setting, aspect ratio, branding). Keep it to one round if possible.

3. **Compose the final prompt.** Write one cohesive, specific prompt paragraph following the
   prompting guidance in `.claude/skills/nano-banana-image-gen/SKILL.md` and its references. Use
   concrete, descriptive language and camera/lighting terms; prefer semantic positives over
   negatives. Include the aspect ratio. If branding was requested, note which Finzly logo asset to
   use and where to place it.

4. **Save the prompt.** Choose a short, descriptive kebab-case filename derived from the subject
   (e.g. `cat-portrait.md`) and save it under `image-prompts/<file_name>.md`. Create the directory
   if needed. Use this structure:

   ```markdown
   # <Short title>

   ## Prompt
   <the final one-paragraph prompt, ready to paste into /create-image>

   ## Suggested output
   - File: <suggested-output-name>.png  (written to image-output/ by /create-image)
   - Aspect ratio: <ratio>
   - Input image (if editing/branding): <path or "none">

   ## Notes
   <any decisions captured from the clarifying questions>
   ```

5. **Report back.** Tell the user the saved file path and show the final prompt. Remind them they
   can render it with `/create-image` using the prompt (and the suggested output path / input image).
