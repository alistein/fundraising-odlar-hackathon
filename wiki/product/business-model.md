# Business model

How Safefund makes money. Proposal, 2026-11-17, pending team confirmation.

> **2026-11-17 (later, after mentor feedback):** the main revenue is now a **2% service fee per donation (minimum 0.20 AZN), paid by the donor on top** (first set as a fixed 1 manat, changed the same day), so the family still receives the full amount. This replaces "0% platform fee" and "no percentage of donations" below; B2B lines become secondary. → [[decisions]]

## Principles

- **Free for donors and families, forever.** The checker is the brand and the data engine.
- **0% platform fee on donations.** 100% goes to the clinic; card or bank processing cost is shown openly. An optional donor tip covers the rest.
- **Institutions pay**, because Safefund cuts their fraud losses and gives them proof.

## Revenue lines

| # | Customer | What they buy | Why they pay | Pricing (assumption) |
|---|---|---|---|---|
| 1 | **Banks and payment apps** | Scam-card intelligence feed (reported and confirmed scam cards) and a pre-transfer check API ("this card is linked to a flagged appeal") | Fewer fraud losses and complaints; meets the CBA's anti-fraud goals; liability where reimbursement rules exist | Annual licence, 30–60k AZN per bank in Azerbaijan; per-call pricing abroad |
| 2 | **Banks** | Verified campaign accounts: a special-account product for verified campaigns, exempt from the 5-a-day cap on a justified request | Compliant fee income and CSR visibility; the CBA allows higher limits on justified requests | Revenue share of the bank's account fee, or a fixed fee |
| 3 | **Clinics** (Baku, and Türkiye clinics serving Azerbaijani patients). **Last roadmap stage** ([[roadmap]]) | Verified-case workflow: confirm diagnosis and invoice, receive payouts, public badge | Paid invoices, fewer bad debts, trust that draws patients | Monthly subscription, 125–250 AZN |
| 4 | **Corporates (CSR)** | Verified giving: fund real cases, get a ledger-backed impact report | Proof of where CSR money went | 5–15k AZN per year, or match-giving campaigns |
| 5 | **Platforms and messengers (global)** | Appeal-check API for campaign vetting and forwarded-message warnings | Trust and safety cost | Per-check / volume tiers |

Line 1 is the main revenue; lines 2–4 build the registry; line 5 is the global scale. Order follows [[roadmap]]: the Tool's data (lines 1 and 5) comes first, and clinics (line 3) come last. Sizing: [[market-azerbaijan]], [[market-global]].

## Unit economics (illustrative)

- A check costs one AI call plus database lookups, about 0.01–0.03 USD **(estimate)**. Free checks are funded by B2B lines 1 and 5.
- Every check adds signal: new scam cards, cloned images, forged documents. The data asset grows with use, and this is what banks buy.

## What we deliberately don't do

- No percentage of donations.
- Safefund never holds donor money. A licensed partner moves it straight to the clinic. → [[fundraising-law]]
- No selling of personal or medical data. Banks get card-level fraud signals only.

## Fee benchmarks (researched 2026-11-17)

| Platform | Platform fee | Processing | Other income | Source |
|---|---|---|---|---|
| GoFundMe (personal campaigns) | 0% | ~2.9% + $0.30 per donation (US, secondary sources) | Optional donor tip to GoFundMe | gofundme.com fees page (UK), secondary blogs |
| JustGiving (UK charities) | 0% since Mar 2019 (was 5%) | 1.9% + £0.30; crowdfunding 2.9% + £0.35 | Optional donor contribution | justgiving.com/about/fees, blog.justgiving.com |
| Kazakhstan crowdfunding sites | 2–8% on project platforms; one cited 2% instead of 5% **(dated, unverified)** | — | — | nur.kz, ICNL review |
| Türkiye (Fonzip) | No public rate found | — | Sells management tools to associations | fonzip.com |

Takeaway: the global norm is **0% taken from the beneficiary**, with the donor covering processing and an optional tip. A fixed 1 manat fee breaks even badly at both ends: 100% of a 1 manat gift, and possibly below card-acquiring cost on a 500 manat gift **(acquiring rates in Azerbaijan unverified)**. A percentage with a floor (e.g. 2%, min 0.20 AZN) paid by the donor fits the norm better.

Sources: [[market-research-2026-11-17]], [[icnl-crowdfunding-2018]], [[idea-brief]]
