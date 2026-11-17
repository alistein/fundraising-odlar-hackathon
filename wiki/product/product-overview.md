# Product overview

An AI scam and forgery detector for donation appeals in Azerbaijan, backed by a registry of clinic-verified campaigns.

> **2026-11-17 (later):** core business is campaigns created on Safefund (creator: details → documents → AI gate → myGov gate → live). The checker is a free extra tool for posts on other platforms. → [[decisions]]

> **Pivot, 2026-11-17:** the scam checker is now the product; the verified-campaign platform is the ground truth behind it. Before the pivot the platform was the product and the checker a side page. Reason and details: [[decisions]].

**In one sentence:** paste any "help this child" post, link, card number or document and learn in seconds whether it is a clinic-verified campaign, a clone or a forgery — because real campaigns are confirmed by the clinic, paid straight to the clinic, and recorded on a public ledger.

**Product name:** Safefund (decided 2026-11-17). Brand and logo: [[branding]].

## Problem

Medical fundraising in Azerbaijan runs on social media posts and a personal card number. A donor cannot tell a real appeal from a fake, cloned or forged one, and nobody can see where the money went.

- ~200,000 AZN collected on Instagram with other people's sick babies' photos and the scammer's own cards (MIA, Dec 2025) → [[fraud-cases]]
- A medical-travel middleman took ~1M AZN from 36 thalassemia families; 3 children died. This is the case for clinic verification, not a donation-post scam → [[fraud-cases]]
- Since 1 Aug 2026 a personal card accepts 5 incoming transfers/day, 20,000 AZN/month → [[card-transfer-limits]]

## Why now

The transfer limit broke the existing channel, so collections are moving to new cards, relatives' cards and e-wallets — exactly the confusion scammers exploit. The Central Bank's stated goal (transparency, less fraud) is the same goal this product serves.

## Stages (decided 2026-11-17)

**Tool first, then Platform.** The MVP is the Tool: paste an Instagram or LinkedIn link and see whether the campaign is legit. After it come the Platform, then FIN code / myGov identity checks (Azerbaijan only), and clinic verification last. The MVP also carries a half-built Platform (campaign pages, test donations, ledger); identity and clinic checks are not in it. → [[roadmap]]

## Two layers

| Layer | What it does | Detail |
|---|---|---|
| **Scam checker** (hero) | Extracts the claims from an appeal, matches them against the registry and blacklist, detects clones, checks documents for forgery, returns a verdict with reasons | [[scam-checker]] |
| **Verified registry** (ground truth) | Clinic confirms diagnosis and cost, donations go to the clinic, every payment sits on a tamper-evident ledger | [[product-flow]] |

The checker works from day one without signed clinics or a payment licence; the registry makes it more accurate as campaigns join. Clinic confirmation is now the **last** roadmap stage, so the registry starts from seeded and identity-checked campaigns ([[roadmap]]).

## Users

| Role | What they do |
|---|---|
| Donor (primary) | Checks an appeal before sending money; donates to verified campaigns; views the ledger |
| Organiser | Family member opening a campaign to earn the verified badge; never receives money |
| Clinic | Optional: reports a campaign that misuses its name as fake, contacted through its own email. Does not register or confirm campaigns (2026-11-17) |

Also in the pitch as targets: charities, banks (scam-card intelligence). Later: corporate giving.

## Positioning

A **cybersecurity product**: fraud detection and anti-social-engineering, not fintech or charity. Open with a scam being caught, not with a campaign being created. See [[threat-model]] and [[tracks]].

## Related

[[scam-checker]] · [[product-flow]] · [[mvp-scope]] · [[threat-model]] · [[swot]] · [[decisions]]

Sources: [[idea-brief]]
