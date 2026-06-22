---
name: finzly-compliance
description: Guardrails every public-facing Finzly content piece must pass before it is "publish-ready". Load this whenever drafting OR reviewing Finzly marketing/external copy (social, blog, press release, ad, email). Covers claim substantiation, prohibited language, how to talk about security/compliance accurately, and the banking-license boundary. Pair with finzly-brand-voice.
---

# Finzly content compliance guardrails

Finzly operates in regulated fintech. Marketing is external and hard to retract once published, so
**every public draft must clear these rules before it's called publish-ready.** When in doubt,
soften the claim or cut it. These are content guardrails, not legal advice — escalate genuine legal
questions to the Finzly team (see Contact).

## The banking-license boundary (most important)

- **Finzly is technology/infrastructure, not a bank.** Never state or imply Finzly is a chartered
  bank, holds customer deposits, is a member of the Federal Reserve, or is FDIC-insured.
- Finzly **enables** banks and credit unions to move money, modernize, and launch products. Phrase
  accordingly: _"Finzly helps banks…"_, _"banks running on BankOS can…"_ — not _"Finzly offers
  accounts/deposits/insured funds."_
- Don't imply Finzly provides regulatory approval, licensing, or compliance *on behalf of* a bank.

## Claim substantiation

Every factual or comparative claim needs a basis. If you can't point to a source, don't publish it.

- **No unsubstantiated superlatives or guarantees:** avoid "fastest," "cheapest," "the best,"
  "#1," "guaranteed," "100% secure," "zero risk," "always," "never fails," "instant" (as an absolute).
  Prefer measured, true phrasing: "real-time," "24/7," "designed to," "helps reduce," "built for."
- **Stats and quotes must be sourced.** Cite the named source inline (e.g. "McKinsey's global
  banking report," "an American Banker–Finzly poll") and link when possible. Don't invent numbers,
  polls, or analyst quotes. If a stat can't be verified, remove it.
- **No forward-looking promises** about performance, ROI, or outcomes stated as certainties. Use
  "can," "may," "designed to," not "will save you X."
- **Comparative claims** about named competitors: avoid unless backed by a citable, fair basis.
- **Customer references:** name a bank/customer or use a logo/testimonial only if it's already
  public/approved. Otherwise keep it generic ("a top-50 US bank").

## Talking about security & compliance accurately

Finzly's posture is real and citable — use it precisely, never embellish.

- **Accurate to say:** Finzly's Information Security Program aligns to **ISO 27001, SOC 1, and
  SOC 2** frameworks; services are hosted on **AWS** (US); **data encrypted at rest and in transit
  (TLS/SSL)**; independent **third-party penetration testing at least annually**; least-privilege
  access, SSO/2FA, quarterly access reviews; annual risk assessments; defined incident response.
- **Do not** claim certifications/attestations Finzly doesn't hold, overstate scope, or say
  "fully compliant/unhackable/100% secure." Say "aligned to," "follows the criteria of,"
  "independently tested."
- Don't disclose internal security specifics beyond the public posture above.
- "Compliant" features (e.g. "automated, programmable, compliant" money movement) describe product
  capability that helps banks meet *their* obligations — not a guarantee of regulatory compliance.

## Tokenized money / stablecoins / digital assets

This is core to Token Galaxy but a sensitive topic.

- Describe capability ("unified ledger for fiat and tokenized money," "move stablecoins and fiat in
  one flow") — don't give investment advice, price predictions, or returns.
- Don't imply Finzly issues a stablecoin/currency or offers it to consumers; Finzly provides the
  movement/ledger platform banks use.
- Flag operational risk honestly when relevant (the brand already does: "tokenizing money without a
  unified ledger can create operational risk").

## General external-content hygiene

- **No confidential/internal info:** roadmaps, unreleased features, customer data, security
  internals, financials, employee/PII.
- **No secrets in repo/output:** never include API keys, credentials, or `.env` contents.
- **Respect IP:** don't reproduce others' copyrighted text/images; logos only with rights.
- **Accessibility/clarity:** avoid misleading framing even if technically true.

## Pre-publish checklist

Before marking any piece publish-ready, confirm:

1. [ ] No statement that Finzly is a bank / holds deposits / is FDIC-insured.
2. [ ] Every stat, quote, and named source is real and (where possible) linked.
3. [ ] No banned superlatives/guarantees ("fastest," "100% secure," "guaranteed," etc.).
4. [ ] Security/compliance language matches the approved posture ("aligned to ISO 27001/SOC 1/SOC 2").
5. [ ] No unapproved customer names, competitor knocks, or confidential/roadmap info.
6. [ ] Tokenized-money claims describe capability, not investment advice or issuance.
7. [ ] Product names + voice conform to [[finzly-brand-voice]].

If a draft fails any item, revise (or flag for human sign-off) — don't publish.

## Contact / escalation

Genuine security or legal questions → **infosec@finzly.com** / the Finzly legal team. A human
should sign off on press releases and any claim you're unsure about.
