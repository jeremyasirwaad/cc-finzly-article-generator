---
name: nano-banana-image-gen
description: Generate or edit images with Google's Gemini "Nano Banana" models (gemini-3.1-flash-image). Use this for ANY request to create, generate, make, draw, render, or design a picture/image/photo/logo/icon/poster/illustration/mockup, or to edit/restyle/modify an existing image. Supports text-to-image, image editing from a reference image, and compositing the Finzly logo into generated images.
---

# Nano Banana image generation

Generate and edit images by calling the bundled Node script, which wraps the Gemini Interactions
API (`gemini-3.1-flash-image`, aka Nano Banana 2).

## Prerequisites

- `GEMINI_API_KEY` (or `GOOGLE_API_KEY`) must be in the environment. In this project it's set via
  `.claude/settings.local.json`, so it's already available to Bash runs here.
- The `@google/genai` dependency is installed in the project root `node_modules`. The script
  resolves it by walking up from its location — no reinstall needed.

## Usage

Run the script from the project root:

```bash
node .claude/skills/nano-banana-image-gen/scripts/generate-image.js "<prompt>" <outputPath> [inputImagePath]
```

- `<prompt>` — quote it. Be specific: subject, style, lighting, composition, aspect (see the
  prompting guide in the reference).
- `<outputPath>` — e.g. `out.png`. Parent dirs are created automatically.
- `[inputImagePath]` — optional. When provided, the image is sent alongside the prompt so the model
  edits/conditions on it (add/remove elements, restyle, composite). PNG/JPG/WEBP/GIF supported.

### Examples

```bash
# text-to-image
node .claude/skills/nano-banana-image-gen/scripts/generate-image.js \
  "A photorealistic nano banana dish in a fancy restaurant, Gemini theme, 16:9" out.png

# edit / condition on an existing image
node .claude/skills/nano-banana-image-gen/scripts/generate-image.js \
  "Add a small wizard hat on this cat, match the lighting" cat_hat.png ./cat.png
```

## Branding the Finzly logo into an image

Two Finzly logos ship in `assets/`:

- `assets/finzly-logo-dark-black-purple.png` — for light backgrounds
- `assets/finzly-logo-light-white-purle.png` — for dark backgrounds

To place the logo on a generated image, pass it as the input image and describe placement, e.g.:

```bash
node .claude/skills/nano-banana-image-gen/scripts/generate-image.js \
  "Use this Finzly logo and place it cleanly in the top-right corner of a modern fintech banner about real-time payments. Keep the logo's colors and proportions unchanged." \
  banner.png \
  .claude/skills/nano-banana-image-gen/assets/finzly-logo-light-white-purle.png
```

Pick the dark-on-light logo for light scenes and the light-on-dark logo for dark scenes.

## Notes & limits

- Default model is `gemini-3.1-flash-image`. The current script handles a single optional input
  image; for multi-reference compositing, aspect ratio / resolution control, multi-turn editing,
  or Google Search grounding, see **references/nano-banana-image-generation.md** and extend the
  script's `ai.interactions.create({ ... })` call accordingly.
- All generated images include a SynthID watermark.
- For complex API options (response_format, aspect ratios, thinking levels, Pro model, interleaved
  output), read **references/nano-banana-image-generation.md**.
