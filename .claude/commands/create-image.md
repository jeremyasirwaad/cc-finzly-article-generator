---
description: Generate or edit an image with Gemini (Nano Banana) via the nano-banana-image-gen skill
argument-hint: <description of the image to create or edit>
---

Use the **nano-banana-image-gen** skill to fulfill this request.

Run the bundled script to generate (or, when an input image is referenced, edit) an image:

```bash
node .claude/skills/nano-banana-image-gen/scripts/generate-image.js "<prompt>" <outputPath> [inputImagePath]
```

Follow the skill's guidance in `.claude/skills/nano-banana-image-gen/SKILL.md` for prompting,
Finzly logo branding (assets in `.claude/skills/nano-banana-image-gen/assets/`), and API options.
After generating, read the output image back to confirm the result.

User request: $ARGUMENTS
