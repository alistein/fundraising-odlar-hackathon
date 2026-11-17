# Product overview

An AI scam and forgery detector for donation appeals in Azerbaijan, backed by a registry of clinic-verified campaigns.

> **Pivot, 2026-11-17:** the scam checker is now the product; the verified-campaign platform is the ground truth behind it. Before the pivot the platform was the product and the checker a side page. Reason and details: [[decisions]].

**In one sentence:** paste any "help this child" post, link, card number or document and learn in seconds whether it is a clinic-verified campaign, a clone or a forgery — because real campaigns are confirmed by the clinic, paid straight to the clinic, and recorded on a public ledger.

**Product name:** Safefund (decided 2026-11-17). Brand and logo: [[branding]].

## Problem

Medical fundraising in Azerbaijan runs on social media posts and a personal card number. A donor cannot tell a real appeal from a fake, cloned or forged one, and nobody can see where the money went.

- ~1M AZN stolen from parents of 36 thalassemia patients in one case → [[fraud-cases]]
- Since 1 Aug 2026 a personal card accepts 5 incoming transfers/day, 20,000 AZN/month → [[card-transfer-limits]]

## Why now

The transfer limit broke the existing channel, so collections are moving to new cards, relatives' cards and e-wallets — exactly the confusion scammers exploit. The Central Bank's stated goal (transparency, less fraud) is the same goal this product serves.

## Two layers

| Layer | What it does | Detail |
|---|---|---|
| **Scam checker** (hero) | Extracts the claims from an appeal, matches them against the registry and blacklist, detects clones, checks documents for forgery, returns a verdict with reasons | [[scam-checker]] |
| **Verified registry** (ground truth) | Clinic confirms diagnosis and cost, donations go to the clinic, every payment sits on a tamper-evident ledger | [[product-flow]] |

The checker works from day one without signed clinics or a payment licence; the registry makes it more accurate as campaigns join.

## Users

| Role | What they do |
|---|---|
| Donor (primary) | Checks an appeal before sending money; donates to verified campaigns; views the ledger |
| Organiser | Family member opening a campaign to earn the verified badge; never receives money |
| Clinic | Confirms diagnosis and treatment cost via its own account; receives the payout |

Also in the pitch as targets: charities, banks (scam-card intelligence). Later: corporate giving.

## Positioning

A **cybersecurity product**: fraud detection and anti-social-engineering, not fintech or charity. Open with a scam being caught, not with a campaign being created. See [[threat-model]] and [[tracks]].

## Related

[[scam-checker]] · [[product-flow]] · [[mvp-scope]] · [[threat-model]] · [[swot]] · [[decisions]]

Sources: [[idea-brief]]
