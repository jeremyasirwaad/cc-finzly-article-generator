---
name: channel-templates
description: Per-channel format rules for Finzly marketing content — LinkedIn, X/Twitter, Instagram, blog, and press release. Load this when drafting or planning content for a specific channel. Defines structure, length, hashtag norms, CTA style, and the matching image aspect ratio for each channel. Pair with finzly-brand-voice and finzly-compliance.
---

# Finzly channel templates

How a piece is formatted depends on where it runs. Apply the right channel spec below, always on top
of **[[finzly-brand-voice]]** (voice/vocabulary) and **[[finzly-compliance]]** (guardrails). Each
channel also specifies the **image aspect ratio** to request from `nano-banana-image-gen`.

LinkedIn is Finzly's primary channel — when unsure, optimize for it.

## LinkedIn (primary)

- **Goal:** B2B thought leadership and demand gen for banking decision-makers.
- **Length:** ~120–250 words. First 1–2 lines are the hook (they show before "…see more").
- **Structure:** punchy hook → insight (often a sourced stat) → Finzly POV/product as enabler →
  clear CTA → link → hashtags.
- **Hashtags:** 3–6 focused tags from the brand cluster, on their own line at the end.
- **CTA:** "Read the blog," "Message us," "Book time at [event]," "Learn more: <link>".
- **Image:** `1:1` (1200×1200) or `1.91:1` landscape (1200×627). Default `1:1`.

## X / Twitter

- **Goal:** fast, topical takes; amplify blogs/news.
- **Length:** ≤280 chars per tweet. Use a **thread** for anything layered (hook tweet + 2–4 detail
  tweets + CTA tweet).
- **Tone:** tighter and more direct than LinkedIn; one idea per tweet.
- **Hashtags:** 1–2 max, inline or at the end.
- **Image:** `16:9` (1600×900).

## Instagram

- **Goal:** visual-first brand presence; explain a concept simply.
- **Image leads** — the visual carries the message; caption supports it.
- **Caption:** short hook line, 1–3 supporting lines, CTA ("Link in bio"). Line breaks for
  readability.
- **Hashtags:** 5–12, in a block at the end (broader mix than LinkedIn is OK).
- **Image:** `1:1` (1080×1080) or `4:5` portrait (1080×1350). Default `4:5` for feed reach.

## Blog

- **Goal:** depth, SEO, and a destination for social CTAs.
- **Length:** ~800–1500 words.
- **Structure:** SEO title → 1-sentence meta description → strong intro framing the problem →
  scannable H2/H3 sections → data with sources → how Finzly/BankOS addresses it →
  conclusion + CTA.
- **Substantiation:** every claim/stat linked to a source (compliance).
- **Image:** hero `16:9` (1600×900); optional inline diagrams.

## Press release

- **Goal:** formal announcement (product, partnership, milestone). **Always requires human
  sign-off** before publishing.
- **Structure:**
  - **Headline** (and optional subhead)
  - **Dateline** — CITY, State — Month Day, Year —
  - **Lead paragraph** — who/what/when/where/why
  - **Body** — details, 1–2 **attributed quotes** (exec/partner; mark placeholders if not approved)
  - **Boilerplate** — the approved "About Finzly" paragraph
  - **Media contact** — name/email
- **Tone:** factual, restrained, third-person. No marketing superlatives.
- **Image:** `16:9` hero or a clean logo lockup if appropriate.

## Quick reference

| Channel | Length | Hashtags | Default image |
|---|---|---|---|
| LinkedIn | 120–250 words | 3–6 | 1:1 |
| X/Twitter | ≤280 chars / thread | 1–2 | 16:9 |
| Instagram | short caption | 5–12 | 4:5 |
| Blog | 800–1500 words | n/a | 16:9 hero |
| Press release | formal, full | n/a | 16:9 / logo |
