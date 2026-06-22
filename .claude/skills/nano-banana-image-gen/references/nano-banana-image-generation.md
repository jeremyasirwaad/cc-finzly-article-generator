# Nano Banana image generation (Gemini Interactions API)

> **Note:** This reference covers the new **Interactions API** (`ai.interactions.create`),
> currently in Beta. For stable production deployments Google still recommends the
> `generateContent` API. The bundled `scripts/generate-image.js` uses the Interactions API.

**Nano Banana** is the name for Gemini's native image generation. It can generate, edit, and
iterate on images conversationally from text, images, or both.

## Models

| Name | Model ID | Use for |
|---|---|---|
| Nano Banana 2 | `gemini-3.1-flash-image` | **Default.** Best all-round speed/cost/intelligence. Adds 512px (0.5K) output, video-to-image, image-search grounding. |
| Nano Banana Pro | `gemini-3-pro-image` | Professional asset production, complex instructions, high-fidelity text, interleaved text+image output. |
| Nano Banana | `gemini-2.5-flash-image` | High-volume, low-latency; 1024px only. |

All generated images include a [SynthID watermark](https://ai.google.dev/responsible/docs/safeguards/synthid).

## Text-to-image (JavaScript)

```js
import { GoogleGenAI } from "@google/genai";
import * as fs from "node:fs";

const ai = new GoogleGenAI({}); // reads GEMINI_API_KEY / GOOGLE_API_KEY from env
const interaction = await ai.interactions.create({
  model: "gemini-3.1-flash-image",
  input: "Create a picture of a nano banana dish in a fancy restaurant with a Gemini theme",
});
const img = interaction.output_image;            // convenience: last generated image block
fs.writeFileSync("out.png", Buffer.from(img.data, "base64"));
```

## Image editing (text + image to image)

Provide an image plus a text prompt to add/remove/modify elements, restyle, or recolor. Pass an
array of content blocks:

```js
const input = [
  { type: "text", text: "Add a small knitted wizard hat on this cat, matching the lighting" },
  { type: "image", mime_type: "image/png", data: base64Image },
];
const interaction = await ai.interactions.create({ model: "gemini-3.1-flash-image", input });
```

## Multi-turn editing

Chain edits with `previous_interaction_id` (the model keeps the prior image as context):

```js
const second = await ai.interactions.create({
  model: "gemini-3.1-flash-image",
  input: "Update this infographic to be in Spanish. Don't change anything else.",
  previous_interaction_id: interaction.id,
  response_format: { type: "image", aspect_ratio: "16:9", image_size: "2K" },
});
```

## Up to 14 reference images (Gemini 3)

Mix multiple reference images in one `input` array — objects, characters, and (Pro only) style refs.
- `gemini-3.1-flash-image`: up to 10 object refs + up to 4 character refs.
- `gemini-3-pro-image`: up to 6 object refs + 5 character refs + 3 style refs (14 total).

Useful for compositing — e.g. dropping the Finzly logo onto a generated scene (pass the logo as a
reference image and describe where it goes).

## Grounding with Google Search

Add the search tool to generate from real-time data (weather, scores, recent events):

```js
const interaction = await ai.interactions.create({
  model: "gemini-3.1-flash-image",
  input: "Visualize SF's 5-day weather forecast as a clean modern chart",
  tools: [{ type: "google_search" }],
  response_format: { type: "image", aspect_ratio: "16:9", image_size: "2K" },
});
```
3.1 Flash also supports image search: `tools: [{ type: "google_search", search_types: ["web_search", "image_search"] }]`.
When using image search you **must** display the `search_suggestions` returned in the `google_search_result` step.

## response_format options

| Field | Values | Notes |
|---|---|---|
| `type` | `"image"`, `"text"` | Pass an array `[{type:"text"},{type:"image"}]` to get both. Image-only suppresses the chatty text. |
| `mime_type` | `image/png`, `image/jpeg` | |
| `aspect_ratio` | `1:1`, `2:3`, `3:2`, `3:4`, `4:3`, `4:5`, `5:4`, `9:16`, `16:9`, `21:9` (+ `1:4`,`4:1`,`1:8`,`8:1` on 3.1 Flash) | Defaults to input image's ratio, else 1:1. |
| `image_size` | `512px`/`0.5K` (3.1 Flash only), `1K`, `2K`, `4K` | **Uppercase K required** — `1k` is rejected. Default 1K. |

## Thinking

Gemini 3 image models reason ("Thinking") before rendering and generate up to two interim "thought
images" (billed, not always shown). On 3.1 Flash you can set
`generation_config: { thinking_level: "minimal" | "high" }` (default `minimal`).

## Interleaved text + images (Pro)

`gemini-3-pro-image` can emit stories/guides with interleaved text and illustrations. Convenience
properties (`.output_image`, `.output_text`) won't capture everything — iterate over
`interaction.steps`, and within each `model_output` step iterate `step.content` blocks
(`type === "text"` or `type === "image"`).

## Prompting guide (highlights)

- **Photorealistic:** `A photorealistic [shot type] of [subject] in [setting]. [lighting]. Shot from [angle] with a [lens].`
- **Stickers/illustrations:** name the style, subject, line/shading qualities, and background.
- **Text in images:** state the exact text, font style, color scheme; Gemini renders text well (Pro best). Generate the text first, then ask for the image.
- **Product mockups:** studio-lit, surface, lighting setup, camera angle, sharp focus on a detail.
- **Negative space:** place a single subject off-center on a large empty canvas for overlay text.
- Best practices: be hyper-specific, give intent/purpose, iterate conversationally, break complex
  scenes into steps, use **semantic negative prompts** ("an empty deserted street" not "no cars"),
  and use camera language (`wide-angle`, `macro`, `low-angle`).

## Limitations

- Best languages: EN, ar-EG, de-DE, es-MX, fr-FR, hi-IN, id-ID, it-IT, ja-JP, ko-KR, pt-BR, ru-RU, ua-UA, vi-VN, zh-CN.
- No audio input. Video input only on 3.1 Flash.
- The model won't always honor the exact number of requested image outputs.
- 3.1 Flash search grounding can't use real-world web images of people.
- All outputs carry a SynthID watermark.

## Source

Adapted from Google's Gemini API docs: <https://ai.google.dev/gemini-api/docs/interactions/image-generation>
